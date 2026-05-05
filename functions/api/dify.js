/**
 * Dify API 代理 - EdgeOne Pages Functions 版本
 *
 * 部署方式：随 EdgeOne Pages 自动部署（基于文件路径自动路由）
 * 访问路径：https://你的域名.edgeone.app/api/dify
 *
 * 环境变量（在 EdgeOne Pages 控制台 → 设置 → 环境变量 配置）：
 * - DIFY_API_KEY: Dify 应用的 API Key (app-xxxxxxxx)
 * - DIFY_BASE_URL: Dify API 地址 (默认 https://api.dify.ai/v1)
 * - ALLOWED_ORIGINS: 允许的来源域名，逗号分隔；同源调用时此项可留空
 *
 * 设计原则：
 * - 仅做认证转发 + CORS，不解析业务内容
 * - <think>...</think> 等业务解析放在前端，保持 Function 极简稳定
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

  // 来源校验（同源请求 origin 通常为 null，跳过校验）
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
  if (origin && allowed.length > 0 && !allowed.includes('*') && !allowed.includes(origin)) {
    return new Response('Forbidden', { status: 403 });
  }

  try {
    const body = await request.json();
    const streaming = body.streaming !== false;

    const difyBaseUrl = env.DIFY_BASE_URL || 'https://api.dify.ai/v1';
    const upstream = await fetch(`${difyBaseUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.DIFY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: body.inputs || {},
        query: body.query,
        response_mode: streaming ? 'streaming' : 'blocking',
        conversation_id: body.conversation_id || '',
        user: body.user || 'website-visitor'
      })
    });

    if (!upstream.ok) {
      const err = await upstream.text();
      return new Response(JSON.stringify({
        error: 'Dify API error',
        status: upstream.status,
        detail: err
      }), {
        status: upstream.status,
        headers: corsHeaders(origin)
      });
    }

    if (streaming) {
      // 透明转发上游 SSE 流
      return new Response(upstream.body, {
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

    const data = await upstream.json();
    return new Response(JSON.stringify(data), {
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

export async function onRequest({ request }) {
  return new Response('Method not allowed', { status: 405 });
}
