/* =============================================
   AUGUSTO MIGUEL — PORTFOLIO 2026
   JavaScript: Interactions & Animations
   ============================================= */

'use strict';

// ─── TYPED TEXT EFFECT ───────────────────────────────────────
const typedWords = ['Fullstack', 'Front-End', 'Back-End', 'Python Dev', 'Java Dev'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typedEffect() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const currentWord = typedWords[wordIndex];

  if (isDeleting) {
    charIndex--;
    el.textContent = currentWord.slice(0, charIndex);
  } else {
    charIndex++;
    el.textContent = currentWord.slice(0, charIndex);
  }

  let speed = isDeleting ? 80 : 120;

  if (!isDeleting && charIndex === currentWord.length) {
    speed = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % typedWords.length;
    speed = 300;
  }

  setTimeout(typedEffect, speed);
}

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

// ─── FLASH CURSOR TRAIL (RAIO DO FLASH) ──────────────────────
function initFlashTrail() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let lastTime = 0;

  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    // Limita um pouco a quantidade de partículas (opcional)
    if (now - lastTime < 15) return; 
    lastTime = now;

    const trail = document.createElement('div');
    trail.className = 'flash-trail';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    
    // Rotação randômica para parecerem faíscas/raios
    const rotation = Math.random() * 360;
    trail.style.setProperty('--rot', `${rotation}deg`);

    document.body.appendChild(trail);

    // Remove do DOM após a animação de fade
    setTimeout(() => {
      trail.remove();
    }, 400);
  }, { passive: true });
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
  typedEffect();
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
