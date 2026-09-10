/* ============================================================
   Girlfriend Day — Ultimate Romantic Edition 💕
   Sections: 1) three.js heart field  2) sparkles + petals
   3) customize  4) envelope  5) flip cards  6) 3D carousel
   7) PROPOSE (un-clickable No button)  8) burst  9) scroll reveal
   ============================================================ */

/* ---------- 1. THREE.JS FLOATING HEART FIELD ---------- */
(function initHeartField(){
  if(typeof THREE === 'undefined'){
    console.warn('Three.js did not load; continuing without the floating heart background.');
    return;
  }
  const canvas = document.getElementById('heart-field');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.z = 18;

  // draw a heart shape onto a canvas texture
  function makeHeartTexture(color){
    const c = document.createElement('canvas');
    c.width = 128; c.height = 128;
    const ctx = c.getContext('2d');
    ctx.translate(64, 20);
    ctx.beginPath();
    const topCurveHeight = 40;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, topCurveHeight - 40, -64, topCurveHeight - 40, -64, topCurveHeight);
    ctx.bezierCurveTo(-64, topCurveHeight + 30, -20, topCurveHeight + 66, 0, topCurveHeight + 96);
    ctx.bezierCurveTo(20, topCurveHeight + 66, 64, topCurveHeight + 30, 64, topCurveHeight);
    ctx.bezierCurveTo(64, topCurveHeight - 40, 0, topCurveHeight - 40, 0, topCurveHeight);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    return new THREE.CanvasTexture(c);
  }

  const palette = ['#ff5c8a', '#ffb3c6', '#e8c170', '#ffe1e9', '#ff69b4', '#c9a0dc'];
  const textures = palette.map(makeHeartTexture);

  const COUNT = window.innerWidth < 700 ? 55 : 110;
  const group = new THREE.Group();
  const hearts = [];

  for(let i=0;i<COUNT;i++){
    const tex = textures[i % textures.length];
    const mat = new THREE.SpriteMaterial({ map: tex, transparent:true, opacity: 0.45 + Math.random()*0.4, depthWrite:false });
    const sprite = new THREE.Sprite(mat);
    const scale = 0.35 + Math.random()*1.2;
    sprite.scale.set(scale, scale, 1);
    sprite.position.set(
      (Math.random()-0.5) * 36,
      (Math.random()-0.5) * 24,
      (Math.random()-0.5) * 18
    );
    sprite.userData.speed = 0.12 + Math.random()*0.4;
    sprite.userData.drift = (Math.random()-0.5) * 0.45;
    sprite.userData.rotSpeed = (Math.random()-0.5) * 0.012;
    group.add(sprite);
    hearts.push(sprite);
  }
  scene.add(group);

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e)=>{
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animate(){
    requestAnimationFrame(animate);
    hearts.forEach(h=>{
      h.position.y += h.userData.speed * 0.012;
      h.position.x += h.userData.drift * 0.012;
      h.material.rotation += h.userData.rotSpeed;
      if(h.position.y > 13){ h.position.y = -13; }
      if(h.position.x > 19) h.position.x = -19;
      if(h.position.x < -19) h.position.x = 19;
    });
    group.rotation.y += (mouseX * 0.15 - group.rotation.y) * 0.02;
    group.rotation.x += (-mouseY * 0.08 - group.rotation.x) * 0.02;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

/* ---------- 2. SPARKLES & ROSE PETALS ---------- */
(function initSparkles(){
  const overlay = document.getElementById('sparkle-overlay');
  if(!overlay) return;
  const COUNT = 40;
  for(let i=0;i<COUNT;i++){
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = Math.random()*100 + '%';
    s.style.top = Math.random()*100 + '%';
    s.style.animationDelay = (Math.random()*3) + 's';
    s.style.animationDuration = (1.5 + Math.random()*2) + 's';
    s.style.width = s.style.height = (2 + Math.random()*4) + 'px';
    overlay.appendChild(s);
  }
})();

(function initPetals(){
  const layer = document.getElementById('petal-layer');
  if(!layer) return;
  const PETAL_COUNT = 20;
  function createPetal(){
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.left = Math.random()*100 + '%';
    p.style.opacity = 0.3 + Math.random()*0.4;
    p.style.width = (10 + Math.random()*16) + 'px';
    p.style.height = (10 + Math.random()*16) + 'px';
    const duration = 6 + Math.random()*8;
    p.style.animationDuration = duration + 's';
    p.style.animationDelay = (Math.random()*6) + 's';
    p.style.setProperty('--petal-drift', (Math.random()*120 - 60) + 'px');
    p.style.setProperty('--petal-rot', (Math.random()*720) + 'deg');
    // Random petal colors
    const colors = ['#ffb3c6','#ff5c8a','#ffe1e9','#e8c170','#c9a0dc'];
    const c = colors[Math.floor(Math.random()*colors.length)];
    p.style.background = `radial-gradient(ellipse, ${c} 20%, transparent 100%)`;
    layer.appendChild(p);
    setTimeout(()=>{ p.remove(); createPetal(); }, (duration + parseFloat(p.style.animationDelay))*1000);
  }
  for(let i=0;i<PETAL_COUNT;i++){
    setTimeout(()=> createPetal(), i*400);
  }
})();

/* ---------- 3. CUSTOMIZATION PANEL ---------- */
const STORAGE_KEY = 'girlfriend-day-config';

function loadConfig(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  }catch(e){ return {}; }
}

function applyConfig(cfg){
  const name = cfg.name && cfg.name.trim() ? cfg.name.trim() : 'Farhana';
  const signature = cfg.signature && cfg.signature.trim() ? cfg.signature.trim() : 'Sajjad';

  document.getElementById('hero-name').textContent = name;
  document.getElementById('letter-name').textContent = name;
  document.getElementById('letter-signature').textContent = signature;
  document.getElementById('closing-name').textContent = name;
  document.getElementById('closing-signature').textContent = signature;

  const statDays = document.getElementById('stat-days');
  if(cfg.date){
    const start = new Date(cfg.date);
    const now = new Date();
    const diff = Math.max(0, Math.floor((now - start) / (1000*60*60*24)));
    statDays.textContent = diff.toLocaleString();
  } else {
    statDays.textContent = '∞';
  }
}

(function initCustomize(){
  const toggle = document.getElementById('customize-toggle');
  const panel = document.getElementById('customize-panel');
  const inputName = document.getElementById('input-name');
  const inputDate = document.getElementById('input-date');
  const inputSig = document.getElementById('input-signature');
  const saveBtn = document.getElementById('save-customize');

  const cfg = loadConfig();
  if(cfg.name) inputName.value = cfg.name;
  if(cfg.date) inputDate.value = cfg.date;
  if(cfg.signature) inputSig.value = cfg.signature;
  applyConfig(cfg);

  toggle.addEventListener('click', ()=> panel.classList.toggle('hidden'));

  saveBtn.addEventListener('click', ()=>{
    const newCfg = {
      name: inputName.value,
      date: inputDate.value,
      signature: inputSig.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCfg));
    applyConfig(newCfg);
    panel.classList.add('hidden');
  });
})();

/* ---------- 4. PROJECT FULLSCREEN ---------- */
(function initProjectFullscreen(){
  const button = document.getElementById('project-fullscreen');
  if(!button) return;

  const label = button.querySelector('.fullscreen-label');
  const root = document.documentElement;

  const currentFullscreenElement = ()=>
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement ||
    null;

  function enterFullscreen(){
    const request = root.requestFullscreen || root.webkitRequestFullscreen || root.msRequestFullscreen;
    if(!request) throw new Error('Fullscreen is not supported by this browser.');
    return request.call(root);
  }

  function exitFullscreen(){
    const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
    if(!exit) return Promise.resolve();
    return exit.call(document);
  }

  function syncFullscreenButton(){
    const isFullscreen = Boolean(currentFullscreenElement());
    button.classList.toggle('is-fullscreen', isFullscreen);
    button.setAttribute('aria-pressed', String(isFullscreen));
    button.setAttribute('aria-label', isFullscreen ? 'Exit project fullscreen' : 'Open project in fullscreen');
    button.title = isFullscreen ? 'Exit fullscreen (Esc)' : 'View fullscreen';
    if(label) label.textContent = isFullscreen ? 'Exit Full Screen' : 'Full Screen';
  }

  button.addEventListener('click', async ()=>{
    try{
      if(currentFullscreenElement()) await exitFullscreen();
      else await enterFullscreen();
    }catch(error){
      console.error(error);
      button.classList.add('fullscreen-error');
      if(label) label.textContent = 'Not Supported';
      setTimeout(()=>{
        button.classList.remove('fullscreen-error');
        syncFullscreenButton();
      }, 1600);
    }
  });

  ['fullscreenchange', 'webkitfullscreenchange', 'MSFullscreenChange'].forEach(eventName=>{
    document.addEventListener(eventName, syncFullscreenButton);
  });

  syncFullscreenButton();
})();

/* ---------- 5. ENVELOPE ---------- */
(function initEnvelope(){
  const envelope = document.getElementById('envelope');
  const hint = document.getElementById('envelope-hint');
  envelope.addEventListener('click', ()=>{
    envelope.classList.toggle('open');
    hint.textContent = envelope.classList.contains('open') ? '💌 tap to close the letter' : '💋 tap the envelope to open your love letter';
  });
})();

/* ---------- 6. SCROLL CUE ---------- */
document.getElementById('scroll-cue').addEventListener('click', ()=>{
  document.getElementById('letter-section').scrollIntoView({ behavior:'smooth' });
});

/* ---------- 7. FLIP CARDS (More romantic reasons) ---------- */
(function initCards(){
      const reasons = [
        { emoji:'😊', text:"💫 The way your smile lights up my entire universe, every single time. You make even the quietest moments feel magical ✨" },
        { emoji:'💭', text:"💛 I love how, when I’m upset, you stay with me instead of walking away. When I get angry, you listen, understand, and hold my heart with so much patience 🤍" },
        { emoji:'🤗', text:"🫶 And even when things get really hard between us, you never stop trying to fix what we have. You never make me feel like I’m alone in it, and that means everything to me 💞" },
        { emoji:'✨', text:"🌙 The way you make even the most ordinary moments feel like a fairytale. A simple day with you becomes something beautiful and unforgettable 🌸" },
        { emoji:'💪', text:"📱 And of course, I love how you always want to text me, call me, and be a part of my day. Your love makes my life feel fuller, warmer, and brighter ❤️" },
        { emoji:'📣', text:"🎉 How you cheer for me louder than anyone else. My biggest supporter, my safe place, and my favorite person to celebrate with 💖" },
        { emoji:'🎵', text:"🎧 The comfort I feel when I hear your voice, especially after a difficult day — it’s my favorite melody, my calm, my home 🫠💕" },
        { emoji:'💕', text:"🌍 Your kindness toward everyone, and especially the way you care for your loved ones. Your heart is so pure, so golden, and so beautiful 💛" },
        { emoji:'🏠', text:"🏡 How safe and completely myself I feel around you. You are my home, my peace, and my favorite person in the whole world 🫶" },
        { emoji:'♾️', text:"💌 I love all of this about you — all the little things, all the effort, and most of all, the way you choose us even when it isn’t easy. From today, tomorrow, and every day after, I’m yours forever 🩷💍" }
      ];
  const grid = document.getElementById('cards-grid');
  reasons.forEach((item, i)=>{
    const card = document.createElement('div');
    card.className = 'flip-card';
    card.innerHTML = `
      <div class="flip-inner">
        <div class="flip-front">
          <span class="card-emoji">${item.emoji}</span>
          <span class="num">${String(i+1).padStart(2,'0')}</span>
          <span class="label">tap to reveal 💗</span>
        </div>
        <div class="flip-back">${item.text}</div>
      </div>`;
    card.addEventListener('click', ()=> card.classList.toggle('flipped'));
    grid.appendChild(card);
  });
})();

/* ---------- 8. 3D PORTRAIT CAROUSEL + FULL VIEW ---------- */
(function initCarousel(){
  const stage = document.getElementById('carousel-stage');
  const portraits = [
    { src:'assets/cute-girl-1.jpeg', caption:'Her beautiful smile 💕' },
    { src:'assets/cute-girl-2.jpeg', caption:'My little sunshine ☀️' },
    { src:'assets/cute-girl-3.jpeg', caption:'Sweetest energy ever ✨' },
    { src:'assets/cute-girl-4.jpeg', caption:'Beautifully you 🌹' },
    { src:'assets/cute-girl-5.jpeg', caption:'My happy place 🏠' },
    { src:'assets/cute-girl-6.jpeg', caption:'Always adorable 💗' }
  ];
  const N = portraits.length;
  const items = [];

  /* Full-viewport lightbox */
  const viewer = document.createElement('div');
  viewer.className = 'photo-viewer';
  viewer.id = 'photo-viewer';
  viewer.setAttribute('role', 'dialog');
  viewer.setAttribute('aria-modal', 'true');
  viewer.setAttribute('aria-label', 'Full photo view');
  viewer.setAttribute('aria-hidden', 'true');
  viewer.innerHTML = `
    <div class="photo-viewer-backdrop" data-close-viewer></div>
    <button class="photo-viewer-close" type="button" aria-label="Close full view" title="Close (Esc)">×</button>
    <button class="photo-viewer-arrow photo-viewer-prev" type="button" aria-label="Previous photo">‹</button>
    <figure class="photo-viewer-content">
      <img class="photo-viewer-image" src="" alt="" draggable="false" />
      <figcaption class="photo-viewer-caption"></figcaption>
      <span class="photo-viewer-help">Press Esc to close</span>
    </figure>
    <button class="photo-viewer-arrow photo-viewer-next" type="button" aria-label="Next photo">›</button>`;
  document.body.appendChild(viewer);

  const viewerImage = viewer.querySelector('.photo-viewer-image');
  const viewerCaption = viewer.querySelector('.photo-viewer-caption');
  const closeButton = viewer.querySelector('.photo-viewer-close');
  const previousButton = viewer.querySelector('.photo-viewer-prev');
  const nextButton = viewer.querySelector('.photo-viewer-next');
  let lastFocusedElement = null;

  portraits.forEach((portrait, i)=>{
    const el = document.createElement('figure');
    el.className = 'carousel-item';
    el.setAttribute('aria-label', `Portrait ${i + 1}: ${portrait.caption}`);
    el.setAttribute('tabindex', '0');
    el.innerHTML = `
      <img src="${portrait.src}" alt="Cute illustrated portrait" loading="lazy" draggable="false" />
      <span class="full-view-badge" aria-hidden="true">⛶ Full view</span>
      <figcaption><span>♥</span>${portrait.caption}</figcaption>`;
    stage.appendChild(el);
    items.push(el);

    function activateOrOpen(){
      if(i !== current){
        current = i;
        render();
      } else {
        openViewer(i);
      }
    }

    el.addEventListener('click', activateOrOpen);
    el.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        activateOrOpen();
      }
    });
  });

  let current = 0;
  let touchStartX = 0;
  let viewerTouchStartX = 0;

  function render(){
    items.forEach((el, i)=>{
      let offset = i - current;
      if(offset > N/2) offset -= N;
      if(offset < -N/2) offset += N;
      const abs = Math.abs(offset);
      const tx = offset * 145;
      const tz = -abs * 155;
      const rotY = offset * -34;
      const scale = abs === 0 ? 1.05 : 0.92;
      el.style.transform = `translateX(${tx}px) translateZ(${tz}px) rotateY(${rotY}deg) scale(${scale})`;
      el.style.opacity = abs > 2 ? 0 : (1 - abs*0.26);
      el.style.filter = abs === 0 ? 'brightness(1.08) saturate(1.06)' : 'brightness(0.68) saturate(0.82)';
      el.style.zIndex = 10 - abs;
      el.classList.toggle('active', abs === 0);
      el.setAttribute('aria-hidden', abs > 2 ? 'true' : 'false');
      el.setAttribute('aria-label', `${portraits[i].caption}${abs === 0 ? '. Open full view' : '. Select photo'}`);
    });
  }

  function updateViewer(){
    const portrait = portraits[current];
    viewerImage.src = portrait.src;
    viewerImage.alt = `Full view: ${portrait.caption}`;
    viewerCaption.innerHTML = `<span>♥</span> ${portrait.caption}`;
  }

  function openViewer(index){
    current = index;
    render();
    updateViewer();
    lastFocusedElement = document.activeElement;
    viewer.classList.add('open');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('viewer-open');
    closeButton.focus({ preventScroll:true });
  }

  function closeViewer(){
    if(!viewer.classList.contains('open')) return;
    viewer.classList.remove('open');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('viewer-open');
    if(lastFocusedElement && typeof lastFocusedElement.focus === 'function'){
      lastFocusedElement.focus({ preventScroll:true });
    }
  }

  function go(step){
    current = (current + step + N) % N;
    render();
    if(viewer.classList.contains('open')) updateViewer();
  }

  render();
  document.getElementById('arrow-left').addEventListener('click', ()=> go(-1));
  document.getElementById('arrow-right').addEventListener('click', ()=> go(1));
  previousButton.addEventListener('click', ()=> go(-1));
  nextButton.addEventListener('click', ()=> go(1));
  closeButton.addEventListener('click', closeViewer);
  viewer.querySelector('[data-close-viewer]').addEventListener('click', closeViewer);

  stage.addEventListener('touchstart', (e)=>{
    touchStartX = e.changedTouches[0].clientX;
  }, {passive:true});
  stage.addEventListener('touchend', (e)=>{
    const distance = e.changedTouches[0].clientX - touchStartX;
    if(Math.abs(distance) > 45) go(distance > 0 ? -1 : 1);
  }, {passive:true});

  viewer.addEventListener('touchstart', (e)=>{
    viewerTouchStartX = e.changedTouches[0].clientX;
  }, {passive:true});
  viewer.addEventListener('touchend', (e)=>{
    const distance = e.changedTouches[0].clientX - viewerTouchStartX;
    if(Math.abs(distance) > 55) go(distance > 0 ? -1 : 1);
  }, {passive:true});

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && viewer.classList.contains('open')){
      e.preventDefault();
      closeViewer();
      return;
    }
    if(e.key === 'ArrowLeft') go(-1);
    if(e.key === 'ArrowRight') go(1);
  });
})();

/* ---------- 9. PROPOSE SECTION — UN-CLICKABLE "No" BUTTON 💕 ---------- */
(function initPropose(){
  const noBtn = document.getElementById('propose-no');
  const yesBtn = document.getElementById('propose-yes');
  const celebration = document.getElementById('propose-celebration');
  const celebrationHearts = document.getElementById('celebration-hearts');
  const buttonsWrap = document.querySelector('.propose-buttons-wrap');

  let noClickAttempts = 0;
  const funnyTexts = [
    "No 💔",
    "Are you sure? 🥺",
    "Think again! 😢",
    "Please? 🥹",
    "Don't break my heart! 💔",
    "You can't click me! 😏",
    "Haha nice try! 🤭",
    "Nope, not happening! 😜",
    "I'll keep running! 🏃‍♀️",
    "Just say YES! 💕",
    "I'll dodge forever! 🫣",
    "Itna bhi mat sata! 🥺",
    "Arre yaar! 😤",
    "Bas kar yaar! 🥹",
    "I'm too fast! ⚡"
  ];

  // Make the yes button grow bigger with each "no" attempt
  let yesScale = 1;

  function moveNoButton(){
    noClickAttempts++;

    // Change text
    noBtn.textContent = funnyTexts[Math.min(noClickAttempts, funnyTexts.length - 1)];

    // Get viewport bounds
    const parent = buttonsWrap.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const margin = 20;

    // Calculate random position within viewport
    const maxX = window.innerWidth - btnRect.width - margin;
    const maxY = window.innerHeight - btnRect.height - margin;

    const randomX = margin + Math.random() * (maxX - margin);
    const randomY = margin + Math.random() * (maxY - margin);

    // Make the button fly to a random position on screen
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    noBtn.style.zIndex = '9000';
    noBtn.style.transition = 'all 0.2s ease';

    // Shrink the no button
    const shrinkFactor = Math.max(0.5, 1 - noClickAttempts * 0.05);
    noBtn.style.transform = `scale(${shrinkFactor}) rotate(${(Math.random()-0.5)*30}deg)`;

    // Grow the yes button
    yesScale = Math.min(1.5, 1 + noClickAttempts * 0.06);
    yesBtn.style.transform = `scale(${yesScale})`;
    yesBtn.style.fontSize = `${1.2 + noClickAttempts * 0.05}rem`;

    // After many attempts, make the no button even harder to click
    if(noClickAttempts > 5){
      noBtn.style.opacity = Math.max(0.3, 1 - noClickAttempts * 0.08);
    }

    // After 10+ attempts, just make it tiny
    if(noClickAttempts >= 10){
      noBtn.style.transform = `scale(0.3) rotate(${Math.random()*360}deg)`;
      noBtn.style.opacity = '0.2';
    }
  }

  // On hover, move the button
  noBtn.addEventListener('mouseenter', moveNoButton);
  // On touch devices
  noBtn.addEventListener('touchstart', (e)=>{
    e.preventDefault();
    moveNoButton();
  }, {passive:false});
  // If they somehow manage to click, still move it
  noBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    moveNoButton();
  });

  // YES button celebration! 🎉
  yesBtn.addEventListener('click', ()=>{
    // Hide the no button
    noBtn.style.display = 'none';

    // Show celebration
    celebration.classList.remove('hidden');

    // Hearts emoji
    celebrationHearts.innerHTML = '💕💖💗💝💘🥰😘💋🌹✨';

    // Massive burst of hearts
    launchCelebrationBurst();

    // Confetti-like effect
    launchConfetti();

    // Change the yes button
    yesBtn.textContent = 'Forever Together 💕';
    yesBtn.style.pointerEvents = 'none';
    yesBtn.style.animation = 'yes-pulse 1s ease-in-out infinite';
  });

  function launchCelebrationBurst(){
    const emojis = ['💕','💖','💗','💝','💘','🥰','😘','💋','🌹','✨','💐','🦋','⭐','🎉','💍'];
    for(let i=0;i<60;i++){
      setTimeout(()=>{
        const h = document.createElement('div');
        h.className = 'burst-heart';
        h.textContent = emojis[Math.floor(Math.random()*emojis.length)];
        h.style.left = Math.random()*100 + 'vw';
        h.style.setProperty('--drift', (Math.random()*200 - 100) + 'px');
        h.style.fontSize = (1 + Math.random()*2) + 'rem';
        h.style.animationDelay = (Math.random()*0.5) + 's';
        h.style.animationDuration = (2.5 + Math.random()*2) + 's';
        document.body.appendChild(h);
        setTimeout(()=> h.remove(), 5000);
      }, i * 60);
    }
  }

  function launchConfetti(){
    const colors = ['#ff5c8a','#ffb3c6','#e8c170','#ff69b4','#c9a0dc','#ffd700','#ff2d6f'];
    for(let i=0;i<80;i++){
      setTimeout(()=>{
        const c = document.createElement('div');
        c.style.position = 'fixed';
        c.style.left = Math.random()*100 + 'vw';
        c.style.top = '-10px';
        c.style.width = (6 + Math.random()*8) + 'px';
        c.style.height = (6 + Math.random()*8) + 'px';
        c.style.background = colors[Math.floor(Math.random()*colors.length)];
        c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        c.style.pointerEvents = 'none';
        c.style.zIndex = '9999';
        c.style.opacity = '0.9';
        const drift = (Math.random()-0.5) * 200;
        const rot = Math.random() * 720;
        c.style.animation = `confetti-fall ${2 + Math.random()*3}s ease-in forwards`;
        c.style.setProperty('--conf-drift', drift + 'px');
        c.style.setProperty('--conf-rot', rot + 'deg');
        document.body.appendChild(c);
        setTimeout(()=> c.remove(), 6000);
      }, i * 40);
    }
  }

  // Add confetti keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes confetti-fall{
      0%{ transform: translateY(0) translateX(0) rotate(0deg); opacity:0.9; }
      100%{ transform: translateY(100vh) translateX(var(--conf-drift, 0px)) rotate(var(--conf-rot, 360deg)); opacity:0; }
    }
  `;
  document.head.appendChild(style);
})();

/* ---------- 10. BURST EFFECT ---------- */
(function initBurst(){
  const btn = document.getElementById('burst-btn');
  const heart = document.getElementById('closing-heart');

  function burst(){
    const emojis = ['♥','💕','💖','💗','💝','💘','🌹','✨'];
    const count = 30;
    for(let i=0;i<count;i++){
      const h = document.createElement('div');
      h.className = 'burst-heart';
      h.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      h.style.left = (40 + Math.random()*20) + 'vw';
      h.style.setProperty('--drift', (Math.random()*160 - 80) + 'px');
      h.style.fontSize = (1 + Math.random()*1.2) + 'rem';
      h.style.animationDelay = (Math.random()*0.4) + 's';
      document.body.appendChild(h);
      setTimeout(()=> h.remove(), 3800);
    }
  }
  btn.addEventListener('click', burst);
  heart.addEventListener('click', burst);
})();

/* ---------- 11. SCROLL REVEAL ANIMATION ---------- */
(function initScrollReveal(){
  // Add reveal class to elements
  const revealElements = document.querySelectorAll('.stat-card, .section-title, .section-sub, .eyebrow, .envelope-wrap, .propose-buttons-wrap, .closing-heart-wrap, .closing-title, .burst-btn, .closing-footer');
  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry =>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ---------- 12. ROMANTIC CURSOR TRAIL ---------- */
(function initCursorTrail(){
  if(window.innerWidth < 768) return; // skip on mobile

  document.addEventListener('mousemove', (e)=>{
    if(Math.random() > 0.85) return; // throttle

    const heart = document.createElement('div');
    heart.style.position = 'fixed';
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9998';
    heart.style.fontSize = (8 + Math.random()*10) + 'px';
    heart.style.opacity = '0.8';
    heart.style.transition = 'all 1s ease-out';
    heart.style.transform = 'translate(-50%,-50%)';

    const emojis = ['💕','💗','✨','💖','🌸'];
    heart.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    document.body.appendChild(heart);

    requestAnimationFrame(()=>{
      heart.style.opacity = '0';
      heart.style.transform = `translate(-50%,-50%) translateY(-30px) scale(0.3)`;
    });

    setTimeout(()=> heart.remove(), 1100);
  });
})();

/* ---------- 13. MUSIC TOGGLE (Ambient romantic tone) ---------- */
// (function initMusic(){
//   const btn = document.getElementById('music-toggle');
//   if(!btn) return;

//   let audioCtx = null;
//   let isPlaying = false;
//   let oscillators = [];

//   function createRomanticAmbient(){
//     audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//     const masterGain = audioCtx.createGain();
//     masterGain.gain.value = 0.25; // very soft
//     masterGain.connect(audioCtx.destination);

//     // Soft chord — C major 7
//     const freqs = [261.63, 329.63, 392.00, 493.88];
//     freqs.forEach(freq =>{
//       const osc = audioCtx.createOscillator();
//       osc.type = 'sine';
//       osc.frequency.value = freq;

//       const gain = audioCtx.createGain();
//       gain.gain.value = 0.01;
//       gain.gain.linearRampToValueAtTime(0.015, audioCtx.currentTime + 2);

//       osc.connect(gain);
//       gain.connect(masterGain);
//       osc.start();
//       oscillators.push({osc, gain});
//     });
//   }

//   btn.addEventListener('click', ()=>{
//     if(!isPlaying){
//       createRomanticAmbient();
//       isPlaying = true;
//       btn.classList.add('playing');
//       btn.textContent = '🎶';
//     } else {
//       oscillators.forEach(({osc, gain})=>{
//         gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
//         osc.stop(audioCtx.currentTime + 0.6);
//       });
//       oscillators = [];
//       audioCtx.close();
//       audioCtx = null;
//       isPlaying = false;
//       btn.classList.remove('playing');
//       btn.textContent = '🎵';
//     }
//   });
// })();
/* ---------- 13. MUSIC TOGGLE (Play romantic song) ---------- */
(function initMusic(){
  const btn = document.getElementById('music-toggle');
  if(!btn) return;

  let audio = null;
  let isPlaying = false;

  btn.addEventListener('click', ()=>{
    if(!isPlaying){
      // Create audio element
      audio = new Audio();
      audio.src = 'assets/romantic-song.m4a'; // Replace with your song file
      audio.volume = 0.5; // 50% volume
      audio.loop = true; // Loop the song
      audio.play().catch(err => {
        console.warn('Audio play failed:', err);
      });
      
      isPlaying = true;
      btn.classList.add('playing');
      btn.textContent = '🎶';
    } else {
      if(audio){
        audio.pause();
        audio.currentTime = 0;
      }
      isPlaying = false;
      btn.classList.remove('playing');
      btn.textContent = '🎵';
    }
  });
})();