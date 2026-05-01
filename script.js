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

  // --- Carousel (horizontal scroll) ---
  const track = document.getElementById('carouselTrack');
  let scrollAmount = 276;

  window.moveCarousel = function (dir) {
    if (!track) return;
    track.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
  };

  if (track) {
    let autoTimer = setInterval(() => {
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 4000);

    track.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.addEventListener('mouseleave', () => {
      autoTimer = setInterval(() => {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }, 4000);
    });
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
})();
