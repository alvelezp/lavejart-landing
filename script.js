// Portafolio dinámico desde img/portfolio
document.addEventListener('DOMContentLoaded', () => initPortfolio());

async function initPortfolio(){
  const container = document.getElementById('masonry');
  if(!container) { bindLightbox(); return; }
  const files = await loadPortfolioList();
  for (let i=0;i<files.length;i++){
    const src = `img/portfolio/${files[i]}`;
    const fig = document.createElement('figure'); fig.className='item';
    const a = document.createElement('a'); a.href = src;
    const img = document.createElement('img'); img.loading='lazy'; img.src = src; img.alt = `Obra ${i+1} de LAVEJART`;
    a.appendChild(img); fig.appendChild(a); container.appendChild(fig);
  }
  bindLightbox();
}

async function loadPortfolioList(){
  // 1) Si existe manifest.json usarlo
  try{
    const res = await fetch('img/portfolio/manifest.json', {cache:'no-store'});
    if(res.ok){
      const list = await res.json();
      if(Array.isArray(list) && list.length) return list;
    }
  }catch(e){}
  // 2) Buscar archivos numerados: obra1..obraN con varias extensiones
  const tryExt = ['png','jpg','jpeg','webp'];
  const found = [];
  let consecMiss = 0;
  for(let i=1;i<=200 && consecMiss<20;i++){
    let hit = false;
    for(const ext of tryExt){
      const name = `obra${i}.${ext}`;
      if(await imageExists(`img/portfolio/${name}`)){ found.push(name); hit = true; break; }
    }
    consecMiss = hit ? 0 : consecMiss+1;
  }
  return found;
}

function imageExists(url){
  return new Promise(resolve=>{
    const img = new Image();
    img.onload = ()=>resolve(true);
    img.onerror = ()=>resolve(false);
    img.src = url;
  });
}

// Visor (lightbox)
const lb = document.getElementById('lightbox'); const lbImg = document.getElementById('lightbox-img');
function bindLightbox(){
  document.querySelectorAll('.masonry .item a').forEach(a=>{
    a.addEventListener('click', e=>{ e.preventDefault(); lbImg.src = a.href; lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); });
  });
}
document.querySelector('.lightbox .close').addEventListener('click', ()=>{ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); });
lb.addEventListener('click', e=>{ if(e.target===lb){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); } });
