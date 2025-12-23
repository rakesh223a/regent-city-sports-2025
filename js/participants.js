function setActive(btn) {
  document
    .querySelectorAll(".game-buttons button")
    .forEach(b => b.classList.remove("active"));

  btn.classList.add("active");
}

function loadParticipants(game, btn) {
  setActive(btn);

  
  if (game === "cricket") {
    document.getElementById("cricketTabs").classList.remove("hidden");
    loadCricketParticipants(); // default tab
    return;
  }

  // hide cricket tabs for other games
  document.getElementById("cricketTabs").classList.add("hidden");

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



function setActiveCricketTab(tab) {
  document.getElementById("cricketParticipantsTab").classList.remove("active");
  document.getElementById("cricketTeamsTab").classList.remove("active");

  tab.classList.add("active");
}



function loadCricketParticipants() {
  setActiveCricketTab(
    document.getElementById("cricketParticipantsTab")
  );

  fetch(`data/participants/cricket.json`)
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
    .catch(err => {
      console.error(err);
      document.getElementById("participants").innerHTML =
        "<p>Cricket participants not available.</p>";
    });
}

function loadCricketTeams() {
  setActiveCricketTab(document.getElementById("cricketTeamsTab"));

  fetch(`data/participants/cricket-teams.json`)
    .then(res => res.json())
    .then(data => {
      let html = `<h3>Cricket Teams</h3>`;

      data.teams.forEach(team => {
        html += `
          <section class="card">
            <h4>${team.name}</h4>
            <ul>
        `;

        team.members.forEach(member => {
          html += `<li>${member}</li>`;
        });

        html += `
            </ul>
          </section>
        `;
      });

      document.getElementById("participants").innerHTML = html;
    })
    .catch(() => {
      document.getElementById("participants").innerHTML =
        "<p>Team data not available.</p>";
    });
}