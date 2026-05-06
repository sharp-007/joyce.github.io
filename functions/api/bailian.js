/**
 * 阿里云百炼智能体 API 代理 - EdgeOne Pages Functions 版本
 *
 * 部署方式：随 EdgeOne Pages 自动部署（基于文件路径自动路由）
 * 访问路径：https://你的域名.edgeone.app/api/bailian
 *
 * 环境变量（在 EdgeOne Pages 控制台 → 设置 → 环境变量 配置）：
 * - BAILIAN_API_KEY: 百炼 API Key (sk-xxxxxxxx)
 * - BAILIAN_APP_ID: 智能体应用 ID (如 ad99cc33c4f04b1b9676e18c2b9564db)
 * - ALLOWED_ORIGINS: 允许的来源域名，逗号分隔；同源调用时此项可留空
 *
 * 数据格式转换：
 * - 把百炼 SSE 格式转为前端兼容的 Dify-like 事件格式
 * - 事件类型：agent_thought (思考过程) / message (回答) / message_end (结束)
 *
 * API 文档：https://help.aliyun.com/zh/model-studio/call-single-agent-application/
 */

const corsHeaders = (origin) => ({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': origin || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
});

export async function onRequestOptions({ request }) {
  const origin = request.headers.get('Origin') || '';
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin') || '';

  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
  if (origin && allowed.length > 0 && !allowed.includes('*') && !allowed.includes(origin)) {
    return new Response('Forbidden', { status: 403 });
  }

  try {
    const body = await request.json();
    const streaming = body.streaming !== false;

    const apiUrl = `https://dashscope.aliyuncs.com/api/v1/apps/${env.BAILIAN_APP_ID}/completion`;

    const upstream = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.BAILIAN_API_KEY}`,
        'Content-Type': 'application/json',
        'X-DashScope-SSE': streaming ? 'enable' : 'disable'
      },
      body: JSON.stringify({
        input: {
          prompt: body.query,
          ...(body.conversation_id && { session_id: body.conversation_id })
        },
        parameters: {
          incremental_output: streaming,
          has_thoughts: true
        },
        debug: {}
      })
    });

    if (!upstream.ok) {
      const err = await upstream.text();
      return new Response(JSON.stringify({
        error: 'Bailian API error',
        status: upstream.status,
        detail: err
      }), {
        status: upstream.status,
        headers: corsHeaders(origin)
      });
    }

    if (streaming) {
      return streamBailianSSE(upstream, origin);
    }

    const data = await upstream.json();
    const output = data.output || {};
    return new Response(JSON.stringify({
      answer: output.text || '',
      conversation_id: output.session_id || '',
      thoughts: output.thoughts || []
    }), {
      headers: corsHeaders(origin)
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Proxy error',
      message: error.message
    }), {
      status: 500,
      headers: corsHeaders(origin)
    });
  }
}

// 显式分发到对应方法处理函数
// EdgeOne Pages Functions 当 onRequest 存在时会优先调用它，不会自动路由到 onRequestPost/Options
export async function onRequest(context) {
  const method = (context.request.method || '').toUpperCase();
  if (method === 'POST') return onRequestPost(context);
  if (method === 'OPTIONS') return onRequestOptions(context);
  return new Response('Method not allowed', { status: 405 });
}

// 把百炼 SSE 转换为前端兼容的事件格式
function streamBailianSSE(upstream, origin) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  (async () => {
    const reader = upstream.body.getReader();
    let buffer = '';
    let sessionId = '';
    // 记录每个 thought（按数组索引）已经推送过的字符长度
    // 百炼把 thought 当成"累积式整段"返回，需要在这里转成真正的 delta 增量
    const thoughtsLastLen = [];

    const flush = (obj) => writer.write(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const ev of events) {
          let dataLine = '';
          for (const line of ev.split('\n')) {
            if (line.startsWith('data:')) {
              dataLine = line.slice(5).trim();
            }
          }
          if (!dataLine || dataLine === '[DONE]') continue;

          let parsed;
          try { parsed = JSON.parse(dataLine); } catch { continue; }

          const output = parsed.output || {};
          if (output.session_id) sessionId = output.session_id;

          // 思考过程：把累积式 thought 转成 delta 增量
          if (Array.isArray(output.thoughts)) {
            for (let i = 0; i < output.thoughts.length; i++) {
              const txt = (output.thoughts[i] && output.thoughts[i].thought) || '';
              const last = thoughtsLastLen[i] || 0;
              if (txt.length > last) {
                const delta = txt.slice(last);
                thoughtsLastLen[i] = txt.length;
                await flush({
                  event: 'agent_thought',
                  index: i,
                  delta,
                  conversation_id: sessionId
                });
              }
            }
          }

          // 回答内容（incremental_output: true 时直接是 delta 片段）
          if (output.text) {
            await flush({
              event: 'message',
              answer: output.text,
              conversation_id: sessionId
            });
          }

          if (output.finish_reason === 'stop') {
            await flush({
              event: 'message_end',
              conversation_id: sessionId
            });
          }
        }
      }
      await writer.write(encoder.encode('data: [DONE]\n\n'));
    } catch (e) {
      console.error('Bailian stream error:', e);
    } finally {
      try { reader.releaseLock(); } catch {}
      try { await writer.close(); } catch {}
    }
  })();

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
