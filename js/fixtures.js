function setActive(btn) {
  document
    .querySelectorAll(".game-buttons button")
    .forEach((b) => b.classList.remove("active"));

  btn.classList.add("active");
}

function getCategoryStatus(category) {
  let totalMatches = 0;
  let pendingMatches = 0;

  Object.values(category.rounds).forEach(round => {
    round.matches.forEach(match => {
      totalMatches++;
      if (match.status !== "completed") {
        pendingMatches++;
      }
    });
  });

  if (totalMatches === 0) return "";

  if (pendingMatches === 0) {
    return "COMPLETED";
  }

  return `( ${pendingMatches} matches left to be completed )`;
}


function loadFixtures(game, btn) {
  setActiveFixtureTab(btn);

  let firstRoundOpened = false;

  fetch(`data/fixtures/${game}.json`)
    .then(res => res.json())
    .then(data => {
      const content = document.getElementById("content");
      if (!content) return;

     let html = `
  <div class="fixtures-header">
    <h2>${data.game} Fixtures</h2>

    ${
      data.game.toLowerCase() === "cricket"
        ? `<a 
            href="assets/Regent_City_Mens_Cricket_Schedule.pdf"
            target="_blank"
            class="pdf-link"
          >
            📄 Download Men's Cricket Schedule
          </a>`
        : ""
    }
  </div>
`;

      // Games with categories (Badminton)
      if (data.categories) {
        Object.values(data.categories).forEach((category,cIdx) => {

          const catId = `category-${cIdx}`;
          const isOpen = "none"; 
          
          const statusText = getCategoryStatus(category);


          html += `
            <section class="card">
              <p class="category-btn"
                onclick="toggleRound('${catId}')">
                ${category.title}
                 <span class="category-status ${statusText === "COMPLETED" ? "done" : "pending"}">
      ${statusText}
    </span>
              </p>
              <div id="${catId}" style="display:${isOpen}">
                ${renderBracketHTML(category.rounds)}
              </div>
            </section>
          `;
        });
      }

      // Games without categories (TT, Chess, etc.)
      else if (data.rounds) {
        html += `
          <section class="card">
            ${renderBracketHTML(data.rounds)}
          </section>
        `;
      }

      content.innerHTML = html;
    })
    .catch(err => {
      console.error(err);
      document.getElementById("content").innerHTML =
        "<p>Fixtures not available.</p>";
    });
}


function toggleRound(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = el.style.display === "none" ? "block" : "none";
}

function setActiveFixtureTab(activeBtn) {
  document.querySelectorAll(".game-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  if (activeBtn) {
    activeBtn.classList.add("active");
  }
}

function renderBracketHTML_old(rounds) {
  let html = `<div class="bracket">`;

  Object.values(rounds).forEach((round, idx)=> {
    html += `
      <div class="round-column round-${idx +1}">
        <h6>${round.title}</h6>
    `;

    round.matches.forEach((match,mIdx) => {
      html += `
      <li class="match-card">
      <div class="match-title">Match ${mIdx + 1}</div>
        <div class="match">
        
          <div class="player">${match.player1}</div>
         <div class="vs">🆚</div>
          <div class="player">${match.player2}</div>
        </div>
      `;
    });

    html += `</div>`;
  });

  html += `</div>`;
  return html;
}

function renderBracketHTML(rounds) {
  let html = `<div class="bracket">`;

  Object.values(rounds).forEach((round, idx) => {
    
    html += `
      <div class="round-column round-${idx + 1}">
        <h6>${round.title}</h6>
    `;

    round.matches.forEach((match, mIdx) => {
      const isCompleted = match.status === "completed";
      const winner = match.winner || "";

      const p1Winner = isCompleted && winner === match.player1;
      const p2Winner = isCompleted && winner === match.player2;

      html += `
        <div class="match-card">
          <div class="match-title">Match ${mIdx + 1}</div>

          <div class="match ${isCompleted ? "completed" : ""}">
            <div class="player ${p1Winner ? "winner" : ""}">
              ${match.player1}
            </div>

            <div class="vs">🆚</div>

            <div class="player ${p2Winner ? "winner" : ""}">
              ${match.player2}
            </div>
          </div>
             ${
            match.score
              ? `<div class="match-score">Score: ${match.score}</div>`
              : ""
          }

          ${
            !isCompleted
              ? `<div class="winner-placeholder">Winner: TBD</div>`
              : ""
          }
          <div class="match-remarks">${match.remarks}</div>
        </div>
      `;
    });

    html += `</div>`;
  });

  html += `</div>`;
  return html;
}



