(function(root){
  'use strict';
  const names={1:'Gestão informal',2:'Gestão organizada',3:'Gestão madura'};
  const descriptions={1:'Processos pouco definidos e controles pontuais. Priorize a organização das rotinas e das informações para decidir.',2:'Processos definidos e controles em evolução. Priorize formalização, acompanhamento de indicadores e uso das informações.',3:'Processos estruturados e acompanhados por indicadores. Sustente as práticas de gestão e aprofunde a melhoria contínua.'};
  function outcome(s){return s.score!==null?{title:'Nível '+s.level+' — '+names[s.level],description:descriptions[s.level]}:{title:s.complete?'Sem classificação de gestão':'Diagnóstico incompleto',description:s.complete?'Todas as questões selecionadas são não aplicáveis. Não há base para atribuir um nível de gestão.':s.total?'Responda às '+(s.total-s.answered)+' perguntas pendentes para conhecer o nível de gestão no escopo selecionado.':'Selecione pelo menos uma área e preencha o formulário para conhecer o nível de gestão.'}}
  async function build(state,dimensions,engine,lib){
    const {PDFDocument,StandardFonts,rgb}=lib;
    const doc=await PDFDocument.create();doc.setTitle('Diagnóstico 360 - '+(state.meta.company||'Maturidade empresarial'));doc.setAuthor(state.meta.assessor||'Diagnóstico 360');doc.setLanguage('pt-BR');doc.setCreator('Diagnóstico 360');
    const regular=await doc.embedFont(StandardFonts.Helvetica),bold=await doc.embedFont(StandardFonts.HelveticaBold);
    const ink=rgb(.09,.18,.29),muted=rgb(.34,.42,.51),navy=rgb(.094,.227,.392),purple=rgb(.44,.32,.77),line=rgb(.85,.89,.93),paper=rgb(.95,.96,.98);
    const W=595.28,H=841.89,M=42,CW=W-2*M;let page,y;let unicodeEscaped=false;
    const safe=v=>Array.from(String(v??'').normalize('NFC').replace(/\r\n?/g,'\n').replace(/\t/g,'    ').replace(/⅓/g,'1/3').replace(/[\u2010-\u2015]/g,'-')).map(c=>{if(c==='\n')return c;try{regular.encodeText(c);return c}catch(e){unicodeEscaped=true;return '[U+'+c.codePointAt(0).toString(16).toUpperCase()+']'}}).join('');
    const fmt=v=>v==null?'Sem nota':new Intl.NumberFormat('pt-BR',{style:'percent',maximumFractionDigits:1}).format(v);
    const date=v=>v?new Date(v).toLocaleString('pt-BR'):'Não registrada';
    function newPage(){page=doc.addPage([W,H]);y=H-M;page.drawText('DIAGNÓSTICO 360  /  GESTÃO EMPRESARIAL',{x:M,y:y-9,size:8,font:bold,color:purple});y-=30}
    function ensure(h){if(y-h<50)newPage()}
    function wrap(value,font,size,width){const lines=[];for(const paragraph of safe(value).split('\n')){let current='';for(const word of paragraph.split(/ +/)){if(!word)continue;const attempt=current?current+' '+word:word;if(font.widthOfTextAtSize(attempt,size)<=width){current=attempt;continue}if(current){lines.push(current);current=''}for(const ch of word){if(font.widthOfTextAtSize(current+ch,size)>width){lines.push(current);current=''}current+=ch}}lines.push(current)}return lines}
    function text(value,{size=10,font=regular,color=ink,width=CW,x=M,gap=6}={}){const lines=wrap(value,font,size,width),lh=size*1.42;for(const l of lines){ensure(lh);if(l)page.drawText(l,{x,y:y-size,size,font,color});y-=lh}y-=gap;return lines.length*lh+gap}
    function title(value){ensure(45);y-=8;text(value,{size:14,font:bold,color:navy,gap:12})}
    function rule(){ensure(12);page.drawLine({start:{x:M,y},end:{x:W-M,y},thickness:.6,color:line});y-=12}
    newPage();text('Relatório de maturidade empresarial',{size:22,font:bold,gap:12});text(state.meta.company||'Empresa não identificada',{size:15,font:bold});text('Diagnóstico '+state.id+'  |  Método '+state.methodVersion,{size:8,color:muted});
    text('Data da avaliação: '+(state.meta.date||'Não informada')+'  |  Emissão: '+date(new Date().toISOString()),{size:9,color:muted});
    const s=engine.summary(dimensions,state),result=outcome(s);
    const bandHeight=s.score===null?120:134;ensure(bandHeight+12);page.drawRectangle({x:M,y:y-bandHeight,width:CW,height:bandHeight,color:navy});const top=y;y-=14;
    text('RESULTADO DO NÍVEL DE GESTÃO',{x:M+16,width:CW-32,size:9,font:bold,color:rgb(.83,.88,.96),gap:7});
    text(result.title,{x:M+16,width:CW-32,size:s.score===null?20:23,font:bold,color:rgb(1,1,1),gap:5});
    if(s.score!==null)text('Maturidade: '+fmt(s.score)+'  |  '+(state.selected.length===dimensions.length?'Avaliação de todas as áreas':'Avaliação de '+state.selected.length+' área(s) selecionada(s)'),{x:M+16,width:CW-32,size:11,color:rgb(1,1,1),gap:5});
    text(result.description,{x:M+16,width:CW-32,size:9,color:rgb(.88,.92,.98),gap:0});y=top-bandHeight-18;
    text('Avaliador: '+(state.meta.assessor||'Não identificado'));text('Entrevistado / cargo: '+(state.meta.respondent||'Não identificado'));
    text('Faturamento anual: '+(state.meta.revenue===''?'Não informado':new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(state.meta.revenue))));
    if(state.meta.context)text('Contexto e limites: '+state.meta.context);
    text('Preenchimento: '+s.answered+'/'+s.total+' respostas. Evidências: '+s.evidence+'/'+s.answered+'. Justificativas de não aplicabilidade pendentes: '+s.naMissing+'.',{size:10,font:bold});
    text('Escopo: '+s.rows.map(r=>r.name).join('; ')+'.',{size:9});
    if(s.evidence<s.answered)text('Há respostas sem evidências registradas. O nível expressa as respostas declaradas e precisa ser interpretado com essas limitações.',{size:9,color:muted});
    title('Como interpretar o nível de gestão');
    for(const [n,label] of Object.entries(names))text('Nível '+n+' - '+label+': '+({1:'até 50%.',2:'acima de 50% até 80%.',3:'acima de 80%.'}[n]),{size:10,font:s.level==n?bold:regular});
    text('O resultado considera apenas o escopo selecionado. As áreas não aplicáveis são excluídas. Escopos diferentes não são diretamente comparáveis.',{size:9,color:muted});
    newPage();title('Resultados por área');
    const cols=[M,M+216,M+278,M+345];
    function tableHeader(){page.drawRectangle({x:M,y:y-23,width:CW,height:23,color:paper});['Área','Respostas','Nota','Nível de gestão'].forEach((t,i)=>page.drawText(t,{x:cols[i]+5,y:y-15,size:8,font:bold,color:ink}));y-=29}
    tableHeader();for(const r of s.rows){const lines=wrap(r.name,bold,9,206);const h=Math.max(26,lines.length*13+10);if(y-h<55){newPage();tableHeader()}lines.forEach((t,i)=>page.drawText(t,{x:M+5,y:y-10-i*13,size:9,font:bold,color:ink}));page.drawText(r.answered+'/'+r.total,{x:cols[1]+5,y:y-10,size:9,font:regular,color:ink});page.drawText(fmt(r.score),{x:cols[2]+5,y:y-10,size:9,font:regular,color:ink});const label=r.score===null?(r.complete?'Não aplicável':'Pendente'):'Nível '+r.level+' - '+names[r.level];wrap(label,regular,8,160).forEach((t,i)=>page.drawText(t,{x:cols[3]+5,y:y-10-i*12,size:8,font:regular,color:ink}));y-=h;rule()}
    ensure(62+s.rows.length*37);title('Gráfico de barras');
    for(const r of s.rows){ensure(34);text(r.name,{size:9,gap:2});const by=y-9;page.drawRectangle({x:M,y:by,width:430,height:7,color:paper});if(r.score!==null&&r.score>0)page.drawRectangle({x:M,y:by,width:430*r.score,height:7,color:r.id==='INO'?rgb(.16,.44,.56):purple});page.drawText(r.score===null?(r.complete?'N/A':'Pendente'):fmt(r.score),{x:M+440,y:by,size:8,font:regular,color:muted});y-=21}
    text('Escala: 0% a 100%. Pendente e não aplicável não representam nota zero.',{size:8,color:muted});
    newPage();title('Radar de maturidade');text('As mesmas áreas e notas do gráfico de barras.',{size:9,color:muted});
    const rows=s.rows,n=rows.length,cx=W/2,cy=y-180,rad=132;
    const pt=(i,v)=>({x:cx+Math.sin(i*2*Math.PI/n)*rad*v,y:cy+Math.cos(i*2*Math.PI/n)*rad*v});
    if(n){for(const t of [.25,.5,.8,1]){if(n>=3)rows.forEach((r,i)=>page.drawLine({start:pt(i,t),end:pt((i+1)%n,t),thickness:.7,color:line}));else page.drawCircle({x:cx,y:cy,size:rad*t,borderColor:line,borderWidth:.7});page.drawText(Math.round(t*100)+'%',{x:cx+5,y:cy+rad*t-11,size:7,font:regular,color:muted})}rows.forEach((r,i)=>{page.drawLine({start:{x:cx,y:cy},end:pt(i,1),color:line,thickness:.7});const p=pt(i,1.2);const short={EST:'Estratégia',FIN:'Financeiro',MKT:'Marketing',PRO:'Produção',COM:'Compras / estoques',DIS:'Distribuição',QUA:'Qualidade',PES:'Pessoas',INO:'Inovação'}[r.id];page.drawText(short,{x:p.x-regular.widthOfTextAtSize(short,9)/2,y:p.y-4,size:9,font:regular,color:ink});if(r.score!==null){const at=pt(i,r.score);page.drawCircle({x:at.x,y:at.y,size:3,color:purple});const next=rows[(i+1)%n];if(n>1&&next.score!==null)page.drawLine({start:at,end:pt((i+1)%n,next.score),thickness:2,color:purple})}})}
    y=cy-rad-55;text(n?'Pontos representam somente áreas concluídas e aplicáveis. Escala de 0% a 100%.':'Nenhuma área selecionada.',{size:9,color:muted});
    title('Critérios de cálculo');text('Sim = 1 ponto; Parcial = 1/3 de ponto; Não = 0. Não se aplica sai do denominador. Questões em branco impedem a classificação final. Uma área inteiramente não aplicável não recebe zero.');text('Operações é a média das áreas de Produção, Compras e estoques e Distribuição selecionadas e aplicáveis. A nota geral é a média dos pilares aplicáveis, com Inovação como pilar independente.');
    title('Estimativa de consultoria');
    const original=dimensions.filter(d=>d.id!=='INO'),legacy=engine.summary(original,{...state,selected:original.map(d=>d.id)});const h=original.every(d=>state.selected.includes(d.id))?engine.hours(legacy.score,state.meta.revenue,true):null;
    text('Pacote completo original: '+(h?h.hours+' horas / '+h.shifts+' turnos de 4 horas.':'não estimado. Exige as oito áreas originais completas e faturamento informado.'));
    for(const [group,label] of [['finance','Financeiro'],['marketing','Marketing'],['people','Pessoas'],['operations','Operações']]){const ds=dimensions.filter(d=>d.group===group),rs=ds.map(d=>engine.dimension(d,state.answers)),valid=rs.filter(r=>r.score!==null);const score=ds.every(d=>state.selected.includes(d.id))&&rs.every(r=>r.complete)&&valid.length?valid.reduce((v,r)=>v+r.score,0)/valid.length:null;const item=engine.hours(score,state.meta.revenue);text(label+': '+(item?item.hours+' horas / '+item.shifts+' turnos.':'não estimado.'),{size:9})}
    text('As horas seguem as tabelas originais, sem carga adicional inventada para Inovação. Pacotes individuais são alternativas ao completo, não parcelas somáveis. A classificação de gestão vem da pontuação, nunca das horas.',{size:9,color:muted});
    for(const d of dimensions.filter(d=>state.selected.includes(d.id))){newPage();title(d.name);for(const q of d.questions){const a=state.answers[q.id]||{};
      const blocks=[
        [q.id+' - '+q.text,{size:11,font:bold,gap:8}],
        ['Resposta: '+({yes:'Sim',no:'Não',partial:'Parcial',na:'Não se aplica'}[a.choice]||'Pendente'),{size:10,font:bold}],
        ['Evidências / justificativa: '+(a.evidence||'Não registrada'),{}],
        ['Fonte: '+(a.source||'Não registrada'),{}],
        ['Responsável pela informação: '+(a.owner||'Não informado'),{}],
        ['Observações: '+(a.notes||'Não registradas'),{}],
        ['Origem: '+q.source,{size:8,color:muted}],
        ['Última alteração: '+date(a.updatedAt)+' | '+(a.updatedBy||'Não informado'),{size:8,color:muted}]
      ];
      const height=blocks.reduce((sum,[v,o])=>sum+wrap(v,o.font||regular,o.size||10,CW).length*(o.size||10)*1.42+(o.gap??6),12);
      ensure(height<700?height:140);for(const [v,o] of blocks)text(v,o);rule()
    }}
    title('Rastreabilidade e conservação');text(state.history.length+' alterações registradas no diagnóstico. O arquivo JSON conserva o histórico completo, com valores anteriores e atuais. Os autores são declarados, sem autenticação. Guarde o PDF junto ao arquivo de diagnóstico.',{size:9});
    if(unicodeEscaped)text('Caracteres fora do conjunto tipográfico do PDF foram representados por seu código Unicode [U+...]. O texto original permanece no arquivo JSON.',{size:8,color:muted});
    const pages=doc.getPages();pages.forEach((p,i)=>{p.drawLine({start:{x:M,y:36},end:{x:W-M,y:36},thickness:.5,color:line});p.drawText('Diagnóstico 360 | '+safe(state.id).slice(0,48),{x:M,y:23,size:7,font:regular,color:muted});p.drawText((i+1)+' / '+pages.length,{x:W-M-35,y:23,size:8,font:regular,color:muted})});
    return doc.save();
  }
  const api={build,outcome};if(typeof module!=='undefined')module.exports=api;else root.DiagnosticPDF=api;
})(typeof window!=='undefined'?window:globalThis);
