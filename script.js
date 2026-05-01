(() => {
  let lang = 'en';

  // --- Language toggle ---
  window.toggleLang = function () {
    lang = lang === 'en' ? 'zh' : 'en';
    document.getElementById('langToggle').textContent = lang === 'en' ? '中文' : 'EN';
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';

    document.querySelectorAll('[data-en][data-zh]').forEach(el => {
      const text = el.getAttribute(lang === 'en' ? 'data-en' : 'data-zh');
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.innerHTML = text;
      }
    });
  };

  // --- Mobile menu ---
  window.toggleMenu = function () {
    document.getElementById('navLinks').classList.toggle('open');
  };

  // close menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('navLinks').classList.remove('open');
    });
  });

  // --- Scroll: nav shadow + active link ---
  const nav = document.getElementById('nav');
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 10);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Fade-in on scroll (IntersectionObserver) ---
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
})();
