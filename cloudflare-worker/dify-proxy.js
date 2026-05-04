/**
 * Dify API Proxy Worker
 * 部署到 Cloudflare Workers，安全代理 Dify API 请求
 * 
 * 环境变量配置：
 * - DIFY_API_KEY: 你的 Dify API Key (app-xxxxxxxx)
 * - DIFY_BASE_URL: Dify API 地址 (默认 https://api.dify.ai/v1)
 * - ALLOWED_ORIGINS: 允许的来源域名，逗号分隔 (如 https://sharp-007.github.io)
 */

export default {
  async fetch(request, env) {
    // CORS 预检请求
    if (request.method === 'OPTIONS') {
      return handleCORS(request, env);
    }

    // 只允许 POST 请求
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // 验证来源
    const origin = request.headers.get('Origin') || '';
    const allowedOrigins = (env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim());
    
    if (allowedOrigins.length > 0 && !allowedOrigins.includes(origin) && !allowedOrigins.includes('*')) {
      return new Response('Forbidden', { status: 403 });
    }

    try {
      const body = await request.json();
      
      // 调用 Dify API
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
          response_mode: 'blocking',
          conversation_id: body.conversation_id || '',
          user: body.user || 'website-visitor'
        })
      });

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: 'Proxy error', message: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin || '*'
        }
      });
    }
  }
};

function handleCORS(request, env) {
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
