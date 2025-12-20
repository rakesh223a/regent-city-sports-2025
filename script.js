document.addEventListener("DOMContentLoaded", () => {
    loadGame("badminton"); // open badminton by default
  });
  
  function loadGame(game) {
    fetch(`data/${game}.json`)
      .then(res => res.json())
      .then(data => renderData(data))
      .catch(err => {
        document.getElementById("content").innerHTML =
          "<p>Data not available</p>";
        console.error(err);
      });
  }
  
  function renderData(data) {
    const content = document.getElementById("content");
    content.innerHTML = "";
  
    Object.values(data).forEach(section => {
      const div = document.createElement("div");
      div.className = "section";
  
      let html = `<h3>${section.title}</h3>`;
  
      section.participants.forEach((item, index) => {
        // Handle both string and object
        const name =
          typeof item === "string"
            ? item
            : item.name || "";
  
        html += `<div class="player">${index + 1}. ${name}</div>`;
      });
  
      div.innerHTML = html;
      content.appendChild(div);
    });
  }
  