// Mock Apps Script backend for tests (single user). Port 8767, key "test".
const http=require('http');let state=null;const KEY='test';
http.createServer((req,res)=>{const u=new URL(req.url,'http://x');const send=o=>{res.writeHead(200,{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'});res.end(JSON.stringify(o))};
 if(req.method==='GET'){if(u.searchParams.get('key')!==KEY)return send({error:'bad key'});return send({state})}
 let b='';req.on('data',d=>b+=d);req.on('end',()=>{const j=JSON.parse(b);if(j.key!==KEY)return send({error:'bad key'});
  if(j.photo)return send({ok:true,url:'https://drive.example/x'});state=j.state;send({ok:true})})}).listen(8767,()=>console.log('mock backend on 8767'));
