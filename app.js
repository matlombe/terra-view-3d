(() => {
'use strict';
const $ = id => document.getElementById(id);
const maputo = {lat:-25.9692,lng:32.5732,size:0.65,color:'#f3c969',name:'Maputo, Moçambique'};
const places = [
 maputo,
 {lat:-19.8436,lng:34.8389,size:0.48,color:'#6cc8ff',name:'Beira, Moçambique'},
 {lat:-15.1165,lng:39.2666,size:0.48,color:'#6cc8ff',name:'Nampula, Moçambique'},
 {lat:-13.3128,lng:35.2406,size:0.48,color:'#6cc8ff',name:'Lichinga, Moçambique'},
 {lat:-11.2694,lng:40.5364,size:0.48,color:'#6cc8ff',name:'Pemba, Moçambique'}
];
let globe;
function status(t){$('globalStatus').textContent=t}
function clock(){ $('utc').textContent = new Date().toISOString().slice(11,19); }
clock(); setInterval(clock,1000);

try {
 globe = Globe()($('globe'))
  .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
  .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
  .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
  .showAtmosphere(true).atmosphereColor('#65b8ff').atmosphereAltitude(0.18)
  .pointsData(places).pointLat('lat').pointLng('lng').pointAltitude(0.025)
  .pointRadius('size').pointColor('color').pointLabel('name').pointResolution(16);
 globe.controls().autoRotate=true; globe.controls().autoRotateSpeed=0.32; globe.controls().enableDamping=true;
 globe.pointOfView({lat:-8,lng:35,altitude:1.75},0);
 const resize=()=>{globe.width(window.innerWidth);globe.height(window.innerHeight)};
 window.addEventListener('resize',resize);resize();
 $('rotate').onchange=e=>globe.controls().autoRotate=e.target.checked;
 $('atmosphere').onchange=e=>globe.showAtmosphere(e.target.checked);
 $('maputo').onchange=e=>globe.pointsData(e.target.checked?places:[...places.slice(1)]);
 $('focusMoz').onclick=()=>globe.pointOfView({lat:-18.5,lng:35.5,altitude:1.25},1000);
 $('home').onclick=()=>globe.pointOfView({lat:0,lng:20,altitude:2.35},1000);
 $('globalStatus').textContent='Globo 3D pronto · Moçambique em destaque';
} catch(err) { status('Erro ao carregar o globo. Verifique a ligação à internet.'); console.error(err); }
setTimeout(()=>$('loader').classList.add('hide'),1300);

document.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>{
 document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b===btn));
 ['globo','tempo','eventos','dados'].forEach(k=>$('view-'+k).hidden=k!==btn.dataset.tab);
}));

const wxCode = code => {
 if(code===0)return 'Céu limpo'; if([1,2,3].includes(code))return 'Pouco nublado a encoberto';
 if([45,48].includes(code))return 'Nevoeiro'; if([51,53,55,56,57].includes(code))return 'Chuvisco';
 if([61,63,65,66,67,80,81,82].includes(code))return 'Chuva'; if([71,73,75,77,85,86].includes(code))return 'Neve';
 if([95,96,99].includes(code))return 'Trovoada'; return 'Condição variável';
};
async function loadWeather(){
 $('weatherState').textContent='A actualizar…';
 const url='https://api.open-meteo.com/v1/forecast?latitude=-25.9692&longitude=32.5732&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=Africa%2FMaputo';
 try{
  const r=await fetch(url,{cache:'no-store'}); if(!r.ok)throw new Error('HTTP '+r.status);
  const d=await r.json(), c=d.current;
  $('temp').textContent=Math.round(c.temperature_2m)+' °C';
  $('feels').textContent=Math.round(c.apparent_temperature)+' °C';
  $('humidity').textContent=c.relative_humidity_2m+' %';
  $('wind').textContent=c.wind_speed_10m+' km/h';
  $('rain').textContent=c.precipitation+' mm';
  $('weatherTime').textContent=c.time.replace('T',' ')+' (Maputo)';
  $('weatherState').textContent=wxCode(c.weather_code)+' · dados recebidos';
  $('wxFresh').textContent='Recebidos online';
  status('Meteorologia actualizada · Maputo');
 }catch(e){$('weatherState').textContent='Sem ligação; não foi possível actualizar';$('wxFresh').textContent='Indisponível';console.warn(e);}
}
$('refreshWeather').onclick=loadWeather; loadWeather(); setInterval(loadWeather,10*60*1000);

async function loadEvents(){
 $('eventState').textContent='A consultar NASA EONET…';
 try{
  const r=await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=15',{cache:'no-store'});
  if(!r.ok)throw new Error('HTTP '+r.status);
  const d=await r.json(), events=d.events||[];
  $('events').innerHTML='';
  if(!events.length){$('events').innerHTML='<p class="small">Não foram devolvidos eventos activos neste momento.</p>';}
  events.slice(0,12).forEach(ev=>{
   const el=document.createElement('div');el.className='event';
   const title=document.createElement('b');title.textContent=ev.title||'Evento ambiental';
   const meta=document.createElement('span');meta.className='muted';
   const cat=(ev.categories||[]).map(c=>c.title).join(', ');
   const date=ev.geometry?.length?ev.geometry[ev.geometry.length-1].date:'Data não indicada';
   meta.textContent=(cat?cat+' · ':'')+date;
   el.append(title,meta);$('events').appendChild(el);
  });
  $('eventState').textContent='Feed recebido · '+events.length+' eventos';
  $('evFresh').textContent='Recebidos online';
 }catch(e){$('eventState').textContent='Feed indisponível; tente novamente';$('events').innerHTML='<p class="small">Não foi possível consultar a NASA EONET. Verifique a ligação à internet.</p>';$('evFresh').textContent='Indisponível';console.warn(e);}
}
$('refreshEvents').onclick=loadEvents;loadEvents();setInterval(loadEvents,30*60*1000);

if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost')){
 addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(console.warn));
}
})();