(function(root) {
  'use strict';
  const weights = { no: 0, partial: 1/3, yes: 1 };
  function level(score) { return score == null ? null : score <= .5 + 1e-12 ? 1 : score <= .8 + 1e-12 ? 2 : 3; }
  function dimension(d, answers) {
    const rows = d.questions.map(q => answers[q.id] || {});
    const answered = rows.filter(a => ['no','partial','yes','na'].includes(a.choice)).length;
    const applicable = rows.filter(a => Object.hasOwnProperty.call(weights,a.choice));
    const complete = answered === rows.length;
    const score = complete && applicable.length ? applicable.reduce((s,a)=>s+weights[a.choice],0)/applicable.length : null;
    const evidence = rows.filter(a => a.choice && (a.evidence || '').trim()).length;
    const naMissing = rows.filter(a=>a.choice==='na' && !(a.evidence || '').trim()).length;
    return { id:d.id, name:d.name, group:d.group, total:rows.length, answered, applicable:applicable.length, na:rows.filter(a=>a.choice==='na').length, complete, score, level:level(score), evidence, naMissing };
  }
  function summary(dimensions, state) {
    const selected = dimensions.filter(d => state.selected.includes(d.id));
    const rows = selected.map(d=>dimension(d,state.answers));
    const complete = rows.length>0 && rows.every(d=>d.complete);
    const groups = {};
    rows.filter(d=>d.score!==null).forEach(d=>(groups[d.group] ||= []).push(d.score));
    const pillars = Object.entries(groups).map(([id,values])=>({id,score:values.reduce((a,b)=>a+b,0)/values.length}));
    const score = complete && pillars.length ? pillars.reduce((s,g)=>s+g.score,0)/pillars.length : null;
    return { rows, pillars, complete, score, level:level(score), total:rows.reduce((s,r)=>s+r.total,0), answered:rows.reduce((s,r)=>s+r.answered,0), evidence:rows.reduce((s,r)=>s+r.evidence,0), naMissing:rows.reduce((s,r)=>s+r.naMissing,0) };
  }
  function hours(score,revenue,total=false) {
    if(score==null || revenue==='' || revenue==null || !Number.isFinite(Number(revenue)) || Number(revenue)<0) return null;
    if(score>=.95-1e-12) return {hours:0,shifts:0};
    const micro=Number(revenue)<=360000;
    const values=total?(micro?[172,152,132]:[236,216,196]):(micro?[56,48,40]:[96,88,80]);
    const h=values[level(score)-1]; return {hours:h,shifts:h/4};
  }
  const api={weights,level,dimension,summary,hours};
  if(typeof module!=='undefined') module.exports=api; else root.DiagnosticEngine=api;
})(typeof window!=='undefined'?window:globalThis);
