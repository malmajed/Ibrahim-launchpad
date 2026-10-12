/* ================= Ibrahim's Launchpad — app shell ================= */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(n,d=0)=>(n==null||!isFinite(n))?'—':Number(n).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const pct=(n,d=1)=>(n==null||!isFinite(n))?'—':(n*100).toFixed(d)+'%';
const DAY=864e5;
const perm=n=>{const p=[...Array(n).keys()];for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[p[i],p[j]]=[p[j],p[i]]}return p};
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const dkey=t=>{const d=new Date(t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
function weekStart(t){const d=new Date(t||Date.now());d.setHours(0,0,0,0);const dow=(d.getDay()+6)%7;d.setDate(d.getDate()-dow);return d.getTime()} // Monday
const weekKey=t=>dkey(weekStart(t));
const FOLLOW=false;
/* reading-link helpers shared by all track files */
const HBRS=t=>'https://hbr.org/search?term='+encodeURIComponent(t);
const INV=t=>'https://www.investopedia.com/terms/'+t;
const OCW=q=>'https://ocw.mit.edu/search/?q='+encodeURIComponent(q);
const DAMO='https://pages.stern.nyu.edu/~adamodar/';
const WIKI=t=>'https://en.wikipedia.org/wiki/'+t;

/* ---------- registry (filled by track data files) ---------- */
const TRACKS=[
 {id:'cfa1',group:'cfa',ico:'Ⅰ',name:'Investment Foundations I',sub:'Concept reinforcement aligned to CFA Level I topics',batch:1,titles:['Ethics: Code and Standards I–III','Ethics: Standards IV–VII and GIPS','Ethics case drill','Rates, returns and time value of money','Statistics, hypothesis tests and regression','Markets, business cycles and policy','International trade and exchange rates','Income statement and balance sheet','Cash flows and analysis tools','Inventories, long-lived assets, taxes and liabilities','Reporting quality and ratio applications','Corporate issuers: governance, investment, capital structure','Equity markets, indices and efficiency','Industry analysis and equity valuation','Fixed income: instruments, pricing and yields','Term structure, duration and convexity','Credit risk and securitisation','Derivatives: forwards, futures, swaps and options','Alternative investments','Portfolio management and risk']},
 {id:'cfa2',group:'cfa',ico:'Ⅱ',name:'Investment Foundations II',sub:'Valuation and analysis in item sets, aligned to CFA Level II topics',batch:1,titles:['Ethics vignettes','Multiple regression and time series','Machine learning and big data','Currencies and economic growth','Intercorporate investments and multinationals','Employee compensation, financial institutions and earnings quality','Capital structure, payouts, cost of capital and restructuring','Equity: DDM and free cash flow models','Multiples, residual income and private companies','Arbitrage-free valuation and binomial trees','Embedded options, credit models and CDS','Derivatives pricing, BSM and Greeks','Real estate, private equity and commodities','Multifactor models, VaR, backtesting and active management','Item-set technique','Level II mock']},
 {id:'cfa3',group:'cfa',ico:'Ⅲ',name:'Investment Foundations III',sub:'Portfolio and wealth management, aligned to CFA Level III core and pathways',batch:1,titles:['Capital market expectations','Asset allocation: strategic and liability-relative','Asset allocation: constraints, goals and rebalancing','Portfolio construction: active vs passive and equity','Portfolio construction: fixed income and liability-driven','Trading, execution and monitoring','Derivatives, currency and risk management','Performance measurement, attribution and manager selection','Ethics and GIPS','Constructed-response technique','Pathway PM: index and active equity','Pathway PM: fixed income strategies','Pathway PM: hedge fund and multi-asset strategies','Pathway PM: trade strategy and case','Pathway Private Markets: private equity and private debt','Pathway Private Markets: real estate and infrastructure','Pathway Private Markets: fund structures, due diligence and performance','Pathway Private Markets: case','Pathway Private Wealth: clients, IPS and taxes','Pathway Private Wealth: estate, family and philanthropy','Pathway Private Wealth: risk management and insurance','Pathway Private Wealth: case']},
 {id:'mba',ico:'◆',name:'MBA Core',sub:'Accounting, finance, marketing, strategy, economics, data',batch:1,titles:['Reading the three statements','Working capital and the cash cycle','Ratio analysis and DuPont','Cost behaviour and break-even','Time value of money','Cost of capital','DCF valuation','Microeconomics for managers','Macroeconomics and the Saudi economy','Pricing strategy','Marketing: STP and the 4Ps','Competitive strategy: Five Forces','Growth strategy: BCG and Ansoff','Operations strategy and process analysis','Organisational behaviour','Data analysis for decisions']},
 {id:'trade',ico:'▲',name:'Trading and Technical Analysis',sub:'Market mechanics, indicators, risk and honest backtesting',batch:3,titles:['Market structure and order types','Tadawul and US market mechanics','Charts, timeframes and clean data','Trend, support and resistance','Moving averages and MACD','RSI, Bollinger bands and volume','Candlesticks: what the evidence says','Position sizing, stops and risk/reward','Expectancy, drawdown and risk of ruin','Behavioural traps','Backtesting without fooling yourself','Technical analysis, fundamentals and market efficiency']}
];
const PFX={mba:'m',cfa1:'a',cfa2:'b',cfa3:'x',trade:'t'};
const TOTAL=()=>TRACKS.reduce((n,t)=>n+t.titles.length,0);
const M={};          // mission id -> mission object
const LABS={};       // lab key -> fn(el, mission, done)
const CASES=[];      // case-of-the-week list
const CUST=id=>state.custom[id]||(state.custom[id]={}); // per-lab saved inputs
function addMissions(list){list.forEach(m=>{if(m.sets)m.quiz=m.sets.flatMap(st=>st.qs.map(q=>Object.assign({stem:st.v,setT:st.t},q))).concat(m.quiz||[]);M[m.id]=m})}
const mid=(t,i)=>PFX[t]+String(i+1).padStart(2,'0');

/* ---------- state defaults ---------- */
function ensure(){const d={progress:{},custom:{},time:{},log:[],xp:0,srs:{},goals:{},days:{},mins:{},conf:{},cow:{},settings:{shareRefl:false},refl:{},badges:{},reviews:0,qd:{},name:'Ibrahim'};for(const k in d)if(state[k]==null)state[k]=d[k];if(!state.settings)state.settings={shareRefl:false}}
ensure();
const P=id=>state.progress[id]||(state.progress[id]={status:'new',steps:{},best:0,attempts:0,xp:0});

/* ---------- reflections: synced with the rest of the state ---------- */
function reflStore(){return state.refl||(state.refl={})}
function reflSave(id,obj){reflStore()[id]=obj;save()}

/* ---------- XP, levels, streak ---------- */
const LEVELS=[[0,'Analyst'],[600,'Senior Analyst'],[1500,'Associate'],[3000,'Vice President'],[5000,'Director'],[7500,'Portfolio Manager']];
function level(x){let i=0;while(i<LEVELS.length-1&&x>=LEVELS[i+1][0])i++;const nx=LEVELS[i+1];return{name:LEVELS[i][1],i,frac:nx?(x-LEVELS[i][0])/(nx[0]-LEVELS[i][0]):1,next:nx}}
function addXP(n,id){if(FOLLOW)return;state.xp=(state.xp||0)+n;if(id){P(id).xp=(P(id).xp||0)+n}state.days[today()]=true;const before=level(state.xp-n).i;save();renderTop();if(level(state.xp).i>before){confetti();toast(`🎖️ ${t('Promoted to')} <b>${t(level(state.xp).name)}</b>`)}checkBadges()}
function streak(){let s=0;const d=new Date();if(!state.days[today()])d.setDate(d.getDate()-1);while(state.days[dkey(d)]){s++;d.setDate(d.getDate()-1)}return s}

/* keep a newly shown button clear of the fixed bottom navigation */
function reveal(e){if(!e)return;(f=>f())(()=>{const r=e.getBoundingClientRect(),nav=$('#tabs'),nb=nav&&getComputedStyle(nav).position==='fixed'&&nav.getBoundingClientRect().top>innerHeight/2?nav.offsetHeight:0;const lim=innerHeight-nb-12;if(r.bottom>lim)scrollBy(0,r.bottom-lim)})}
/* ---------- toast & confetti ---------- */
let toastT;function toast(h){const t=$('#toast');t.innerHTML=h;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),2600)}
function confetti(){const c=$('#confetti');if(!c)return;const x=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;const cols=['#F5C518','#FFB000','#0B2545','#1F4FD8','#5DA9E9','#ffffff'];const ps=Array.from({length:110},()=>({x:Math.random()*c.width,y:-20-Math.random()*c.height*.4,vx:(Math.random()-.5)*3,vy:2+Math.random()*3,r:3+Math.random()*4,c:cols[Math.floor(Math.random()*cols.length)],a:Math.random()*6}));let f=0;(function tick(){x.clearRect(0,0,c.width,c.height);ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.a+=.1;x.fillStyle=p.c;x.save();x.translate(p.x,p.y);x.rotate(p.a);x.fillRect(-p.r,-p.r/2,p.r*2,p.r);x.restore()});if(++f<150)requestAnimationFrame(tick);else x.clearRect(0,0,c.width,c.height)})()}

/* ---------- badges ---------- */
const BADGES=[
 ['first','🚀','First mission',s=>done().length>=1],
 ['five','🎯','Five missions',s=>done().length>=5],
 ['cfa1','Ⅰ','Investment Foundations I complete',s=>trackDone('cfa1')],
 ['cfa2','Ⅱ','Investment Foundations II complete',s=>trackDone('cfa2')],
 ['cfa3','Ⅲ','Investment Foundations III complete',s=>trackDone('cfa3')],
 ['mba','◆','MBA Core complete',s=>trackDone('mba')],
 ['trade','▲','Trading track complete',s=>trackDone('trade')],
 ['exam70','🎓','Practice simulator 70%+',s=>(s.exams||[]).some(e=>e.score>=.7&&e.n>=30)],
 ['perfect','💯','Perfect test score',s=>Object.values(s.progress).some(p=>p.best>=1)],
 ['q500','🧮','500 practice questions',s=>qTotal()>=500],
 ['streak7','🔥','7-day streak',s=>streak()>=7],
 ['streak30','🌋','30-day streak',s=>streak()>=30],
 ['review50','🧠','50 reviews',s=>(s.reviews||0)>=50],
 ['review250','🏛️','250 reviews',s=>(s.reviews||0)>=250],
 ['cow1','📘','First case of the week',s=>Object.values(s.cow).filter(c=>c.done).length>=1],
 ['cow4','📚','Four cases of the week',s=>Object.values(s.cow).filter(c=>c.done).length>=4],
 ['photo','📷','First notebook photo',s=>(s.photos||[]).length>0],
 ['goals','✅','Hit all weekly targets',s=>!!s.badges.goals]
];
/* practice questions answered, by day (mission tests + simulator) */
function qAdd(n){const k=today();state.qd=state.qd||{};state.qd[k]=(state.qd[k]||0)+n}
function qSince(ts){return Object.entries(state.qd||{}).filter(([d])=>new Date(d+'T12:00').getTime()>=ts).reduce((a,[,n])=>a+n,0)}
const qTotal=()=>qSince(0);
const done=()=>Object.keys(state.progress).filter(id=>state.progress[id].status==='completed'&&M[id]);
const trackDone=t=>{const tr=TRACKS.find(x=>x.id===t);return tr.titles.every((_,i)=>(state.progress[mid(t,i)]||{}).status==='completed')};
function checkBadges(){if(FOLLOW)return;let got=[];BADGES.forEach(([k,e,n,f])=>{if(!state.badges[k]){try{if(f(state)){state.badges[k]=Date.now();got.push(e+' '+t(n))}}catch(err){}}});if(got.length){save();setTimeout(()=>{confetti();toast('🏅 '+t('Badge')+': <b>'+got.join(', ')+'</b>')},700)}}

/* ---------- theme ---------- */
function applyTheme(){const t=localStorage.getItem('ilp-theme');if(t)document.documentElement.setAttribute('data-theme',t);else document.documentElement.removeAttribute('data-theme')}
function toggleTheme(){const cur=document.documentElement.getAttribute('data-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');const n=cur==='dark'?'light':'dark';try{localStorage.setItem('ilp-theme',n)}catch(e){}applyTheme()}

/* ---------- time tracking ---------- */
let current=null;
setInterval(()=>{if(document.hidden)return;const id=current&&current.id;const k=today();state.mins[k]=(state.mins[k]||0)+15;if(id)state.time[id]=(state.time[id]||0)+15;if(Object.keys(state.mins).length>120){const ks=Object.keys(state.mins).sort();ks.slice(0,ks.length-120).forEach(x=>delete state.mins[x])}save()},15000);

/* ---------- header ---------- */
function renderTop(){ensure();const br=$('.brand');if(br)br.innerHTML=LANG==='ar'?'منصّة <b>إبراهيم</b>':"Ibrahim's <b>Launchpad</b>";const L=level(state.xp||0);$('#lvlTxt').innerHTML=`${t(L.name)} · ${fmt(state.xp||0)} XP${L.next?` <span class="nxtlvl" style="opacity:.7">→ ${t(L.next[1])} ${t('at')} ${fmt(L.next[0])}</span>`:''}`;$('#xpBar').style.width=Math.min(100,L.frac*100)+'%';const due=dueCards().length;const b=$('#dueBadge');if(b){b.textContent=due;b.classList.toggle('hide',!due)}const lb=$('#langBtn');if(lb)lb.textContent=LANG==='ar'?'EN':'ع'}

/* ---------- router ---------- */
function go(h){location.hash=h}
function route(){const h=location.hash.replace(/^#\/?/,'')||'home';const [v,a,b]=h.split('/');current=null;window.scrollTo(0,0);
  $$('#tabs button').forEach(x=>x.classList.toggle('on',x.dataset.v===v||(v==='track'&&x.dataset.v==='tracks')||(v==='m'&&x.dataset.v==='tracks')||(['goals','badges','settings','journal','study','exam'].includes(v)&&x.dataset.v==='more')));
  const V={study:()=>vStudy(a),exam:()=>vExam(a,b),home:vHome,tracks:vTracks,track:()=>vTrack(a),m:()=>vMission(a,b),review:vReview,case:()=>vCase(a),more:vMore,goals:vGoals,badges:vBadges,settings:vSettings,journal:vJournal}[v]||vHome;
  V();localize();renderTop()}
function renderMap(){route()}

/* ---------- views ---------- */
const view=()=>$('#view');
/* mission, case and question content stays in English (the exam language); this wrapper keeps it left-to-right in the Arabic interface */
const EN=h=>`<div class="en" dir="ltr" lang="en">${h}</div>`;
function trackStats(t){const tr=TRACKS.find(x=>x.id===t);const ids=tr.titles.map((_,i)=>mid(t,i));const d=ids.filter(id=>(state.progress[id]||{}).status==='completed').length;return{d,n:ids.length,ids}}
function nextMission(){for(const tr of TRACKS){for(let i=0;i<tr.titles.length;i++){const id=mid(tr.id,i);if(M[id]&&(state.progress[id]||{}).status!=='completed')return id}}return null}
function inProgress(){return Object.keys(state.progress).filter(id=>M[id]&&state.progress[id].status==='started').sort((a,b)=>(state.progress[b].updated||0)-(state.progress[a].updated||0))[0]}
const dateL=(d,o)=>new Date(d).toLocaleDateString(LANG==='ar'?'ar-SA-u-ca-gregory-nu-latn':'en-GB',o);

function vHome(){const L=level(state.xp||0);const ip=inProgress()||nextMission();const m=ip&&M[ip];const due=dueCards().length;const w=weekProgress();const c=currentCase();const cs=c&&state.cow[c.id];
  const hr=new Date().getHours();const greet=hr<12?t('Good morning'):hr<17?t('Good afternoon'):t('Good evening');
  view().innerHTML=`
  <div class="eyebrow">${dateL(Date.now(),{weekday:'long',day:'numeric',month:'long'})}</div>
  <h1>${greet}${LANG==='ar'?' يا إبراهيم':', Ibrahim'}</h1>
  <div class="grid g4 g2m kpis" style="margin:12px 0 14px">
    <div class="stat"><small>${t('Level')}</small><b>${t(L.name)}</b><small>${fmt(state.xp)} XP</small></div>
    <div class="stat"><small>${t('Streak')}</small><b>${streak()} 🔥</b><small>${t('days in a row')}</small></div>
    <div class="stat"><small>${t('Questions this week')}</small><b>${qSince(weekStart())}</b><small>${t('practice questions')}</small></div>
    <div class="stat"><small>${t('Review due')}</small><b>${due}</b><small>${t('concept cards')}</small></div>
  </div>
  <div class="card cfahero" onclick="go('#/study')"><div class="row" style="flex-wrap:nowrap"><span class="tile">${ico('target',26)}</span><div style="min-width:0"><div class="eyebrow">${t('CFA Level I · the main goal')}</div><h2 style="margin:4px 0 2px">${t('CFA study tracker')}</h2><small class="muted">${t('Every 2027 learning module · practice accuracy · hours · mocks · readiness')}</small></div></div></div>
  ${m?`<div class="card upnext" style="--tc:${tcol(m.track).c}"><div class="row" style="flex-wrap:nowrap;align-items:flex-start"><span class="tile">${mico(ip,26)}</span><div style="min-width:0"><div class="eyebrow" style="color:var(--tc)">${(state.progress[ip]||{}).status==='started'?t('Continue'):t('Up next')} · ${t(TRACKS.find(x=>x.id===m.track).name)}</div><h2 style="margin-top:4px" dir="ltr" lang="en">${esc(m.title)}</h2></div></div><p class="note" dir="ltr" lang="en">${esc(m.blurb)}</p><div class="row"><button class="sbtn" onclick="go('#/m/${ip}')">${t('Open mission')}</button><span class="note">~${m.mins||35} ${t('min')}</span></div></div>`:''}
  <div class="grid g2">
    <div class="card"><div class="row"><h3 style="margin:0">${t('This week')}</h3><span class="spacer"></span><a href="#/goals" class="note">${t('Edit goals')}</a></div>${goalBars(w)}</div>
    <div class="card">${c?`<div class="eyebrow">${t('Case of the week')}</div><h3 style="margin-top:4px" dir="ltr" lang="en">${esc(c.title)}</h3><p class="note" dir="ltr" lang="en">${esc(c.teaser)}</p><div class="row"><button class="sbtn ${cs&&cs.done?'alt':''}" onclick="go('#/case')">${cs&&cs.done?t('Review your answers'):cs?t('Continue the case'):t('Read the case')}</button>${cs&&cs.done?`<span class="pill done">${t('Done')} · ${Math.round(cs.score*100)}%</span>`:''}</div>`:''}</div>
  </div>
  ${due?`<div class="card"><div class="row"><div><h3 style="margin:0">${t('Spaced review')}</h3><p class="note" style="margin:0">${due} ${t('cards due. Five minutes keeps the concepts fresh.')}</p></div><span class="spacer"></span><button class="sbtn" onclick="go('#/review')">${t('Review now')}</button></div></div>`:''}
  <h2 style="margin-top:18px">${t('Tracks')}</h2>
  ${trackGroups()}`}
function trackGroups(){const cfa=TRACKS.filter(x=>x.group==='cfa'),rest=TRACKS.filter(x=>!x.group);return`<p class="note" style="margin-top:0">${t('The CFA missions reinforce concepts from CFA Institute\'s topic outline. They do not replace the official curriculum: the tracker measures your real work in the CFA Institute Learning Ecosystem and your prep provider.')}</p><div class="grid g2" style="margin-bottom:12px"><div class="card tcard" onclick="go('#/study')" style="border-inline-start:4px solid var(--gold2)"><div class="row"><span class="tile">${ico('target',22)}</span><div><b>${t('CFA study tracker')}</b><br><small class="muted">${t('Modules, accuracy, hours, mocks, readiness')}</small></div></div></div><div class="card tcard" onclick="go('#/exam')"><div class="row"><span class="tile">${ico('check',22)}</span><div><b>${t('Practice simulator')}</b><br><small class="muted">${t('Timed questions weighted by the 2027 topic weights')}</small></div></div></div></div><div class="grid g2">${cfa.concat(rest).map(trackCard).join('')}</div>`}
function trackCard(tr){const s=trackStats(tr.id),c=tcol(tr.id);const avail=tr.titles.some((_,i)=>M[mid(tr.id,i)]);return`<div class="card tcard trk" style="--tc:${c.c}" onclick="go('#/track/${tr.id}')"><div class="trkband" style="background:${c.g};color:${c.fg||'#fff'}"><span class="tile glass">${ico(c.i,26)}</span><div style="flex:1;min-width:0"><h3>${t(tr.name)}</h3><small>${t(tr.sub)}</small></div><span class="trkpct">${Math.round(s.d/s.n*100)}%</span></div><div class="trkbody"><div class="icorow">${tr.titles.map((_,i)=>{const id=mid(tr.id,i),dn=(state.progress[id]||{}).status==='completed';return`<span class="mini ${dn?'on':''} ${M[id]?'':'off'}" data-tip="${i+1}. ${esc(M[id]?M[id].title:tr.titles[i])}${dn?' ✓':''}" role="link" aria-label="Mission ${i+1}: ${esc(tr.titles[i])}" ${M[id]?`onclick="event.stopPropagation();go('#/m/${id}')"`:''}>${mico(id,15)}</span>`}).join('')}</div><div class="prog"><i style="width:${s.d/s.n*100}%"></i></div><small class="muted">${s.d} ${t('of')} ${s.n} ${t('missions')}${avail?'':' · '+t('coming soon')}</small></div></div>`}
function vTracks(){view().innerHTML=`<h1>${t('Tracks')}</h1><p class="note">${t('Each mission: concept cards → a working lab → a self-test → a reflection. Concepts then join your spaced-review deck.')}</p>${trackGroups()}`}
function vTrack(id){const tr=TRACKS.find(x=>x.id===id);if(!tr)return vTracks();const s=trackStats(id);
  const c=tcol(id),fg=c.fg||'#fff';view().innerHTML=`<div style="--tc:${c.c}"><div class="trackhead" style="background:${c.g};color:${fg};border:0"><div class="row" style="flex-wrap:nowrap"><span class="tile glass" style="width:52px;height:52px">${ico(c.i,30)}</span><div><div class="eyebrow" style="color:${fg};opacity:.8">${t('Track')}</div><h1 style="margin:0">${t(tr.name)}</h1></div></div><p style="margin-top:8px">${t(tr.sub)}</p><div class="prog" style="background:rgba(127,127,127,.25)"><i style="width:${s.d/s.n*100}%;background:${fg}"></i></div><small style="opacity:.85">${s.d} ${t('of')} ${s.n} ${t('complete')}</small>${tr.group==='cfa'?`<div class="ctl" style="margin-bottom:0"><button class="sbtn" style="background:#fff;color:#0B2545;border-color:#fff" onclick="go('#/exam/${id}')">${t('Practice simulator')}</button><button class="sbtn" style="background:transparent;color:#fff;border-color:#fff" onclick="go('#/study/${id}')">${t('Study tracker')}</button></div>`:''}</div>
  <div class="mlist">${tr.titles.map((ti,i)=>{const mi=mid(id,i),m=M[mi],p=state.progress[mi]||{};const dn=p.status==='completed';
    return`<button class="mitem ${dn?'done':''} ${m?'':'lock'}" ${m?`onclick="go('#/m/${mi}')"`:'disabled'}><span class="tile ${dn?'':'soft'}">${mico(mi,22)}</span><span class="t"><small class="mnum">${t('Mission')} ${i+1}${dn?' · ✓ '+t('done'):''}</small><b dir="ltr" lang="en">${esc(m?m.title:ti)}</b><small class="muted">${m?esc(m.lab.name):t('Coming in batch')+' '+tr.batch}</small></span>${dn?`<span class="pill done">${Math.round((p.best||0)*100)}%</span>`:p.status==='started'?`<span class="pill gold">${t('In progress')}</span>`:''}</button>`}).join('')}</div></div>`}

/* ---------- mission ---------- */
const STEPS=[['learn','Learn'],['lab','Lab'],['test','Test'],['reflect','Reflect'],['read','Read']];
function vMission(id,step){const m=M[id];if(!m)return vTracks();current=m;const p=P(id);if(p.status==='new'){p.status='started';p.updated=Date.now();logEvent('start',id,m.title);save()}
  step=step||(p.steps.learn?(p.steps.lab?(p.steps.test?'reflect':'test'):'lab'):'learn');
  const tr=TRACKS.find(x=>x.id===m.track);const idx=tr.titles.findIndex((_,i)=>mid(m.track,i)===id);
  const c=tcol(m.track);view().innerHTML=`<div style="--tc:${c.c}"><div class="row" style="margin-bottom:4px"><a href="#/track/${m.track}" class="note">${t('←')} ${t(tr.name)}</a><span class="spacer"></span>${p.status==='completed'?`<span class="pill done">${t('Completed')}</span>`:''}</div>
  ${EN(`<div class="mhead"><span class="tile">${mico(id,28)}</span><div style="min-width:0"><div class="eyebrow" style="color:var(--tc)">${tr.name} · Mission ${idx+1} of ${tr.titles.length}</div><h1 style="margin:2px 0 4px">${esc(m.title)}</h1><p class="note" style="margin:0">${esc(m.blurb)}</p></div></div>
  <div class="steps">${STEPS.map(([k,n])=>`<button class="${k===step?'on':''} ${p.steps[k]?'ok':''}" data-step="${k}" onclick="go('#/m/${id}/${k}')">${ico(STEPICO[k],16)}<span>${n}</span></button>`).join('')}</div>
  <div id="stepBox"></div>`)}</div>`;
  const box=$('#stepBox');({learn:stepLearn,lab:stepLab,test:stepTest,reflect:stepReflect,read:stepRead}[step]||stepLearn)(box,m)}
function markStep(m,k,xp){const p=P(m.id);if(p.steps[k])return false;p.steps[k]=Date.now();p.updated=Date.now();addXP(xp,m.id);logEvent(k,m.id,m.title);maybeComplete(m);save();const b=$(`.steps button[data-step="${k}"]`);if(b)b.classList.add('ok');return true}
function maybeComplete(m){const p=P(m.id);if(p.status!=='completed'&&p.steps.learn&&p.steps.lab&&p.steps.test){p.status='completed';p.updated=Date.now();logEvent('complete',m.id,m.title+' ('+Math.round((p.best||0)*100)+'%)');save();setTimeout(()=>{confetti();toast(`✅ <b>${t('Mission complete')}:</b> ${esc(m.title)}`)},300)}}
function stepLearn(box,m){let i=0;const n=m.cards.length;
  const draw=()=>{const c=m.cards[i];box.innerHTML=`<div class="card concept"><div class="eyebrow">Concept ${i+1} of ${n}</div><h3 style="margin-top:4px">${c.h}</h3><div>${c.b}</div></div><div class="dots">${m.cards.map((_,j)=>`<i class="${j===i?'on':''}"></i>`).join('')}</div><div class="ctl"><button class="sbtn alt" id="prv" ${i?'':'disabled'}>← Back</button><span class="spacer"></span>${i<n-1?'<button class="sbtn" id="nxt">Next →</button>':'<button class="sbtn gold" id="fin">Add to review deck & go to the lab →</button>'}</div>`;
    $('#prv',box).onclick=()=>{i--;draw()};const nx=$('#nxt',box);if(nx)nx.onclick=()=>{i++;draw();box.scrollIntoView({block:'start'})};const f=$('#fin',box);if(f)f.onclick=()=>{addCards(m);markStep(m,'learn',10);go('#/m/'+m.id+'/lab')}};draw()}
function stepLab(box,m){box.innerHTML=`<div class="card"><div class="eyebrow">Lab</div><h3 style="margin-top:4px">${esc(m.lab.name)}</h3><p class="note">${m.lab.intro||''}</p><div id="labBox"></div></div><div class="ctl"><span class="spacer"></span><button class="sbtn alt" onclick="go('#/m/${m.id}/test')">Go to the test →</button></div>`;
  const fn=LABS[m.lab.key];const lb=$('#labBox',box);if(!fn){lb.innerHTML='<p class="note">Lab not found.</p>';return}
  fn(lb,m,()=>{if(markStep(m,'lab',20))toast('🧪 '+t('Lab complete')+' +20 XP')})}
function stepTest(box,m){const qs=m.quiz;let i=0,ok=0;
  const draw=()=>{if(i>=qs.length){const sc=ok/qs.length;const p=P(m.id);p.attempts=(p.attempts||0)+1;const first=!p.steps.test;const gain=Math.round(40*sc)-(first?0:Math.round(40*(p.best||0)));if(sc>(p.best||0))p.best=sc;
      box.innerHTML=`<div class="card" style="text-align:center"><div class="eyebrow">Result</div><div class="big" style="font-size:2.6rem">${ok}/${qs.length}</div><p>${sc>=.85?'Excellent. You own this.':sc>=.67?'Solid. Review the explanations you missed.':'Worth another pass. Revisit the concept cards, then retry.'}</p><div class="ctl" style="justify-content:center"><button class="sbtn alt" id="again">Retry</button><button class="sbtn" onclick="go('#/m/${m.id}/reflect')">Reflect →</button></div></div>`;
      $('#again',box).onclick=()=>{i=0;ok=0;draw()};if(m.cr)crPractice(box,m);
      if(first){markStep(m,'test',Math.round(40*sc))}else{if(gain>0)addXP(gain,m.id);logEvent('retest',m.id,Math.round(sc*100)+'%');save()}if(sc>=1)checkBadges();return}
    const q0=qs[i],pm=perm(q0.o.length),q={q:q0.q,w:q0.w,o:pm.map(k=>q0.o[k]),a:pm.indexOf(q0.a)};box.innerHTML=`<div class="card">${q0.stem?`<details ${i===0||qs[i-1].stem!==q0.stem?'open':''} class="exhibit" style="margin-bottom:10px"><summary><b>Item set: ${esc(q0.setT||'Vignette')}</b> <span class="note">(tap to show or hide)</span></summary><div class="casebody" style="margin-top:6px">${q0.stem}</div></details>`:''}<div class="row"><div class="eyebrow">Question ${i+1} of ${qs.length}</div><span class="spacer"></span><small class="muted">${ok} correct</small></div><h3 style="margin-top:6px;font-family:var(--sans);font-size:1.02rem">${q.q}</h3><div id="opts">${q.o.map((o,j)=>`<button class="qopt" data-j="${j}">${o}</button>`).join('')}</div><div id="why"></div></div>`;
    $$('.qopt',box).forEach(b=>b.onclick=()=>{const j=+b.dataset.j;const r=j===q.a;if(r)ok++;qAdd(1);logEvent('quiz',m.id,(r?'✓ ':'✗ ')+String(q.q).replace(/<[^>]+>/g,'').slice(0,60));$$('.qopt',box).forEach(x=>{x.disabled=true;if(+x.dataset.j===q.a)x.classList.add('right');else if(x===b)x.classList.add('wrong')});
      $('#why',box).innerHTML=`<div class="readout ${r?'ok':'bad'}"><b>${r?'Correct.':'Not quite.'}</b> ${q.w}</div><div class="ctl"><span class="spacer"></span><button class="sbtn" id="nq">${i<qs.length-1?'Next question →':'See result'}</button></div>`;$('#nq',box).onclick=()=>{i++;draw()};reveal($('#nq',box))})};draw()}
function crPractice(box,m){const d=document.createElement('div');d.innerHTML=`<div class="card"><div class="eyebrow">Constructed response</div><h3 style="margin-top:4px">Write it, then mark it</h3><p class="note">Level III rewards short, precise, justified answers. Write as you would on the exam, then reveal the model answer and tick the points you earned.</p>${m.cr.map((c,k)=>`<div style="margin:14px 0;padding-top:10px;border-top:1px solid var(--line)"><p><b>${k+1}. ${c.q}</b> <span class="pill">${c.pts.length} points</span></p><textarea data-ca="${k}" style="min-height:120px" placeholder="Your answer…"></textarea><div class="ctl"><button class="sbtn alt" data-show="${k}">Show model answer</button></div><div data-mod="${k}" hidden><div class="model"><b>Model answer.</b> ${c.model}</div><div class="rubric">${c.pts.map((p2,j)=>`<label><input type="checkbox" data-sc="${k}"><span>${p2}</span></label>`).join('')}</div><div class="note" data-tot="${k}"></div></div></div>`).join('')}</div>`;box.appendChild(d);
  $$('[data-show]',d).forEach(b=>b.onclick=()=>{const k=b.dataset.show;$(`[data-mod="${k}"]`,d).hidden=false;b.remove();logEvent('cr',m.id,'Constructed response attempted')});
  $$('[data-sc]',d).forEach(x=>x.onchange=()=>{const k=x.dataset.sc,all=$$(`[data-sc="${k}"]`,d),n=all.filter(y=>y.checked).length;$(`[data-tot="${k}"]`,d).textContent=`Self-score: ${n} of ${all.length}`})}
function stepReflect(box,m){const r=reflStore()[m.id]||{};const conf=state.conf[m.id]||0;const prompts=m.reflect||['What is the single most useful idea from this mission?','Where will you use it: in your CFA study, in reading the market, or in your work?','What is still unclear, and how will you close the gap?'];
  box.innerHTML=`<div class="card"><h3>Self-assessment</h3><p class="note">How confidently could you explain and apply this under exam conditions?</p><div class="conf" id="conf">${[1,2,3,4,5].map(n=>`<button data-n="${n}" class="${conf===n?'on':''}">${n}</button>`).join('')}</div><div class="row note" style="justify-content:space-between;margin-top:4px"><span>Not yet</span><span>Could teach it</span></div></div>
  <div class="card"><h3 style="margin:0">Reflection</h3>${prompts.map((q,j)=>`<label class="f">${esc(q)}</label><textarea data-j="${j}" placeholder="Write a few honest sentences…">${esc((r.a||[])[j]||'')}</textarea>`).join('')}<div class="ctl"><button class="sbtn" id="sv">Save reflection</button><span class="note" id="svm">${r.t?'Last saved '+new Date(r.t).toLocaleString('en-GB'):''}</span></div></div>
  <div class="card"><h3>Notebook</h3><p class="note">Photograph handwritten workings, a formula sheet or a chart you marked up. Saved to Drive, linked to this mission.</p>${SYNC.url?`<input type="file" id="photoIn" accept="image/*" capture="environment" hidden><button class="sbtn alt" id="photoBtn">📷 Add a photo</button> <span class="note" id="photoMsg"></span><div id="thumbs"></div>`:'<p class="note">Turn on cloud sync in Settings to use the notebook.</p>'}</div>`;
  $$('#conf button',box).forEach(b=>b.onclick=()=>{state.conf[m.id]=+b.dataset.n;logEvent('confidence',m.id,'Confidence '+b.dataset.n+'/5');save();$$('#conf button',box).forEach(x=>x.classList.toggle('on',x===b))});
  $('#sv',box).onclick=()=>{const a=$$('textarea',box).map(x=>x.value.trim());if(a.join('').length<20){$('#svm',box).textContent='Write a little more first.';return}reflSave(m.id,{a,t:Date.now()});logEvent('reflect',m.id,'Reflection saved');if(markStep(m,'reflect',15))toast('📝 +15 XP');$('#svm',box).textContent='Saved '+new Date().toLocaleTimeString('en-GB')};
  if(SYNC.url)setupNotebook(m)}
function stepRead(box,m){box.innerHTML=`<div class="card reading"><h3>Reading list</h3><p class="note">Short, high-yield sources. Some HBR articles need a subscription.</p>${m.read.map(r=>`<a href="${r.u}" target="_blank" rel="noopener"><b>${esc(r.t)}</b><small class="muted">${esc(r.s)}${r.n?' · '+esc(r.n):''}</small></a>`).join('')}</div>`}

/* ---------- spaced repetition (Leitner, 7 boxes) ---------- */
const IVL=[0,1,3,7,14,30,60];
function addCards(m){(m.srs||[]).forEach((c,i)=>{const k=m.id+'-'+i;if(!state.srs[k])state.srs[k]={b:0,due:Date.now()}});save()}
function cardOf(k){const [id,i]=k.split('-');const m=M[id];return m&&m.srs&&m.srs[+i]?{m,c:m.srs[+i]}:null}
function dueCards(){const now=Date.now();return Object.keys(state.srs||{}).filter(k=>state.srs[k].due<=now&&cardOf(k))}
function vReview(){const q=dueCards().sort(()=>Math.random()-.5);const total=Object.keys(state.srs).length;let i=0,n=0;
  const draw=()=>{if(i>=q.length){view().innerHTML=`<h1>${t('Review')}</h1><div class="card" style="text-align:center"><div class="big">${n?t('Done for now ✓'):t('Nothing due')}</div><p class="note">${n?`${t('Cards reviewed')}: ${n}. `:''}${t('Cards in your deck')}: ${total}. ${total?t('Next due')+': '+nextDue():t('Finish a mission’s concept cards to add some.')}</p></div>${deckTable()}`;localize();renderTop();return}
    const {m,c}=cardOf(q[i]);view().innerHTML=`<h1>${t('Review')}</h1><p class="note">${q.length-i} ${t('left')} · ${t('Leitner spacing: 1, 3, 7, 14, 30, 60 days')}</p>${EN(`<div class="card flash"><div class="eyebrow">${esc(m.title)}</div><div class="q" style="margin-top:8px">${c.q}</div><div class="a hide" id="ans">${c.a}</div></div>`)}<div class="ctl" id="rc"><button class="sbtn" id="show" style="flex:1">${t('Show answer')}</button></div>`;
    $('#show').onclick=()=>{$('#ans').classList.remove('hide');$('#rc').innerHTML=[['Again',0],['Hard',1],['Good',2],['Easy',3]].map(([x,g])=>`<button class="sbtn ${g===2?'':'alt'}" style="flex:1" data-g="${g}">${t(x)}</button>`).join('');$$('#rc button').forEach(b=>b.onclick=()=>{grade(q[i],+b.dataset.g);n++;i++;draw()})}};draw()}
function grade(k,g){const s=state.srs[k];if(g===0){s.b=0;s.due=Date.now()+10*60e3}else{s.b=Math.max(1,Math.min(6,s.b+(g===1?0:g===2?1:2)));s.due=Date.now()+IVL[s.b]*DAY*(g===1?.6:1)}state.reviews=(state.reviews||0)+1;logEvent('review',k.split('-')[0],['Again','Hard','Good','Easy'][g]);addXP(2)}
function nextDue(){const ds=Object.values(state.srs).map(s=>s.due).filter(d=>d>Date.now()).sort((a,b)=>a-b);return ds.length?new Date(ds[0]).toLocaleString(LANG==='ar'?'ar-SA-u-ca-gregory-nu-latn':'en-GB',{weekday:'short',hour:'2-digit',minute:'2-digit'}):'—'}
function deckTable(){const by={};Object.values(state.srs).forEach(s=>{by[s.b]=(by[s.b]||0)+1});if(!Object.keys(by).length)return'';return`<div class="card"><h3>${t('Your deck by box')}</h3><div class="grid g4 g2m">${IVL.map((d,b)=>`<div class="stat"><small>${t('Box')} ${b} · ${d?d+' '+t('d'):t('new')}</small><b>${by[b]||0}</b></div>`).join('')}</div></div>`}

/* ---------- weekly goals: CFA hours, practice questions, reviews, missions (news scans and journal entries join in later batches) ---------- */
const GDEF={cfaHours:12,questions:120,reviews:40,missions:2};
const GN={cfaHours:'CFA study hours (logged in the tracker)',questions:'Practice questions answered',reviews:'Cards reviewed',missions:'Missions completed'};
function goalsOf(wk){wk=wk||weekKey();if(!state.goals[wk]){const prev=Object.keys(state.goals).sort().pop();state.goals[wk]={t:Object.assign({},GDEF,prev?state.goals[prev].t:{}),items:[]}}const g=state.goals[wk];Object.keys(GDEF).forEach(k=>{if(g.t[k]==null)g.t[k]=GDEF[k]});return g}
function cfaHoursSince(ts){const c=state.cfa||{};return(c.hrs||[]).filter(h=>h[0]>=ts).reduce((a,h)=>a+(+h[1]||0),0)}
function weekProgress(){const ws=weekStart(),g=goalsOf();const L=(state.log||[]).filter(l=>l.t>=ws);const exQ=(state.exams||[]).filter(e=>e.t>=ws).reduce((a,e)=>a+(e.n||0),0);
  return{g,v:{cfaHours:Math.round(cfaHoursSince(ws)*10)/10,questions:qSince(ws)+exQ,reviews:L.filter(l=>l.type==='review').length,missions:L.filter(l=>l.type==='complete').length}}}
function goalBars(w){const keys=Object.keys(GN);const all=keys.every(k=>w.v[k]>=w.g.t[k]);if(all&&!state.badges.goals){state.badges.goals=Date.now();setTimeout(()=>{confetti();toast('✅ '+t('All weekly targets hit!'))},500);save()}
  return keys.map(k=>`<div style="margin:8px 0"><div class="row" style="font-size:.88rem"><span>${t(GN[k])}</span><span class="spacer"></span><b>${w.v[k]} / ${w.g.t[k]}</b></div><div class="prog"><i style="width:${Math.min(100,w.v[k]/Math.max(1,w.g.t[k])*100)}%"></i></div></div>`).join('')+(w.g.items.length?`<small class="muted">${w.g.items.filter(x=>x.done).length}/${w.g.items.length} ${t('personal goals done')}</small>`:'')}
function vGoals(){const w=weekProgress(),g=w.g;
  view().innerHTML=`<a href="#/more" class="note">${t('←')} ${t('More')}</a><h1>${t('Weekly goals')}</h1><p class="note">${t('Week of')} ${dateL(weekStart(),{day:'numeric',month:'long'})}. ${t('Targets carry forward to next week.')} ${t('300 hours over about 26 weeks is roughly 12 hours a week.')}</p>
  <div class="card"><h3>${t('Progress')}</h3>${goalBars(w)}</div>
  <div class="card"><h3>${t('Targets')}</h3><div class="grid g2">${Object.keys(GN).map(k=>`<div><label class="f">${t(GN[k])}</label><input class="tin" type="number" min="0" inputmode="numeric" data-k="${k}" value="${g.t[k]}"></div>`).join('')}</div></div>
  <div class="card"><h3>${t('Personal goals this week')}</h3><p class="note">${t('E.g. "Finish the Fixed Income reading on yield measures", "Do one 90-question mock".')}</p><div id="gl">${g.items.map((x,i)=>`<div class="goal ${x.done?'done':''}"><input type="checkbox" data-i="${i}" ${x.done?'checked':''}><span>${esc(x.t)}</span><button class="sbtn alt sm" data-d="${i}" aria-label="${t('Delete')}">✕</button></div>`).join('')||`<p class="note">${t('No personal goals yet.')}</p>`}</div><div class="ctl"><input class="tin" id="ng" placeholder="${t('Add a goal')}" style="flex:1"><button class="sbtn" id="ag">${t('Add')}</button></div></div>`;
  $$('input[data-k]').forEach(x=>x.onchange=()=>{g.t[x.dataset.k]=Math.max(0,+x.value||0);save();vGoals()});
  $$('#gl input[type=checkbox]').forEach(x=>x.onchange=()=>{g.items[+x.dataset.i].done=x.checked;if(x.checked){addXP(10);logEvent('goal','week',g.items[+x.dataset.i].t)}save();vGoals()});
  $$('#gl [data-d]').forEach(x=>x.onclick=()=>{g.items.splice(+x.dataset.d,1);save();vGoals()});
  const add=()=>{const v=$('#ng').value.trim();if(!v)return;g.items.push({t:v,done:false});save();vGoals()};$('#ag').onclick=add;$('#ng').onkeydown=e=>{if(e.key==='Enter')add()}}

/* ---------- case of the week (MBA cases) ---------- */
function currentCase(){if(!CASES.length)return null;const w=Math.floor((weekStart()-weekStart(Date.UTC(2026,9,12)))/(7*DAY));return CASES[((w%CASES.length)+CASES.length)%CASES.length]}
function vCase(id){const cur=currentCase();const c=id?CASES.find(x=>x.id===id):cur;if(!c){view().innerHTML=`<h1>${t('Case of the week')}</h1><p>${t('No cases yet.')}</p>`;return}const st=state.cow[c.id]||{};
  view().innerHTML=`<div class="row"><div class="eyebrow">${c===cur?t('Case of the week'):t('Case archive')}</div><span class="spacer"></span><select id="arch" class="tin" dir="ltr" style="width:auto;max-width:62vw;padding:6px 8px;font-size:.85rem">${CASES.map(x=>`<option value="${x.id}" ${x===c?'selected':''}>${esc(x.title)}${x===cur?' (this week)':''}${(state.cow[x.id]||{}).done?' ✓':''}</option>`).join('')}</select></div>
  ${EN(`<h1 style="margin-top:8px">${esc(c.title)}</h1><p class="note" style="margin-top:0">${esc(c.byline)}</p>
  <div class="card casebody">${c.body}</div>
  ${c.exhibits.map((e,i)=>`<div class="card"><div class="eyebrow">Exhibit ${i+1}</div><h3 style="margin-top:4px">${e.t}</h3><div class="tablewrap">${e.h}</div>${e.s?`<small class="muted">${e.s}</small>`:''}</div>`).join('')}
  <div class="card"><h2>Discussion questions</h2><p class="note">Write your answer to each, as if preparing for class. Then reveal the teaching note and tick the points you covered.</p><div id="dq"></div></div>`)}`;
  $('#arch').onchange=e=>go('#/case/'+e.target.value);
  const dq=$('#dq');const answers=st.answers||[];const ticks=st.ticks||{};
  dq.innerHTML=c.questions.map((q,i)=>`<div style="margin:14px 0" data-i="${i}"><h3 style="font-family:var(--sans);font-size:1rem">${i+1}. ${q.q}</h3><textarea data-a="${i}" placeholder="Your answer…">${esc(answers[i]||'')}</textarea><div class="ctl"><button class="sbtn alt sm" data-r="${i}">${st.revealed&&st.revealed[i]?'Hide':'Reveal'} teaching note</button></div><div class="model ${st.revealed&&st.revealed[i]?'':'hide'}" id="tn${i}"><b>Teaching note.</b> ${q.note}<div class="rubric" style="margin-top:6px">${q.pts.map((p,j)=>`<label><input type="checkbox" data-t="${i}-${j}" ${ticks[i+'-'+j]?'checked':''}><span>${p}</span></label>`).join('')}</div></div></div>`).join('')+`<div class="ctl"><button class="sbtn gold" id="cfin">${st.done?'Update my score':'Finish the case'}</button><span class="note" id="cmsg">${st.done?'Scored '+Math.round(st.score*100)+'% · '+new Date(st.t).toLocaleDateString('en-GB'):''}</span></div>`;
  const persist=()=>{const s=state.cow[c.id]=state.cow[c.id]||{};s.answers=$$('textarea[data-a]',dq).map(x=>x.value);s.ticks={};$$('input[data-t]',dq).forEach(x=>{if(x.checked)s.ticks[x.dataset.t]=1});save()};
  $$('textarea[data-a]',dq).forEach(x=>x.onchange=persist);$$('input[data-t]',dq).forEach(x=>x.onchange=persist);
  $$('[data-r]',dq).forEach(b=>b.onclick=()=>{const i=+b.dataset.r;const s=state.cow[c.id]=state.cow[c.id]||{};s.revealed=s.revealed||{};if(!(s.answers||[])[i]&&!$(`textarea[data-a="${i}"]`,dq).value.trim()&&!s.revealed[i]){toast('Write your answer first — that is the point of the case method.');return}s.revealed[i]=!s.revealed[i];persist();$('#tn'+i).classList.toggle('hide',!s.revealed[i]);b.textContent=(s.revealed[i]?'Hide':'Reveal')+' teaching note'});
  $('#cfin').onclick=()=>{persist();const s=state.cow[c.id];const tot=c.questions.reduce((a,q)=>a+q.pts.length,0);const got=Object.keys(s.ticks||{}).length;const allAns=c.questions.every((_,i)=>(s.answers[i]||'').trim().length>15);if(!allAns){toast('Answer every question first.');return}const first=!s.done;s.score=got/tot;s.done=true;s.t=Date.now();logEvent('case',c.id,'Case of the week: '+c.title+' ('+Math.round(s.score*100)+'%)');save();if(first){addXP(60);confetti();toast('📘 +60 XP')}$('#cmsg').textContent='Scored '+Math.round(s.score*100)+'%';checkBadges()}}

/* ---------- more, badges, journal ---------- */
function vMore(){view().innerHTML=`<h1>${t('More')}</h1><div class="grid g2">
  ${[['study','target',t('CFA study tracker'),t('Coverage of the 2027 outline, hours, mocks, readiness')],['exam','check',t('Practice simulator'),t('Timed questions weighted by the 2027 topic weights')],['goals','flag',t('Weekly goals'),t('Targets and personal goals for this week')],['badges','award',t('Badges'),t('What you have earned so far')],['journal','pen',t('Reflections'),t('Everything you have written, by mission')],['settings','sliders',t('Settings'),t('Language, theme, sync, backup')]].map(([h,ic,ti,s])=>`<div class="card tcard" onclick="go('#/${h}')"><div class="row"><span class="tile">${ico(ic,22)}</span><div><h3 style="margin:0">${ti}</h3><small class="muted">${s}</small></div></div></div>`).join('')}</div>
  <div class="card"><h3>${t('Sync status')}</h3><p class="note" id="syncStat">${SYNC.url?t('Cloud sync on'):t('Cloud sync is off')}</p></div>`;if(SYNC.url)pullState()}
function vBadges(){view().innerHTML=`<a href="#/more" class="note">${t('←')} ${t('More')}</a><h1>${t('Badges')}</h1><div class="badgegrid">${BADGES.map(([k,e,n])=>`<div class="bdg ${state.badges[k]?'on':''}"><div class="e">${e}</div><small>${t(n)}${state.badges[k]?'<br><span class="muted">'+dateL(state.badges[k])+'</span>':''}</small></div>`).join('')}</div>`}
function vJournal(){const r=reflStore();const ids=Object.keys(r).filter(id=>M[id]).sort((a,b)=>r[b].t-r[a].t);
  view().innerHTML=`<a href="#/more" class="note">${t('←')} ${t('More')}</a><h1>${t('Reflections')}</h1>${ids.map(id=>{const m=M[id];const p=m.reflect||['Most useful idea','Where I will use it','Still unclear'];return EN(`<div class="card"><div class="row"><h3 style="margin:0">${esc(m.title)}</h3><span class="spacer"></span><small class="muted">${new Date(r[id].t).toLocaleDateString('en-GB')}</small></div>${r[id].a.map((a,j)=>a?`<p><b class="muted" style="font-size:.85rem">${esc(p[j]||'')}</b><br>${esc(a)}</p>`:'').join('')}</div>`)}).join('')||`<p class="note">${t('No reflections yet.')}</p>`}`}

/* ---------- settings ---------- */
function linkFor(page){const b=btoa(unescape(encodeURIComponent(JSON.stringify({u:SYNC.url,k:SYNC.key}))));return location.origin+location.pathname.replace(/[^/]*$/,'')+page+'#sync='+b}
function vSettings(){view().innerHTML=`<a href="#/more" class="note">${t('←')} ${t('More')}</a><h1>${t('Settings')}</h1>
  <div class="card"><h3>${t('Language and theme')}</h3><p class="note">${t('The interface can be English or Arabic. Missions, cases and practice questions stay in English, the language of the exam.')}</p><div class="ctl"><button class="sbtn ${LANG==='en'?'':'alt'}" data-lang="en">English</button><button class="sbtn ${LANG==='ar'?'':'alt'}" data-lang="ar">العربية</button><span class="spacer"></span><button class="sbtn alt" id="thm">${t('Switch light / dark')}</button></div></div>
  <div class="card"><h3>${t('Cloud sync')}</h3><p class="note">${t('Progress saves to a Google Sheet so it follows you across phone, tablet and laptop.')}</p><label class="f">${t('Apps Script web-app URL')}</label><input class="tin" id="syncUrl" dir="ltr" value="${esc(SYNC.url)}" placeholder="https://script.google.com/macros/s/…/exec"><label class="f">${t('Secret key')}</label><input class="tin" id="syncKey" dir="ltr" value="${esc(SYNC.key)}"><div class="ctl"><button class="sbtn" id="ssv">${t('Save & sync')}</button><span class="note" id="syncStat">${SYNC.url?t('Cloud sync on'):t('Cloud sync is off')}</span></div>
  ${SYNC.url?`<label class="f">${t('Link for your other devices (opens the app already connected)')}</label><div class="ctl"><input class="tin" readonly id="dl" dir="ltr" value="${linkFor('index.html')}" style="flex:1"><button class="sbtn alt sm" data-c="dl">${t('Copy')}</button></div>`:''}</div>
  <div class="card"><h3>${t('Backup')}</h3><div class="ctl"><button class="sbtn alt" id="exp">${t('Download backup (.json)')}</button><button class="sbtn alt" id="imp">${t('Restore from backup')}</button><input type="file" id="impf" accept="application/json" hidden></div></div>
  <p class="note">Ibrahim's Launchpad · build <span dir="ltr">${BUILD}</span></p>`;
  $$('[data-lang]').forEach(b=>b.onclick=()=>setLang(b.dataset.lang));
  $('#thm').onclick=toggleTheme;$('#ssv').onclick=()=>{saveSyncSettings();setTimeout(vSettings,1200)};
  $$('[data-c]').forEach(b=>b.onclick=()=>{const i=$('#'+b.dataset.c);i.select();try{navigator.clipboard.writeText(i.value)}catch(e){document.execCommand('copy')}toast(t('Link copied'))});
  $('#exp').onclick=()=>{const blob=new Blob([JSON.stringify({state},null,1)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ibrahim-launchpad-backup-'+today()+'.json';a.click()};
  $('#imp').onclick=()=>$('#impf').click();$('#impf').onchange=async e=>{try{const j=JSON.parse(await e.target.files[0].text());if(!j.state)throw 0;state=j.state;ensure();if(j.refl&&!Object.keys(state.refl||{}).length)state.refl=j.refl;save();toast(t('Backup restored'));route()}catch(err){toast(t('That file is not a Launchpad backup'))}}}

/* ---------- small widgets used by labs ---------- */
function numIn(id,label,val,o={}){return`<div><label class="f" for="${id}">${label}</label><input class="tin" type="number" inputmode="decimal" id="${id}" value="${val}" ${o.step?`step="${o.step}"`:'step="any"'} ${o.min!=null?`min="${o.min}"`:''}></div>`}
const V=(id,r=document)=>{const x=$('#'+id,r);return x?parseFloat(x.value)||0:0};
function bars(data,o={}){/* data:[{l,v,c}] */const W=560,H=o.h||220,pad=34,bw=(W-pad*2)/data.length;const mx=Math.max(...data.map(d=>Math.abs(d.v)),1e-9)*1.15;const mn=Math.min(0,...data.map(d=>d.v))*1.15;const y=v=>H-24-(v-mn)/(mx-mn)*(H-40);
  return`<div class="chart" dir="ltr"><svg viewBox="0 0 ${W} ${H}" role="img"><line x1="${pad}" x2="${W-pad}" y1="${y(0)}" y2="${y(0)}" stroke="var(--line)"/>${data.map((d,i)=>{const x=pad+i*bw+bw*.15,h=Math.abs(y(d.v)-y(0));return`<rect x="${x}" y="${Math.min(y(d.v),y(0))}" width="${bw*.7}" height="${Math.max(1,h)}" rx="3" fill="${d.c||'var(--gold2)'}"/><text x="${x+bw*.35}" y="${Math.min(y(d.v),y(0))-5}" text-anchor="middle" style="fill:var(--ink);font-weight:600">${o.f?o.f(d.v):fmt(d.v)}</text><text x="${x+bw*.35}" y="${H-8}" text-anchor="middle">${esc(d.l)}</text>`}).join('')}</svg></div>`}
/* classification drill (moved here from the Engineering lab file; used by Investment Foundations labs) */
function classifyLab(el,done,cfg){let html=`<p class="note">${cfg.intro||''}</p>`+cfg.items.map((it,i)=>`<div style="margin:8px 0"><div style="font-size:.93rem">${it[0]}</div><select class="tin" data-c="${i}" style="margin-top:4px"><option value="">— choose —</option>${cfg.cats.map(c=>`<option>${c}</option>`).join('')}</select></div>`).join('')+`<div class="ctl"><button class="sbtn" id="cc">Check</button></div><div id="cm"></div>`;el.innerHTML=html;
 $('#cc',el).onclick=()=>{let n=0;$$('[data-c]',el).forEach(s=>{const it=cfg.items[+s.dataset.c],g=s.value===it[1];if(g)n++;s.style.borderColor=s.value?g?'var(--ok)':'var(--bad)':'';s.title=it[2]||''});const need=cfg.pass||Math.ceil(cfg.items.length*.75);
  $('#cm',el).innerHTML=`<div class="readout ${n>=need?'ok':''}"><b>${n}/${cfg.items.length}.</b> ${cfg.why}</div>${cfg.items.map(it=>`<div class="note">• ${it[0].replace(/<[^>]+>/g,'').slice(0,60)}… → <b>${it[1]}</b>${it[2]?': '+it[2]:''}</div>`).join('')}`;if(n>=need)done()}}

/* ---------- boot ---------- */
function boot(){applyTheme();applyLang();
  if(location.hash.startsWith('#sync=')){try{const o=JSON.parse(decodeURIComponent(escape(atob(location.hash.slice(6)))));if(o.u){SYNC={url:o.u,key:o.k||''};localStorage.setItem('ilp-sync',JSON.stringify(SYNC))}}catch(e){}history.replaceState(null,'',location.pathname+'#/home')}
  const NAVI={home:'home',tracks:'tracks',review:'review',case:'casebook',more:'more'};$$('#tabs button').forEach(b=>{const s=b.querySelector('span');if(s)s.innerHTML=ico(NAVI[b.dataset.v],22)});$('#themeBtn').onclick=toggleTheme;$('#langBtn').onclick=()=>setLang(LANG==='ar'?'en':'ar');$$('#tabs button').forEach(b=>b.onclick=()=>go('#/'+b.dataset.v));
  addEventListener('hashchange',route);route();renderTop();
  if(SYNC.url){setSyncStatus('busy','');pullState()}else setSyncStatus('off',t('Cloud sync is off'));
  addEventListener('visibilitychange',()=>{if(!document.hidden&&SYNC.url)pullState()})}
