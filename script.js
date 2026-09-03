const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Scroll progress bar ---------- */
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress);
updateScrollProgress();

/* ---------- Nav shrink on scroll ---------- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.style.padding = '16px 48px';
    nav.style.boxShadow = '0 10px 30px rgba(43,36,56,0.05)';
  } else {
    nav.style.padding = '24px 48px';
    nav.style.boxShadow = 'none';
  }
});

/* ---------- Active section highlight ---------- */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link-item');
window.addEventListener('scroll', () => {
  let currentId = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 160) currentId = section.getAttribute('id');
  });
  navItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('href') === `#${currentId}`);
  });
});

/* ---------- Mobile hamburger menu ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navScrim = document.getElementById('navScrim');

function closeMobileMenu() {
  navLinks.classList.remove('open');
  navScrim.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
function openMobileMenu() {
  navLinks.classList.add('open');
  navScrim.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
navToggle.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
});
navScrim.addEventListener('click', closeMobileMenu);
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth > 640) closeMobileMenu(); });

/* ---------- Back to top button ---------- */
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  toTop.classList.toggle('visible', window.scrollY > 500);
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- Typed hero eyebrow line ---------- */
const typedTarget = document.getElementById('typedText');
const typedString = 'Computer Science Student';
if (typedTarget) {
  if (prefersReducedMotion) {
    typedTarget.textContent = typedString;
  } else {
    let i = 0;
    function typeChar() {
      if (i <= typedString.length) {
        typedTarget.textContent = typedString.slice(0, i);
        i++;
        setTimeout(typeChar, 28);
      }
    }
    typeChar();
  }
}

/* ---------- Animated stat counters (trigger once visible) ---------- */
const statNumbers = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      if (prefersReducedMotion) {
        el.textContent = target;
      } else {
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 30));
        const interval = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(interval); }
          el.textContent = current;
        }, 40);
      }
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNumbers.forEach(el => statObserver.observe(el));

/* ---------- Cursor glow + parallax blobs (desktop pointer only) ---------- */
const cursorGlow = document.getElementById('cursorGlow');
const blobs = document.querySelectorAll('.blob');
const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (isFinePointer && !prefersReducedMotion) {
  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    cursorGlow.classList.add('visible');

    const xRatio = (e.clientX / window.innerWidth) - 0.5;
    const yRatio = (e.clientY / window.innerHeight) - 0.5;
    blobs.forEach(blob => {
      const depth = parseFloat(blob.getAttribute('data-depth')) || 0.3;
      blob.style.transform = `translate(${xRatio * 60 * depth}px, ${yRatio * 60 * depth}px)`;
    });
  });
  window.addEventListener('mouseleave', () => cursorGlow.classList.remove('visible'));
}

/* ---------- Magnetic buttons ---------- */
if (isFinePointer && !prefersReducedMotion) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });
}

/* ---------- Project card reveal: click-to-expand (works on touch and desktop, unlike hover) ---------- */
document.querySelectorAll('.reveal-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.tilt-card');
    const isOpen = card.classList.contains('is-open');
    card.classList.toggle('is-open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
    btn.querySelector('span').textContent = isOpen ? 'View case study' : 'Hide case study';
  });
});

/* ---------- Tilt effect on project cards ---------- */
if (isFinePointer && !prefersReducedMotion) {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

/* ---------- Scroll-reveal for major blocks ---------- */
if (!prefersReducedMotion) {
  const revealTargets = document.querySelectorAll('.tilt-card, .skill-group, .cert-card, .more-card, .about-text, .contact-links');
  revealTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.165,0.84,0.44,1), transform 0.7s cubic-bezier(0.165,0.84,0.44,1)';
  });
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => revealObserver.observe(el));
}