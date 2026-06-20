/* =====================================================
   ANSHIKA PROPOSAL — SUPER-CHARGED JS
   Canvas BG + 8D Tilt + Parallax + Sparkles + No-button escape
   ===================================================== */

/* ========== 1. CANVAS BACKGROUND — cherry floating orbs ========== */
(function initCanvas() {
  const canvas = document.createElement('canvas');
  canvas.id = 'bgCanvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const orbs = Array.from({ length: 22 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 120 + 40,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    alpha: Math.random() * 0.18 + 0.04,
    hue: Math.random() > 0.5 ? '198,42,42' : '255,100,130',
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.008 + 0.004,
  }));

  function drawOrbs() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() * 0.001;
    orbs.forEach(o => {
      o.x += o.vx;
      o.y += o.vy;
      if (o.x < -o.r) o.x = canvas.width + o.r;
      if (o.x > canvas.width + o.r) o.x = -o.r;
      if (o.y < -o.r) o.y = canvas.height + o.r;
      if (o.y > canvas.height + o.r) o.y = -o.r;

      const pulse = Math.sin(t * o.speed * 20 + o.phase) * 0.5 + 0.5;
      const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * (1 + pulse * 0.3));
      grad.addColorStop(0,   `rgba(${o.hue}, ${o.alpha + pulse * 0.08})`);
      grad.addColorStop(0.5, `rgba(${o.hue}, ${o.alpha * 0.5})`);
      grad.addColorStop(1,   `rgba(${o.hue}, 0)`);
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r * (1 + pulse * 0.3), 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });
    requestAnimationFrame(drawOrbs);
  }
  drawOrbs();
})();

/* ========== 2. FLOWER RAIN CANVAS (proposal section) ========== */
(function initFlowerRain() {
  const canvas = document.getElementById('flowerCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.parentElement.offsetWidth  || window.innerWidth;
    canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Cherry blossom petal shape
  function drawPetal(ctx, x, y, r, rot, alpha, colorA, colorB) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = alpha;
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    grad.addColorStop(0, colorA);
    grad.addColorStop(1, colorB);
    ctx.fillStyle = grad;
    ctx.beginPath();
    // draw a 5-petal flower
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      const cx1 = Math.cos(angle - 0.5) * r * 0.5;
      const cy1 = Math.sin(angle - 0.5) * r * 0.5;
      const cx2 = Math.cos(angle + 0.5) * r * 0.5;
      const cy2 = Math.sin(angle + 0.5) * r * 0.5;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.bezierCurveTo(cx1, cy1, cx2, cy2, px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  const colors = [
    ['rgba(198,42,42,0.9)',  'rgba(140,10,10,0)'],
    ['rgba(255,100,130,0.8)','rgba(200,40,70,0)'],
    ['rgba(255,160,180,0.7)','rgba(198,42,42,0)'],
    ['rgba(220,20,60,0.85)', 'rgba(120,0,30,0)'],
    ['rgba(255,200,210,0.7)','rgba(198,42,42,0)'],
  ];

  const flowers = Array.from({ length: 55 }, () => {
    const c = colors[Math.floor(Math.random() * colors.length)];
    return {
      x:     Math.random() * (canvas.width  || window.innerWidth),
      y:     -Math.random() * 600,
      r:     Math.random() * 14 + 6,
      rot:   Math.random() * Math.PI * 2,
      rotV:  (Math.random() - 0.5) * 0.06,
      vy:    Math.random() * 1.8 + 0.8,
      vx:    (Math.random() - 0.5) * 1.2,
      alpha: Math.random() * 0.55 + 0.35,
      swing: Math.random() * Math.PI * 2,
      swingSpeed: Math.random() * 0.03 + 0.01,
      swingAmp:   Math.random() * 30 + 10,
      colorA: c[0], colorB: c[1],
    };
  });

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = canvas.width  || window.innerWidth;
    const H = canvas.height || window.innerHeight;
    flowers.forEach(f => {
      f.swing += f.swingSpeed;
      f.x  += f.vx + Math.sin(f.swing) * 0.6;
      f.y  += f.vy;
      f.rot += f.rotV;
      if (f.y > H + 30) {
        f.y = -30;
        f.x = Math.random() * W;
      }
      if (f.x > W + 30) f.x = -30;
      if (f.x < -30)    f.x = W + 30;
      drawPetal(ctx, f.x, f.y, f.r, f.rot, f.alpha, f.colorA, f.colorB);
    });
    requestAnimationFrame(tick);
  }
  tick();
})();


/* ========== 3. GLOBAL FAST FLOWER RAIN — 7 canvas-drawn types ========== */
(function globalFlowerRain() {
  const canvas = document.getElementById('globalFlowers');
  if (!canvas) return;
  canvas.style.cssText = [
    'position:fixed','inset:0','width:100vw','height:100vh',
    'pointer-events:none','z-index:2','opacity:1'
  ].join(';');
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
  resize(); window.addEventListener('resize', resize);

  // 7 flower types with distinct palettes
  const CONFIG = {
    sakura:   { cols:['rgba(255,210,225,','rgba(255,235,245,','rgba(255,185,210,','rgba(255,255,255,'], cnt:14 },
    rose:     { cols:['rgba(160,5,25,',  'rgba(198,42,42,',  'rgba(130,0,20,',  'rgba(210,50,60,'],  cnt:12 },
    heart:    { cols:['rgba(255,60,110,','rgba(255,120,160,','rgba(220,20,70,',  'rgba(255,170,200,'],cnt:10 },
    hibiscus: { cols:['rgba(210,20,50,', 'rgba(255,50,80,',  'rgba(180,10,40,',  'rgba(240,70,100,'],cnt:10 },
    star:     { cols:['rgba(255,220,235,','rgba(255,245,250,','rgba(255,150,190,','rgba(255,255,255,'],cnt:8 },
    leaf:     { cols:['rgba(140,0,30,',  'rgba(180,30,50,',  'rgba(120,0,20,',   'rgba(160,20,45,'],  cnt:8 },
    daisy:    { cols:['rgba(255,200,215,','rgba(255,230,240,','rgba(255,160,190,','rgba(255,240,248,'],cnt:8 },
  };

  function makeFlower(type, W) {
    const cfg = CONFIG[type];
    return {
      type, x:Math.random()*W, y:-Math.random()*900,
      r: Math.random()*11+5,
      rot:Math.random()*Math.PI*2, rotV:(Math.random()-.5)*.1,
      vy:Math.random()*3.5+2.2,           // FAST
      vx:(Math.random()-.5)*1.8,
      swing:Math.random()*Math.PI*2, swingS:Math.random()*.045+.018,
      alpha:Math.random()*.48+.28,
      color:cfg.cols[Math.floor(Math.random()*cfg.cols.length)],
    };
  }

  const W = window.innerWidth;
  const flowers = [];
  Object.keys(CONFIG).forEach(type => {
    for(let i=0;i<CONFIG[type].cnt;i++) flowers.push(makeFlower(type, W));
  });

  function draw(f) {
    const r = f.r, c = f.color, a = f.alpha;
    ctx.save(); ctx.translate(f.x,f.y); ctx.rotate(f.rot); ctx.globalAlpha=a;
    const g = ctx.createRadialGradient(0,0,r*.05,0,0,r);
    g.addColorStop(0,c+'1)'); g.addColorStop(.6,c+'.7)'); g.addColorStop(1,c+'0)');
    ctx.fillStyle=g;
    switch(f.type){
      case 'sakura':
        for(let i=0;i<5;i++){
          ctx.save(); ctx.rotate((i/5)*Math.PI*2);
          ctx.beginPath(); ctx.ellipse(0,-r*.52,r*.3,r*.58,0,0,Math.PI*2); ctx.fill(); ctx.restore();
        }
        ctx.beginPath(); ctx.arc(0,0,r*.16,0,Math.PI*2);
        ctx.fillStyle='rgba(255,140,180,'+a*.9+')'; ctx.fill();
        break;
      case 'rose':
        ctx.beginPath(); ctx.ellipse(0,0,r*.42,r,0,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(0,-r*.75); ctx.lineTo(0,r*.75);
        ctx.strokeStyle='rgba(70,0,0,.22)'; ctx.lineWidth=.7; ctx.stroke();
        break;
      case 'heart':
        ctx.beginPath();
        ctx.moveTo(0,r*.28);
        ctx.bezierCurveTo(-r*.5,-r*.18,-r,-r*.06,-r,r*.28);
        ctx.bezierCurveTo(-r,r*.65,-r*.5,r*1.05,0,r*1.35);
        ctx.bezierCurveTo(r*.5,r*1.05,r,r*.65,r,r*.28);
        ctx.bezierCurveTo(r,r*.06,r*.5,-r*.18,0,r*.28);
        ctx.fill(); break;
      case 'hibiscus':
        for(let i=0;i<6;i++){
          ctx.save(); ctx.rotate((i/6)*Math.PI*2);
          ctx.beginPath(); ctx.ellipse(0,-r*.5,r*.38,r*.62,0,0,Math.PI*2); ctx.fill(); ctx.restore();
        }
        ctx.beginPath(); ctx.arc(0,0,r*.18,0,Math.PI*2);
        ctx.fillStyle='rgba(255,210,60,'+a*.8+')'; ctx.fill();
        break;
      case 'star':
        ctx.beginPath();
        for(let i=0;i<8;i++){
          const ang=(i/8)*Math.PI*2, rd=i%2===0?r:r*.4;
          i===0?ctx.moveTo(Math.cos(ang)*rd,Math.sin(ang)*rd)
               :ctx.lineTo(Math.cos(ang)*rd,Math.sin(ang)*rd);
        }
        ctx.closePath(); ctx.fill(); break;
      case 'leaf':
        ctx.beginPath();
        ctx.moveTo(0,-r); ctx.bezierCurveTo(r*.65,-r*.3,r*.65,r*.3,0,r);
        ctx.bezierCurveTo(-r*.65,r*.3,-r*.65,-r*.3,0,-r);
        ctx.fill();
        ctx.beginPath(); ctx.moveTo(0,-r*.7); ctx.lineTo(0,r*.7);
        ctx.strokeStyle='rgba(80,0,0,.18)'; ctx.lineWidth=.5; ctx.stroke();
        break;
      case 'daisy':
        for(let i=0;i<8;i++){
          const ang=(i/8)*Math.PI*2;
          ctx.save();
          ctx.translate(Math.cos(ang)*r*.55,Math.sin(ang)*r*.55);
          ctx.beginPath(); ctx.ellipse(0,0,r*.28,r*.4,ang,0,Math.PI*2);
          ctx.fill(); ctx.restore();
        }
        ctx.beginPath(); ctx.arc(0,0,r*.22,0,Math.PI*2);
        ctx.fillStyle='rgba(255,200,80,'+a+')'; ctx.fill();
        break;
    }
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const W2=canvas.width, H=canvas.height;
    flowers.forEach(f=>{
      f.swing+=f.swingS; f.x+=f.vx+Math.sin(f.swing)*.9; f.y+=f.vy; f.rot+=f.rotV;
      if(f.y>H+30){Object.assign(f,makeFlower(f.type,W2)); f.y=-30;}
      if(f.x>W2+30)f.x=-30; if(f.x<-30)f.x=W2+30;
      draw(f);
    });
    requestAnimationFrame(tick);
  }
  tick();
})();


/* ========== 6. TWINKLING STAR FIELD ========== */
(function addStars() {
  const style = document.createElement('style');
  style.textContent = `
    .twinkle-star {
      position:fixed; border-radius:50%;
      pointer-events:none; z-index:0;
      animation:twinkle ease-in-out infinite;
    }
    @keyframes twinkle {
      0%,100% { opacity:0.08; transform:scale(1); }
      50%      { opacity:0.75; transform:scale(1.6); }
    }
  `;
  document.head.appendChild(style);
  for (let i = 0; i < 40; i++) {
    const s    = document.createElement('div');
    s.className = 'twinkle-star';
    const size = Math.random() * 5 + 2;
    const hue  = Math.random() > 0.5 ? '198,42,42' : '255,100,130';
    s.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}vw; top:${Math.random()*100}vh;
      background:radial-gradient(circle, rgba(${hue},0.9) 0%, transparent 70%);
      animation-duration:${Math.random()*3+2}s;
      animation-delay:${Math.random()*5}s;
      box-shadow:0 0 ${size*2}px rgba(${hue},0.6);
    `;
    document.body.appendChild(s);
  }
})();

/* ========== 7. SCROLL REVEAL ========== */
const timelineItems = document.querySelectorAll('.timeline-item');
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, idx) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), idx * 80);
    }
  });
}, { threshold: 0.15 });
timelineItems.forEach(item => observer.observe(item));

/* ========== 8. 8D TILT + MOUSE TRACKING ========== */
function addTiltEffect(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.addEventListener('mousemove', e => {
      const rect    = card.getBoundingClientRect();
      const x       = e.clientX - rect.left;
      const y       = e.clientY - rect.top;
      const centerX = rect.width  / 2;
      const centerY = rect.height / 2;
      const rotX    = ((y - centerY) / centerY) * -10;
      const rotY    = ((x - centerX) / centerX) * 10;
      card.style.transform  = `translateY(-12px) scale(1.02) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      card.style.transition = 'transform 0.05s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.45s cubic-bezier(0.22,1,0.36,1)';
    });
  });
}
addTiltEffect('.timeline-card');
addTiltEffect('.letter-envelope');

/* ========== 9. HERO PARALLAX MOUSE ========== */
const hero = document.getElementById('hero');
if (hero) {
  hero.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    const content = hero.querySelector('.hero-content');
    if (content) content.style.transform = `translateX(${x * 0.4}px) translateY(${y * 0.4}px)`;
    hero.querySelectorAll('.circle').forEach((c, i) => {
      const d = (i + 1) * 0.18;
      c.style.transform = `translateX(${x * d}px) translateY(${y * d}px) scale(${1 + Math.abs(x) * 0.0015})`;
    });
  });
  hero.addEventListener('mouseleave', () => {
    const content = hero.querySelector('.hero-content');
    if (content) content.style.transform = '';
    hero.querySelectorAll('.circle').forEach(c => c.style.transform = '');
  });
}

/* ========== 10. NO BUTTON RUNS AWAY ========== */
let noClickCount = 0;
window.runAway = function(btn) {
  noClickCount++;
  const bw  = btn.offsetWidth  || 100;
  const bh  = btn.offsetHeight || 40;
  const pad = 20;
  const maxX = Math.max(pad, window.innerWidth  - bw - pad);
  const maxY = Math.max(pad, window.innerHeight - bh - pad);
  const rx   = Math.floor(Math.random() * (maxX - pad)) + pad;
  const ry   = Math.floor(Math.random() * (maxY - pad)) + pad;

  btn.style.position   = 'fixed';
  btn.style.left       = rx + 'px';
  btn.style.top        = ry + 'px';
  btn.style.bottom     = 'auto';
  btn.style.right      = 'auto';
  btn.style.zIndex     = '9999';
  btn.style.transition = 'left .18s cubic-bezier(0.22,1,0.36,1), top .18s cubic-bezier(0.22,1,0.36,1), transform .18s ease, opacity .18s ease';

  const scale = Math.max(0.4, 1 - noClickCount * 0.09);
  btn.style.transform = `scale(${scale})`;
  btn.style.opacity   = Math.max(0.15, 1 - noClickCount * 0.1);

  const yesBtn = document.getElementById('yesBtn');
  if (yesBtn) {
    const yesScale = Math.min(1.3, 1 + noClickCount * 0.05);
    yesBtn.style.transform = `scale(${yesScale}) translateY(-6px)`;
    if (noClickCount >= 4) {
      yesBtn.style.boxShadow = '0 24px 70px rgba(198,42,42,0.7), 0 0 50px rgba(198,42,42,0.4)';
      yesBtn.style.background = 'linear-gradient(135deg, #4a0808, #8b1a1a, #c62a2a, #ff4444)';
    }
  }

  const labels = [
    'No...', 'Are you sure? 😟', 'Really...?', 'Think again 🥺',
    'Please? 💕', "Don't do this...", 'Last chance! 🙏',
    "You'll regret it 😢", 'Noooooo...', 'Fine... 😞'
  ];
  const span = btn.querySelector('span');
  if (span && noClickCount <= labels.length) span.textContent = labels[noClickCount - 1] || 'No';

  addRipple(e => {}, btn);
};

/* ========== 11. YES — FULL CINEMATIC ANIMATION ========== */
window.sayYes = function() {
  const overlay = document.getElementById('celebrationOverlay');
  overlay.classList.add('active');

  // 1. Staggered "She" + "Said" slide in
  setTimeout(() => { const e = document.getElementById('yw1'); if(e) e.classList.add('show'); }, 350);
  setTimeout(() => { const e = document.getElementById('yw2'); if(e) e.classList.add('show'); }, 700);

  // 2. YES! explodes in
  setTimeout(() => { const e = document.getElementById('yesBig'); if(e) e.classList.add('show'); }, 1050);

  // 3. Typewriter tagline — fast
  setTimeout(() => {
    const phrase = "I don't know where destiny is made — but I'll always be with you 🌹";
    const el = document.getElementById('yesTagline');
    if (!el) return;
    el.innerHTML = '';
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'tw-cursor';
    el.appendChild(cursor);
    const interval = setInterval(() => {
      if (i < phrase.length) {
        el.insertBefore(document.createTextNode(phrase[i++]), cursor);
      } else {
        clearInterval(interval);
        setTimeout(() => cursor.remove(), 2000);
      }
    }, 14);   // fast typing
  }, 1800);

  // 4. Emoji wave row
  setTimeout(() => {
    const el = document.getElementById('yesEmojiWave');
    if (!el) return;
    const emojis = ['💍','💕','🌹','💗','✨','🌸','💖','🩷','🎊','💝','❤️‍🔥','🌺'];
    el.innerHTML = '';
    emojis.forEach((em, i) => {
      const s = document.createElement('span');
      s.textContent = em;
      s.style.animationDelay = (i * 0.16) + 's';
      el.appendChild(s);
    });
  }, 2800);

  // 5. YES Canvas — explosion + cherry blossom rain
  startYesCanvas();

  // 6. External confetti + fireworks
  launchConfetti();
  launchFireworks();
};

function startYesCanvas() {
  const canvas = document.getElementById('yesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  // Burst particles outward
  const burst = [];
  for (let i = 0; i < 220; i++) {
    const ang = Math.random() * Math.PI * 2;
    const spd = Math.random() * 9 + 2;
    const colors = ['rgba(255,200,220,', 'rgba(255,255,255,', 'rgba(255,140,170,',
                    'rgba(220,20,60,',   'rgba(255,220,230,', 'rgba(180,20,60,'];
    const col = colors[Math.floor(Math.random() * colors.length)];
    burst.push({
      x: canvas.width/2, y: canvas.height/2,
      vx: Math.cos(ang)*spd, vy: Math.sin(ang)*spd,
      r: Math.random()*6+2,
      alpha: 1, fade: Math.random()*.025+.012,
      color: col,
    });
  }

  // Gentle falling cherry blossoms
  const blossoms = Array.from({length: 60}, () => ({
    x: Math.random()*canvas.width, y: -Math.random()*500,
    r: Math.random()*10+5, rot: Math.random()*Math.PI*2,
    rotV: (Math.random()-.5)*.07,
    vy: Math.random()*1.8+.7, vx: (Math.random()-.5)*.9,
    swing: Math.random()*Math.PI*2, swingS: Math.random()*.04+.01,
    alpha: Math.random()*.5+.35,
    hue: ['rgba(255,200,220,','rgba(255,255,255,','rgba(255,150,180,','rgba(255,230,240,'][Math.floor(Math.random()*4)],
  }));

  // Shooting star lines
  const stars = Array.from({length: 8}, () => ({
    x: Math.random()*canvas.width, y: Math.random()*canvas.height*.5,
    vx: Math.random()*12+6, vy: Math.random()*4+2,
    len: Math.random()*80+40, alpha: 0,
    life: 0, maxLife: Math.random()*60+40,
    delay: Math.random()*150,
  }));

  let frame = 0;
  function drawYes() {
    frame++;
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Burst particles (first 120 frames)
    burst.forEach(p => {
      if (p.alpha <= 0) return;
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.96; p.vy *= 0.96;
      p.alpha -= p.fade;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.color + Math.max(0,p.alpha) + ')';
      ctx.fill();
      ctx.restore();
    });

    // Shooting stars
    stars.forEach(s => {
      if (frame < s.delay) return;
      s.life++;
      if (s.life > s.maxLife) {
        s.x = Math.random()*canvas.width; s.y = Math.random()*canvas.height*.4;
        s.life = 0; s.delay = frame + Math.random()*80;
        return;
      }
      s.x += s.vx; s.y += s.vy;
      const prog = s.life / s.maxLife;
      const alpha = prog < 0.3 ? prog/0.3 : 1 - (prog-0.3)/0.7;
      ctx.save();
      ctx.globalAlpha = alpha * 0.7;
      const grad = ctx.createLinearGradient(s.x-s.len, s.y-s.len*.25, s.x, s.y);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(1, 'rgba(255,230,240,1)');
      ctx.strokeStyle = grad; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(s.x-s.len, s.y-s.len*.25); ctx.lineTo(s.x,s.y); ctx.stroke();
      ctx.restore();
    });

    // Cherry blossoms
    blossoms.forEach(b => {
      b.swing += b.swingS; b.x += b.vx + Math.sin(b.swing)*.5; b.y += b.vy; b.rot += b.rotV;
      if (b.y > canvas.height+30) { b.y=-30; b.x=Math.random()*canvas.width; }
      if (b.x > canvas.width+30)  b.x=-30;
      if (b.x < -30) b.x=canvas.width+30;
      // draw 5-petal blossom
      ctx.save();
      ctx.translate(b.x, b.y); ctx.rotate(b.rot); ctx.globalAlpha = b.alpha;
      const g = ctx.createRadialGradient(0,0,0,0,0,b.r);
      g.addColorStop(0, b.hue+'0.95)'); g.addColorStop(1, b.hue+'0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      for (let k=0; k<5; k++) {
        const ang = (k/5)*Math.PI*2;
        const px=Math.cos(ang)*b.r, py=Math.sin(ang)*b.r;
        const c1x=Math.cos(ang-.5)*b.r*.55, c1y=Math.sin(ang-.5)*b.r*.55;
        const c2x=Math.cos(ang+.5)*b.r*.55, c2y=Math.sin(ang+.5)*b.r*.55;
        k===0 ? ctx.moveTo(px,py) : ctx.bezierCurveTo(c1x,c1y,c2x,c2y,px,py);
      }
      ctx.closePath(); ctx.fill(); ctx.restore();
    });

    requestAnimationFrame(drawYes);
  }
  drawYes();
}

window.closeCelebration = function() {
  const overlay = document.getElementById('celebrationOverlay');
  overlay.classList.remove('active');
  ['yw1','yw2','yesBig'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('show');
  });
  const tl = document.getElementById('yesTagline');
  if (tl) tl.innerHTML = '';
  const ew = document.getElementById('yesEmojiWave');
  if (ew) ew.innerHTML = '';
};

/* ========== 12. HERO — Giant Sakura rain ========== */
(function heroFlowerRain() {
  const canvas = document.getElementById('heroFlowers');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width  = canvas.parentElement.offsetWidth  || window.innerWidth;
    canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
  }
  resize(); window.addEventListener('resize', resize);

  // Large, graceful sakura — light pink + white
  const petals = Array.from({length:38}, () => ({
    x: Math.random()*(canvas.width||window.innerWidth),
    y: -Math.random()*800,
    r: Math.random()*18+10,
    rot: Math.random()*Math.PI*2, rotV:(Math.random()-.5)*.025,
    vy: Math.random()*1.2+.4, vx:(Math.random()-.5)*.6,
    swing: Math.random()*Math.PI*2, swingS:Math.random()*.018+.006,
    alpha: Math.random()*.4+.25,
    hue: ['rgba(255,215,225,','rgba(255,240,245,','rgba(255,200,215,','rgba(255,255,255,'][Math.floor(Math.random()*4)],
  }));

  function drawSakura(ctx, x, y, r, rot, alpha, hue) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(rot); ctx.globalAlpha=alpha;
    const g=ctx.createRadialGradient(0,0,r*.1,0,0,r);
    g.addColorStop(0, hue+'1)'); g.addColorStop(.6,hue+'.6)'); g.addColorStop(1,hue+'0)');
    ctx.fillStyle=g;
    for(let i=0;i<5;i++){
      ctx.save(); ctx.rotate((i/5)*Math.PI*2);
      ctx.beginPath();
      ctx.ellipse(0,-r*.55,r*.35,r*.6,0,0,Math.PI*2);
      ctx.fill(); ctx.restore();
    }
    // Center dot
    ctx.beginPath(); ctx.arc(0,0,r*.18,0,Math.PI*2);
    ctx.fillStyle='rgba(255,170,200,'+alpha*.8+')'; ctx.fill();
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const W=canvas.width||window.innerWidth, H=canvas.height||window.innerHeight;
    petals.forEach(p => {
      p.swing+=p.swingS; p.x+=p.vx+Math.sin(p.swing)*.8; p.y+=p.vy; p.rot+=p.rotV;
      if(p.y>H+30){p.y=-30;p.x=Math.random()*W;}
      if(p.x>W+30)p.x=-30; if(p.x<-30)p.x=W+30;
      drawSakura(ctx,p.x,p.y,p.r,p.rot,p.alpha,p.hue);
    });
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ========== 13. STORY — Dark crimson rose petals ========== */
(function storyFlowerRain() {
  const canvas = document.getElementById('storyFlowers');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width  = canvas.parentElement.offsetWidth  || window.innerWidth;
    canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
  }
  resize(); window.addEventListener('resize', resize);

  // Elongated spinning rose petals, deep red
  const petals = Array.from({length:28}, () => ({
    x: Math.random()*(canvas.width||window.innerWidth),
    y: -Math.random()*500,
    rx: Math.random()*8+4, ry: Math.random()*16+8,
    rot: Math.random()*Math.PI*2, rotV:(Math.random()-.5)*.08,
    vy: Math.random()*2.2+1.0, vx:(Math.random()-.5)*1.2,
    swing:Math.random()*Math.PI*2, swingS:Math.random()*.025+.008,
    alpha:Math.random()*.45+.3,
    hue:['rgba(139,0,0,','rgba(180,20,20,','rgba(198,42,42,','rgba(120,0,30,','rgba(160,10,30,'][Math.floor(Math.random()*5)],
  }));

  function tick() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const W=canvas.width||window.innerWidth, H=canvas.height||window.innerHeight;
    petals.forEach(p => {
      p.swing+=p.swingS; p.x+=p.vx+Math.sin(p.swing)*.5; p.y+=p.vy; p.rot+=p.rotV;
      if(p.y>H+30){p.y=-30;p.x=Math.random()*W;}
      if(p.x>W+30)p.x=-30; if(p.x<-30)p.x=W+30;
      ctx.save();
      ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.globalAlpha=p.alpha;
      const g=ctx.createRadialGradient(0,0,0,0,0,Math.max(p.rx,p.ry));
      g.addColorStop(0,p.hue+'0.95)'); g.addColorStop(.5,p.hue+'0.7)'); g.addColorStop(1,p.hue+'0)');
      ctx.fillStyle=g;
      ctx.beginPath(); ctx.ellipse(0,0,p.rx,p.ry,0,0,Math.PI*2); ctx.fill();
      // Vein line
      ctx.beginPath(); ctx.moveTo(0,-p.ry*.7); ctx.lineTo(0,p.ry*.7);
      ctx.strokeStyle='rgba(80,0,0,0.2)'; ctx.lineWidth=.5; ctx.stroke();
      ctx.restore();
    });
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ========== 14. LETTER — Soft pink heart rain ========== */
(function letterFlowerRain() {
  const canvas = document.getElementById('letterFlowers');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width  = canvas.parentElement.offsetWidth  || window.innerWidth;
    canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
  }
  resize(); window.addEventListener('resize', resize);

  function drawHeart(ctx, x, y, size, alpha, hue) {
    ctx.save(); ctx.translate(x,y); ctx.globalAlpha=alpha;
    const g=ctx.createRadialGradient(0,0,0,0,size*.3,size);
    g.addColorStop(0,hue+'1)'); g.addColorStop(1,hue+'0)');
    ctx.fillStyle=g; ctx.beginPath();
    ctx.moveTo(0,size*.3);
    ctx.bezierCurveTo(-size*.5,-size*.2,-size,-size*.1,-size,size*.3);
    ctx.bezierCurveTo(-size,size*.7,-size*.5,size*1.1,0,size*1.4);
    ctx.bezierCurveTo(size*.5,size*1.1,size,size*.7,size,size*.3);
    ctx.bezierCurveTo(size,size*.1 - size*.1,size*.5,-size*.2,0,size*.3);
    ctx.closePath(); ctx.fill(); ctx.restore();
  }

  const hearts = Array.from({length:22}, () => ({
    x: Math.random()*(canvas.width||window.innerWidth),
    y: -Math.random()*400,
    size: Math.random()*9+4,
    rot: Math.random()*Math.PI*2, rotV:(Math.random()-.5)*.03,
    vy: Math.random()*.9+.4, vx:(Math.random()-.5)*.5,
    swing:Math.random()*Math.PI*2, swingS:Math.random()*.02+.007,
    alpha:Math.random()*.4+.2,
    hue:['rgba(255,182,210,','rgba(255,200,225,','rgba(255,160,195,','rgba(255,220,235,'][Math.floor(Math.random()*4)],
  }));

  function tick() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const W=canvas.width||window.innerWidth, H=canvas.height||window.innerHeight;
    hearts.forEach(h => {
      h.swing+=h.swingS; h.x+=h.vx+Math.sin(h.swing)*.4; h.y+=h.vy; h.rot+=h.rotV;
      if(h.y>H+30){h.y=-30;h.x=Math.random()*W;}
      if(h.x>W+30)h.x=-30; if(h.x<-30)h.x=W+30;
      drawHeart(ctx,h.x,h.y,h.size,h.alpha,h.hue);
    });
    requestAnimationFrame(tick);
  }
  tick();
})();




/* ========== 12. CANVAS CONFETTI BURST (geometric — no emoji) ========== */
function launchConfetti() {
  const cvs = document.createElement('canvas');
  cvs.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1005;';
  document.body.appendChild(cvs);
  cvs.width = window.innerWidth; cvs.height = window.innerHeight;
  const ctx2 = cvs.getContext('2d');

  const cx = cvs.width/2, cy = cvs.height/2;
  const shapeTypes = ['circle','rect','star','heart'];
  const palette = [
    '#ff4466','#ff6688','#ffaacc','#ffffff','#ffd6e0',
    '#c62a2a','#ff8899','#ffe0ec','#ff3355','#ffbbcc'
  ];
  const pieces = Array.from({length:160}, ()=>{
    const ang=Math.random()*Math.PI*2, spd=Math.random()*12+4;
    return {
      x:cx, y:cy, vx:Math.cos(ang)*spd, vy:Math.sin(ang)*spd-6,
      r:Math.random()*7+3, rot:Math.random()*Math.PI*2,
      rotV:(Math.random()-.5)*.22,
      color:palette[Math.floor(Math.random()*palette.length)],
      type:shapeTypes[Math.floor(Math.random()*shapeTypes.length)],
      alpha:1, fade:Math.random()*.018+.009, grav:.18,
    };
  });

  function drawPiece(p){
    ctx2.save(); ctx2.translate(p.x,p.y); ctx2.rotate(p.rot);
    ctx2.globalAlpha=p.alpha; ctx2.fillStyle=p.color;
    switch(p.type){
      case 'circle':
        ctx2.beginPath(); ctx2.arc(0,0,p.r,0,Math.PI*2); ctx2.fill(); break;
      case 'rect':
        ctx2.fillRect(-p.r,-p.r*.5,p.r*2,p.r); break;
      case 'star':{
        ctx2.beginPath();
        for(let i=0;i<8;i++){
          const a=(i/8)*Math.PI*2, rd=i%2===0?p.r:p.r*.45;
          i===0?ctx2.moveTo(Math.cos(a)*rd,Math.sin(a)*rd)
               :ctx2.lineTo(Math.cos(a)*rd,Math.sin(a)*rd);
        }
        ctx2.closePath(); ctx2.fill(); break;
      }
      case 'heart':{
        const s=p.r*.8;
        ctx2.beginPath();
        ctx2.moveTo(0,s*.28);
        ctx2.bezierCurveTo(-s*.5,-s*.18,-s,-s*.06,-s,s*.28);
        ctx2.bezierCurveTo(-s,s*.65,-s*.5,s*1.05,0,s*1.35);
        ctx2.bezierCurveTo(s*.5,s*1.05,s,s*.65,s,s*.28);
        ctx2.bezierCurveTo(s,s*.06,s*.5,-s*.18,0,s*.28);
        ctx2.fill(); break;
      }
    }
    ctx2.restore();
  }

  let running = true;
  function frame(){
    if(!running) return;
    ctx2.clearRect(0,0,cvs.width,cvs.height);
    let alive=0;
    pieces.forEach(p=>{
      if(p.alpha<=0) return;
      p.x+=p.vx; p.y+=p.vy; p.vy+=p.grav;
      p.vx*=.98; p.rot+=p.rotV; p.alpha-=p.fade;
      alive++; drawPiece(p);
    });
    if(alive>0) requestAnimationFrame(frame);
    else { running=false; cvs.remove(); }
  }
  frame();
}



/* ========== 13. FIREWORK DOTS ========== */
function launchFireworks() {
  const colors = ['#c62a2a','#ff4444','#f8b4c8','#ffffff','#ffaaaa'];
  if (!document.getElementById('fw-style')) {
    const s = document.createElement('style');
    s.id    = 'fw-style';
    s.textContent = `
      @keyframes fwDot {
        0%   { transform:translate(-50%,-50%) scale(1); opacity:1; }
        100% { transform:translate(calc(-50% + var(--fx)),calc(-50% + var(--fy))) scale(0); opacity:0; }
      }
    `;
    document.head.appendChild(s);
  }
  for (let burst = 0; burst < 6; burst++) {
    setTimeout(() => {
      const cx = Math.random() * window.innerWidth;
      const cy = Math.random() * (window.innerHeight * 0.7);
      for (let d = 0; d < 20; d++) {
        const el   = document.createElement('div');
        const ang  = (d / 20) * Math.PI * 2;
        const spd  = Math.random() * 80 + 40;
        const fx   = Math.cos(ang) * spd + 'px';
        const fy   = Math.sin(ang) * spd + 'px';
        el.style.cssText = `
          position:fixed; left:${cx}px; top:${cy}px;
          width:8px; height:8px; border-radius:50%;
          background:${colors[Math.floor(Math.random()*colors.length)]};
          pointer-events:none; z-index:1003;
          --fx:${fx}; --fy:${fy};
          animation:fwDot 0.9s ease-out forwards;
          box-shadow:0 0 6px currentColor;
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1000);
      }
    }, burst * 200);
  }
}

/* ========== 14. MAGNETIC YES BUTTON ========== */
const yesBtn = document.getElementById('yesBtn');
if (yesBtn) {
  yesBtn.addEventListener('mousemove', e => {
    const rect = yesBtn.getBoundingClientRect();
    const x    = e.clientX - rect.left - rect.width  / 2;
    const y    = e.clientY - rect.top  - rect.height / 2;
    yesBtn.style.transform = `scale(1.12) translate(${x * 0.18}px, ${y * 0.18 - 6}px)`;
  });
  yesBtn.addEventListener('mouseleave', () => { yesBtn.style.transform = ''; });
}

/* ========== 15. SPARKLE TRAIL ========== */
function addSparkleTrail(selector) {
  if (!document.getElementById('sparkle-style')) {
    const s = document.createElement('style');
    s.id    = 'sparkle-style';
    s.textContent = `
      @keyframes sparkleOut {
        0%   { transform:translate(-50%,-50%) scale(0) rotate(0deg); opacity:1; }
        100% { transform:translate(-50%,-50%) scale(2) translateY(-35px) rotate(var(--sr)); opacity:0; }
      }
    `;
    document.head.appendChild(s);
  }
  document.querySelectorAll(selector).forEach(el => {
    let lastSparkle = 0;
    el.addEventListener('mousemove', e => {
      const now = Date.now();
      if (now - lastSparkle < 80) return;
      lastSparkle = now;
      const spark = document.createElement('div');
      spark.style.cssText = `
        position:fixed;
        left:${e.clientX}px; top:${e.clientY}px;
        pointer-events:none; z-index:9999;
        font-size:${Math.random()*14+10}px;
        --sr:${(Math.random()-0.5)*360}deg;
        animation:sparkleOut 0.75s ease-out forwards;
      `;
      spark.textContent = ['✨','💕','🌸','⭐','💫','❤️‍🔥'][Math.floor(Math.random()*6)];
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 800);
    });
  });
}
addSparkleTrail('.btn-yes');
addSparkleTrail('.title-name');
addSparkleTrail('.proposal-emoji');
addSparkleTrail('.letter-sign');
addSparkleTrail('.proposal-heading');
addSparkleTrail('.celebrate-title');

/* ========== 16. RIPPLE ON BUTTON CLICK ========== */
function addRipple(e, el) {
  const ripple = document.createElement('div');
  const rect   = el.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height) * 2;
  ripple.style.cssText = `
    position:absolute;
    width:${size}px; height:${size}px;
    border-radius:50%;
    background:rgba(255,255,255,0.3);
    left:50%; top:50%;
    transform:translate(-50%,-50%) scale(0);
    animation:rippleOut 0.6s ease-out forwards;
    pointer-events:none;
  `;
  if (!document.getElementById('ripple-style')) {
    const s = document.createElement('style');
    s.id    = 'ripple-style';
    s.textContent = `@keyframes rippleOut { to { transform:translate(-50%,-50%) scale(1); opacity:0; } }`;
    document.head.appendChild(s);
  }
  el.style.position = el.style.position || 'relative';
  el.style.overflow = 'hidden';
  el.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);
}

if (yesBtn) {
  yesBtn.addEventListener('click', e => addRipple(e, yesBtn));
}

/* ========== 17. SCROLL → SMOOTH INDICATOR ========== */
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
  scrollIndicator.addEventListener('click', () => {
    document.getElementById('story').scrollIntoView({ behavior:'smooth' });
  });
}

/* ========== 18. CURSOR TRAIL ========== */
(function cursorTrail() {
  const trailEmojis = ['❤️','✨','🌸','💕'];
  let lastTrail = 0;
  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastTrail < 120) return;
    lastTrail = now;
    const dot = document.createElement('div');
    dot.style.cssText = `
      position:fixed;
      left:${e.clientX}px; top:${e.clientY}px;
      pointer-events:none; z-index:9998;
      font-size:${Math.random()*8+8}px;
      opacity:0.7;
      animation:trailFade 0.9s ease-out forwards;
      transform:translate(-50%,-50%);
    `;
    dot.textContent = trailEmojis[Math.floor(Math.random()*trailEmojis.length)];
    if (!document.getElementById('trail-style')) {
      const s = document.createElement('style');
      s.id    = 'trail-style';
      s.textContent = `
        @keyframes trailFade {
          0%   { opacity:0.7; transform:translate(-50%,-50%) scale(1); }
          100% { opacity:0;   transform:translate(-50%,-130%) scale(0.4); }
        }
      `;
      document.head.appendChild(s);
    }
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 950);
  });
})();

/* ========== 19. SECTION ENTRANCE REVEAL ========== */
(function sectionReveal() {
  const style = document.createElement('style');
  style.textContent = `
    .reveal-section { opacity:0; transform:translateY(40px); transition:all 0.9s cubic-bezier(0.22,1,0.36,1); }
    .reveal-section.revealed { opacity:1; transform:translateY(0); }
  `;
  document.head.appendChild(style);
  document.querySelectorAll('.story-title,.letter-wrapper,.proposal-content').forEach(el => {
    el.classList.add('reveal-section');
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal-section').forEach(el => obs.observe(el));
})();
