/* ============================================================
   Ibrahim's Launchpad — core (adapted from the Launchpad kit)
   1) Single-user state in localStorage
   2) Cloud sync (Google Sheet via Apps Script web app)
   3) Photo upload to Google Drive (notebook)
   Requires: renderTop(), renderMap() and a global `state`.
   ============================================================ */
const USER='ibrahim';
const LSKEY='ilp-state';
/* ---------- state helpers ---------- */
let state={progress:{},custom:{},time:{},log:[]};try{state=Object.assign(state,JSON.parse(localStorage.getItem(LSKEY)||'{}'))}catch(e){}
function save(){state.savedAt=Date.now();try{localStorage.setItem(LSKEY,JSON.stringify(state))}catch(e){}schedulePush()}
function logEvent(type,mod,detail){state.log=state.log||[];state.log.push({t:Date.now(),type,mod,detail});if(state.log.length>300)state.log=state.log.slice(-300)}
/* ---------- cloud sync (Google Sheet via Apps Script) ---------- */
const SYNC_DEFAULT={url:'',key:''}; // never commit the URL or secret; enter them in Settings or open the device link
let SYNC=Object.assign({},SYNC_DEFAULT);try{const o=JSON.parse(localStorage.getItem('ilp-sync')||'null');if(o&&o.url)SYNC=o}catch(e){}
let pushT=null,syncStatus='off';
function setSyncStatus(s,msg){syncStatus=s;const el=document.getElementById('syncStat');if(el)el.innerHTML=msg;const dot=document.getElementById('syncDot');if(dot){dot.className='syncDot '+s;dot.title=msg.replace(/<[^>]+>/g,'')}}
function schedulePush(){if(!SYNC.url)return;clearTimeout(pushT);pushT=setTimeout(pushState,1500)}
async function pushState(){if(!SYNC.url)return;try{setSyncStatus('busy',t('Saving to Drive…'));const r=await fetch(SYNC.url,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({key:SYNC.key,state,device:navigator.platform})});const j=await r.json();if(j.error)throw new Error(j.error);setSyncStatus('ok',t('Saved to Drive')+' '+new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}))}catch(e){setSyncStatus('err',t('Not saved to Drive')+': '+e.message)}}
async function pullState(){if(!SYNC.url)return false;try{setSyncStatus('busy',t('Loading from Drive…'));const r=await fetch(SYNC.url+'?key='+encodeURIComponent(SYNC.key)+'&t='+Date.now());const j=await r.json();if(j.error)throw new Error(j.error);
  if(j.state&&(j.state.savedAt||0)>(state.savedAt||0)){state=Object.assign({progress:{},custom:{},time:{},log:[]},j.state);try{localStorage.setItem(LSKEY,JSON.stringify(state))}catch(e){}renderTop();renderMap();setSyncStatus('ok',t('Loaded from Drive'));return true}
  setSyncStatus('ok',t('Drive is up to date'));if((state.savedAt||0)>(j.state?j.state.savedAt||0:0))pushState();return false}catch(e){setSyncStatus('err',t('Could not reach Drive')+': '+e.message);return false}}
function saveSyncSettings(){SYNC={url:document.getElementById('syncUrl').value.trim(),key:document.getElementById('syncKey').value.trim()};try{localStorage.setItem('ilp-sync',JSON.stringify(SYNC))}catch(e){}if(SYNC.url)pullState().then(()=>pushState());else setSyncStatus('off',t('Cloud sync is off'))}

/* ---------- notebook photos ---------- */
function setupNotebook(m){const inp=document.getElementById('photoIn'),btn=document.getElementById('photoBtn'),msg=document.getElementById('photoMsg');const draw=()=>{document.getElementById('thumbs').innerHTML=(state.photos||[]).filter(p=>p.mod===m.id).map(p=>`<a href="${p.url}" target="_blank" rel="noopener" title="${new Date(p.t).toLocaleString('en-GB')}"><img src="${p.thumb||''}" alt=""></a>`).join('')};draw();
  btn.onclick=()=>inp.click();inp.onchange=async()=>{const f=inp.files[0];if(!f)return;msg.textContent=t('Uploading…');try{const [big,thumb]=await Promise.all([shrink(f,1000,0.72),shrink(f,160,0.6)]);const r=await fetch(SYNC.url,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({key:SYNC.key,photo:big,mission:m.id,name:m.title})});const j=await r.json();if(j.error)throw new Error(j.error);(state.photos=state.photos||[]).push({t:Date.now(),mod:m.id,url:j.url,thumb});if(state.photos.length>40)state.photos=state.photos.slice(-40);logEvent('photo',m.id,'Notebook photo');save();draw();msg.textContent=t('Saved to Drive')+' ✓'}catch(e){msg.textContent=t('Could not upload')+': '+e.message}inp.value=''}}
function shrink(file,max,q){return new Promise((res,rej)=>{const img=new Image();img.onload=()=>{const k=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);c.getContext('2d').drawImage(img,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',q))};img.onerror=rej;img.src=URL.createObjectURL(file)})}
