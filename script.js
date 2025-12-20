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
    .then(res => res.json())
    .then(data => renderGame(data));
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