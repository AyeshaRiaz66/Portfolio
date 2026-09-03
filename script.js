const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Scroll progress bar & Back to Top ---------- */
const scrollProgress = document.getElementById('scrollProgress');
const toTopBtn = document.getElementById('toTop');

function handleScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + '%';

  if (toTopBtn) {
    if (scrollTop > 400) {
      toTopBtn.classList.add('visible');
    } else {
      toTopBtn.classList.remove('visible');
    }
  }
}
window.addEventListener('scroll', handleScroll);
handleScroll();

if (toTopBtn) {
  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Nav shrink on scroll ---------- */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.style.padding = '16px 48px';
      nav.style.boxShadow = '0 10px 30px rgba(43,36,56,0.05)';
    } else {
      nav.style.padding = '24px 48px';
      nav.style.boxShadow = 'none';
    }
  });
}

/* ---------- Mobile hamburger menu ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navScrim = document.getElementById('navScrim');

function closeMobileMenu() {
  if (navLinks) navLinks.classList.remove('open');
  if (navScrim) navScrim.classList.remove('open');
  if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
}

function openMobileMenu() {
  if (navLinks) navLinks.classList.add('open');
  if (navScrim) navScrim.classList.add('open');
  if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
}

function toggleMobileMenu(e) {
  if (e) e.preventDefault();
  if (navLinks) {
    navLinks.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  }
}

if (navToggle) {
  navToggle.addEventListener('click', toggleMobileMenu);
}
if (navScrim) {
  navScrim.addEventListener('click', closeMobileMenu);
}
if (navLinks) {
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileMenu();
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 640) closeMobileMenu();
});

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

/* ---------- Animated stat counters ---------- */
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

