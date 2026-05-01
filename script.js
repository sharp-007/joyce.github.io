(() => {
  let lang = 'en';

  window.toggleLang = function () {
    lang = lang === 'en' ? 'zh' : 'en';
    document.getElementById('langToggle').textContent = lang === 'en' ? '中文' : 'EN';
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
      { title_en:"ChatBI OEE Platform", title_zh:"工业ChatBI平台", subtitle:"NL2SQL · Streamlit · Qwen", cover:"images/projects/chatbi-oee.svg", url:"#project-chatbi" },
      { title_en:"Industrial RAG Q&A", title_zh:"工业知识问答", subtitle:"LangChain · ChromaDB · React", cover:"images/projects/rag-qa.svg", url:"#project-rag" },
      { title_en:"Light Everywhere", title_zh:"城市角落的光", subtitle:"AIGC Short Film · AI Music & Visuals", cover:"blog/covers/placeholder-1.svg", url:"#creative" }
    ],
    'data/projects.json': [
      { title_en:"Industrial ChatBI Platform", title_zh:"工业ChatBI对话分析平台", cover:"images/projects/chatbi-oee.svg", url:"https://github.com/sharp-007/ChatBI_OEE", id:"project-chatbi", featured:true },
      { title_en:"Defect Detection · YOLO11", title_zh:"工业缺陷检测 · YOLO11", cover:"images/projects/defect-detection.svg", url:"https://github.com/sharp-007/carbon_fiber_defect_detection_system_pyhton3.10", id:"project-defect", featured:true },
      { title_en:"Industrial RAG Q&A", title_zh:"工业知识问答系统", cover:"images/projects/rag-qa.svg", url:"https://github.com/sharp-007/industrial_agent_mini_demo", id:"project-rag", featured:true },
      { title_en:"Dify Agents · RAG + TTS", title_zh:"Dify Agents · RAG + TTS", cover:"images/projects/dify-agents.svg", url:"https://github.com/sharp-007/Dify_Agents", id:"project-dify", featured:true },
      { title_en:"AssetOpsBench Agent", title_zh:"AssetOpsBench Agent", cover:"images/projects/assetops.svg", url:"https://github.com/sharp-007/mini_demo_with_AssetOpsBench", id:"", featured:false },
      { title_en:"Kaggle Dogs vs Cats", title_zh:"Kaggle Dogs vs Cats", cover:"images/projects/kaggle-cats.svg", url:"https://github.com/sharp-007/Kaggle_Dogs_vs_Cats_PyTorch", id:"", featured:false },
      { title_en:"Hexi Corridor Silk Road", title_zh:"河西走廊丝绸之路", cover:"images/projects/hexi-corridor.svg", url:"https://github.com/sharp-007/Hexi-Corridor-Silk-Road", id:"", featured:false },
      { title_en:"Arcing Issue · Random Forest", title_zh:"电弧问题 · 随机森林", cover:"images/projects/arcing-rf.svg", url:"https://github.com/sharp-007/Arcing-Issue-Solution-with-Random-Forest", id:"", featured:false }
    ],
    'data/blogs.json': [
      { title_en:"How I Built an Industrial ChatBI Platform with Vibe Coding", title_zh:"我如何用Vibe Coding构建工业ChatBI平台", cover:"blog/covers/placeholder-1.svg", url:"", date:"2026-04-15" },
      { title_en:"RAG in Practice: Building an Industrial Knowledge Q&A System", title_zh:"RAG实战：构建工业知识库智能问答系统", cover:"blog/covers/placeholder-2.svg", url:"", date:"2026-03-20" },
      { title_en:"YOLO11 for Industrial Defect Detection: A Complete Guide", title_zh:"YOLO11工业缺陷检测：完整指南", cover:"blog/covers/placeholder-3.svg", url:"", date:"2026-02-10" }
    ],
    'data/talks.json': [
      { title_en:"DOE Intro: Master DOE in 60 Minutes", title_zh:"DOE入门课：60分钟轻松掌握DOE", cover:"images/talks/doe-intro.svg", url:"https://www.jmp.com/zh-hans/resources/on-demand/local/jmp-doe-from-zero-on-demand" },
      { title_en:"DOE Case Studies: 3 Methods for R&D", title_zh:"DOE经典案例实战：3种实验设计方法", cover:"images/talks/doe-cases.svg", url:"https://www.jmp.com/zh-hans/resources/on-demand/local/doe-industry-cases-study" },
      { title_en:"DOE White Paper: Zero-to-One Guide", title_zh:"从0到1掌握DOE白皮书", cover:"images/talks/doe-whitepaper.svg", url:"https://www.jmp.com/zh-hans/resources/white-papers/doe-from-zero-for-engineers" },
      { title_en:"Quality Analysis: 2 Cases for QE", title_zh:"45分钟完全入门质量分析", cover:"images/talks/quality-analysis.svg", url:"https://www.jmp.com/zh-hans/resources/on-demand/local/get-started-quality-engineer" }
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

  async function fetchJSON(path) {
    try {
      const r = await fetch(path);
      if (!r.ok) throw new Error(r.status);
      const data = await r.json();
      return Array.isArray(data) ? data : (data.items || []);
    } catch {
      if (FALLBACK_DATA[path]) return FALLBACK_DATA[path];
      return [];
    }
  }

  function renderCarousel(items) {
    const track = document.getElementById('carouselTrack');
    if (!track || !items.length) return;
    track.innerHTML = items.map(item => `
      <a class="carousel-card" href="${escHtml(item.url)}">
        <img src="${escHtml(item.cover)}" alt="${escHtml(item.title_en)}" ${imgErr}>
        <div class="carousel-label">
          <strong data-en="${escHtml(item.title_en)}" data-zh="${escHtml(item.title_zh)}">${escHtml(item.title_en)}</strong>
          <span>${escHtml(item.subtitle)}</span>
        </div>
      </a>
    `).join('');
  }

  function renderProjects(items) {
    const featured = items.filter(p => p.featured);
    const others = items.filter(p => !p.featured);

    const container = document.getElementById('projects-grid');
    if (!container) return;

    let html = '<div class="photo-grid photo-grid-4 fade-in">';
    featured.forEach(p => {
      html += `
        <a href="${escHtml(p.url)}" target="_blank" class="photo-card"${p.id ? ` id="${escHtml(p.id)}"` : ''}>
          <img src="${escHtml(p.cover)}" alt="${escHtml(p.title_en)}" loading="lazy" ${imgErr}>
          <div class="photo-card-label" data-en="${escHtml(p.title_en)}" data-zh="${escHtml(p.title_zh)}">${escHtml(p.title_en)}</div>
        </a>`;
    });
    html += '</div>';

    if (others.length) {
      html += '<div class="photo-grid photo-grid-4 fade-in" style="margin-top:16px">';
      others.forEach(p => {
        html += `
          <a href="${escHtml(p.url)}" target="_blank" class="photo-card"${p.id ? ` id="${escHtml(p.id)}"` : ''}>
            <img src="${escHtml(p.cover)}" alt="${escHtml(p.title_en)}" loading="lazy" ${imgErr}>
            <div class="photo-card-label" data-en="${escHtml(p.title_en)}" data-zh="${escHtml(p.title_zh)}">${escHtml(p.title_en)}</div>
          </a>`;
      });
      html += '</div>';
    }
    container.innerHTML = html;
  }

  function renderBlogs(items) {
    const container = document.getElementById('blogs-grid');
    if (!container || !items.length) return;

    let html = '<div class="photo-grid photo-grid-3 fade-in">';
    items.forEach(b => {
      const tag = b.url ? 'a' : 'div';
      const linkAttr = b.url ? ` href="${escHtml(b.url)}" target="_blank"` : '';
      html += `
        <${tag}${linkAttr} class="photo-card">
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

    let html = '<div class="photo-grid photo-grid-4 fade-in">';
    items.forEach(tk => {
      html += `
        <a href="${escHtml(tk.url)}" target="_blank" class="photo-card">
          <img src="${escHtml(tk.cover)}" alt="${escHtml(tk.title_en)}" loading="lazy" ${imgErr}>
          <div class="photo-card-label" data-en="${escHtml(tk.title_en)}" data-zh="${escHtml(tk.title_zh)}">${escHtml(tk.title_en)}</div>
        </a>`;
    });
    html += '</div>';
    container.innerHTML = html;
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
    const [carousel, projects, blogs, talks] = await Promise.all([
      fetchJSON('data/carousel.json'),
      fetchJSON('data/projects.json'),
      fetchJSON('data/blogs.json'),
      fetchJSON('data/talks.json')
    ]);
    renderCarousel(carousel);
    renderProjects(projects);
    renderBlogs(blogs);
    renderTalks(talks);
    reapplyLang();
    reobserveFadeIn();
  }

  // --- Video source switch ---
  const videoSources = {
    youtube: 'https://www.youtube-nocookie.com/embed/OMIchR2C6qs',
    bilibili: 'https://player.bilibili.com/player.html?bvid=BV1pyofB2Ebe&autoplay=0'
  };

  window.switchVideo = function (source) {
    const container = document.getElementById('videoContainer');
    if (!container) return;
    const old = document.getElementById('videoFrame');
    if (old) old.remove();
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

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 10);
    let current = '';
    sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 100) current = sec.id; });
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Fade-in ---
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
    { threshold: 0.08 }
  );
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // --- Load data on DOM ready ---
  loadAllData();
})();
