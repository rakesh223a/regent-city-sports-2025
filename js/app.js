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

function clearContent() {
  content.innerHTML = "";
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
    .then(data => {
      if (data.categories) {
        renderFixtureCategories(data.game, data.categories);
      } else if (data.rounds) {
        renderRoundsView(data.game, data.rounds);
      } else {
        content.innerHTML = "<p>No fixtures available.</p>";
      }
    })
    .catch(() => {
      content.innerHTML = "<p>Fixtures not available.</p>";
    });
}


function renderFixtureCategories(gameName, categories) {
  clearContent();

  let html = `<h2>${gameName} Fixtures</h2>`;
  html += `<div class="category-menu">`;

  Object.entries(categories).forEach(([key, category]) => {
    html += `
      <button onclick="renderRoundsView('${category.title}', ${encodeURIComponent(JSON.stringify(category.rounds))})">
        ${category.title}
      </button>
    `;
  });

  html += `</div>`;
  content.innerHTML = html;
}

function renderRoundsView(title, roundsData) {
  // Handle encoded JSON when coming from category click
  if (typeof roundsData === "string") {
    roundsData = JSON.parse(decodeURIComponent(roundsData));
  }

  let html = `<h2>${title}</h2>`;

  Object.values(roundsData).forEach(round => {
    html += `<h3>${round.title}</h3><ol>`;
    round.matches.forEach(match => {
      html += `<li>${match.player1} vs ${match.player2}</li>`;
    });
    html += `</ol>`;
  });

  content.innerHTML = html;
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

function renderBadmintonCategories(categories) {
  const container = document.getElementById("categoryTabs");
  container.innerHTML = "";

  Object.keys(categories).forEach(key => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    btn.textContent = categories[key].title;
    btn.dataset.categoryKey = key;

    btn.addEventListener("click", () => {
      renderCategoryFixtures(categories[key]);
      setActive(btn, ".category-btn");
    });

    container.appendChild(btn);
  });
}

function renderCategoryFixtures(category) {
  const roundsContainer = document.getElementById("roundTabs");
  const fixturesContainer = document.getElementById("fixturesContent");

  roundsContainer.innerHTML = "";
  fixturesContainer.innerHTML = `<h3>${category.title}</h3>`;

  Object.values(category.rounds).forEach(round => {
    const roundBtn = document.createElement("button");
    roundBtn.className = "round-btn";
    roundBtn.textContent = round.title;

    roundBtn.addEventListener("click", () => {
      showRound(round);
      setActive(roundBtn, ".round-btn");
    });

    roundsContainer.appendChild(roundBtn);
  });

  // Auto-open first round
  const firstRound = Object.values(category.rounds)[0];
  if (firstRound) showRound(firstRound);
}

function showRound(round) {
  const fixturesContainer = document.getElementById("fixturesContent");

  let html = `<h3>${round.title}</h3><ol>`;

  round.matches.forEach(match => {
    if (match.player2 === "BYE") {
      html += `<li><strong>${match.player1}</strong> — BYE</li>`;
    } else {
      html += `<li>${match.player1} <b>vs</b> ${match.player2}</li>`;
    }
  });

  html += "</ol>";
  fixturesContainer.innerHTML = html;
}

function setActive(activeBtn, selector) {
  document.querySelectorAll(selector).forEach(btn =>
    btn.classList.remove("active")
  );

  if (activeBtn) {
    activeBtn.classList.add("active");
  }
}


