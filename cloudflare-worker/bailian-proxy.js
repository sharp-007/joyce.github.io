/**
 * 阿里云百炼智能体 API 代理 Worker (支持流式输出)
 * 部署到 Cloudflare Workers，安全代理百炼 API 请求
 * 
 * 环境变量配置：
 * - BAILIAN_API_KEY: 百炼 API Key (sk-xxxxxxxx)
 * - BAILIAN_APP_ID: 智能体应用 ID (如 ad99cc33c4f04b1b9676e18c2b9564db)
 * - ALLOWED_ORIGINS: 允许的来源域名，逗号分隔 (如 https://sharp-007.github.io)
 * 
 * API 文档：https://help.aliyun.com/zh/model-studio/call-single-agent-application/
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
    if (allowedOrigins.length > 0 && allowedOrigins[0] !== '' && 
        !allowedOrigins.includes(origin) && !allowedOrigins.includes('*')) {
      return new Response('Forbidden', { status: 403 });
    }

    try {
      const body = await request.json();
      const streaming = body.streaming !== false;
      
      // 构建百炼智能体 API 请求
      const apiUrl = `https://dashscope.aliyuncs.com/api/v1/apps/${env.BAILIAN_APP_ID}/completion`;
      
      const requestBody = {
        input: {
          prompt: body.query,
          // 支持传入会话 ID 以保持多轮对话上下文
          ...(body.conversation_id && { session_id: body.conversation_id })
        },
        parameters: {
          incremental_output: streaming,
          // 如果智能体使用深度思考模型（如 Qwen3），返回思考过程
          has_thoughts: true
        },
        debug: {}
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.BAILIAN_API_KEY}`,
          'Content-Type': 'application/json',
          // 流式输出需要设置此 Header
          'X-DashScope-SSE': streaming ? 'enable' : 'disable'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const err = await response.text();
        return new Response(JSON.stringify({ error: 'Bailian API error', detail: err }), {
          status: response.status,
          headers: corsHeaders(origin)
        });
      }

      if (streaming) {
        // 流式输出：转换百炼 SSE 格式为前端兼容格式
        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        const encoder = new TextEncoder();
        
        (async () => {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let sessionId = '';
          
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              buffer += decoder.decode(value, { stream: true });
              // 按 SSE 事件分割（双换行符）
              const events = buffer.split('\n\n');
              buffer = events.pop() || '';
              
              for (const eventData of events) {
                const lines = eventData.split('\n');
                let dataLine = '';
                
                for (const line of lines) {
                  if (line.startsWith('data:')) {
                    dataLine = line.slice(5).trim();
                  }
                }
                
                if (dataLine && dataLine !== '[DONE]') {
                  try {
                    const parsed = JSON.parse(dataLine);
                    const output = parsed.output || {};
                    
                    // 保存会话 ID
                    if (output.session_id) {
                      sessionId = output.session_id;
                    }
                    
                    // 检查是否有思考过程
                    if (output.thoughts && output.thoughts.length > 0) {
                      // 发送思考过程事件
                      for (const thought of output.thoughts) {
                        if (thought.thought) {
                          const thoughtOutput = {
                            event: 'agent_thought',
                            thought: thought.thought,
                            conversation_id: sessionId
                          };
                          await writer.write(encoder.encode(`data: ${JSON.stringify(thoughtOutput)}\n\n`));
                        }
                      }
                    }
                    
                    // 发送回答内容
                    if (output.text) {
                      const msgOutput = {
                        event: 'message',
                        answer: output.text,
                        conversation_id: sessionId
                      };
                      await writer.write(encoder.encode(`data: ${JSON.stringify(msgOutput)}\n\n`));
                    }
                    
                    // 检查是否完成
                    if (output.finish_reason === 'stop') {
                      const endOutput = {
                        event: 'message_end',
                        conversation_id: sessionId
                      };
                      await writer.write(encoder.encode(`data: ${JSON.stringify(endOutput)}\n\n`));
                    }
                  } catch (e) {
                    // 忽略解析错误
                  }
                }
              }
            }
            await writer.write(encoder.encode('data: [DONE]\n\n'));
          } catch (e) {
            console.error('Stream error:', e);
          } finally {
            await writer.close();
          }
        })();

        return new Response(readable, {
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
        // 阻塞模式（非流式）
        const data = await response.json();
        const output = data.output || {};
        
        // 转换响应格式以兼容前端
        return new Response(JSON.stringify({
          answer: output.text || '',
          conversation_id: output.session_id || '',
          thoughts: output.thoughts || []
        }), {
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
