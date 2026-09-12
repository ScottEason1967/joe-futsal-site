/* Shared rich "Pride DNA" pop-up — used by the homepage house and the pivot page.
   Each competency's video lives here once; triggers just carry data-dna="<key>". */
(function(){
  var EF_LOGO='img/ENG_FUTSAL_HORIZONTAL_RED-e1668661165486-768x362.webp';
  var DNA_DATA={
    'constant-threat':{group:'Pride DNA · Pivot Role',name:'Constant Threat',pride:'Possess a constant threat through receiving, turning and shooting in the final third.',video:'uVhn9-6P8X8',anchor:'pivot.html#p2',quotes:[
      {t:'Positive 1v1 dribbling and finishing ability.',a:'Tony Loftus · Team Sunderland Head Coach'},
      {t:'He is a threat with the ball, can pick a hard pass, play through the lines, and judges his attacking runs well.',a:'David Banjura · Former National League Chief Scout'}]},
    'retains-under-pressure':{group:'Pride DNA · Pivot Role',name:'Retains Under Pressure',pride:'Effectively retains possession under pressure.',video:'zmRC5aI2NDM',anchor:'pivot.html#p3',quotes:[
      {t:'He is very rarely flustered when under pressure and is able to turn away from defenders, protecting the ball, with great ease.',a:'Mark Hodgson · Brazilian Soccer Schools'},
      {t:'Confident to receive under pressure. Showed a high level of responsibility.',a:'Richard Eyley · Scout, Sheffield United FC'}]},
    'first-line-press':{group:'Pride DNA · Pivot Role',name:'First-Line Press',pride:'Demonstrates athleticism and an understanding to press effectively at the first line.',video:'eCp5T_w2wy0',anchor:'pivot.html#p4',quotes:[
      {t:'In defence, he defends at a high intensity, not allowing his man any time on the ball, and is rarely caught out of position in turnovers.',a:'Tom Thorogood · Red House School'},
      {t:'He works hard week in, week out, always giving 100%. I never have to encourage him to work hard.',a:'Lee Moore MSc ASCC · PROformance'}]},
    'technical-excellence':{group:'Pride DNA · Pillar',name:'Technical Excellence',pride:'Skilfully adaptable under pressure.',video:'aKdNUCQ0Z8k',anchor:'pivot.html#p6',quotes:[
      {t:'Joe has a lovely feel for the ball — he can manipulate it easily and freely between both feet and perform technical actions to a high, game-realistic level.',a:'Danny Fowler · UEFA A, Middlesbrough Academy'},
      {t:'Superb with both right and left foot in terms of close ball control, first touch and short passing.',a:'Mark Hodgson · Brazilian Soccer Schools'}]},
    'athletic-dominance':{group:'Pride DNA · Pillar',name:'Athletic Dominance',pride:'Efficient and effective mover.',video:'wYYt72EmyF0',anchor:'pivot.html#p1',quotes:[
      {t:"Physically he is, for want of a better term, 'a machine' — with strength, pace, power and stamina to boot.",a:'Danny Fowler · UEFA A, Middlesbrough Academy'},
      {t:'He has developed into an extremely quick, strong and physical athlete who can dominate physically due to his height, pace and strength.',a:'Mark Hodgson · Brazilian Soccer Schools'}]},
    'game-sense':{group:'Pride DNA · Pillar',name:'Game Sense',pride:'Understand space & time.',video:'82mNUxfOenM',anchor:'pivot.html#p5',quotes:[
      {t:'He plays with his head up and scans the pitch both with and without the ball, which allows him to take up excellent positions and make good decisions.',a:'Mark Hodgson · Brazilian Soccer Schools'},
      {t:'He reads the game well, winning 50/50s and interceptions, and repositions well to help progress the attack.',a:'Tom Thorogood · Red House School'}]},
    'emotional-intelligence':{group:'Pride DNA · Pillar',name:'Emotional Intelligence',pride:'Psychologically robust & emotionally intelligent within the Pride environment.',video:null,anchor:'pivot.html#coach',quotes:[
      {t:'I have never met anyone as determined as Joe in terms of mindset and wanting to achieve at something. He is like a sponge.',a:'Lee Moore MSc ASCC · PROformance'},
      {t:'Despite carrying an injury and an early heavy scoreline, Joe showed no signs of frustration or blaming teammates — encouraging and praising them throughout.',a:'Jack Manship · Scout, Doncaster Rovers'}]}
  };
  var css='.dnam-backdrop{position:fixed;inset:0;z-index:1000;background:rgba(0,16,38,.9);backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;padding:4vh 3vw;opacity:0;transition:opacity .2s}'
    +'.dnam-backdrop.open{display:flex;opacity:1}'
    +'.dnam-box{width:100%;max-width:900px;max-height:92vh;background:#0a1f45;border:1px solid rgba(255,255,255,.12);border-radius:16px;box-shadow:0 24px 80px rgba(0,0,0,.6);position:relative;transform:scale(.95);transition:transform .25s}'
    +'.dnam-backdrop.open .dnam-box{transform:scale(1)}'
    +'.dnam-scroll{max-height:92vh;overflow-y:auto;padding:26px 30px 30px}'
    +'.dnam-close{position:absolute;top:12px;right:14px;z-index:3;width:40px;height:40px;border:none;border-radius:50%;background:rgba(255,255,255,.14);color:#fff;font-size:22px;cursor:pointer;line-height:1}'
    +'.dnam-close:hover{background:var(--amber);color:var(--blue-deep)}'
    +'.dnam-eyebrow{font-size:11px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;color:var(--amber)}'
    +'.dnam-head h3{font-family:var(--font-display);font-size:1.9rem;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:.4px;line-height:1.05;margin:4px 0 16px}'
    +'.dnam-pride{display:flex;align-items:center;gap:16px;background:linear-gradient(135deg,var(--red),#a50e1f);border-radius:10px;padding:14px 18px;margin-bottom:18px}'
    +'.dnam-pride img{width:78px;height:auto;flex-shrink:0;background:#fff;border-radius:6px;padding:5px 7px}'
    +'.dnam-pride p{margin:0;color:#fff;font-style:italic;font-size:1rem;line-height:1.4;font-weight:500}'
    +'.dnam-video{position:relative;aspect-ratio:16/9;background:#000;border-radius:12px;overflow:hidden;margin-bottom:18px}'
    +'.dnam-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}'
    +'.dnam-novideo{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:16px 18px;color:rgba(255,255,255,.85);font-size:.9rem;margin-bottom:18px}'
    +'.dnam-novideo i{color:var(--amber);margin-right:8px}'
    +'.dnam-quotes{display:grid;gap:10px;margin-bottom:16px}'
    +'.dnam-q{background:rgba(255,255,255,.05);border-left:3px solid var(--amber);border-radius:8px;padding:13px 16px}'
    +'.dnam-q p{margin:0 0 6px;color:rgba(255,255,255,.92);font-style:italic;font-size:.9rem;line-height:1.5}'
    +'.dnam-q span{font-size:11px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;color:rgba(255,255,255,.6)}'
    +'.dnam-more{display:inline-block;font-weight:800;font-size:12.5px;letter-spacing:.5px;text-transform:uppercase;color:var(--amber);text-decoration:none}'
    +'.dnam-more:hover{text-decoration:underline}'
    +'body.dnam-lock{overflow:hidden}'
    +'@media(max-width:600px){.dnam-scroll{padding:20px 18px 24px}.dnam-pride{flex-direction:column;align-items:flex-start;gap:10px}.dnam-head h3{font-size:1.5rem}}';
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
  var el=null;
  function render(d){
    var vid = d.video
      ? '<div class="dnam-video"><iframe src="https://www.youtube-nocookie.com/embed/'+d.video+'?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="'+d.name+' highlights" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>'
      : '<div class="dnam-novideo"><i class="fas fa-comments"></i>Shown in coach &amp; scout testimony — not on film.</div>';
    var quotes = d.quotes.map(function(q){return '<div class="dnam-q"><p>&ldquo;'+q.t+'&rdquo;</p><span>'+q.a+'</span></div>';}).join('');
    return '<button class="dnam-close" type="button" aria-label="Close">&times;</button>'
      +'<div class="dnam-scroll"><div class="dnam-head"><span class="dnam-eyebrow">'+d.group+'</span><h3>'+d.name+'</h3></div>'
      +'<div class="dnam-pride"><img src="'+EF_LOGO+'" alt="England Futsal"><p>&ldquo;'+d.pride+'&rdquo;</p></div>'
      +vid
      +'<div class="dnam-quotes">'+quotes+'</div>'
      +'<a class="dnam-more" href="'+d.anchor+'">Full written analysis &rarr;</a></div>';
  }
  function ensure(){
    if(el) return;
    el=document.createElement('div'); el.className='dnam-backdrop'; el.id='dnaModal';
    el.innerHTML='<div class="dnam-box" role="dialog" aria-modal="true"></div>';
    document.body.appendChild(el);
    el.addEventListener('click',function(e){ if(e.target===el) close(); });
  }
  function open(key){
    var d=DNA_DATA[key]; if(!d) return;
    ensure();
    el.querySelector('.dnam-box').innerHTML=render(d);
    el.querySelector('.dnam-close').addEventListener('click',close);
    el.classList.add('open'); document.body.classList.add('dnam-lock');
  }
  function close(){
    if(!el) return; el.classList.remove('open'); document.body.classList.remove('dnam-lock');
    var b=el.querySelector('.dnam-box'); setTimeout(function(){ if(b) b.innerHTML=''; },250);
  }
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') close(); });
  document.addEventListener('click',function(e){
    var t=e.target.closest ? e.target.closest('[data-dna]') : null;
    if(t){ e.preventDefault(); open(t.getAttribute('data-dna')); }
  });
  window.openDnaModal=open;
})();
