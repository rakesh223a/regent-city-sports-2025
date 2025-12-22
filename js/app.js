const content = document.getElementById("content");
const gameMenu = document.getElementById("gameMenu");
const fixturesSection = document.getElementById("fixturesSection");
const rulesSection = document.getElementById("rulesSection");

const categoryTabs = document.getElementById("categoryTabs");
const roundTabs = document.getElementById("roundTabs");
const fixturesContent = document.getElementById("fixturesContent");

let appMode = "participants"; // participants | fixtures
let currentFixtureData = null;

/* ===============================
   INIT
=============================== */
document.addEventListener("DOMContentLoaded", () => {
  bindMenus();
  bindGames();
  showParticipants();
});

/* ===============================
   MENU BINDING
=============================== */
function bindMenus() {
  document.getElementById("menuParticipants").onclick = showParticipants;
  document.getElementById("menuFixtures").onclick = showFixtures;
  document.getElementById("menuRules").onclick = showRules;
}

function bindGames() {
  document.querySelectorAll(".game-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      setActive(btn, ".game-btn");
      const game = btn.dataset.game;

      if (appMode === "participants") {
        loadParticipants(game);
      } else {
        loadFixtures(game);
      }
    });
  });
}

/* ===============================
   VIEW SWITCH
=============================== */
function hideAll() {
  content.innerHTML = "";
  fixturesSection.classList.add("hidden");
  rulesSection.classList.add("hidden");
}

function showParticipants() {
  appMode = "participants";
  hideAll();
  gameMenu.classList.remove("hidden");
  content.innerHTML = `<p>Select a game to view participants.</p>`;
  setActive(document.getElementById("menuParticipants"), ".menu-btn");
}

function showFixtures() {
  appMode = "fixtures";
  hideAll();
  gameMenu.classList.remove("hidden");
  fixturesSection.classList.remove("hidden");

  categoryTabs.innerHTML = "";
  roundTabs.innerHTML = "";
  fixturesContent.innerHTML = `<p>Select a game to view fixtures.</p>`;

  setActive(document.getElementById("menuFixtures"), ".menu-btn");
}

function showRules() {
  appMode = "rules";
  hideAll();
  rulesSection.classList.remove("hidden");
  setActive(document.getElementById("menuRules"), ".menu-btn");
}

/* ===============================
   PARTICIPANTS
=============================== */
function loadParticipants(game) {
  fetch(`data/participants/${game}.json`)
    .then(r => r.json())
    .then(data => {
      let html = "";
      Object.values(data).forEach(cat => {
        html += `<h3>${cat.title}</h3><ol>`;
        cat.participants.forEach(p => {
          html += `<li>${p.name}</li>`;
        });
        html += `</ol>`;
      });
      content.innerHTML = html;
    })
    .catch(() => {
      content.innerHTML = `<p>Participants not available.</p>`;
    });
}

/* ===============================
   FIXTURES (MULTI CATEGORY)
=============================== */
function loadFixtures(game) {
  fetch(`data/fixtures/${game}.json`)
    .then(r => r.json())
    .then(data => {
      currentFixtureData = data.categories;
      renderCategories(data.categories);
    })
    .catch(() => {
      fixturesContent.innerHTML = `<p>Fixtures not uploaded.</p>`;
    });
}

function renderCategories(categories) {
  categoryTabs.innerHTML = "";
  roundTabs.innerHTML = "";
  fixturesContent.innerHTML = "";

  Object.entries(categories).forEach(([key, cat], index) => {
    const btn = document.createElement("button");
    btn.textContent = cat.title;
    btn.className = "tab-btn";
    btn.onclick = () => openCategory(key);
    categoryTabs.appendChild(btn);

    if (index === 0) {
      setActive(btn, ".tab-btn");
      openCategory(key);
    }
  });
}

function openCategory(key) {
  const category = currentFixtureData[key];
  roundTabs.innerHTML = "";
  fixturesContent.innerHTML = "";

  Object.entries(category.rounds).forEach(([rKey, round], index) => {
    const btn = document.createElement("button");
    btn.textContent = round.title;
    btn.className = "round-btn";
    btn.onclick = () => renderRound(round);
    roundTabs.appendChild(btn);

    if (index === 0) {
      setActive(btn, ".round-btn");
      renderRound(round);
    }
  });
}

function renderRound(round) {
  let html = `<h3>${round.title}</h3><ol>`;
  round.matches.forEach(m => {
    if (m.player2 === "BYE") {
      html += `<li><strong>${m.player1}</strong> — BYE</li>`;
    } else {
      html += `<li>${m.player1} vs ${m.player2}</li>`;
    }
  });
  html += `</ol>`;
  fixturesContent.innerHTML = html;
}

/* ===============================
   ACTIVE STATE
=============================== */
function setActive(el, selector) {
  document.querySelectorAll(selector).forEach(b => b.classList.remove("active"));
  if (el) el.classList.add("active");
}
