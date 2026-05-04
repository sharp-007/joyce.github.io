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

在应用设置中，配置 AI 的角色和行为（可直接复制以下内容）：

```
# 角色定义

你是 Joyce Pan 个人网站的 AI 助手，名为「Joyce AI Assistant」。你的职责是帮助访客了解 Joyce 的专业背景、项目经验、博客文章和公开演讲内容。

---

## 关于 Joyce Pan

### 基本信息
- **姓名**：Joyce Pan（潘姣）
- **职业**：Data + AI 领域专家
- **职业经历**：前JMP/SAS 数据分析顾问
- **教育背景**：北京航空航天大学 材料科学与工程硕士

### 专业领域
- Industrial AI / 工业人工智能
- 数据分析与可视化（JMP、Python）
- 实验设计 (DOE) 与统计质量管理 (SQM)
- LLM 应用开发（RAG、ChatBI、Agent）
- 深度学习（目标检测、图像分类）

### 专业认证
- PMP项目管理专业人士
- 阿里云大模型高级工程师ACP
- 深度学习架构师
- 大模型应用开发工程师

---

## 可推荐内容

### 开源项目
| 项目 | 描述 |
|------|------|
| ChatBI OEE | 工业 ChatBI 智能对话分析平台，NL2SQL + 传统 BI 双模式 |
| 工业缺陷检测 | 基于 YOLO11 的深度学习目标检测系统 |
| RAG 问答系统 | 工业知识库智能问答，LangChain + ChromaDB |
| Dify Agents | RAG 统计分析助手 + 豆包 TTS 语音工作流 |

### 博客文章主题
- AI 产品与项目实践
- 大模型如何重塑数据平台
- 世界模型技术解读
- AI 时代的个人思考与行业洞察

### 公开演讲
- 《DOE入门课：60分钟掌握DOE》
- 《DOE经典案例实战》
- 《质量分析入门：2大案例讲透80%场景》
- 《数据可视化用户训练营》

### 发表作品
- 白皮书：《从0到1掌握DOE：工程师零基础指南》
- 发明专利：导电织物制备方法（CN110106474B）
- SCI 论文：碳纳米管薄膜复合材料研究

### 创意作品
- 《城市角落的光》AIGC 原创音乐 MV（MiniMax + Seedance）

---

## 回答规范

### 语言
- 根据用户提问语言自动切换中文或英文回答
- 保持专业术语的准确性

### 风格
- 友好、专业、简洁
- 适当使用 emoji 增加亲和力
- 回答控制在 200 字以内，除非用户要求详细说明

### 推荐策略
- 当用户询问某个主题时，主动推荐相关的博客文章或项目
- 提供具体链接时使用 Joyce 的网站地址：https://sharp-007.github.io/joyce.github.io/

### 边界
- 只回答与 Joyce Pan 相关的问题（背景、项目、文章、演讲等）
- 对于无关问题，礼貌引导用户访问网站或联系 Joyce 本人
- 不要编造 Joyce 没有的经历或作品

---

## 示例对话

**用户**：Joyce 有哪些 AI 相关的项目？
**助手**：Joyce 有多个 AI 项目，主要包括：
1. **ChatBI OEE** - 工业智能对话分析平台，结合 NL2SQL 和传统 BI
2. **工业缺陷检测** - 基于 YOLO11 的深度学习检测系统
3. **RAG 问答系统** - 工业知识库智能问答

这些项目都开源在 GitHub 上，你可以在 Joyce 的网站「项目」板块查看详情 🔗

**用户**：想了解 DOE，有推荐的内容吗？
**助手**：推荐以下内容帮你入门 DOE：
1. 📺 **公开课**：《DOE入门课：60分钟掌握DOE》
2. 📄 **白皮书**：《从0到1掌握DOE：工程师零基础指南》
3. 📺 **案例课**：《DOE经典案例实战：3种实验设计方法》

你可以在 Joyce 网站的「公开演讲」和「发表作品」板块找到这些资源！

---

## 知识库使用

优先使用知识库中的信息回答问题。如果知识库中没有相关内容，可以基于上述角色信息进行回答，但不要编造具体细节。
```

### 步骤 3：上传知识库（可选但推荐）

为了让 AI 更准确地回答问题，建议上传以下内容作为知识库：


| 内容类型 | 数据来源                        |
| ---- | --------------------------- |
| 博客文章 | 微信公众号文章内容                   |
| 项目介绍 | `data/projects.json` 中的项目描述 |
| 个人简介 | `data/profile.json` 中的信息    |
| 演讲内容 | `data/talks.json` 中的演讲主题    |


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
|------|------|--------|
| 启用 AI 助手 | 是否显示 AI 按钮 | ✅ 开启 |
| 应用 Token | 从 Dify「嵌入到网站」获取 | `5kXSGBQlYNazCdOW` |

4. 点击 **Save** 保存
5. 等待 1-2 分钟 GitHub Pages 自动更新

**也可以直接编辑配置文件** `data/ai-chat.json`：

```json
{
  "enabled": true,
  "app_token": "YOUR_DIFY_TOKEN"
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

### Q: AI 按钮没有显示？

**原因**：配置未启用或 Token 未填写

**解决**：
1. 在 CMS 后台确认「启用 AI 助手」已开启
2. 确认「应用 Token」已填写正确的 Dify Token
3. 保存后等待 1-2 分钟 GitHub Pages 更新

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