/* ==============================
   GLOBAL REFERENCES
============================== */
const content = document.getElementById("content");
const gameMenu = document.getElementById("gameMenu");
const fixturesSection = document.getElementById("fixturesSection");
const participantsSection = document.getElementById("participantsSection");
const rulesSection = document.getElementById("rulesSection");
const roundTabs = document.getElementById("roundTabs");
const fixturesContent = document.getElementById("fixturesContent");
const fixtureCategories = document.getElementById("fixtureCategories");

/* ==============================
   INITIAL LOAD
============================== */
document.addEventListener("DOMContentLoaded", () => {
  hideAllSections();
  content.innerHTML = `<p class="hint">Select a menu to continue.</p>`;
});

/* ==============================
   HELPERS
============================== */
function hideAllSections() {
  participantsSection?.classList.add("hidden");
  fixturesSection?.classList.add("hidden");
  rulesSection?.classList.add("hidden");
  gameMenu?.classList.add("hidden");
}

function setActive(container, activeBtn) {
  if (!container || !activeBtn) return;

  Array.from(container.children).forEach(btn => {
    btn.classList.remove("active");
  });

  activeBtn.classList.add("active");
}

/* ==============================
   TOP MENU
============================== */
function showParticipants() {
  hideAllSections();
  participantsSection.classList.remove("hidden");
  gameMenu.classList.remove("hidden");

  content.innerHTML = `<p class="hint">Select a game to view participants.</p>`;
}

function showFixtures() {
  hideAllSections();
  fixturesSection.classList.remove("hidden");

  fixtureCategories.innerHTML = "";
  roundTabs.innerHTML = "";
  fixturesContent.innerHTML =
    `<p class="hint">Select a game to view fixtures.</p>`;
}

function showRules() {
  hideAllSections();
  rulesSection.classList.remove("hidden");

  rulesSection.innerHTML = `
    <h2>📜 Rules & Regulations</h2>
    <ul>
      <li>Participants must report on time.</li>
      <li>Fixtures are subject to change.</li>
      <li>Fair play is mandatory.</li>
      <li>Organizers’ decision is final.</li>
    </ul>
  `;
}

/* ==============================
   PARTICIPANTS
============================== */
function loadGame(game) {
  fetch(`${game}.json`)
    .then(res => res.json())
    .then(data => renderParticipants(data))
    .catch(() => {
      content.innerHTML = `<p>Participant list not available.</p>`;
    });
}

function renderParticipants(data) {
  let html = "";

  Object.values(data).forEach(category => {
    html += `<div class="card">
      <h3>${category.title}</h3>
      <ol>`;
    category.participants.forEach(p => {
      html += `<li>${p.name}</li>`;
    });
    html += `</ol></div>`;
  });

  content.innerHTML = html;
}

/* ==============================
   FIXTURES
============================== */
function loadFixtures(game) {
  fetch(`fixtures/${game}.json`)
    .then(res => res.json())
    .then(data => renderFixtureCategories(data.categories))
    .catch(() => {
      fixturesContent.innerHTML =
        `<p>Fixtures for this game are not uploaded yet.</p>`;
    });
}

function renderFixtureCategories(categories) {
  fixtureCategories.innerHTML = "";
  roundTabs.innerHTML = "";
  fixturesContent.innerHTML = "";

  Object.values(categories).forEach(category => {
    const btn = document.createElement("button");
    btn.textContent = category.title;

    btn.onclick = () => {
      setActive(fixtureCategories, btn);
      renderRounds(category.rounds);
    };

    fixtureCategories.appendChild(btn);
  });

  // Auto open first category
  const firstBtn = fixtureCategories.children[0];
  if (firstBtn) firstBtn.click();
}

function renderRounds(rounds) {
  roundTabs.innerHTML = "";
  fixturesContent.innerHTML = "";

  Object.values(rounds).forEach(round => {
    const btn = document.createElement("button");
    btn.textContent = round.title;

    btn.onclick = () => {
      setActive(roundTabs, btn);
      showRound(round);
    };

    roundTabs.appendChild(btn);
  });

  // Auto open first round
  const firstBtn = roundTabs.children[0];
  if (firstBtn) firstBtn.click();
}

function showRound(round) {
  let html = `<h3>${round.title}</h3><ol>`;

  round.matches.forEach(match => {
    if (match.bye) {
      html += `<li><strong>${match.player}</strong> — BYE</li>`;
    } else {
      html += `<li>${match.player1} vs ${match.player2}</li>`;
    }
  });

  html += `</ol>`;
  fixturesContent.innerHTML = html;
}
