# AI 智能体对话功能配置指南

本文档介绍如何配置网站的 AI 智能体对话功能，让访客可以通过 AI 助手了解 Joyce Pan 的相关信息。

---

## 功能概述

- **位置**：页面右下角浮动按钮
- **默认状态**：关闭（点击按钮展开聊天窗口）
- **技术方案**：集成 Dify AI 应用
- **后台管理**：通过 CMS 后台一键开关
- **支持内容**：工作经历、项目介绍、博客推荐、公开演讲等

---

## 快速开关（CMS 后台）

上传到 GitHub 后，可以在 CMS 后台一键控制 AI 助手：

1. 访问 CMS 后台：`https://sharp-007.github.io/joyce.github.io/admin/`
2. 登录 GitHub 授权
3. 在左侧菜单找到 **🤖 AI 助手 AI Chat**
4. 点击进入配置页面
5. **开启/关闭**：切换「启用 AI 助手」开关
6. 点击 **Save** 保存

保存后约 1-2 分钟，GitHub Pages 自动更新，AI 按钮即会显示/隐藏。

---

## 完整配置步骤

### 步骤 1：在 Dify 中创建应用

1. 登录 [Dify Cloud](https://dify.ai) 或你的自托管 Dify 实例
2. 点击 **创建应用** → 选择 **聊天助手 (Chatbot)**
3. 填写应用名称，如 `Joyce Pan AI Assistant`

### 步骤 2：配置 System Prompt

在应用设置中，配置 AI 的角色和行为：

```
你是 Joyce Pan 的 AI 助手，负责回答关于 Joyce 的问题：

## 基本信息
- 姓名：Joyce Pan（潘姣）
- 职业：Data + AI 领域专家
- 当前角色：JMP/SAS 高级分析顾问

## 专业领域
- Industrial AI / 工业人工智能
- 数据分析与可视化
- 实验设计 (DOE) 与统计质量管理
- LLM 应用与 RAG 系统

## 可推荐的内容
- 博客文章：AI产品实践、个人思考、行业洞察
- 公开演讲：DOE入门课、质量分析、数据可视化
- 开源项目：ChatBI、RAG问答系统、缺陷检测等
- 创意作品：AIGC音乐MV

## 回答风格
- 友好、专业
- 可以推荐相关文章或项目链接
- 支持中英文回答
```

### 步骤 3：上传知识库（可选但推荐）

为了让 AI 更准确地回答问题，建议上传以下内容作为知识库：

| 内容类型 | 数据来源 |
|---------|---------|
| 博客文章 | 微信公众号文章内容 |
| 项目介绍 | `data/projects.json` 中的项目描述 |
| 个人简介 | `data/profile.json` 中的信息 |
| 演讲内容 | `data/talks.json` 中的演讲主题 |

### 步骤 4：获取嵌入 Token

1. 在 Dify 应用页面，点击 **发布** 或 **嵌入**
2. 选择 **嵌入到网站** 方式
3. 复制应用 Token（格式类似：`abc123def456ghi789`）
4. 记录 Base URL：
   - Dify Cloud：`https://udify.app`
   - 自托管：你的 Dify 域名

### 步骤 5：更新网站配置（通过 CMS 后台）

1. 访问 CMS 后台：`https://你的域名/admin/`
2. 点击左侧 **🤖 AI 助手 AI Chat**
3. 填写配置：

| 字段 | 说明 | 示例值 |
|-----|------|-------|
| 启用 AI 助手 | 是否显示 AI 按钮 | ✅ 开启 |
| Dify 服务地址 | Dify Cloud 或自托管地址 | `https://udify.app` |
| 应用 Token | 从 Dify 获取的嵌入 Token | `abc123def456...` |
| 应用类型 | Chatbot 或 Chat | `chatbot` |

4. 点击 **Save** 保存
5. 等待 1-2 分钟 GitHub Pages 自动更新

**也可以直接编辑配置文件** `data/ai-chat.json`：

```json
{
  "enabled": true,
  "base_url": "https://udify.app",
  "app_token": "YOUR_ACTUAL_TOKEN_HERE",
  "chatbot_type": "chatbot"
}
```

---

## 本地测试

```bash
# 启动本地服务器
npx serve .

# 访问
http://localhost:3000
```

点击右下角的 AI 按钮测试功能。

---

## 常见问题

### Q: 点击按钮显示"AI 助手配置中..."？

**原因**：Token 未配置或配置错误

**解决**：
1. 确认 `DIFY_CONFIG.enabled` 为 `true`
2. 确认 `appToken` 已替换为实际的 Token
3. 确认 Token 格式正确（不含引号或空格）

### Q: 聊天窗口加载失败？

**可能原因**：
- 网络问题无法访问 Dify 服务
- Token 已过期或被删除
- CORS 跨域限制

**解决**：
1. 检查网络连接
2. 在 Dify 后台确认应用状态
3. 如使用自托管，检查 CORS 配置

### Q: 如何关闭 AI 功能？

**方法一：CMS 后台（推荐）**
1. 访问 `/admin/` 后台
2. 进入 **🤖 AI 助手 AI Chat**
3. 关闭「启用 AI 助手」开关
4. 点击 Save 保存

**方法二：直接编辑文件**

修改 `data/ai-chat.json`：

```json
{
  "enabled": false
}
```

---

## 文件结构

AI 聊天功能涉及的文件：

```
joyce.github.io/
├── index.html           # AI 聊天组件 HTML
├── style.css            # 聊天按钮和窗口样式
├── script.js            # 交互逻辑（读取配置、加载 iframe）
├── data/
│   └── ai-chat.json     # AI 助手配置文件（CMS 可编辑）
└── admin/
    └── config.yml       # CMS 配置（包含 AI 助手管理）
```

---

## 扩展：自定义样式

如需调整聊天按钮或窗口样式，编辑 `style.css` 中的以下部分：

```css
/* 按钮位置和大小 */
.ai-chat-widget { bottom: 24px; right: 80px; }
.ai-chat-toggle { width: 56px; height: 56px; }

/* 聊天窗口大小 */
.ai-chat-window { width: 400px; height: 560px; }

/* 主题颜色 */
.ai-chat-toggle { background: var(--gradient); }
.ai-chat-header { background: var(--gradient); }
```

---

## 参考链接

- [Dify 官方文档](https://docs.dify.ai/)
- [Dify Cloud](https://dify.ai)
- [Dify GitHub](https://github.com/langgenius/dify)

---

© 2026 Joyce Pan. All Rights Reserved.
