const CACHE = "kf-public-p1-fix8-v1";
const APP = ["./", "./index.html", "./manifest.webmanifest"];
self.addEventListener("install", event => {event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP)).then(()=>self.skipWaiting()));});
self.addEventListener("activate", event => {event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch", event => {
 if(event.request.method !== "GET") return;
 const url=new URL(event.request.url); if(url.origin!==self.location.origin) return;
 if(event.request.mode==="navigate") {event.respondWith(fetch(event.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put("./index.html",copy));return resp;}).catch(()=>caches.match("./index.html").then(r=>r||caches.match("./"))));return;}
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return resp;})));
});
