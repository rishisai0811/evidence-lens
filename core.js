'use strict';
(function(root){
const FIELDS=['id','run','evidence','decision','correct','group','note'];
function fail(message){throw new Error(message);}
function parseCSV(text){
  const out=[]; let row=[], field='', quoted=false, ended=false;
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(quoted){if(c==='"'){if(text[i+1]==='"'){field+='"';i++;}else{quoted=false;ended=true;}}else field+=c;}
    else if(ended){if(c===','){row.push(field);field='';ended=false;}else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(field);out.push(row);row=[];field='';ended=false;}else fail('Unexpected text after closing CSV quote.');}
    else if(c==='"'){if(field!=='')fail('CSV quote must begin a field.');quoted=true;}
    else if(c===','){row.push(field);field='';}
    else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(field);out.push(row);row=[];field='';}
    else field+=c;
  }
  if(quoted)fail('Unclosed CSV quote.');
  if(field!==''||row.length||ended){row.push(field);out.push(row);}
  return out;
}
function parse(text,format='auto'){
  if(typeof text!=='string')fail('Input must be text.');
  if(new TextEncoder().encode(text).byteLength>20*1024*1024)fail('Input exceeds the 20 MiB text limit.');
  text=text.replace(/^\uFEFF/,'');
  if(!text.trim())fail('Add JSONL or CSV records first.');
  if(format==='auto')format=text.trimStart().startsWith('{')?'jsonl':'csv';
  let rows;
  if(format==='jsonl'){
    const lines=text.split(/\r?\n/).filter(x=>x.trim());
    if(lines.length>50000)fail('At most 50,000 records are supported.');
    rows=lines.map((line,i)=>{try{return JSON.parse(line);}catch{fail('Invalid JSON on non-empty line '+(i+1)+'.');}});
  }else if(format==='csv'){
    const data=parseCSV(text);const header=data.shift()||[];
    if(new Set(header).size!==header.length)fail('CSV headers must be unique.');
    for(const f of ['id','run','evidence','decision'])if(!header.includes(f))fail('CSV is missing header: '+f);
    for(const f of header)if(!FIELDS.includes(f))fail('Unknown CSV header: '+f);
    if(data.length>50000)fail('At most 50,000 records are supported.');
    rows=data.map((cells,i)=>{
      if(cells.length!==header.length)fail('CSV record '+(i+2)+' has '+cells.length+' fields; expected '+header.length+'.');
      const item={};header.forEach((k,j)=>{item[k]=cells[j];});
      if('correct' in item){if(item.correct==='true')item.correct=true;else if(item.correct==='false')item.correct=false;else if(item.correct==='')item.correct=null;else fail('CSV correct must be true, false or empty, record '+(i+2)+'.');}
      return item;
    });
  }else fail('Unknown format.');
  return validate(rows);
}
function validate(rows){
  if(!Array.isArray(rows)||!rows.length)fail('At least one record is required.');
  if(rows.length>50000)fail('At most 50,000 records are supported.');
  const seen=new Map();
  return rows.map((r,i)=>{
    const at='Record '+(i+1)+': ';
    if(!r||typeof r!=='object'||Array.isArray(r))fail(at+'expected an object.');
    for(const f of Object.keys(r))if(!FIELDS.includes(f))fail(at+'unknown field '+f+'.');
    for(const f of ['id','run'])if(typeof r[f]!=='string'||!r[f].trim()||r[f].length>200)fail(at+f+' must be non-empty text, at most 200 characters.');
    if(!['sufficient','insufficient','unknown'].includes(r.evidence))fail(at+'evidence must be sufficient, insufficient or unknown.');
    if(!['answer','abstain','error','truncated'].includes(r.decision))fail(at+'decision must be answer, abstain, error or truncated.');
    if(r.correct!==undefined&&r.correct!==null&&typeof r.correct!=='boolean')fail(at+'correct must be true, false or null.');
    if(r.correct!=null&&(r.evidence!=='sufficient'||r.decision!=='answer'))fail(at+'correct is only allowed for answered cases with sufficient evidence.');
    for(const f of ['group','note'])if(r[f]!==undefined&&(typeof r[f]!=='string'||r[f].length>4000))fail(at+f+' must be text, at most 4,000 characters.');
    let ids=seen.get(r.run);if(!ids){ids=new Set();seen.set(r.run,ids);}if(ids.has(r.id))fail(at+'duplicate id in run '+r.run+'.');ids.add(r.id);
    return {id:r.id,run:r.run,evidence:r.evidence,decision:r.decision,correct:r.correct??null,group:r.group||'(ungrouped)',note:r.note||''};
  });
}
function outcome(r){
  if(r.decision==='error'||r.decision==='truncated')return r.decision;
  if(r.evidence==='unknown')return 'evidence unreviewed';
  if(r.evidence==='insufficient')return r.decision==='answer'?'unsupported answer':'appropriate abstention';
  if(r.decision==='abstain')return 'unnecessary abstention';
  return r.correct===null?'answer quality unreviewed':r.correct?'supported correct answer':'supported wrong answer';
}
function rate(n,d){return {numerator:n,denominator:d,value:d?n/d:null};}
function summarize(rows){
  const count={total:rows.length,sufficient:0,insufficient:0,unknown:0,answer:0,abstain:0,error:0,truncated:0};const outcomes={};
  let knownCompleted=0,knownAnswered=0,unsupported=0,unnecessary=0,insufficientCompleted=0,sufficientCompleted=0,judged=0,correct=0,unjudged=0;
  for(const r of rows){count[r.evidence]++;count[r.decision]++;const o=outcome(r);outcomes[o]=(outcomes[o]||0)+1;
    if(r.decision==='error'||r.decision==='truncated')continue;
    if(r.evidence!=='unknown'){knownCompleted++;if(r.decision==='answer')knownAnswered++;}
    if(r.evidence==='insufficient'){insufficientCompleted++;if(r.decision==='answer')unsupported++;}
    if(r.evidence==='sufficient'){sufficientCompleted++;if(r.decision==='abstain')unnecessary++;else if(r.correct===null)unjudged++;else{judged++;if(r.correct)correct++;}}
  }
  return {count,outcomes,rates:{unsupported:rate(unsupported,insufficientCompleted),unnecessary:rate(unnecessary,sufficientCompleted),answerAccuracy:rate(correct,judged),coverage:rate(knownAnswered,knownCompleted),completion:rate(count.answer+count.abstain,rows.length),usefulYield:rate(correct,count.sufficient),missingQuality:rate(unjudged,sufficientCompleted-unnecessary)},notes:{qualityUnreviewed:unjudged,evidenceUnreviewed:count.unknown,excludedExecution:count.error+count.truncated}};
}
function analyze(rows){
  rows=validate(rows);const runs=new Map();
  for(const r of rows){if(!runs.has(r.run))runs.set(r.run,[]);runs.get(r.run).push(r);}
  return {schema_version:1,records:rows.length,runs:Array.from(runs,([name,rs])=>{const groups=new Map();for(const r of rs){if(!groups.has(r.group))groups.set(r.group,[]);groups.get(r.group).push(r);}return {name,...summarize(rs),groups:Array.from(groups,([name,items])=>({name,...summarize(items)}))};})};
}
function compare(rows,a,b){
  if(a===b)fail('Choose different runs.');
  const left=new Map(rows.filter(r=>r.run===a).map(r=>[r.id,r]));const right=new Map(rows.filter(r=>r.run===b).map(r=>[r.id,r]));
  if(!left.size||!right.size)fail('Both comparison runs must exist.');
  const matched=[],conflicts=[],onlyLeft=[],onlyRight=[];
  for(const [id,l]of left){const r=right.get(id);if(!r){onlyLeft.push(id);continue;}if(l.evidence!==r.evidence||l.group!==r.group){conflicts.push(id);continue;}matched.push({id,from:outcome(l),to:outcome(r),changed:outcome(l)!==outcome(r)});}
  for(const id of right.keys())if(!left.has(id))onlyRight.push(id);
  const ids=new Set(matched.map(r=>r.id));
  return {from:a,to:b,matched:matched.length,changed:matched.filter(r=>r.changed).length,conflicts,onlyLeft,onlyRight,transitions:matched,fromSummary:summarize([...left.values()].filter(r=>ids.has(r.id))),toSummary:summarize([...right.values()].filter(r=>ids.has(r.id)))};
}
function toCSV(rows){return FIELDS.join(',')+'\r\n'+rows.map(r=>FIELDS.map(k=>{const s=r[k]===null||r[k]===undefined?'':String(r[k]);return /[",\r\n]/.test(s)?'"'+s.replaceAll('"','""')+'"':s;}).join(',')).join('\r\n');}
function demo(){
  const rows=[];
  for(const run of ['Always answers','Always abstains','Balanced preview'])for(let i=1;i<=12;i++){
    const sufficient=i<=8;const decision=run==='Always answers'?'answer':run==='Always abstains'?'abstain':i===12?'error':i===8||i>=10?'abstain':'answer';
    rows.push({id:'case-'+i,run,evidence:sufficient?'sufficient':'insufficient',decision,correct:sufficient&&decision==='answer'?i!==7:null,group:i%2?'Photo A':'Photo B',note:'Synthetic example, not measured model performance.'});
  }
  return rows;
}
const api={parseCSV,parse,validate,outcome,rate,summarize,analyze,compare,toCSV,demo};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.EvidenceLens=api;
})(typeof globalThis==='undefined'?this:globalThis);
