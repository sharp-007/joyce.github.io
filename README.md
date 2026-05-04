# Joyce Pan | Data + AI Portfolio

个人作品集展示站点，基于纯前端技术栈（HTML + CSS + JavaScript）构建，用于展示个人项目、技术分享、博客文章、工作经历等内容。支持中英文双语切换。

## 预览

站点部署后可通过 GitHub Pages 访问：

```
https://sharp-007.github.io/joyce.github.io/
```

## 项目结构

```
joyce.github.io/
├── index.html          # 主页面（静态框架 + 动态容器）
├── style.css           # 全局样式（主题色、卡片、时间线等）
├── script.js           # 交互逻辑 + 数据驱动渲染
├── data/               # 模块化内容数据（JSON）
│   ├── carousel.json   # 首页走马灯数据
│   ├── projects.json   # 项目数据（含技能标签）
│   ├── blogs.json      # 博客文章数据
│   ├── talks.json      # 技术分享数据（含技能标签）
│   ├── publications.json # 发表作品数据（白皮书、专利、论文）
│   ├── creative.json   # 创意作品数据（AI创作、音乐视频）
│   ├── profile.json    # 个人简介数据（头像、简介、技能、社交链接）
│   ├── experience.json # 工作经历与教育背景数据
│   └── contact.json    # 联系方式数据（社交链接、二维码）
├── admin/              # Decap CMS 可视化管理后台
│   ├── index.html      # CMS 入口页面
│   └── config.yml      # CMS 配置文件
├── blog/
│   └── covers/         # 博客封面图片
├── images/
│   ├── projects/       # 项目封面图片
│   ├── talks/          # 技术分享封面图片
│   ├── logos/          # 公司/学校 Logo
│   └── uploads/        # CMS 上传图片目录
├── .gitignore          # Git 忽略文件配置
└── README.md
```

## 功能特性

- **中英文双语切换** — 一键切换全站语言
- **响应式设计** — 适配桌面端与移动端
- **主题色视觉系统** — 统一的青绿色渐变主题，卡片边框、分隔线等体现品牌色
- **技能标签关联** — 项目和技术分享卡片显示相关技能标签，技能与作品自然关联
- **视频嵌入** — 支持 YouTube / Bilibili 双源切换
- **平滑滚动与动画** — 基于 Intersection Observer 的淡入效果
- **时间线布局** — 工作经历与教育背景采用时间线设计
- **纯静态** — 无需后端服务，直接部署到任意静态托管平台
- **数据驱动** — 项目、博客、技术分享等内容存储在 JSON 文件中，页面动态渲染
- **可视化 CMS** — 集成 Decap CMS，通过浏览器后台可视化添加/编辑内容，自动提交到 GitHub

## 部署指南

### 方式一：GitHub Pages（推荐）

1. **创建 GitHub 仓库**
  在 GitHub 上新建一个仓库，仓库名为 `joyce.github.io`。
2. **推送代码到仓库**
  ```bash
   git remote add origin https://github.com/sharp-007/joyce.github.io.git
   git branch -M main
   git push -u origin main
  ```
3. **开启 GitHub Pages**
  - 进入仓库页面 → **Settings** → **Pages**
  - **Source** 选择 `Deploy from a branch`
  - **Branch** 选择 `main`，目录选择 `/ (root)`
  - 点击 **Save**
4. **访问站点**
  等待 1-2 分钟后，即可通过以下地址访问：
   `https://sharp-007.github.io/joyce.github.io/`

### 方式二：自定义域名（可选）

1. 在仓库 **Settings → Pages → Custom domain** 中填写你的域名（如 `www.example.com`）
2. 在域名 DNS 服务商处添加记录：
  - **CNAME** 记录：`www` → `sharp-007.github.io`
  - 或 **A** 记录指向 GitHub Pages IP 地址：
    ```
    185.199.108.153
    185.199.109.153
    185.199.110.153
    185.199.111.153
    ```
3. 勾选 **Enforce HTTPS**

### 方式三：本地预览

由于项目为纯静态文件，可直接在本地用任意 HTTP 服务器预览：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js (npx)
npx serve .

# 使用 VS Code
# 安装 Live Server 插件，右键 index.html → Open with Live Server
```

然后在浏览器访问 `http://localhost:8000`。

## 内容管理（Decap CMS）

网站集成了 [Decap CMS](https://decapcms.org/)，支持通过浏览器可视化管理内容。

### 在线使用（GitHub Pages 部署后）

1. 访问 `https://sharp-007.github.io/joyce.github.io/admin/`
2. 通过 GitHub 账号授权登录
3. 在可视化界面中添加/编辑博客、项目、演讲等内容
4. 点击发布，CMS 自动将修改 commit 到 GitHub 仓库
5. GitHub Pages 自动重新部署，主页即时更新

### 本地开发使用

```bash
# 1. 安装并启动 Decap CMS 本地代理
npx decap-server

# 2. 在另一个终端启动本地 HTTP 服务器
npx serve .

# 3. 访问 http://localhost:3000/admin/ 即可在本地可视化编辑
```

### GitHub OAuth 配置（完整指南）

在线使用 CMS 需要配置 GitHub OAuth，以下是完整配置步骤：

#### 步骤 1：部署 OAuth 代理服务

推荐使用免费的 [Sveltia CMS Auth](https://github.com/sveltia/sveltia-cms-auth)（Cloudflare Worker 方案）：

1. 访问 [Sveltia CMS Auth](https://github.com/sveltia/sveltia-cms-auth)
2. 点击 **"Deploy to Cloudflare"** 按钮
3. 登录 Cloudflare 账号，完成一键部署
4. 部署成功后获得 Worker URL，格式如：`https://sveltia-cms-auth.xxx.workers.dev`

#### 步骤 2：创建 GitHub OAuth App

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 **OAuth Apps** → **New OAuth App**
3. 填写以下信息：

| 字段 | 值 |
|------|-----|
| Application name | `Joyce Portfolio CMS`（任意名称） |
| Homepage URL | `https://sharp-007.github.io/joyce.github.io/` |
| Authorization callback URL | `https://你的Worker地址/callback` |

4. 点击 **Register application**
5. 创建成功后，复制 **Client ID**
6. 点击 **Generate a new client secret**，复制 **Client Secret**（只显示一次）

#### 步骤 3：配置 Cloudflare 环境变量

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → 点击你的 Worker（如 `sveltia-cms-auth`）
3. 点击 **Settings** → **Variables and Secrets**
4. 添加两个环境变量：

| 变量名 | 值 |
|--------|-----|
| `GITHUB_CLIENT_ID` | 你的 GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | 你的 GitHub OAuth Client Secret |

5. 点击 **Save and Deploy** 重新部署 Worker

#### 步骤 4：更新 CMS 配置

在 `admin/config.yml` 中配置 `base_url`：

```yaml
backend:
  name: github
  repo: sharp-007/joyce.github.io
  branch: main
  base_url: https://你的Worker地址
```

#### 步骤 5：测试 CMS

1. 推送更新后的 `config.yml` 到 GitHub
2. 等待 1-2 分钟 GitHub Pages 更新
3. 访问 `https://sharp-007.github.io/joyce.github.io/admin/`
4. 点击 **Login with GitHub** 授权登录

详见 [Decap CMS 官方文档](https://decapcms.org/docs/github-backend/)。

### CMS 支持的内容模块

| 模块 | 说明 | 数据文件 |
|------|------|----------|
| 🎠 首页走马灯 | 首页高亮展示卡片 | `data/carousel.json` |
| 💼 项目 | 个人项目（支持重点展示标记） | `data/projects.json` |
| 📝 博客 | 微信公众号文章 | `data/blogs.json` |
| 🎤 技术分享 | 公开课、白皮书 | `data/talks.json` |
| 📚 发表作品 | 专利、论文、白皮书 | `data/publications.json` |
| 🎨 创意作品 | AI 创作、音乐视频 | `data/creative.json` |

所有模块都支持：
- ✅ 拖拽排序
- ✅ 图片上传
- ✅ 中英文双语字段
- ✅ 实时预览

## 自定义修改


| 修改内容 | 对应文件 | CMS 支持 |
| --- | --- | :---: |
| 首页走马灯 (Carousel) | `data/carousel.json` | ✅ |
| 精选项目 (Projects) | `data/projects.json` | ✅ |
| 博客文章 (Blog) | `data/blogs.json` | ✅ |
| 技术分享 (Talks) | `data/talks.json` | ✅ |
| 发表作品 (Publications) | `data/publications.json` | ✅ |
| 创意作品 (Creative) | `data/creative.json` | ✅ |
| 个人简介与核心技能 (Profile) | `data/profile.json` | ✅ |
| 工作经历与教育背景 (Experience) | `data/experience.json` | ✅ |
| 联系方式 (Contact) | `data/contact.json` | ✅ |
| 主题色、卡片样式 | `style.css` | ❌ |
| 交互逻辑、数据渲染 | `script.js` | ❌ |
| CMS 配置 | `admin/config.yml` | - |


## 技术栈

- HTML5
- CSS3（CSS Variables、Flexbox、Grid、动画）
- Vanilla JavaScript（ES6+、Fetch API 数据驱动）
- [Decap CMS](https://decapcms.org/)（可视化内容管理）
- Google Fonts（Inter + Noto Sans SC）

## License

&copy; 2026 Joyce Pan. All rights reserved.