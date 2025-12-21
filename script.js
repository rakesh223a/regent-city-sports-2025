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
  participantsSection?.classList.add("hidden");
  fixturesSection?.classList.add("hidden");
  rulesSection?.classList.add("hidden");
  gameMenu?.classList.add("hidden");
}

/* ==============================
   TOP MENU ACTIONS
============================== */
function showParticipants(btn) {
  hideAllSections();
  setActive(btn, ".top-menu button");

  participantsSection.classList.remove("hidden");
  gameMenu.classList.remove("hidden");

  content.innerHTML = `<p class="hint">Select a game to view participants.</p>`;
}

function showFixtures(btn) {
  hideAllSections();
  setActive(btn, ".top-menu button");

  fixturesSection.classList.remove("hidden");
  fixturesContent.innerHTML = `<p class="hint">Select a game to view fixtures.</p>`;
}

function showRules(btn) {
  hideAllSections();
  setActive(btn, ".top-menu button");

  rulesSection.classList.remove("hidden");
}


/* ==============================
   PARTICIPANTS
============================== */
function loadGame(game, btn) {
  setActive(btn, ".game-btn");

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
function loadFixtures(game, btn) {
  setActive(btn, ".game-btn");

  fetch(`fixtures/${game}.json`)
    .then(res => res.json())
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

  Object.values(rounds).forEach((round, index) => {
    const btn = document.createElement("button");
    btn.textContent = round.title;
    btn.className = "round-btn";
    btn.onclick = () => {
      setActive(btn, ".round-btn");
      showRound(round);
    };

    roundTabs.appendChild(btn);

    // Auto-select first round
    if (index === 0) {
      btn.classList.add("active");
      showRound(round);
    }
  });
}

function showRound(round) {
  if (!round.matches || round.matches.length === 0) {
    fixturesContent.innerHTML = `
      <h3>${round.title}</h3>
      <p>Fixtures will be updated soon.</p>
    `;
    return;
  }

  let html = `<h3>${round.title}</h3><ol class="fixture-list">`;

  round.matches.forEach(match => {
    const p1 = match.player1 || "TBD";
    const p2 = match.player2 || "TBD";

    if (p2 === "BYE") {
      html += `<li><strong>${p1}</strong> — BYE</li>`;
    } else {
      html += `<li>${p1} <strong>vs</strong> ${p2}</li>`;
    }
  });

  html += `</ol>`;
  fixturesContent.innerHTML = html;
}

function setActive(button, groupSelector) {
  document.querySelectorAll(groupSelector).forEach(btn =>
    btn.classList.remove("active")
  );
  button.classList.add("active");
}

