let rulesData = {};
let activeGame = null;

fetch("data/rules/rules.json")
  .then(res => res.json())
  .then(data => {
    rulesData = data;

    const firstGame = Object.keys(rulesData)[0];
    loadRules(firstGame);
  });

function loadRules(game) {
  activeGame = game;
  renderGameTabs();
  renderRules();
}

function renderGameTabs() {
  const container = document.getElementById("rulesGameTabs");
  container.innerHTML = "";

  Object.keys(rulesData).forEach(game => {
    const btn = document.createElement("button");
    btn.className = "game-btn" + (game === activeGame ? " active" : "");
    btn.textContent = game;

    btn.onclick = () => loadRules(game);
    container.appendChild(btn);
  });
}

function renderRules() {
  const container = document.getElementById("rulesContent");
  const gameRules = rulesData[activeGame];

  container.innerHTML = `
    <section class="card">
      <h3>${gameRules.title}</h3>
      <ul>
        ${gameRules.rules.map(rule => `<li>${rule}</li>`).join("")}
      </ul>
    </section>
  `;
}
