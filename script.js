function loadGame(game) {
    fetch(`data/${game}.json`)
      .then(response => response.json())
      .then(data => renderData(data))
      .catch(error => {
        document.getElementById("content").innerHTML =
          "<p>Data not available.</p>";
        console.error(error);
      });
  }
  
  function renderData(data) {
    const content = document.getElementById("content");
    content.innerHTML = "";
  
    Object.keys(data).forEach(key => {
      const section = data[key];
  
      const div = document.createElement("div");
      div.className = "section";
  
      let html = `<h3>${section.title}</h3>`;
  
      section.participants.forEach((p, index) => {
        const name = p.name || p.team || "Unknown";
        const status = p.status || "Playing";
  
        html += `
          <div class="player status-${status}">
            ${index + 1}. ${name} - ${status}
          </div>
        `;
      });
  
      div.innerHTML = html;
      content.appendChild(div);
    });
  }
  