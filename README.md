# Joyce Pan | Data + AI Portfolio

个人主页展示站点，基于纯前端技术栈（HTML + CSS + JavaScript）构建，用于展示个人技能、项目经历、博客、教育背景、证书及发表论文等内容。支持中英文双语切换。

## 预览

站点部署后可通过 GitHub Pages 访问：

```
https://<your-github-username>.github.io/<repo-name>/
```

## 项目结构

```
joyce_pan_portfolio/
├── index.html        # 主页面（包含所有版块内容）
├── style.css         # 全局样式
├── script.js         # 交互逻辑（语言切换、视频源切换、导航、动画等）
├── blog/
│   └── covers/       # 博客封面占位图
├── QRCODE/           # 微信公众号二维码图片
├── resume/           # 简历 YAML 数据源
│   ├── Joyce_EN.yaml
│   └── Joyce_ZH.yaml
└── README.md
```

## 功能特性

- **中英文双语切换** — 一键切换全站语言
- **响应式设计** — 适配桌面端与移动端
- **视频嵌入** — 支持 YouTube / Bilibili 双源切换
- **平滑滚动与动画** — 基于 Intersection Observer 的淡入效果
- **纯静态** — 无需后端服务，直接部署到任意静态托管平台

## 部署指南

### 方式一：GitHub Pages（推荐）

1. **创建 GitHub 仓库**

   在 GitHub 上新建一个仓库，仓库名建议使用 `<username>.github.io`（用户主页）或其他任意名称（项目主页）。

2. **推送代码到仓库**

   ```bash
   git remote add origin https://github.com/<username>/<repo-name>.git
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
   - 用户主页：`https://<username>.github.io/`
   - 项目主页：`https://<username>.github.io/<repo-name>/`

### 方式二：自定义域名（可选）

1. 在仓库 **Settings → Pages → Custom domain** 中填写你的域名（如 `www.example.com`）
2. 在域名 DNS 服务商处添加记录：
   - **CNAME** 记录：`www` → `<username>.github.io`
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

## 自定义修改

| 修改内容 | 对应文件 |
|---------|---------|
| 个人信息、项目、经历等 | `index.html` |
| 颜色、字体、布局样式 | `style.css` |
| 语言切换、视频源、导航交互 | `script.js` |
| 简历数据 | `resume/*.yaml` |

## 技术栈

- HTML5
- CSS3（CSS Variables、Flexbox、Grid、动画）
- Vanilla JavaScript（ES6+）
- Google Fonts（Inter + Noto Sans SC）

## License

&copy; 2026 Joyce Pan. All rights reserved.
