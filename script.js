const content = document.getElementById("content");
const gameMenu = document.getElementById("gameMenu");

function showParticipants() {
  gameMenu.classList.remove("hidden");
  content.innerHTML = `<p class="hint">Select a game to view participants.</p>`;
}

function showFixtures() {
  gameMenu.classList.add("hidden");
  content.innerHTML = `
    <h2>Fixtures</h2>
    <p>Fixtures will be updated during the tournament.</p>
  `;
}

function showRules() {
  gameMenu.classList.add("hidden");
  content.innerHTML = `
    <h2>Rules & Regulations</h2>
    <ul>
      <li>Matches follow standard rules</li>
      <li>Organizers' decision is final</li>
      <li>Be on time for matches</li>
    </ul>
  `;
}

function loadGame(game) {
    fetch(`${game}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`File not found: ${game}.json`);
        }
        return response.json();
      })
      .then(data => renderGame(data))
      .catch(err => {
        content.innerHTML = `
          <h2>Error</h2>
          <p>${err.message}</p>
          <p>Please check if the JSON file exists and is committed.</p>
        `;
      });
  }
  

function renderGame(data) {
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

let currentFixtures = null;

function loadFixtures(game) {
  fetch(`fixtures/${game}.json`)
    .then(res => res.json())
    .then(data => {
      currentFixtures = data.rounds;
      renderRounds(data.rounds);
    })
    .catch(() => {
      document.getElementById("fixturesContent").innerHTML =
        "<p>Fixtures not uploaded yet.</p>";
    });
}

function renderRounds(rounds) {
  const roundTabs = document.getElementById("roundTabs");
  roundTabs.innerHTML = "";

  Object.keys(rounds).forEach(key => {
    const btn = document.createElement("button");
    btn.innerText = rounds[key].title;
    btn.onclick = () => showRound(rounds[key]);
    roundTabs.appendChild(btn);
  });

  // auto-open Round 1
  const firstRound = Object.values(rounds)[0];
  if (firstRound) showRound(firstRound);
}

function showRound(round) {
  const container = document.getElementById("fixturesContent");

  if (!round.matches || round.matches.length === 0) {
    container.innerHTML = `<h3>${round.title}</h3><p>Fixtures will be updated soon.</p>`;
    return;
  }

  let html = `<h3>${round.title}</h3><ol>`;
  round.matches.forEach(m => {
    html += `<li>${m}</li>`;
  });
  html += "</ol>";

  container.innerHTML = html;
}
