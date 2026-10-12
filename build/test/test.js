// Headless regression for Ibrahim's Launchpad.
// Usage: serve the repo root on 8765 (python3 -m http.server 8765), start node build/test/mock.js, then: node build/test/test.js [batch]
const {chromium}=require('playwright');
const base='http://localhost:8765/index.html';
const out={errors:[],console:[],missions:0,labs:0,quizQ:0,contrast:[],overflow:[],notes:[]};
(async()=>{
 const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
 const P=await ctx.newPage();
 P.on('pageerror',e=>out.errors.push(e.message));
 P.on('console',m=>{if(m.type()==='error'&&!/fonts\.(googleapis|gstatic)/.test(m.text()))out.console.push(m.text())});
 const go=async h=>{await P.goto(base+h);await P.waitForTimeout(150)};
 const link=Buffer.from(JSON.stringify({u:'http://localhost:8767/',k:'test'})).toString('base64');
 await go('#sync='+link);await P.waitForTimeout(800);
 // 1. single user: no picker, no PIN, no family
 const h1=await P.innerText('main h1');if(!/Ibrahim/.test(h1))out.errors.push('home greeting missing name: '+h1);
 for(const r of ['family','rooms'])if(await P.evaluate(r=>typeof window['v'+r[0].toUpperCase()+r.slice(1)]!=='undefined',r))out.errors.push('leftover view: '+r);
 // 2. every route
 const routes=['#/home','#/tracks','#/track/cfa1','#/track/cfa2','#/track/cfa3','#/track/mba','#/exam/cfa2','#/exam/cfa3','#/study/cfa2','#/study/cfa3','#/track/trade','#/review','#/case','#/more','#/goals','#/badges','#/journal','#/settings','#/study','#/exam','#/exam/cfa1'];
 for(const r of routes){await go(r);const w=await P.evaluate(()=>document.documentElement.scrollWidth);if(w>392)out.overflow.push(r+' '+w+'px')}
 // 3. every mission: learn → lab → test (answer correctly by matching textContent) → reflect → read
 const ids=await P.evaluate(()=>Object.keys(M).sort());
 for(const id of ids){
  await go('#/m/'+id+'/learn');
  for(let k=0;k<8;k++){const n=await P.$('#nxt');if(n)await n.click();else break}
  const f=await P.$('#fin');if(f){await f.click();await P.waitForTimeout(100)}else out.errors.push(id+': no finish button on cards');
  await go('#/m/'+id+'/lab');
  const lab=await P.$('#labBox');const txt=lab?await lab.innerText():'';if(!lab||txt.length<10||/Lab not found/.test(txt))out.errors.push(id+': lab empty or missing');else out.labs++;
  // poke the lab: fill numbers, change selects, click its buttons once
  await P.evaluate(()=>{const lb=document.querySelector('#labBox');lb.querySelectorAll('input[type=number]').forEach(i=>{i.value=String((+i.value||1)*1);i.dispatchEvent(new Event('input',{bubbles:true}));i.dispatchEvent(new Event('change',{bubbles:true}))});lb.querySelectorAll('select').forEach(s=>{if(s.options.length>1){s.selectedIndex=1;s.dispatchEvent(new Event('change',{bubbles:true}))}});[...lb.querySelectorAll('button')].slice(0,12).forEach(x=>{try{x.click()}catch(e){}})});
  await P.waitForTimeout(60);
  await go('#/m/'+id+'/test');
  const n=await P.evaluate(id=>M[id].quiz.length,id);
  for(let q=0;q<n;q++){
   const ok=await P.evaluate(([id,q])=>{const d=document.createElement('div');d.innerHTML=M[id].quiz[q].o[M[id].quiz[q].a];const want=d.textContent.trim();const b=[...document.querySelectorAll('.qopt')].find(x=>x.textContent.trim()===want);if(!b)return false;b.click();return true},[id,q]);
   if(!ok){out.errors.push(id+' q'+(q+1)+': correct option not found');const any=await P.$('.qopt');if(any)await any.click()}
   out.quizQ++;const nq=await P.$('#nq');if(nq)await nq.click()}
  const res=await P.innerText('#stepBox');if(!res.includes(n+'/'+n))out.errors.push(id+': expected full marks, got '+res.slice(0,40).replace(/\n/g,' '));
  await go('#/m/'+id+'/reflect');await go('#/m/'+id+'/read');
  out.missions++}
 // 4. simulator: quick exam starts and records
 await go('#/exam/cfa1');const qb=await P.$('[data-m="q30"]');if(qb){await qb.click();await P.waitForTimeout(200);}else out.errors.push('simulator: no quick-exam button');
 // 5. Arabic interface: RTL shell, English content LTR
 await go('#/settings');await P.click('[data-lang="ar"]');await P.waitForTimeout(200);
 const dir=await P.evaluate(()=>document.documentElement.dir);if(dir!=='rtl')out.errors.push('Arabic: html dir is '+dir);
 await go('#/home');const ah1=await P.innerText('main h1');if(!/إبراهيم/.test(ah1))out.errors.push('Arabic: greeting not Arabic: '+ah1);
 await go('#/m/a01/learn');const cdir=await P.evaluate(()=>getComputedStyle(document.querySelector('.concept')).direction);if(cdir!=='ltr')out.errors.push('Arabic: mission content not LTR');
 for(const r of ['#/home','#/tracks','#/goals','#/settings','#/more','#/review']){await go(r);const w=await P.evaluate(()=>document.documentElement.scrollWidth);if(w>392)out.overflow.push('ar '+r+' '+w+'px')}
 await go('#/settings');await P.click('[data-lang="en"]');
 // 6. WCAG contrast of visible text, light and dark
 const contrast=()=>P.evaluate(()=>{const L=c=>{let m=c.match(/[\d.]+/g).map(Number);if(/^color\(/.test(c))m=[m[0]*255,m[1]*255,m[2]*255,m[3]];const f=x=>{x/=255;return x<=.03928?x/12.92:((x+.055)/1.055)**2.4};return[.2126*f(m[0])+.7152*f(m[1])+.0722*f(m[2]),m[3]==null?1:m[3]]};
   const bgOf=e=>{for(let x=e;x;x=x.parentElement){const s=getComputedStyle(x);if(s.backgroundImage&&s.backgroundImage!=='none')return null;const c=s.backgroundColor;const[,a]=L(c);if(a>.9)return c}return getComputedStyle(document.body).backgroundColor};
   const bad=[];document.querySelectorAll('main *, header *, nav *').forEach(e=>{const tn=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());if(!tn)return;const r=e.getBoundingClientRect();if(!r.width||!r.height)return;const s=getComputedStyle(e);if(s.visibility==='hidden'||+s.opacity<.5)return;const bg=bgOf(e);if(!bg)return;const[a]=L(s.color),[b2]=L(bg);const cr=(Math.max(a,b2)+.05)/(Math.min(a,b2)+.05);const big=parseFloat(s.fontSize)>=24||(parseFloat(s.fontSize)>=18.66&&+s.fontWeight>=700);if(cr<(big?3:4.5))bad.push((e.className||e.tagName)+' "'+e.textContent.trim().slice(0,30)+'" '+cr.toFixed(2)+' '+s.color+' on '+bg)});return bad.slice(0,15)});
 for(const th of ['light','dark'])for(const r of ['#/home','#/tracks','#/track/mba','#/m/m01/learn','#/goals','#/settings','#/study','#/case']){await P.evaluate(th=>{localStorage.setItem('ilp-theme',th);applyTheme()},th);await go(r);(await contrast()).forEach(x=>out.contrast.push(th+' '+r+' · '+x))}
 // 7. sync round-trip with the mock backend
 await P.waitForTimeout(2500);const synced=await P.evaluate(async()=>{const r=await fetch('http://localhost:8767/?key=test');const j=await r.json();return j.state&&j.state.xp});if(!synced)out.errors.push('sync: mock backend has no state');else out.notes.push('synced XP '+synced);
 await P.screenshot({path:'/tmp/claude-0/-home-claude/e50902a2-3592-5dc2-b13a-928b662208bc/scratchpad/last.png'});
 await b.close();
 console.log(JSON.stringify(out,null,1));
 process.exit(out.errors.length||out.console.length?1:0)})();
