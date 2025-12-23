function setActive(btn) {
  document
    .querySelectorAll(".game-buttons button")
    .forEach(b => b.classList.remove("active"));

  btn.classList.add("active");
}

function loadParticipants(game, btn) {
  setActive(btn);

  fetch(`data/participants/${game}.json`)
    .then(res => res.json())
    .then(data => {
      const content = document.getElementById("participants");
      let html = "";

      Object.values(data).forEach(cat => {
        html += `
          <section class="card">
            <h3>${cat.title}</h3>
            <ol>
        `;

        cat.participants.forEach(p => {
          html += `<li>${p.name}</li>`;
        });

        html += `</ol></section>`;
      });

      content.innerHTML = html;
    })
    .catch(() => {
      document.getElementById("participants").innerHTML =
        "<p>No participants available.</p>";
    });
}