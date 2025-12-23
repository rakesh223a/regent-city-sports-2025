function setActive(btn) {
  document
    .querySelectorAll(".game-buttons button")
    .forEach(b => b.classList.remove("active"));

  btn.classList.add("active");
}

function loadFixtures(game) {
  fetch(`data/fixtures/${game}.json`)
    .then(res => res.json())
    .then(data => {
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
              html += `<li>${match.player1} vs ${match.player2}</li>`;
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
            html += `<li>${match.player1} vs ${match.player2}</li>`;
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