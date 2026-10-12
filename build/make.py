# Build index.html at the repo root from build/src. Usage: python3 build/make.py v3
import os,re,sys,datetime
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));S=os.path.join(R,'build','src')
rd=lambda f:open(os.path.join(S,f)).read()
ver=sys.argv[1] if len(sys.argv)>1 else 'dev'
order=['core.js','i18n.js','app.js','icons.js']
extra=sorted(f for f in os.listdir(S) if f.endswith('.js') and f not in order)  # track files: labs_*.js, data_*.js, cases_*.js, exam.js, study.js ...
# duplicate top-level names break the single concatenated script: stop the build if any appear
seen={}
for f in order+extra:
  for n in re.findall(r'^(?:const|let|var|function|async function)\s+([A-Za-z_$][\w$]*)',rd(f),re.M):
    seen.setdefault(n,[]).append(f)
dup={n:fs for n,fs in seen.items() if len(fs)>1}
if dup: sys.exit('Duplicate top-level names: '+'; '.join(f'{n} in {", ".join(fs)}' for n,fs in dup.items()))
labkeys={}
for f in extra:
  for k in re.findall(r'^LABS\.([A-Za-z_$][\w$]*)\s*=',rd(f),re.M): labkeys.setdefault(k,[]).append(f)
dl={k:fs for k,fs in labkeys.items() if len(fs)>1}
if dl: sys.exit('Duplicate LABS keys: '+'; '.join(f'{k} in {", ".join(fs)}' for k,fs in dl.items()))
js='\n'.join([rd('core.js'),f"const BUILD='{ver} · {datetime.date.today()}';"]+[rd(f) for f in order[1:]+extra]+['boot();'])
head='''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="Ibrahim">
<meta name="theme-color" content="#0B2545">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="manifest" href="manifest.webmanifest">
<style>html,body{height:100%}body{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}img{max-width:100%}[hidden]{display:none!important}</style>
'''
tail='<script>if("serviceWorker" in navigator){navigator.serviceWorker.register("sw.js").then(r=>{r.update();setInterval(()=>r.update(),60*60*1000)}).catch(()=>{});let rl=false;navigator.serviceWorker.addEventListener("controllerchange",()=>{if(!rl){rl=true;location.reload()}})}</script>\n</body>\n</html>\n'
out=head+"<title>Ibrahim's Launchpad</title>\n<style>\n"+rd('style.css')+"\n</style>\n</head>\n<body>"+rd('body.html')+"\n<script>\n"+js+"\n</script>\n"+tail
open(os.path.join(R,'index.html'),'w').write(out)
p=os.path.join(R,'sw.js');w=open(p).read();w=re.sub(r"ilp-[\w.]+'","ilp-"+ver+"'",w,count=1);open(p,'w').write(w)
import subprocess,tempfile,shutil
if shutil.which('node'):
  with tempfile.NamedTemporaryFile('w',suffix='.js',delete=False) as tf: tf.write(js)
  r=subprocess.run(['node','--check',tf.name],capture_output=True,text=True);os.unlink(tf.name)
  if r.returncode: sys.exit('Syntax error in built script:\n'+r.stderr[:800])
print('built',len(out),'cache',ver)
