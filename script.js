/* ── Theme toggle ────────────────────────────────────────── */
const themeBtn  = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

const saved = localStorage.getItem('theme') || 'dark';
applyTheme(saved);

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (themeIcon) themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
}

/* ── Mobile nav ──────────────────────────────────────────── */
const hamburger = document.querySelector('.nav-hamburger');
const navLinks  = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

/* ── Active nav link on scroll ───────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const links    = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });

sections.forEach(s => navObserver.observe(s));

/* ── Scroll reveal ───────────────────────────────────────── */
document.querySelectorAll(
  '.skill-category, .project-card, .about-grid, .contact-form, .contact-links'
).forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(entries => {
  const visible = entries.filter(e => e.isIntersecting);
  visible.forEach((entry, i) => {
    setTimeout(() => entry.target.classList.add('visible'), i * 80);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Contact form ────────────────────────────────────────── */
const form   = document.getElementById('contact-form');
const status = document.getElementById('form-status');

if (form && status) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form));

    if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
      status.textContent = 'Please fill in all fields.';
      status.style.color = '#e87070';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      status.textContent = 'Please enter a valid email address.';
      status.style.color = '#e87070';
      return;
    }

    status.textContent = 'Sending…';
    status.style.color = 'var(--muted)';

    fetch('https://formspree.io/f/meebjjor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => {
      if (res.ok) {
        form.reset();
        status.textContent = 'Message sent! I\'ll get back to you soon.';
        status.style.color = 'var(--accent)';
        setTimeout(() => { status.textContent = ''; }, 5000);
      } else {
        status.textContent = 'Something went wrong. Please email me directly.';
        status.style.color = '#e87070';
      }
    })
    .catch(() => {
      status.textContent = 'Something went wrong. Please email me directly.';
      status.style.color = '#e87070';
    });
  });
}
