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
  
      section.participants.forEach((p, index) => {
        // ✔ SUPPORT STRING & OBJECT BOTH
        const name = typeof p === "string" ? p : p.name;
        const status =
          typeof p === "object" && p.status ? p.status : "";
  
        html += `
          <div class="player">
            ${index + 1}. ${name}${status ? " - " + status : ""}
          </div>
        `;
      });
  
      div.innerHTML = html;
      content.appendChild(div);
    });
  }
  