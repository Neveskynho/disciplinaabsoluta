/* ===== DISCIPLINA ABSOLUTA — JAVASCRIPT ===== */

'use strict';

// ============================================================
// 1. CURSOR PERSONALIZADO
// ============================================================
(function initCursor() {
  const cursor = document.querySelector('.cursor');
  const trail  = document.querySelector('.cursor-trail');

  if (!cursor || !trail) return;

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Trail segue com delay (RAF)
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    trail.style.left = trailX + 'px';
    trail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Hover em links e botões
  const hoverEls = document.querySelectorAll('a, button, .offer-card, .module-item, .enemy-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
})();


// ============================================================
// 2. REVEAL ON SCROLL (IntersectionObserver)
// ============================================================
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || 0);

        setTimeout(() => {
          el.classList.add('revealed');
        }, delay);

        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  els.forEach(el => observer.observe(el));
})();


// ============================================================
// 3. CONTADOR ANIMADO NOS NÚMEROS
// ============================================================
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number, .proof-big');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el   = entry.target;
      const text = el.textContent.trim();
      const num  = parseFloat(text.replace(/[^\d.]/g, ''));

      if (isNaN(num)) return;

      const suffix = text.replace(/[\d.]/g, '');
      const prefix = text.match(/^[^\d]*/)?.[0] || '';
      const duration = 1800;
      const start    = performance.now();

      function updateCount(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 4);
        const current  = num * eased;

        el.textContent = prefix + (Number.isInteger(num)
          ? Math.floor(current).toLocaleString('pt-BR')
          : current.toFixed(1)) + suffix;

        if (progress < 1) requestAnimationFrame(updateCount);
      }

      requestAnimationFrame(updateCount);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => countObserver.observe(el));
})();


// ============================================================
// 4. PARALLAX NO HERO
// ============================================================
(function initParallax() {
  const heroTitle  = document.querySelector('.hero-title');
  const heroBg     = document.querySelector('.hero-bg-lines');
  const bgText     = document.querySelector('.enemy-bg-text');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;

    if (heroTitle) {
      heroTitle.style.transform = `translateY(${sy * 0.25}px)`;
      heroTitle.style.opacity   = Math.max(0, 1 - sy / 500);
    }

    if (heroBg) {
      heroBg.style.transform = `translateY(${sy * 0.1}px)`;
    }

    if (bgText) {
      bgText.style.transform = `translate(-50%, calc(-50% + ${sy * 0.08}px))`;
    }
  }, { passive: true });
})();


// ============================================================
// 5. GLITCH EFFECT NO TÍTULO HERO
// ============================================================
(function initGlitch() {
  const titleAccent = document.querySelector('.title-accent');
  if (!titleAccent) return;

  function glitch() {
    titleAccent.style.textShadow = `
      ${(Math.random() - 0.5) * 8}px 0 var(--red),
      ${(Math.random() - 0.5) * 8}px 0 var(--gold)
    `;

    setTimeout(() => {
      titleAccent.style.textShadow = '0 0 80px rgba(229, 57, 53, 0.5)';
    }, 100);
  }

  // Glitch esporádico
  setInterval(() => {
    if (Math.random() < 0.3) {
      glitch();
      setTimeout(glitch, 60);
      setTimeout(glitch, 120);
    }
  }, 3500);
})();


// ============================================================
// 6. SMOOTH SCROLL COM OFFSET
// ============================================================
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      const offset = 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


// ============================================================
// 7. DESTAQUE ATIVO NO CARD DE OFERTA (HOVER EFFECT)
// ============================================================
(function initOfferCards() {
  const cards = document.querySelectorAll('.offer-card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      cards.forEach(c => {
        if (c !== card) c.style.opacity = '0.55';
      });
    });

    card.addEventListener('mouseleave', () => {
      cards.forEach(c => c.style.opacity = '1');
    });
  });
})();


// ============================================================
// 8. BARRA DE PROGRESSO DE LEITURA
// ============================================================
(function initReadingProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(to right, var(--red), var(--gold));
    z-index: 9999;
    width: 0%;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const docHeight     = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled      = window.scrollY;
    const pct           = (scrolled / docHeight) * 100;
    bar.style.width     = pct + '%';
  }, { passive: true });
})();


// ============================================================
// 9. TYPED EFFECT NA HERO PRE-HEADLINE
// ============================================================
(function initTyped() {
  const el = document.querySelector('.hero-pre .mono-tag');
  if (!el) return;

  const text    = el.textContent;
  el.textContent = '';
  el.style.opacity = '1';

  let i = 0;
  const type = () => {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      setTimeout(type, 50 + Math.random() * 30);
    }
  };

  // Inicia após carregamento
  setTimeout(type, 800);
})();


// ============================================================
// 10. MÓDULOS — HIGHLIGHT SEQUENCIAL NA ENTRADA
// ============================================================
(function initModuleHighlight() {
  const modules = document.querySelectorAll('.module-item');

  const moduleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const index = Array.from(modules).indexOf(el);
        
        setTimeout(() => {
          el.style.borderLeft = '2px solid var(--red)';
          setTimeout(() => {
            el.style.borderLeft = '';
          }, 600);
        }, index * 80);

        moduleObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  modules.forEach(el => moduleObserver.observe(el));
})();


// ============================================================
// 11. SECTION NUMBER TRACKER (subtle nav indicator)
// ============================================================
(function initSectionTracker() {
  const sections = document.querySelectorAll('section[id]');
  const heroNum  = document.querySelector('.hero-number');
  
  if (!heroNum) return;

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionNum = Array.from(sections).indexOf(entry.target) + 1;
        const numStr = sectionNum.toString().padStart(2, '0');
        
        heroNum.style.transition = 'opacity 0.4s';
        heroNum.style.opacity = '0';
        setTimeout(() => {
          heroNum.textContent = numStr;
          heroNum.style.opacity = '1';
        }, 400);
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => sectionObserver.observe(s));
})();


// ============================================================
// 12. MICRO-ANIMAÇÃO NOS BOTÕES CTA (pulso periódico)
// ============================================================
(function initButtonPulse() {
  const ctaBtns = document.querySelectorAll('.btn-pro, .final-cta-btn');

  ctaBtns.forEach(btn => {
    setInterval(() => {
      btn.style.boxShadow = '0 0 30px rgba(201,168,76,0.4)';
      setTimeout(() => {
        btn.style.boxShadow = '';
      }, 600);
    }, 4000);
  });
})();


// ============================================================
// 13. PARTÍCULAS FLUTUANTES NO HERO
// ============================================================
(function initParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.3;
  `;
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W = canvas.width  = hero.offsetWidth;
  let H = canvas.height = hero.offsetHeight;

  const particles = Array.from({ length: 40 }, () => ({
    x:    Math.random() * W,
    y:    Math.random() * H,
    vx:   (Math.random() - 0.5) * 0.3,
    vy:   -Math.random() * 0.4 - 0.1,
    size: Math.random() * 1.5 + 0.5,
    color: Math.random() > 0.5 ? '#C0392B' : '#C9A84C',
    life: Math.random()
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.003;

      if (p.life <= 0 || p.y < 0) {
        p.x    = Math.random() * W;
        p.y    = H + 10;
        p.life = Math.random() * 0.8 + 0.2;
      }

      ctx.globalAlpha = p.life * 0.6;
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', () => {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  });
})();


// ============================================================
// 14. EFEITO DE ENTRADA INICIAL (page load)
// ============================================================
(function initPageLoad() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';

  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });

  // Fallback
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 500);
})();


// ============================================================
// 15. SALES POPUP (Simulador de Vendas)
// ============================================================
(function initSalesPopup() {
  const popup = document.getElementById('salesPopup');
  const nameEl = document.getElementById('salesName');
  const timeEl = document.getElementById('salesTime');
  const closeBtn = document.getElementById('salesClose');

  if (!popup || !nameEl || !timeEl || !closeBtn) return;

  const names = [
    'João S.', 'Marcos T.', 'Ana C.', 'Pedro H.', 'Lucas M.',
    'Bruno G.', 'Felipe P.', 'Rafael L.', 'Carlos E.', 'Gabriel R.',
    'Thiago A.', 'Mateus F.', 'Fernando D.', 'Diego V.', 'Leonardo C.',
    'Juliana F.', 'Camila V.', 'Roberto N.', 'Gustavo B.', 'Amanda P.'
  ];

  const times = [
    'agora mesmo', 'há 2 minutos', 'há 5 minutos', 'há 10 minutos',
    'há 15 minutos', 'há 22 minutos', 'há 34 minutos', 'há 45 minutos',
    'há 1 hora', 'agora mesmo', 'agora mesmo', 'há 3 minutos'
  ];

  let timeoutId;

  function showPopup() {
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomTime = times[Math.floor(Math.random() * times.length)];

    nameEl.textContent = randomName;
    timeEl.textContent = randomTime;

    popup.classList.add('show');

    // Ocultar após 6 segundos
    timeoutId = setTimeout(hidePopup, 6000);
  }

  function hidePopup() {
    popup.classList.remove('show');
    
    // Próximo popup entre 12s e 32s
    const nextTime = Math.floor(Math.random() * 20000) + 12000;
    setTimeout(showPopup, nextTime);
  }

  closeBtn.addEventListener('click', () => {
    clearTimeout(timeoutId);
    hidePopup();
  });

  // Mostrar o primeiro popup após 4 segundos
  setTimeout(showPopup, 4000);
})();
