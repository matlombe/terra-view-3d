const CACHE='terra3d-live-v2';
const CORE=['./','./index.html','./app.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.origin!==self.location.origin)return;
 e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{
  if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}
  return r;
 }).catch(()=>caches.match('./index.html'))));
});