function setActive(btn) {
  document
    .querySelectorAll(".game-buttons button")
    .forEach((b) => b.classList.remove("active"));

  btn.classList.add("active");
}

function loadFixtures_old(game, btn) {
  setActiveFixtureTab(btn);
  fetch(`data/fixtures/${game}.json`)
    .then((res) => res.json())
    .then((data) => {
     

      const content = document.getElementById("content");
      if (!content) return;

      let html = `<h2>${data.game} Fixtures</h2>`;

      /* =====================================================
         CASE 1: Games with Categories (Badminton)
      ===================================================== */
      if (data.categories) {
        Object.values(data.categories).forEach((category, cIdx) => {
           
          html += `
            <section class="card">
              <h5>${category.title}</h5>
             
          `;

          Object.values(category.rounds).forEach((round, rIdx) => {
            const roundId = `cat-${cIdx}-round-${rIdx}`;
            const isOpen = rIdx === 0 ? "block" : "none"; // 👈 Round 1 open

            html += `
              <div class="round">
                <button class="round-btn"
                  onclick="toggleRound('${roundId}')">
                  ${round.title}
                </button>

                <ol id="${roundId}" style="display:${isOpen}">
            `;

            round.matches.forEach(match => {
              html += `<li>${match.player1} 🆚 ${match.player2}</li>`;
            });

            html += `
                </ol>
              </div>
            `;
          });

          html += `</section>`;
        });
      }

      /* =====================================================
         CASE 2: Games without Categories
         (Table Tennis, Chess, Carrom, etc.)
      ===================================================== */
      else if (data.rounds) {
        html += `<section class="card">`;
       
        Object.values(data.rounds).forEach((round, idx) => {
          const roundId = `round-${idx}`;
          const isOpen = idx === 0 ? "block" : "none"; // 👈 Round 1 open

          html += `
            <div class="round">
              <button class="round-btn"
                onclick="toggleRound('${roundId}')">
                ${round.title}
              </button>

              <ol id="${roundId}" style="display:${isOpen}">
          `;

          round.matches.forEach(match => {
            html += `<li>${match.player1} 🆚 ${match.player2}</li>`;
          });

          html += `
              </ol>
            </div>
          `;
        });

        html += `</section>`;
      }

      /* =====================================================
         Render Output
      ===================================================== */
      content.innerHTML = html;
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("content").innerHTML =
        "<p>Fixtures not available.</p>";
    });
}

function loadFixtures(game, btn) {
  setActiveFixtureTab(btn);

  fetch(`data/fixtures/${game}.json`)
    .then(res => res.json())
    .then(data => {
      const content = document.getElementById("content");
      if (!content) return;

      let html = `<h2>${data.game} Fixtures</h2>`;

      // Games with categories (Badminton)
      if (data.categories) {
        Object.values(data.categories).forEach(category => {
          html += `
            <section class="card">
              <h5>${category.title}</h5>
              ${renderBracketHTML(category.rounds)}
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

function renderBracketHTML(rounds) {
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

