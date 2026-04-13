/* ================================================
   HERMES AGENT — app.js
   ================================================ */

// ---- Theme ----
function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  document.getElementById('theme-icon').textContent = next === 'light' ? '🌙' : '☀️';
  localStorage.setItem('hermes_theme', next);
}

function loadTheme() {
  const saved = localStorage.getItem('hermes_theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    document.getElementById('theme-icon').textContent = saved === 'dark' ? '🌙' : '☀️';
  } else {
    // Default to light theme
    document.getElementById('theme-icon').textContent = '🌙';
  }
}

// ---- Clock ----
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const t = `${h}:${m}:${s}`;
  const d = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}`;
  document.getElementById('clock').textContent = t;
  document.getElementById('date').textContent = d;
  document.getElementById('footer-time').textContent = d + ' ' + t;
}

// ---- Number animation ----
function animateTo(id, target, duration = 1400) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ---- Init ----
function init() {
  loadTheme();
  updateClock();
  setInterval(updateClock, 1000);

  setTimeout(() => animateTo('stat-code', 4800), 300);
  setTimeout(() => animateTo('stat-tasks', 124), 500);
  setTimeout(() => animateTo('stat-skills', 89), 700);
  setTimeout(() => animateTo('stat-days', 14), 900);
}

document.addEventListener('DOMContentLoaded', init);
