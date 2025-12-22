function loadFixtures(game) {
  console.log("Loading fixtures for:", game);

  fetch(`data/fixtures/${game}.json`)
    .then(res => {
      if (!res.ok) {
        throw new Error("JSON not found");
      }
      return res.json();
    })
    .then(data => {
      const content = document.getElementById("content");

      if (!content) {
        console.error("❌ #content div not found in HTML");
        return;
      }

      let html = `<h3>${data.game} Fixtures</h3>`;

      // 🔹 CASE 1: Games with categories (Badminton)
      if (data.categories) {
        Object.values(data.categories).forEach(category => {
          html += `
            <section class="card">
              <h4>${category.title}</h4>
          `;

          Object.values(category.rounds).forEach(round => {
            html += `<h5>${round.title}</h5><ol>`;

            round.matches.forEach(match => {
              html +=  `<li>${match.player1} vs ${match.player2}</li>`;
            });

            html += `</ol>`;
          });

          html += `</section>`;
        });
      }

      // 🔹 CASE 2: Games without categories (Table Tennis, Chess)
      else if (data.rounds) {
        html += `<section class="card">`;

        Object.values(data.rounds).forEach(round => {
          html += `<h5>${round.title}</h5><ol>`;

          round.matches.forEach(match => {
            html += `<li>${match.player1} vs ${match.player2}</li>`;
          });

          html += `</ol>`;
        });

        html += `</section>`;
      }

      content.innerHTML = html;
    })
    .catch(err => {
      console.error("❌ Fixture load error:", err);
      document.getElementById("content").innerHTML =
        "<p>Fixtures not available.</p>";
    });
}