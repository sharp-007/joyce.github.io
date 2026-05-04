# Dify API 代理 - Cloudflare Workers 部署指南

这个 Worker 作为 Dify API 的代理，安全地存储 API Key，前端无需暴露密钥。

## 部署步骤

### 1. 创建 Cloudflare 账号

访问 [Cloudflare Dashboard](https://dash.cloudflare.com/) 注册/登录账号（免费）。

### 2. 创建 Worker

1. 进入 **Workers & Pages**
2. 点击 **Create application** → **Create Worker**
3. 给 Worker 命名，如 `joyce-dify-proxy`
4. 点击 **Deploy**

### 3. 编辑代码

1. 部署后点击 **Edit code**
2. 删除默认代码，粘贴 `dify-proxy.js` 的内容
3. 点击 **Save and Deploy**

### 4. 配置环境变量

1. 回到 Worker 页面，点击 **Settings** → **Variables**
2. 添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DIFY_API_KEY` | `app-xxxxxxxx` | 从 Dify 获取的 API Key |
| `DIFY_BASE_URL` | `https://api.dify.ai/v1` | Dify API 地址 |
| `ALLOWED_ORIGINS` | `https://sharp-007.github.io` | 你的网站域名 |

3. 点击 **Save and Deploy**

### 5. 获取 Worker URL

部署成功后，你会得到一个 URL，格式如：
```
https://joyce-dify-proxy.你的用户名.workers.dev
```

### 6. 更新网站配置

编辑 `data/ai-chat.json`：

```json
{
  "enabled": true,
  "proxy_url": "https://joyce-dify-proxy.你的用户名.workers.dev",
  "chatbot_type": "chatbot"
}
```

## 获取 Dify API Key

1. 登录 [Dify Cloud](https://cloud.dify.ai)
2. 打开你的应用
3. 点击左侧 **API 访问** 或进入开发页面
4. 在 **API 密钥** 区域点击创建
5. 复制生成的 Key（格式：`app-xxxxxxxx`）

## 免费额度

Cloudflare Workers 免费计划：
- 每天 100,000 次请求
- 对于个人网站绰绰有余

## 测试

部署后可以用 curl 测试：

```bash
curl -X POST https://你的worker地址.workers.dev \
  -H "Content-Type: application/json" \
  -H "Origin: https://sharp-007.github.io" \
  -d '{"query": "你好"}'
```

## 安全说明

- API Key 存储在 Cloudflare 环境变量中，不会暴露
- 通过 `ALLOWED_ORIGINS` 限制只有你的网站可以调用
- 建议同时在 Dify 后台设置速率限制
