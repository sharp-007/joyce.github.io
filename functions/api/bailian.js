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
          has_thoughts: true,
          // Qwen3 等思考模型：API 显式打开思考模式，
          // 即使智能体应用内没有发布"思考模式"开关也能拿到 thoughts
          enable_thinking: true
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
// 改用 ReadableStream + controller.enqueue：相比 TransformStream 在 EdgeOne 上
// 更直接地把每条事件 push 给下游，避免边缘节点积累缓冲；
// 每条事件附带服务端时间戳 ts（ms 相对请求开始），方便前端 DevTools 排查链路延迟
function streamBailianSSE(upstream, origin) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body.getReader();
      let buffer = '';
      let sessionId = '';
      const t0 = Date.now();
      const enqueue = (obj) => {
        const payload = { ...obj, ts: Date.now() - t0 };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      // 立即发送 2KB 的 SSE 注释 padding，强制下游 CDN / 浏览器立刻打开 SSE 通道
      try {
        controller.enqueue(encoder.encode(':' + ' '.repeat(2048) + '\n\n'));
      } catch {}

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

            // 思考过程：incremental_output: true 时每个 chunk 的 thought 字段
            // 本身就是当次 delta 片段（参考百炼官方文档 5694-5698 的 Python 示例），
            // 直接透传即可。只关心 action_type === 'reasoning' 的深度思考；
            // 其他 action_type（如 api / response 等工具调用）暂不传给前端。
            if (Array.isArray(output.thoughts)) {
              for (const t of output.thoughts) {
                if (!t) continue;
                const at = t.action_type || t.actionType || '';
                if (at && at !== 'reasoning') continue;
                const delta = t.thought || '';
                if (!delta) continue;
                enqueue({
                  event: 'agent_thought',
                  delta,
                  conversation_id: sessionId
                });
              }
            }

            // 回答内容（incremental_output: true 时直接是 delta 片段）
            if (output.text) {
              enqueue({
                event: 'message',
                answer: output.text,
                conversation_id: sessionId
              });
            }

            if (output.finish_reason === 'stop') {
              enqueue({
                event: 'message_end',
                conversation_id: sessionId
              });
            }
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (e) {
        console.error('Bailian stream error:', e);
      } finally {
        try { reader.releaseLock(); } catch {}
        try { controller.close(); } catch {}
      }
    },
    cancel() {
      // 客户端断开时进入这里；start() 内的 finally 已负责清理 reader
    }
  });

  return new Response(stream, {
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
