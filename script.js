// Page load: show only main menu (no games)
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("sub-menu").innerHTML = "";
    document.getElementById("content").innerHTML =
      "<p>Please select a menu option.</p>";
  });
  
  /* ---------- TOP MENU ---------- */
  
  function showParticipants() {
    const subMenu = document.getElementById("sub-menu");
    const content = document.getElementById("content");
  
    // Show game links
    subMenu.innerHTML = `
  <button onclick="loadGame('badminton')">🏸 Badminton</button>
  <button onclick="loadGame('cricket')">🏏 Cricket</button>
  <button onclick="loadGame('chess')">♟️ Chess</button>
  <button onclick="loadGame('carrom')">🎯 Carrom</button>
  <button onclick="loadGame('ludo')">🎲 Ludo</button>
`;
  
    content.innerHTML = "<p>Select a game to view participants.</p>";
  }
  
  function showFixtures() {
    document.getElementById("sub-menu").innerHTML = "";
    document.getElementById("content").innerHTML = `
      <h3>📋 Fixtures</h3>
      <p>Fixtures and match schedules will be updated here.</p>
    `;
  }
  
  function showRules() {
    document.getElementById("sub-menu").innerHTML = "";
    document.getElementById("content").innerHTML = `
      <h3>📜 Rules & Regulations</h3>
      <ol>
        <li>Participants must report on time.</li>
        <li>Match schedules will be announced in advance.</li>
        <li>Referee and organizer decisions are final.</li>
        <li>Misconduct may lead to disqualification.</li>
        <li>Organizers reserve the right to amend rules.</li>
      </ol>
    `;
  }
  
  /* ---------- LOAD GAME DATA ---------- */
  
  function loadGame(game) {
    fetch(`data/${game}.json`)
      .then(res => res.json())
      .then(data => renderData(data))
      .catch(() => {
        document.getElementById("content").innerHTML =
          "<p>Data not available.</p>";
      });
  }
  
  function renderData(data) {
    const content = document.getElementById("content");
    content.innerHTML = "";
  
    Object.values(data).forEach(section => {
      let html = `<div class="section"><h3>${section.title}</h3>`;
  
      section.participants.forEach((p, index) => {
        html += `<div class="player">${index + 1}. ${p.name}</div>`;
      });
  
      html += `</div>`;
      content.innerHTML += html;
    });
  }
  