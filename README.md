# Joyce Pan | Data + AI Portfolio

个人主页展示站点，基于纯前端技术栈（HTML + CSS + JavaScript）构建，用于展示个人技能、项目经历、博客、演讲等内容。支持中英文双语切换。

## 预览

站点部署后可通过 GitHub Pages 访问：

```
https://sharp-007.github.io/joyce.github.io/
```

## 项目结构

```
joyce.github.io/
├── index.html          # 主页面（静态框架 + 动态容器）
├── style.css           # 全局样式
├── script.js           # 交互逻辑 + 数据驱动渲染
├── data/               # 模块化内容数据（JSON）
│   ├── projects.json   # 项目数据
│   ├── blogs.json      # 博客文章数据
│   ├── talks.json      # 演讲与白皮书数据
│   └── carousel.json   # 首页走马灯数据
├── admin/              # Decap CMS 可视化管理后台
│   ├── index.html      # CMS 入口页面
│   └── config.yml      # CMS 配置文件
├── blog/
│   └── covers/         # 博客封面图片
├── images/
│   ├── projects/       # 项目封面图片
│   ├── talks/          # 演讲封面图片
│   └── uploads/        # CMS 上传图片目录
├── .gitignore          # Git 忽略文件配置
└── README.md
```

## 功能特性

- **中英文双语切换** — 一键切换全站语言
- **响应式设计** — 适配桌面端与移动端
- **视频嵌入** — 支持 YouTube / Bilibili 双源切换
- **平滑滚动与动画** — 基于 Intersection Observer 的淡入效果
- **纯静态** — 无需后端服务，直接部署到任意静态托管平台
- **数据驱动** — 项目、博客、演讲等内容存储在 JSON 文件中，页面动态渲染
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

### GitHub OAuth 配置

在线使用 CMS 需要配置 GitHub OAuth App：

1. 在 GitHub Settings > Developer settings > OAuth Apps 中创建 OAuth App
2. 设置 Homepage URL 为站点地址，Authorization callback URL 为 `https://sharp-007.github.io/joyce.github.io/admin/`
3. 部署一个 OAuth 代理服务（推荐使用免费的 Cloudflare Worker 方案）
4. 在 `admin/config.yml` 中的 `backend` 部分添加 `base_url` 指向代理地址

详见 [Decap CMS 文档](https://decapcms.org/docs/github-backend/)。

## 自定义修改


| 修改内容                  | 对应文件                             |
| --------------------- | -------------------------------- |
| 首页走马灯 (Carousel)      | `data/carousel.json` 或通过 CMS 后台  |
| 精选项目 (Projects)       | `data/projects.json` 或通过 CMS 后台  |
| 博客文章 (Blog)           | `data/blogs.json` 或通过 CMS 后台     |
| 技术分享 (Talks)          | `data/talks.json` 或通过 CMS 后台     |
| 个人简介 (Hero)           | `index.html` — Hero 模块           |
| 工作经历 (Experience)     | `index.html` — Experience 模块     |
| 教育背景 (Education)      | `index.html` — Education 模块      |
| 专业证书 (Certifications) | `index.html` — Certifications 模块 |
| 职业技能 (Skills)         | `index.html` — Skills 模块         |
| 发表作品 (Publications)   | `index.html` — Publications 模块   |
| 创意作品 (Creative)       | `index.html` — Creative 模块       |
| 联系方式 (Contact)        | `index.html` — Contact 模块        |
| 颜色、字体、布局样式            | `style.css`                      |
| 语言切换、视频源、导航交互         | `script.js`                      |
| CMS 配置（字段定义等）         | `admin/config.yml`               |


## 技术栈

- HTML5
- CSS3（CSS Variables、Flexbox、Grid、动画）
- Vanilla JavaScript（ES6+、Fetch API 数据驱动）
- [Decap CMS](https://decapcms.org/)（可视化内容管理）
- Google Fonts（Inter + Noto Sans SC）

## License

&copy; 2026 Joyce Pan. All rights reserved.