/* ==============================
   GLOBAL STATE
============================== */
const content = document.getElementById("content");
const gameMenu = document.getElementById("gameMenu");

let currentPage = null; // "participants" | "fixtures"

/* ==============================
   PAGE NAVIGATION
============================== */
function showPage(page) {
  currentPage = page;
  gameMenu.classList.add("hidden");
  content.innerHTML = "";

  if (page === "participants") {
    gameMenu.classList.remove("hidden");
    content.innerHTML =
      "<p class='hint'>Select a game to view participants.</p>";
  }

  if (page === "fixtures") {
    gameMenu.classList.remove("hidden");
    content.innerHTML =
      "<p class='hint'>Select a game to view fixtures.</p>";
  }

  if (page === "rules") {
    content.innerHTML = `
      <h2>Rules & Regulations</h2>
      <ul>
        <li>Participants must report on time.</li>
        <li>Fixtures may change during the tournament.</li>
        <li>Organizers’ decision is final.</li>
        <li>Fair play is mandatory.</li>
      </ul>
    `;
  }
}

/* ==============================
   GAME CLICK ROUTER
============================== */
function onGameClick(game) {
  if (currentPage === "participants") {
    loadParticipants(game);
  } else if (currentPage === "fixtures") {
    loadFixtures(game);
  }
}

/* ==============================
   PARTICIPANTS
============================== */
function loadParticipants(game) {
  fetch(`data/participants/${game}.json`)
    .then(res => {
      if (!res.ok) throw new Error("Participants not found");
      return res.json();
    })
    .then(data => renderParticipants(data))
    .catch(() => {
      content.innerHTML = "<p>Participant data not available.</p>";
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
  fetch(`data/fixtures/${game}.json`)
    .then(res => {
      if (!res.ok) throw new Error("Fixtures not found");
      return res.json();
    })
    .then(data => renderFixtures(data))
    .catch(() => {
      content.innerHTML = "<p>Fixtures not available.</p>";
    });
}

function renderFixtures(data) {
  let html = `<h2>${data.game} Fixtures</h2>`;

  if (!data.rounds) {
    content.innerHTML = "<p>No fixture rounds found.</p>";
    return;
  }

  Object.values(data.rounds).forEach(round => {
    html += `<h3>${round.title}</h3><ol>`;
    round.matches.forEach(match => {
      html += `<li>${match.player1} vs ${match.player2}</li>`;
    });
    html += `</ol>`;
  });

  content.innerHTML = html;
}
