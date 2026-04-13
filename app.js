/* ================================================
   MISSION CONTROL — app.js
   ================================================ */

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

// ---- GitHub ----
async function loadGitHubProfile() {
  try {
    const r = await fetch('https://api.github.com/users/shuiruoyan');
    const d = await r.json();

    document.getElementById('gh-avatar').src = d.avatar_url;
    document.getElementById('gh-name').textContent = d.name || d.login;
    document.getElementById('gh-login').textContent = '@' + d.login;
    document.getElementById('gh-repos').textContent = d.public_repos ?? '--';
    document.getElementById('gh-followers').textContent = d.followers ?? '--';
    document.getElementById('gh-following').textContent = d.following ?? '--';
    document.getElementById('github-status').textContent = 'ONLINE';
  } catch {
    document.getElementById('github-status').textContent = 'OFFLINE';
  }
}

// ---- Weather ----
const WEATHER_ICONS = {
  'Clear': '☀️', 'Clouds': '☁️', 'Rain': '🌧️', 'Drizzle': '🌦️',
  'Thunderstorm': '⛈️', 'Snow': '❄️', 'Mist': '🌫️', 'Fog': '🌫️',
  'Haze': '🌫️', 'Smoke': '🌫️', 'Dust': '💨', 'default': '🌡️'
};

async function loadWeather() {
  try {
    // Use free Open-Meteo API — no key needed
    const geoRes = await fetch('https://ipapi.co/json/');
    const geo = await geoRes.json();
    const lat = geo.latitude;
    const lon = geo.longitude;
    const city = geo.city || geo.country_name || 'Unknown';

    const wRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
    );
    const w = await wRes.json();
    const c = w.current;

    const temp = Math.round(c.temperature_2m);
    const humidity = c.relative_humidity_2m;
    const wind = Math.round(c.wind_speed_10m);
    const code = c.weather_code;

    document.getElementById('weather-temp').textContent = temp + '°';
    document.getElementById('weather-humidity').textContent = humidity + '%';
    document.getElementById('weather-wind').textContent = wind + ' km/h';
    document.getElementById('weather-city').textContent = city;

    const weatherName = getWeatherName(code);
    document.getElementById('weather-desc').textContent = weatherName;
    document.getElementById('weather-icon').textContent = WEATHER_ICONS[weatherName] || WEATHER_ICONS['default'];
    document.getElementById('weather-status').textContent = 'OK';
  } catch {
    document.getElementById('weather-status').textContent = 'ERROR';
    document.getElementById('weather-desc').textContent = 'Unavailable';
    document.getElementById('weather-temp').textContent = '--°';
  }
}

function getWeatherName(code) {
  const map = {
    0: 'Clear', 1: 'Clear', 2: 'Clouds', 3: 'Clouds',
    45: 'Fog', 48: 'Fog',
    51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
    61: 'Rain', 63: 'Rain', 65: 'Rain',
    71: 'Snow', 73: 'Snow', 75: 'Snow',
    80: 'Rain', 81: 'Rain', 82: 'Rain',
    95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
  };
  return map[code] || 'Clouds';
}

// ---- System Monitor (simulated for browser) ----
function updateSystemMonitor() {
  // Simulated data for browser environment
  // In a real deployment these could be real metrics from a backend
  const cpu = 15 + Math.random() * 35;
  const mem = 30 + Math.random() * 40;
  const disk = 45 + Math.random() * 15;
  const net = Math.random() * 100;

  document.getElementById('cpu-bar').style.width = cpu + '%';
  document.getElementById('cpu-val').textContent = Math.round(cpu) + '%';

  document.getElementById('mem-bar').style.width = mem + '%';
  document.getElementById('mem-val').textContent = Math.round(mem) + '%';

  document.getElementById('disk-bar').style.width = disk + '%';
  document.getElementById('disk-val').textContent = Math.round(disk) + '%';

  document.getElementById('net-bar').style.width = Math.min(net, 100) + '%';
  document.getElementById('net-val').textContent = net.toFixed(1) + ' Mbps';
}

// ---- Kanban ----
let kanbanData = {
  backlog: [],
  progress: [],
  done: []
};

function loadKanban() {
  try {
    const saved = localStorage.getItem('kanban_shuiruoyan');
    if (saved) kanbanData = JSON.parse(saved);
  } catch {}
  renderKanban();
}

function saveKanban() {
  try {
    localStorage.setItem('kanban_shuiruoyan', JSON.stringify(kanbanData));
    flashSave();
  } catch {}
}

function flashSave() {
  const btn = document.querySelector('.action-btn:last-child');
  if (!btn) return;
  const orig = btn.querySelector('span:last-child').textContent;
  btn.querySelector('span:last-child').textContent = 'SAVED!';
  setTimeout(() => btn.querySelector('span:last-child').textContent = orig, 1200);
}

function renderKanban() {
  renderCol('backlog', 'cards-backlog', 'count-backlog');
  renderCol('progress', 'cards-progress', 'count-progress');
  renderCol('done', 'cards-done', 'count-done');
}

function renderCol(key, cardsId, countId) {
  const cards = document.getElementById(cardsId);
  const count = document.getElementById(countId);
  cards.innerHTML = '';
  count.textContent = kanbanData[key].length;

  kanbanData[key].forEach((task, i) => {
    const card = document.createElement('div');
    card.className = 'kanban-card';
    card.draggable = true;
    card.dataset.col = key;
    card.dataset.index = i;

    card.innerHTML = `
      <div class="kanban-card-title">${escHtml(task.title)}</div>
      ${task.desc ? `<div class="kanban-card-desc">${escHtml(task.desc)}</div>` : ''}
      <div class="kanban-card-footer">
        <span class="priority-badge priority-${task.priority}">${task.priority.toUpperCase()}</span>
        <button class="card-delete" onclick="deleteTask('${key}', ${i})" title="Delete">&#10005;</button>
      </div>
    `;

    card.addEventListener('dragstart', onDragStart);
    card.addEventListener('dragend', onDragEnd);
    cards.appendChild(card);
  });
}

function escHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// Drag and drop
let dragSrc = null;

function onDragStart(e) {
  dragSrc = e.currentTarget;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function onDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  dragSrc = null;
}

document.querySelectorAll('.kanban-col').forEach(col => {
  col.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
  col.addEventListener('drop', e => {
    e.preventDefault();
    if (!dragSrc) return;
    const newCol = col.id.replace('kanban-', '');
    const oldCol = dragSrc.dataset.col;
    const idx = parseInt(dragSrc.dataset.index);

    if (newCol === oldCol) return;

    const task = kanbanData[oldCol].splice(idx, 1)[0];
    kanbanData[newCol].push(task);
    saveKanban();
    renderKanban();
  });
});

function deleteTask(col, idx) {
  kanbanData[col].splice(idx, 1);
  saveKanban();
  renderKanban();
}

// Modal
function openAddModal() {
  document.getElementById('task-title').value = '';
  document.getElementById('task-desc').value = '';
  document.getElementById('task-priority').value = 'medium';
  document.getElementById('task-col').value = 'backlog';
  document.getElementById('modal-overlay').classList.add('open');
  setTimeout(() => document.getElementById('task-title').focus(), 100);
}

function closeModal(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('modal-overlay').classList.remove('open');
}

function addTask() {
  const title = document.getElementById('task-title').value.trim();
  if (!title) return;

  const desc = document.getElementById('task-desc').value.trim();
  const priority = document.getElementById('task-priority').value;
  const col = document.getElementById('task-col').value;

  kanbanData[col].push({ title, desc, priority });
  saveKanban();
  renderKanban();
  closeModal();
}

// Close modal on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ---- Init ----
async function init() {
  createStars();
  updateClock();
  setInterval(updateClock, 1000);

  setInterval(updateUptime, 1000);
  setInterval(updateSystemMonitor, 3000);

  loadKanban();

  await loadGitHubProfile();
  await loadWeather();

  updateSystemMonitor();
}

document.addEventListener('DOMContentLoaded', init);
