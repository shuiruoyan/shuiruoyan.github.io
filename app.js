/* ================================================
   HERMES AGENT — app.js
   ================================================ */

// ---- Theme ----
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);

  const icon = document.getElementById('theme-icon');
  const label = document.getElementById('theme-label');
  icon.textContent = next === 'light' ? '☀️' : '🌙';
  label.textContent = next === 'light' ? '白天' : '夜晚';

  // Save preference
  localStorage.setItem('hermes_theme', next);
}

function loadTheme() {
  const saved = localStorage.getItem('hermes_theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    document.getElementById('theme-icon').textContent = saved === 'light' ? '☀️' : '🌙';
    document.getElementById('theme-label').textContent = saved === 'light' ? '白天' : '夜晚';
  }
}

// ---- Starfield ----
function createStars() {
  const container = document.getElementById('stars');
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.setProperty('--dur', (2 + Math.random() * 4) + 's');
    star.style.animationDelay = Math.random() * 4 + 's';
    container.appendChild(star);
  }
}

// ---- Clock ----
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const time = `${h}:${m}:${s}`;
  const date = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}`;

  document.getElementById('clock').textContent = time;
  document.getElementById('big-clock').textContent = time;
  document.getElementById('date').textContent = date;
  document.getElementById('big-date').textContent = date;
  document.getElementById('footer-time').textContent = date + ' ' + time;

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  document.getElementById('timezone').textContent = tz;
}

// ---- Uptime ----
let uptimeSeconds = 0;
function updateUptime() {
  uptimeSeconds++;
  const h = String(Math.floor(uptimeSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((uptimeSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(uptimeSeconds % 60).padStart(2, '0');
  document.getElementById('uptime').textContent = `${h}:${m}:${s}`;
}

// ---- Fake Stats (simulated activity metrics) ----
// These represent the agent's capabilities and are not tied to any user's private data
const STATS = {
  // Simulated code lines written by this agent session
  codeLines: 4800,
  // Tasks completed across sessions
  tasks: 124,
  // Number of distinct skills/tools the agent has demonstrated
  skills: 89,
  // Days since agent was initialized in this environment
  daysSinceInit: 14
};

function animateStat(id, target, duration = 1200) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = 0;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ---- Init ----
async function init() {
  loadTheme();
  createStars();
  updateClock();
  setInterval(updateClock, 1000);
  setInterval(updateUptime, 1000);

  // Animate stats with stagger
  setTimeout(() => animateStat('stat-code', STATS.codeLines), 200);
  setTimeout(() => animateStat('stat-tasks', STATS.tasks), 400);
  setTimeout(() => animateStat('stat-skills', STATS.skills), 600);
  setTimeout(() => animateStat('stat-days', STATS.daysSinceInit), 800);
}

document.addEventListener('DOMContentLoaded', init);
