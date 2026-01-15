fetch("data/results/winner.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("winnersContent");
    let html = "";

    Object.entries(data).forEach(([game, events]) => {
      html += `
        <section class="card">
          <h4 class="game-title">${game}</h4>
      `;

      events.forEach(event => {
        html += `
          <div class="winner-row">
            <div class="category-name">${event.category}</div>
            <div class="winner">🥇 ${event.winner}</div>
            ${event.runnerUp ? `<div class="runner">🥈 ${event.runnerUp}</div>`: ``}
          </div>
        `;
      });

      html += `</section>`;
    });

    container.innerHTML = html;
  })
  .catch(() => {
    document.getElementById("winnersContent").innerHTML =
      "<p>Winners data not available.</p>";
  });