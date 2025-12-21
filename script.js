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

let currentFixtures = null;

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
  if (participantsSection) participantsSection.classList.add("hidden");
  if (fixturesSection) fixturesSection.classList.add("hidden");
  if (rulesSection) rulesSection.classList.add("hidden");
  if (gameMenu) gameMenu.classList.add("hidden");
}

/* ==============================
   TOP MENU ACTIONS
============================== */
function showParticipants() {
  hideAllSections();

  if (participantsSection) participantsSection.classList.remove("hidden");
  if (gameMenu) gameMenu.classList.remove("hidden");

  content.innerHTML = `<p class="hint">Select a game to view participants.</p>`;
}

function showFixtures() {
  hideAllSections();

  if (fixturesSection) fixturesSection.classList.remove("hidden");

  roundTabs.innerHTML = "";
  fixturesContent.innerHTML = `<p class="hint">Select a game to view fixtures.</p>`;
}

function showRules() {
  hideAllSections();

  if (rulesSection) rulesSection.classList.remove("hidden");

  rulesSection.innerHTML = `
    <h2>Rules & Regulations</h2>
    <ul>
      <li>Participants must report on time.</li>
      <li>Match schedule will be announced in advance.</li>
      <li>Organizers’ decision is final.</li>
      <li>Fair play is mandatory.</li>
    </ul>
  `;
}

/* ==============================
   PARTICIPANTS
============================== */
function loadGame(game) {
  fetch(`${game}.json`)
    .then(res => {
      if (!res.ok) throw new Error("File not found");
      return res.json();
    })
    .then(data => renderParticipants(data))
    .catch(() => {
      content.innerHTML = `<p>Participant list not available.</p>`;
    });
}

function renderParticipants(data) {
  let html = "";

  Object.values(data).forEach(category => {
    html += `<h2>${category.title}</h2><ol>`;
    category.participants.forEach(p => {
      html += `<li>${p.name}</li>`;
    });
    html += `</ol>`;
  });

  content.innerHTML = html;
}

/* ==============================
   FIXTURES
============================== */
function loadFixtures(game) {
  fetch(`fixtures/${game}.json`)
    .then(res => {
      if (!res.ok) throw new Error("Fixture not found");
      return res.json();
    })
    .then(data => {
      currentFixtures = data.rounds;
      renderRounds(data.rounds);
    })
    .catch(() => {
      fixturesContent.innerHTML =
        `<p>Fixtures for this game are not uploaded yet.</p>`;
    });
}

function renderRounds(rounds) {
  roundTabs.innerHTML = "";

  Object.keys(rounds).forEach(key => {
    const btn = document.createElement("button");
    btn.textContent = rounds[key].title;
    btn.onclick = () => showRound(rounds[key]);
    roundTabs.appendChild(btn);
  });

  // Auto open first round
  const firstRound = Object.values(rounds)[0];
  if (firstRound) showRound(firstRound);
}

function showRound(round) {
  if (!round.matches || round.matches.length === 0) {
    fixturesContent.innerHTML = `
      <h3>${round.title}</h3>
      <p>Fixtures will be updated soon.</p>
    `;
    return;
  }

  let html = `<h3>${round.title}</h3><ol>`;
  round.matches.forEach(match => {
    html += `<li>${match}</li>`;
  });
  html += `</ol>`;

  fixturesContent.innerHTML = html;
}
