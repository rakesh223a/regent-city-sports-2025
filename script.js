function loadGame(g){fetch('data/'+g+'.json').then(r=>r.json()).then(d=>{
let c=document.getElementById('content');c.innerHTML='';
for(let k in d){let s=d[k];let h='<h3>'+s.title+'</h3>';
s.participants.forEach((p,i)=>h+=`${i+1}. ${p.name||p.team} - ${p.status}<br>`);
c.innerHTML+=h;}
});}