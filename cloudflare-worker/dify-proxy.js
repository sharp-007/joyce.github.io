/**
 * Dify API Proxy Worker (支持流式输出)
 * 部署到 Cloudflare Workers，安全代理 Dify API 请求
 * 
 * 环境变量配置：
 * - DIFY_API_KEY: 你的 Dify API Key (app-xxxxxxxx)
 * - DIFY_BASE_URL: Dify API 地址 (默认 https://api.dify.ai/v1)
 * - ALLOWED_ORIGINS: 允许的来源域名，逗号分隔 (如 https://sharp-007.github.io)
 */

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    
    // CORS 预检请求
    if (request.method === 'OPTIONS') {
      return handleCORS(origin);
    }

    // 只允许 POST 请求
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // 验证来源
    const allowedOrigins = (env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim());
    if (allowedOrigins.length > 0 && allowedOrigins[0] !== '' && !allowedOrigins.includes(origin) && !allowedOrigins.includes('*')) {
      return new Response('Forbidden', { status: 403 });
    }

    try {
      const body = await request.json();
      const streaming = body.streaming !== false;
      
      const difyBaseUrl = env.DIFY_BASE_URL || 'https://api.dify.ai/v1';
      const response = await fetch(`${difyBaseUrl}/chat-messages`, {
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

      if (!response.ok) {
        const err = await response.text();
        return new Response(JSON.stringify({ error: 'Dify API error', detail: err }), {
          status: response.status,
          headers: corsHeaders(origin)
        });
      }

      if (streaming) {
        // 流式输出：直接转发 SSE 流
        return new Response(response.body, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': origin || '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        });
      } else {
        // 阻塞模式
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: corsHeaders(origin)
        });
      }

    } catch (error) {
      return new Response(JSON.stringify({ error: 'Proxy error', message: error.message }), {
        status: 500,
        headers: corsHeaders(origin)
      });
    }
  }
};

function corsHeaders(origin) {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function handleCORS(origin) {
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
