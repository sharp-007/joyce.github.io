(() => {
  let lang = 'zh';

  window.toggleLang = function () {
    lang = lang === 'zh' ? 'en' : 'zh';
    document.getElementById('langToggle').textContent = lang === 'zh' ? 'EN' : '中文';
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
    document.querySelectorAll('[data-en][data-zh]').forEach(el => {
      const text = el.getAttribute(lang === 'en' ? 'data-en' : 'data-zh');
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = text;
      else el.innerHTML = text;
    });
  };

  // --- Data-driven rendering ---

  const FALLBACK_DATA = {
    'data/carousel.json': [
      { title_en:"Industrial ChatBI Platform", title_zh:"工业ChatBI智能对话分析平台", subtitle:"NL2SQL · Streamlit · Qwen", cover:"images/uploads/projects/chatbi-oee.png", url:"https://github.com/sharp-007/ChatBI_OEE" },
      { title_en:"Industrial Knowledge Q&A · RAG", title_zh:"工业知识库智能问答系统", subtitle:"LangChain · ChromaDB · React", cover:"images/uploads/projects/rag-qa.png", url:"https://github.com/sharp-007/industrial_agent_mini_demo" },
      { title_en:"Light Everywhere", title_zh:"城市角落的光 | AI原创音乐MV | 原创动画短片", subtitle:"AIGC Short Film · AI Music & Visuals", cover:"images/uploads/mv.png", url:"https://www.youtube.com/watch?v=OMIchR2C6qs" },
      { title_en:"DOE Introduction Course", title_zh:"DOE入门课：60分钟掌握DOE", subtitle:"JMP · DOE · Public Course", cover:"images/uploads/talks/doe-intro.png", url:"https://www.jmp.com/zh-hans/resources/on-demand/local/jmp-doe-from-zero-on-demand" },
      { title_en:"Industrial Defect Detection · YOLO11", title_zh:"工业缺陷智能检测系统", subtitle:"YOLO11 · Deep Learning · Quality Control", cover:"images/uploads/projects/defect-detection.png", url:"https://github.com/sharp-007/carbon_fiber_defect_detection_system_python3.10" }
    ],
    'data/projects.json': [
      { title_en:"Industrial ChatBI Platform", title_zh:"工业ChatBI智能对话分析平台", desc_en:"OEE analytics combining traditional BI dashboards with NL2SQL conversational analysis", desc_zh:"面向制造业OEE场景，融合传统BI仪表盘与AI对话式分析双模式", cover:"images/uploads/projects/chatbi-oee.png", url:"https://github.com/sharp-007/ChatBI_OEE", id:"project-chatbi", featured:true },
      { title_en:"Industrial Defect Detection · YOLO11", title_zh:"工业缺陷智能检测系统", desc_en:"Deep learning object detection replacing manual inspection for quality control", desc_zh:"基于YOLO11的深度学习目标检测，以智能检测替代人工检测", cover:"images/uploads/projects/defect-detection.png", url:"https://github.com/sharp-007/carbon_fiber_defect_detection_system_python3.10", id:"project-defect", featured:true },
      { title_en:"Industrial Knowledge Q&A · RAG", title_zh:"工业知识库智能问答系统", desc_en:"RAG-based intelligent Q&A system for industrial equipment maintenance knowledge", desc_zh:"基于RAG的本地部署智能问答系统，赋能工业设备维护知识管理", cover:"images/uploads/projects/rag-qa.png", url:"https://github.com/sharp-007/industrial_agent_mini_demo", id:"project-rag", featured:true },
      { title_en:"Dify Agents · RAG + TTS", title_zh:"Dify智能体合集 · RAG + TTS", desc_en:"RAG-based statistical analysis assistant and Doubao-powered TTS workflow", desc_zh:"基于Dify构建的RAG统计分析助手和豆包TTS语音工作流", cover:"images/uploads/projects/dify-agents.png", url:"https://github.com/sharp-007/Dify_Agents", id:"project-dify", featured:true },
      { title_en:"AssetOpsBench Agent", title_zh:"资产运维智能体", desc_en:"AI agent demo based on IBM AssetOpsBench for asset management operations", desc_zh:"基于IBM AssetOpsBench的资产管理运维AI Agent演示", cover:"images/uploads/projects/assetops.png", url:"https://github.com/sharp-007/mini_demo_with_AssetOpsBench", id:"", featured:false },
      { title_en:"Kaggle Dogs vs Cats · PyTorch", title_zh:"Kaggle猫狗分类 · PyTorch", desc_en:"Image classification using PyTorch with transfer learning", desc_zh:"基于PyTorch的图像分类与迁移学习项目", cover:"images/uploads/projects/kaggle-cats.png", url:"https://github.com/sharp-007/Kaggle_Dogs_vs_Cats_PyTorch", id:"", featured:false },
      { title_en:"Glass Panel Quality · Random Forest", title_zh:"玻璃面板质量分析 · 随机森林", desc_en:"Applied Random Forest for defect classification and key factor identification, AUC 0.92", desc_zh:"应用随机森林模型预测缺陷分类并识别关键因子，AUC达0.92", cover:"images/uploads/projects/arcing-rf.png", url:"https://github.com/sharp-007/Arcing-Issue-Solution-with-Random-Forest", id:"", featured:false },
      { title_en:"Hexi Corridor Silk Road", title_zh:"河西走廊丝绸之路之旅", desc_en:"Data-driven journey combining JMP interactive visualization with travel storytelling", desc_zh:"数据驱动的丝绸之路之旅，结合JMP交互式数据可视化与旅行叙事", cover:"images/uploads/projects/hexi-corridor.png", url:"https://github.com/sharp-007/Hexi-Corridor-Silk-Road", id:"", featured:false }
    ],
    'data/blogs.json': [
      { title_en:"Understanding How LLMs Reshape Data Platforms in One Diagram", title_zh:"一图理解大模型如何重塑数据平台", cover:"images/uploads/blogs/impact_diagram_zh.png", url:"https://mp.weixin.qq.com/s/eIQ0NeJ9hnBqkX6ueDvy2A", date:"2026-04-20" },
      { title_en:"The Ultimate Guide to World Models", title_zh:"一文读懂世界模型", cover:"/images/uploads/world-model-wechat-cover.png", url:"https://mp.weixin.qq.com/s/Dq5zCliOY9LeO0Uzh3oTCA?token=2126128470&lang=zh_CN", date:"2026-04-15" },
      { title_en:"What Defines Human Value in the Era of AI?", title_zh:"AI时代，人类的核心价值在哪里？", cover:"/images/uploads/xiaohongshu_cover.png", url:"https://mp.weixin.qq.com/s/79hOq2ySP2MQts5QpMe7kg?token=2126128470&lang=zh_CN", date:"2026-03-20" },
      { title_en:"In an AI-Driven World, Play the Long Game", title_zh:"AI时代如何反脆弱：相信时间的力量", cover:"/images/uploads/wechat-illustration-03-fundamentals-practice.png", url:"https://mp.weixin.qq.com/s/cDDkY_QcgwUJKKTHa95UgQ", date:"2026-02-10" },
      { title_en:"World Models, Explained in One Diagram", title_zh:"一图理解世界模型", cover:"/images/uploads/worldmodels_xiaohongshu.png", url:"https://mp.weixin.qq.com/s/6kTeCudFb2IB3j5evO73gQ", date:"2026-05-02" },
      { title_en:"How Large Models Are Reshaping Data Platforms: One Diagram, 10 Layers Explained", title_zh:"大模型如何重塑数据平台？一张图讲清楚10层技术栈的变与不变", cover:"/images/uploads/wechat-cover-llm-data-platform.png", url:"https://mp.weixin.qq.com/s/RlMWMXGu4taOElHMOSVk-g", date:"2026-05-02" }
    ],
    'data/talks.json': [
      { title_en:"DOE Intro: Master DOE in 60 Minutes", title_zh:"DOE入门课：从方法到实践，60分钟轻松掌握DOE", cover:"images/uploads/talks/doe-intro.png", url:"https://www.jmp.com/zh-hans/resources/on-demand/local/jmp-doe-from-zero-on-demand" },
      { title_en:"DOE Case Studies: 3 Methods for R&D & Process Optimization", title_zh:"DOE经典案例实战：产品研发与工艺优化的3种实验设计方法", cover:"images/uploads/talks/doe-cases.png", url:"https://www.jmp.com/zh-hans/resources/on-demand/local/doe-industry-cases-study" },
      { title_en:"Quality Analysis: 2 Cases Covering 80% QE Scenarios", title_zh:"45分钟完全入门质量分析：2大案例讲透质量工程师80%的数据分析场景", cover:"images/uploads/talks/quality-analysis.png", url:"https://www.jmp.com/zh-hans/resources/on-demand/local/get-started-quality-engineer" },
      { title_en:"Data Visualization User Group", title_zh:"数据可视化用户训练营", cover:"images/uploads/talks/user-group.png", url:"" },
      { title_en:"Food Sensory Analysis & Recipe Optimization: Statistical Methods & Cases", title_zh:"食品感官分析与配方优化的常用统计方法与实战案例", cover:"images/uploads/talks/food-webinar.png", url:"" }
    ]
  };

  function escHtml(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  const imgErr = `onerror="this.style.background='#1e293b';this.alt=''"`;
  const heroErr = `onerror="this.style.background='linear-gradient(135deg,#004f90,#00a8e8)'"`;

  async function fetchJSON(path, returnRaw = false) {
    try {
      const r = await fetch(path);
      if (!r.ok) throw new Error(r.status);
      const data = await r.json();
      if (returnRaw) return data;
      return Array.isArray(data) ? data : (data.items || []);
    } catch {
      if (FALLBACK_DATA[path]) return FALLBACK_DATA[path];
      return returnRaw ? {} : [];
    }
  }

  const SOCIAL_ICONS = {
    github: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    email: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
    twitter: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>',
    wechat: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-2.036 2.87c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982z"/></svg>'
  };

  function renderCarousel(items) {
    const track = document.getElementById('carouselTrack');
    if (!track || !items.length) return;
    track.innerHTML = items.map(item => `
      <a class="carousel-card" href="${escHtml(item.url)}" target="_blank">
        <img src="${escHtml(item.cover)}" alt="${escHtml(item.title_en)}" ${imgErr}>
        <div class="carousel-label">
          <strong data-en="${escHtml(item.title_en)}" data-zh="${escHtml(item.title_zh)}">${escHtml(item.title_en)}</strong>
          <span>${escHtml(item.subtitle)}</span>
        </div>
      </a>
    `).join('');
    initCarouselControls(items.length);
  }

  function initCarouselControls(totalItems) {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    if (!track || !prevBtn || !nextBtn) return;
    
    const visibleCount = 3;
    let currentIndex = 0;
    const maxIndex = Math.max(0, totalItems - visibleCount);
    
    function updateCarousel() {
      const cardWidth = track.children[0]?.offsetWidth || 0;
      const gap = 12;
      track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
      prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
      nextBtn.style.opacity = currentIndex >= maxIndex ? '0.4' : '1';
    }
    
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) { currentIndex--; updateCarousel(); }
    });
    nextBtn.addEventListener('click', () => {
      if (currentIndex < maxIndex) { currentIndex++; updateCarousel(); }
    });
    
    setTimeout(updateCarousel, 100);
  }

  function renderProjects(items) {
    const featured = items.filter(p => p.featured);
    const others = items.filter(p => !p.featured);

    const container = document.getElementById('projects-grid');
    if (!container) return;

    const renderSkills = (skills) => {
      if (!skills || !skills.length) return '';
      return `<div class="project-skills">${skills.map(s => `<span class="project-skill">${escHtml(s)}</span>`).join('')}</div>`;
    };

    let html = '<div class="photo-grid photo-grid-4 fade-in">';
    featured.forEach(p => {
      html += `
        <a href="${escHtml(p.url)}" target="_blank" class="photo-card project-card"${p.id ? ` id="${escHtml(p.id)}"` : ''}>
          <img src="${escHtml(p.cover)}" alt="${escHtml(p.title_en)}" loading="lazy" ${imgErr}>
          <div class="photo-card-label" data-en="${escHtml(p.title_en)}" data-zh="${escHtml(p.title_zh)}">${escHtml(p.title_en)}</div>
          ${renderSkills(p.skills)}
        </a>`;
    });
    html += '</div>';

    if (others.length) {
      html += '<div class="photo-grid photo-grid-4 fade-in" style="margin-top:16px">';
      others.forEach(p => {
        html += `
          <a href="${escHtml(p.url)}" target="_blank" class="photo-card project-card"${p.id ? ` id="${escHtml(p.id)}"` : ''}>
            <img src="${escHtml(p.cover)}" alt="${escHtml(p.title_en)}" loading="lazy" ${imgErr}>
            <div class="photo-card-label" data-en="${escHtml(p.title_en)}" data-zh="${escHtml(p.title_zh)}">${escHtml(p.title_en)}</div>
            ${renderSkills(p.skills)}
          </a>`;
      });
      html += '</div>';
    }
    container.innerHTML = html;
  }

  function renderBlogs(items) {
    const container = document.getElementById('blogs-grid');
    if (!container || !items.length) return;

    let html = '<div class="photo-grid photo-grid-6 fade-in">';
    items.forEach(b => {
      const tag = b.url ? 'a' : 'div';
      const linkAttr = b.url ? ` href="${escHtml(b.url)}" target="_blank"` : '';
      html += `
        <${tag}${linkAttr} class="photo-card blog-card">
          <img src="${escHtml(b.cover)}" alt="${escHtml(b.title_en)}" loading="lazy" ${imgErr}>
          <div class="photo-card-label" data-en="${escHtml(b.title_en)}" data-zh="${escHtml(b.title_zh)}">${escHtml(b.title_en)}</div>
        </${tag}>`;
    });
    html += '</div>';
    container.innerHTML = html;
  }

  function renderTalks(items) {
    const container = document.getElementById('talks-grid');
    if (!container || !items.length) return;

    const renderSkills = (skills) => {
      if (!skills || !skills.length) return '';
      return `<div class="project-skills">${skills.map(s => `<span class="project-skill">${escHtml(s)}</span>`).join('')}</div>`;
    };

    let html = '<div class="photo-grid photo-grid-4 fade-in">';
    items.forEach(tk => {
      const hasUrl = tk.url && tk.url.trim();
      const tag = hasUrl ? 'a' : 'div';
      const linkAttr = hasUrl ? ` href="${escHtml(tk.url)}" target="_blank"` : '';
      html += `
        <${tag}${linkAttr} class="photo-card talk-card">
          <img src="${escHtml(tk.cover)}" alt="${escHtml(tk.title_en)}" loading="lazy" ${imgErr}>
          <div class="photo-card-label" data-en="${escHtml(tk.title_en)}" data-zh="${escHtml(tk.title_zh)}">${escHtml(tk.title_en)}</div>
          ${renderSkills(tk.skills)}
        </${tag}>`;
    });
    html += '</div>';
    container.innerHTML = html;
  }

  function renderProfile(data) {
    const container = document.getElementById('hero-content');
    if (!container || !data.name_en) return;

    const bioHtml = (data.bio || []).map(b => 
      `<p data-en="${escHtml(b.text_en)}" data-zh="${escHtml(b.text_zh)}">${escHtml(b.text_en)}</p>`
    ).join('');

    const badgesHtml = (data.badges || []).map(b => 
      `<span class="badge" data-en="${escHtml(b.text_en)}" data-zh="${escHtml(b.text_zh)}">${escHtml(b.text_en)}</span>`
    ).join('');

    const skillsHtml = (data.skills || []).map(s => 
      `<span class="hero-skill" data-en="${escHtml(s.text_en)}" data-zh="${escHtml(s.text_zh)}">${escHtml(s.text_en)}</span>`
    ).join('');

    const linksHtml = (data.social_links || []).map(l => {
      const icon = SOCIAL_ICONS[l.icon] || '';
      const text = l.display || l.platform;
      return `<a href="${escHtml(l.url)}" target="_blank">${icon}${escHtml(text)}</a>`;
    }).join('');

    container.innerHTML = `
      <div class="hero-profile">
        <img src="${escHtml(data.photo)}" alt="${escHtml(data.name_en)}" class="hero-photo" ${heroErr}>
      </div>
      <div class="hero-text">
        <h1 data-en="${escHtml(data.name_en)}" data-zh="${escHtml(data.name_zh)}">${escHtml(data.name_en)}</h1>
        <p class="hero-tagline" data-en="${escHtml(data.tagline_en)}" data-zh="${escHtml(data.tagline_zh)}">${escHtml(data.tagline_en)}</p>
        <div class="hero-bio">${bioHtml}</div>
        <div class="hero-badges">${badgesHtml}</div>
        <div class="hero-skills">${skillsHtml}</div>
        <div class="hero-links">${linksHtml}</div>
      </div>
    `;
  }

  function renderExperience(items) {
    const container = document.getElementById('experience-list');
    if (!container || !items.length) return;

    container.innerHTML = items.map(exp => {
      const isEdu = exp.type === 'education';
      const isStatus = exp.type === 'status';
      const itemClass = isEdu ? 'exp-item exp-edu fade-in' : 'exp-item fade-in';

      let headerHtml = '';
      if (isStatus) {
        headerHtml = `<div class="exp-status" data-en="${escHtml(exp.company_en)}" data-zh="${escHtml(exp.company_zh)}">${escHtml(exp.company_en)}</div>`;
      } else {
        const logoHtml = exp.logo ? `<img src="${escHtml(exp.logo)}" alt="${escHtml(exp.company_en)}" class="company-logo">` : '';
        const linkHtml = exp.company_url 
          ? `<a href="${escHtml(exp.company_url)}" target="_blank" data-en="${escHtml(exp.company_en)}" data-zh="${escHtml(exp.company_zh)}">${escHtml(exp.company_en)}</a>`
          : `<span data-en="${escHtml(exp.company_en)}" data-zh="${escHtml(exp.company_zh)}">${escHtml(exp.company_en)}</span>`;
        headerHtml = `<h3>${logoHtml}${linkHtml}</h3>`;
        if (exp.role_en) {
          headerHtml += `<div class="exp-role" data-en="${escHtml(exp.role_en)}" data-zh="${escHtml(exp.role_zh)}">${escHtml(exp.role_en)}</div>`;
        }
      }

      const highlightsHtml = (exp.highlights && exp.highlights.length) 
        ? `<ul>${exp.highlights.map(h => `<li data-en="${escHtml(h.text_en)}" data-zh="${escHtml(h.text_zh)}">${h.text_en}</li>`).join('')}</ul>` 
        : '';

      return `
        <div class="${itemClass}">
          <div class="exp-period" data-en="${escHtml(exp.period_en)}" data-zh="${escHtml(exp.period_zh)}">${escHtml(exp.period_en)}</div>
          <div class="exp-body">
            ${headerHtml}
            ${highlightsHtml}
          </div>
        </div>
      `;
    }).join('');
  }

  function renderContact(data) {
    const container = document.getElementById('contact-content');
    if (!container || !data.title_en) return;

    const linksHtml = (data.social_links || []).map(l => {
      const icon = SOCIAL_ICONS[l.icon] || '';
      const text = l.display || l.platform;
      return `<a href="${escHtml(l.url)}" target="_blank">${icon}${escHtml(text)}</a>`;
    }).join('');

    const qrcodesHtml = (data.qrcodes || []).map(qr => `
      <div class="qrcode-card">
        <img src="${escHtml(qr.image)}" alt="${escHtml(qr.title_en)}" loading="lazy">
        <span data-en="${escHtml(qr.title_en)}" data-zh="${escHtml(qr.title_zh)}">${escHtml(qr.title_en)}</span>
      </div>
    `).join('');

    container.innerHTML = `
      <h2 data-en="${escHtml(data.title_en)}" data-zh="${escHtml(data.title_zh)}">${escHtml(data.title_en)}</h2>
      <p data-en="${escHtml(data.subtitle_en)}" data-zh="${escHtml(data.subtitle_zh)}">${escHtml(data.subtitle_en)}</p>
      <div class="contact-links">${linksHtml}</div>
      <div class="qrcode-section">${qrcodesHtml}</div>
    `;
  }

  function reapplyLang() {
    if (lang !== 'en') {
      document.querySelectorAll('[data-en][data-zh]').forEach(el => {
        const text = el.getAttribute('data-zh');
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = text;
        else el.innerHTML = text;
      });
    }
  }

  function reobserveFadeIn() {
    document.querySelectorAll('.fade-in:not(.visible)').forEach(el => observer.observe(el));
  }

  async function loadAllData() {
    const [carousel, projects, blogs, talks, profile, experience, contact] = await Promise.all([
      fetchJSON('data/carousel.json'),
      fetchJSON('data/projects.json'),
      fetchJSON('data/blogs.json'),
      fetchJSON('data/talks.json'),
      fetchJSON('data/profile.json', true),
      fetchJSON('data/experience.json'),
      fetchJSON('data/contact.json', true)
    ]);
    renderCarousel(carousel);
    renderProjects(projects);
    renderBlogs(blogs);
    renderTalks(talks);
    renderProfile(profile);
    renderExperience(experience);
    renderContact(contact);
    reapplyLang();
    reobserveFadeIn();
  }

  // --- Video source switch ---
  const videoSources = {
    youtube: 'https://www.youtube-nocookie.com/embed/OMIchR2C6qs?rel=0',
    bilibili: 'https://player.bilibili.com/player.html?bvid=BV1pyofB2Ebe&autoplay=0'
  };
  const videoLinks = {
    youtube: 'https://www.youtube.com/watch?v=OMIchR2C6qs',
    bilibili: 'https://www.bilibili.com/video/BV1pyofB2Ebe/'
  };
  const isLocalFile = location.protocol === 'file:';

  window.switchVideo = function (source) {
    const container = document.getElementById('videoContainer');
    if (!container) return;
    container.innerHTML = '';

    if (source === 'youtube' && isLocalFile) {
      const fallback = document.createElement('div');
      fallback.className = 'video-fallback';
      fallback.innerHTML = `
        <p>YouTube 视频无法在本地预览</p>
        <a href="${videoLinks.youtube}" target="_blank">点击在 YouTube 上观看</a>
      `;
      container.appendChild(fallback);
    } else {
      const iframe = document.createElement('iframe');
      iframe.id = 'videoFrame';
      iframe.src = videoSources[source];
      iframe.title = 'Light Everywhere';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';
      if (source === 'bilibili') iframe.sandbox = 'allow-scripts allow-same-origin allow-popups allow-presentation';
      container.appendChild(iframe);
    }

    document.querySelectorAll('.video-switch-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.toLowerCase().includes(source));
    });
  };

  // --- Mobile menu ---
  window.toggleMenu = function () {
    document.getElementById('navLinks').classList.toggle('open');
  };
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
  });

  // --- Scroll: nav shadow + active link ---
  const nav = document.getElementById('nav');
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 10);
    let current = '';
    sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 100) current = sec.id; });
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
    
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Fade-in ---
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
    { threshold: 0.08 }
  );
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // --- Initialize language & Load data on DOM ready ---
  document.querySelectorAll('[data-en][data-zh]').forEach(el => {
    const text = el.getAttribute('data-zh');
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = text;
    else el.innerHTML = text;
  });
  loadAllData();
})();
