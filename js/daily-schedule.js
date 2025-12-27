let scheduleData = {};
let activeWeek = null;
let activeDay = null;
let activeGame = null;

/* ===============================
   INITIAL LOAD
================================ */
fetch("data/schedule/daily-schedule.json")
  .then(res => res.json())
  .then(data => {
    scheduleData = data;

    const firstWeekKey = Object.keys(scheduleData)[0];
    loadWeek(firstWeekKey);
  })
  .catch(() => {
    document.getElementById("scheduleContent").innerHTML =
      "<p>Schedule not available.</p>";
  });

/* ===============================
   WEEK HANDLING
================================ */
function loadWeek(weekKey) {
  activeWeek = weekKey;
  activeDay = null;
  activeGame = null;

  renderWeekTabs();
  renderDayTabs();
}

function renderWeekTabs() {
  const weekTabs = document.getElementById("weekTabs");
  weekTabs.innerHTML = "";

  Object.entries(scheduleData).forEach(([key, week]) => {
    const btn = document.createElement("button");
    btn.className = "week-btn" + (key === activeWeek ? " active" : "");
    btn.textContent = week.label;

    btn.onclick = () => loadWeek(key);
    weekTabs.appendChild(btn);
  });
}

/* ===============================
   DAY HANDLING
================================ */
function renderDayTabs() {
  const dayTabs = document.getElementById("dayTabs");
  const gameTabs = document.getElementById("gameTabs");

  dayTabs.innerHTML = "";
  gameTabs.innerHTML = "";
  gameTabs.classList.add("hidden");

  const days = scheduleData[activeWeek].days;
  const dayKeys = Object.keys(days);

  if (!dayKeys.length) {
    document.getElementById("scheduleContent").innerHTML =
      "<p>No matches yet — the schedule will be updated soon.</p>";
    return;
  }

  activeDay = dayKeys[0];

  dayKeys.forEach((dayKey, idx) => {
    const btn = document.createElement("button");
    btn.className = "day-btn" + (idx === 0 ? " active" : "");
    btn.textContent = days[dayKey].label;

    btn.onclick = () => {
      document.querySelectorAll(".day-btn")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");
      activeDay = dayKey;
      activeGame = null;

      loadDay();
    };

    dayTabs.appendChild(btn);
  });

  loadDay();
}

/* ===============================
   DAY → GAME → MATCH FLOW
================================ */
function loadDay() {
  const dayData = scheduleData[activeWeek].days[activeDay];
  const matches = dayData.matches || [];

  renderGameTabs(matches);
}

/* ===============================
   GAME TABS
================================ */
function renderGameTabs(matches) {
  const gameTabs = document.getElementById("gameTabs");
  gameTabs.innerHTML = "";

  const games = [...new Set(matches.map(m => m.game))];

  // Single game → no tabs, render directly
  if (games.length === 1) {
    gameTabs.classList.add("hidden");
    activeGame = games[0];
    renderMatches(matches, activeGame);
    return;
  }

  gameTabs.classList.remove("hidden");

  games.forEach((game, idx) => {
    const btn = document.createElement("button");
    btn.className = "game-tab" + (idx === 0 ? " active" : "");
    btn.textContent = game;

    btn.onclick = () => {
      document.querySelectorAll(".game-tab")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");
      activeGame = game;
      renderMatches(matches, activeGame);
    };

    gameTabs.appendChild(btn);
  });

  // Default → first game
  activeGame = games[0];
  renderMatches(matches, activeGame);
}

/* ===============================
   MATCH RENDERING
================================ */
function renderMatches(matches, selectedGame) {
  const container = document.getElementById("scheduleContent");
  container.innerHTML = "";

  const filtered = matches.filter(m => m.game === selectedGame);

  if (!filtered.length) {
    container.innerHTML = "<p>No matches yet — the schedule will be updated soon.</p>";
    return;
  }

  filtered.forEach(match => {
    container.innerHTML += `
      <div class="schedule-card">
        ${match.round ? `<div class="round-label">${match.round}</div>` : ""}

        <div class="schedule-title">
          ${match.game} – ${match.category}
        </div>

        <div class="schedule-meta">
          ⏰ ${match.time} &nbsp; | &nbsp; 📍 ${match.venue}
        </div>

        <div class="schedule-match">
          ${match.match}
        </div>
      </div>
    `;
  });
}
