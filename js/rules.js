let rulesData = {};
let activeGame = null;
let activeCricketCategory = null;

/* ===============================
   LOAD JSON
================================ */
fetch("data/rules/rules.json")
  .then(res => res.json())
  .then(data => {
    rulesData = data;

    const firstGame = Object.keys(rulesData)[0];
    loadGame(firstGame);
  });

/* ===============================
   GAME TABS
================================ */
function renderGameTabs() {
  const tabs = document.getElementById("rulesGameTabs");
  tabs.innerHTML = "";

  Object.keys(rulesData).forEach(game => {
    const btn = document.createElement("button");
    btn.className = "rule-tab" + (game === activeGame ? " active" : "");
    btn.textContent = game;

    btn.onclick = () => loadGame(game);
    tabs.appendChild(btn);
  });
}

/* ===============================
   LOAD GAME
================================ */
function loadGame(gameKey) {
  activeGame = gameKey;
  activeCricketCategory = null;

  renderGameTabs();

  if (gameKey === "Cricket") {
    renderCricketTabs();
  } else {
    renderSimpleRules(gameKey);
  }
}

/* ===============================
   SIMPLE RULES (NON-CRICKET)
================================ */
function renderSimpleRules(gameKey) {
  const content = document.getElementById("rulesContent");
  content.innerHTML = `<h3>${gameKey} Rules</h3>`;

  rulesData[gameKey].rules.forEach(rule => {
    content.innerHTML += `<li>${rule}</li>`;
  });
}

/* ===============================
   CRICKET CATEGORY TABS
================================ */
function renderCricketTabs() {
  const content = document.getElementById("rulesContent");

  // Clear everything safely
  content.innerHTML = `
    <div id="cricketTabs" class="sub-tabs"></div>
    <div id="rulesBody"></div>
  `;

  const tabsContainer = document.getElementById("cricketTabs");
  const categories = rulesData.Cricket.categories;
  const keys = Object.keys(categories);

  activeCricketCategory = keys[0];

  keys.forEach(cat => {
    const btn = document.createElement("button");
    btn.className =
      "sub-tab" + (cat === activeCricketCategory ? " active" : "");
    btn.textContent = cat;

    btn.onclick = () => {
      document
        .querySelectorAll(".sub-tab")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");
      activeCricketCategory = cat;
      renderCricketRules(cat_toggle = cat);
    };

    tabsContainer.appendChild(btn);
  });

  renderCricketRules(activeCricketCategory);
}

/* ===============================
   CRICKET RULES
================================ */
function renderCricketRules(categoryKey) {
  const rulesBody = document.getElementById("rulesBody");
  const category = rulesData.Cricket.categories[categoryKey];

  rulesBody.innerHTML = `
    <h3>${category.title}</h3>
  `;

  category.sections.forEach(section => {
    rulesBody.innerHTML += `
      <div class="rule-section">
        <h4>${section.heading}</h4>
        <ul>
          ${section.rules.map(r => `<li>${r}</li>`).join("")}
        </ul>
      </div>
    `;
  });
}