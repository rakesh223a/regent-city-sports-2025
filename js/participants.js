function loadParticipants(game) {
  fetch(`data/participants/${game}.json`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("participants");
      let html = "";

      Object.values(data).forEach(category => {
        html += `
          <section class="card">
            <h3>${category.title}</h3>
            <ol>
        `;

        category.participants.forEach(p => {
          html += `<li>${p.name}</li>`;
        });

        html += `
            </ol>
          </section>
        `;
      });

      container.innerHTML = html;
    })
    .catch(() => {
      document.getElementById("participants").innerHTML =
        "<p>No participant data available</p>";
    });
}