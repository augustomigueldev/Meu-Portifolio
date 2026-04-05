/* =============================================
   AUGUSTO MIGUEL — PORTFOLIO 2026
   JavaScript: Interactions & Animations
   ============================================= */

'use strict';

// Animacoes Extras

// ─── NAVBAR SCROLL EFFECT ────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ─── ACTIVE NAV LINK ON SCROLL ───────────────────────────────
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

// ─── HAMBURGER MENU ──────────────────────────────────────────
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close on nav link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ─── CURSOR GLOW ─────────────────────────────────────────────
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) {
    if (glow) glow.style.display = 'none';
    return;
  }

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.06;
    glowY += (mouseY - glowY) * 0.06;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }

  animateGlow();
}

// ─── FLASH CURSOR TRAIL (LIGHTNING CANVAS) ─────────────────
function initFlashTrail() {
  const canvas = document.getElementById('lightning-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const path = [];

  function addPoint(x, y) {
    path.push({ x, y, age: 0 });
  }

  window.addEventListener('mousemove', (e) => addPoint(e.clientX, e.clientY), { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) addPoint(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  // Desenha os sub-ramos tremidos do raio
  function drawLightning(p1, p2) {
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const steps = Math.max(Math.floor(dist / 10), 1);
    
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);

    for (let i = 1; i <= steps; i++) {
        let t = i / steps;
        let pX = p1.x + (p2.x - p1.x) * t;
        let pY = p1.y + (p2.y - p1.y) * t;
        
        let noiseOffset = (Math.random() - 0.5) * 15; // Ruído que cria as quinas do raio
        
        ctx.lineTo(pX + noiseOffset, pY + noiseOffset);
    }
    ctx.stroke();
  }

  function renderLoop() {
    ctx.clearRect(0, 0, width, height);

    if (path.length > 1) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      for (let i = 0; i < path.length - 1; i++) {
        let p1 = path[i];
        let p2 = path[i + 1];

        if (p1.age > 15) continue; // Desaparece tão rápido quanto um relâmpago curucu

        let alpha = 1 - (p1.age / 15);
        
        // Relâmpago Principal (Miolo super branco + Glow amarelo agressivo)
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ffcc00"; 
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = Math.random() * 2 + 1.5; // Espessura tremelica da eletricidade
        
        drawLightning(p1, p2);

        // Faíscas laterais menores para preencher o visual do raio vibrando
        if (Math.random() < 0.3) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#b30000"; // Leve tom do traje
            ctx.strokeStyle = `rgba(255, 204, 0, ${alpha * 0.8})`; // Eletricidade Amarela
            ctx.lineWidth = 1;
            drawLightning(p1, {
              x: p2.x + (Math.random() - 0.5) * 35,
              y: p2.y + (Math.random() - 0.5) * 35
            });
        }
      }
    }

    // Envelhece e mata os vetores do raio na tela
    for (let i = 0; i < path.length; i++) {
      path[i].age++;
    }
    while(path.length && path[0].age > 15) {
      path.shift();
    }

    requestAnimationFrame(renderLoop);
  }

  renderLoop();
}

// ─── SCROLL REVEAL ───────────────────────────────────────────
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.section-header, .about-text-card, .about-cards, .info-card, .skill-card, .project-card, .contact-info, .contact-form'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Staggered delay for grid items
        const delay = entry.target.closest('.skills-grid, .projects-grid, .about-cards')
          ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 60
          : 0;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  revealElements.forEach(el => observer.observe(el));
}

// ─── CONTACT FORM ────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      statusEl.textContent = '⚠️ Por favor, preencha todos os campos.';
      statusEl.style.color = '#f59e0b';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      statusEl.textContent = '⚠️ Por favor, insira um email válido.';
      statusEl.style.color = '#f59e0b';
      return;
    }

    // Simulate send (replace with real API call)
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    statusEl.textContent = '';

    await new Promise(resolve => setTimeout(resolve, 1200));

    statusEl.textContent = '✅ Mensagem enviada! Obrigado pelo contato.';
    statusEl.style.color = '#10b981';
    form.reset();

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Enviar Mensagem
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`;
    }, 3000);

    setTimeout(() => {
      statusEl.textContent = '';
    }, 6000);
  });
}

// ─── FOOTER YEAR ─────────────────────────────────────────────
function initFooterYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ─── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ─── SKILL CARDS GLOW ON HOVER ───────────────────────────────
function initSkillHover() {
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// ─── INIT ALL ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initActiveNavLinks();
  initHamburger();
  initCursorGlow();
  initScrollReveal();
  initContactForm();
  initFooterYear();
  initSmoothScroll();
  initSkillHover();
  initFlashTrail();
});
