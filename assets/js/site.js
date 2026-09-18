(function(){
  const btn = document.querySelector('.menu-toggle');
  const menu = document.getElementById('main-nav');
  if (!btn || !menu) return;

  function setOpen(open){
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    const icon = btn.querySelector('span');
    if (icon) icon.textContent = open ? '×' : '☰';
  }

  btn.addEventListener('click', function(e){
    e.stopPropagation();
    setOpen(!menu.classList.contains('open'));
  });

  menu.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', function(){ setOpen(false); });
  });

  document.addEventListener('click', function(e){
    if (!menu.contains(e.target) && !btn.contains(e.target)) setOpen(false);
  });

  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') setOpen(false);
  });

  window.addEventListener('resize', function(){
    if (window.innerWidth > 900) setOpen(false);
  });
})();

(function(){
  const openBtn = document.querySelector('.poc-image-button');
  const box = document.getElementById('chart-lightbox');
  const closeBtn = box ? box.querySelector('.chart-lightbox-close') : null;
  if (!openBtn || !box || !closeBtn) return;

  let previousFocus = null;

  function openBox(){
    previousFocus = document.activeElement;
    box.hidden = false;
    box.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeBox(){
    box.hidden = true;
    box.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    if (previousFocus) previousFocus.focus();
  }

  openBtn.addEventListener('click', openBox);
  closeBtn.addEventListener('click', closeBox);

  box.addEventListener('click', function(e){
    if (e.target === box) closeBox();
  });

  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && !box.hidden) closeBox();
  });
})();

(function(){
  const cases={
    science:{
      question:"Does Compound Q produce a real survival benefit, or are the positive results better explained by methodology or measurement artifacts?",
      hypotheses:["Compound Q has a real survival benefit, conditional on protocol, exposure, and dose.","Compound Q has no reliable survival benefit; positive findings are methodological or measurement artifacts."],
      evidence:[["Study A","Improved cell survival after stress exposure."],["Study B","No improvement under its protocol."],["Replication Lab","Independent lab observed improvement."],["Methods Review","Study B used a shorter exposure period."],["Assay Audit","Study B measurement reliability was challenged."],["Dose Analysis","Improvement was strongest at higher doses."]],
      state:"leading unresolved",status:"Leading, not resolved: H1",
      metrics:[{name:"H1 · Real conditional benefit",support:98,contradiction:29,independent:3},{name:"H2 · No reliable benefit",support:29,contradiction:92,independent:1}],
      distinction:["Matched independent replication","Repeat the effect test in an independent lab under matched protocol, exposure, and dose conditions."],
      anomalies:["H1 contested","H2 contested","observer disagreement","formation closure unverified"]
    },
    investing:{
      question:"Is the company's growth economically durable, or is the headline growth real but fragile because concentration and competitive pressure threaten durability?",
      hypotheses:["The company's growth is economically durable.","Headline growth is real but fragile because concentration and competitive pressure threaten durability."],
      evidence:[["Quarterly Report","Revenue growth accelerated to 24%."],["Management","Growth thesis is strengthening."],["Bear Analyst","Customer concentration weakens the thesis."],["Cash Flow Statement","Free cash flow turned positive."],["Customer Data","Largest customer is 41% of revenue."],["Competitor Report","A major competitor cut prices 18%."]],
      state:"plural unresolved",status:"No unique leader",
      metrics:[{name:"H1 · Durable growth",support:74,contradiction:94,independent:1},{name:"H2 · Fragile concentrated growth",support:96,contradiction:23,independent:3}],
      distinction:["Customer concentration","Measure renewal, expansion, and churn behavior of the largest customer versus the rest of the customer base."],
      anomalies:["H1 contested","H2 contested","formation closure unverified"]
    },
    investigation:{
      question:"Did the subject enter through the east entrance around 9:10, or is the east-entrance identification wrong and the subject was elsewhere?",
      hypotheses:["The subject entered the east entrance around 9:10.","The east-entrance identification is wrong or belongs to someone else; the subject was elsewhere."],
      evidence:[["Witness A","Reported the subject at the east entrance."],["Camera","Shows a person matching the subject at 9:08."],["Witness B","Did not see the subject at the east entrance."],["Phone GPS","Placed the subject 12 miles away."],["Access System","Badge opened the west entrance at 9:12."],["Witness A follow-up","Later reduced confidence in identity and timing."]],
      state:"leading unresolved",status:"Leading, not resolved: H2",
      metrics:[{name:"H1 · East entrance",support:77,contradiction:96,independent:2},{name:"H2 · Identification wrong / elsewhere",support:96,contradiction:67,independent:3}],
      distinction:["Identity / location","Obtain an independent identity-grade image or biometric comparison from the east-entrance camera rather than another recollection."],
      anomalies:["H1 contested","H2 contested","witness reliability challenge","observer disagreement","formation closure unverified"]
    }
  };

  let current="science";
  const byId=id=>document.getElementById(id);
  function metricCard(x){
    return '<div class="ran-demo-metric"><b>'+x.name+'</b>'+
      '<div class="ran-demo-row"><span>Support</span><span>'+x.support+'%</span></div>'+
      '<div class="ran-demo-bar"><i style="width:'+x.support+'%"></i></div>'+
      '<div class="ran-demo-row"><span>Contradiction</span><span>'+x.contradiction+'%</span></div>'+
      '<div class="ran-demo-bar red"><i style="width:'+x.contradiction+'%"></i></div>'+
      '<div class="ran-demo-row"><span>Independent confirmations</span><span>'+x.independent+'</span></div></div>';
  }
  function renderInput(){
    const c=cases[current];
    byId("ranDemoQuestion").textContent=c.question;
    byId("ranDemoHypotheses").innerHTML=c.hypotheses.map((x,i)=>'<div class="ran-demo-hyp"><b>H'+(i+1)+'</b>'+x+'</div>').join("");
    byId("ranDemoEvidence").innerHTML=c.evidence.slice(0,4).map(x=>'<div class="ran-demo-evidence"><span>'+x[0]+'</span> — '+x[1]+'</div>').join("")+
      '<div class="ran-demo-hint">+ '+Math.max(0,c.evidence.length-4)+' additional evidence items in this controlled case</div>';
    byId("ranDemoState").textContent="Ready to analyze";
    byId("ranDemoStatus").textContent="Choose “Analyze demonstration case.”";
    byId("ranDemoMetrics").style.opacity=.25;
    byId("ranDemoMetrics").innerHTML=c.metrics.map(metricCard).join("");
    byId("ranDemoDistinction").style.display="none";
    byId("ranDemoAnomalies").innerHTML="";
  }
  document.querySelectorAll("[data-ran-case]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll("[data-ran-case]").forEach(x=>x.classList.remove("active"));
      btn.classList.add("active");
      current=btn.getAttribute("data-ran-case");
      renderInput();
    });
  });
  const analyze=byId("ranDemoAnalyze");
  if(analyze){
    analyze.addEventListener("click",()=>{
      const c=cases[current];
      byId("ranDemoState").textContent=c.state;
      byId("ranDemoStatus").textContent=c.status;
      byId("ranDemoMetrics").style.opacity=1;
      byId("ranDemoMetrics").innerHTML=c.metrics.map(metricCard).join("");
      byId("ranDemoDistinction").innerHTML='<small>Next distinction to seek</small><strong>'+c.distinction[0]+'</strong><div style="margin-top:5px;color:#c5d0de">'+c.distinction[1]+'</div>';
      byId("ranDemoDistinction").style.display="block";
      byId("ranDemoAnomalies").innerHTML=c.anomalies.map(x=>'<span class="ran-demo-anomaly">'+x+'</span>').join("");
    });
  }
  renderInput();
})();
