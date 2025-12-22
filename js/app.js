const content=document.getElementById("content");
const gameMenu=document.getElementById("gameMenu");

function showPage(page){
  gameMenu.classList.add("hidden");
  content.innerHTML="";
  if(page==="participants"){
    gameMenu.classList.remove("hidden");
    content.innerHTML="<p class='hint'>Select a game to view participants.</p>";
  }
  if(page==="fixtures"){
    gameMenu.classList.remove("hidden");
    content.innerHTML="<p class='hint'>Fixtures will be shown here.</p>";
  }
  if(page==="rules"){
    content.innerHTML=`<h2>Rules & Regulations</h2>
    <ul>
      <li>Participants must report on time.</li>
      <li>Fixtures may change.</li>
      <li>Organizer decision is final.</li>
    </ul>`;
  }
}

function loadParticipants(game){
  fetch(`data/participants/${game}.json`)
    .then(r=>r.json())
    .then(d=>{
      let html="";
      Object.values(d).forEach(c=>{
        html+=`<h2>${c.title}</h2><ol>`;
        c.participants.forEach(p=>html+=`<li>${p.name}</li>`);
        html+="</ol>";
      });
      content.innerHTML=html;
    })
    .catch(()=>content.innerHTML="<p>Data not available</p>");
}