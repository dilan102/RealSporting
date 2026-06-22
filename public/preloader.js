(function(){
  const NINOS = '/brand/preloader-ninos.jpg';
  const NINAS = '/brand/preloader-ninas.jpg';

  const values = [
    { word:'RESPETO',     bg: NINOS, tagline:'Fundamento del juego'      },
    { word:'DISCIPLINA',  bg: NINAS, tagline:'El camino al éxito'        },
    { word:'EMPATÍA',     bg: NINOS, tagline:'Unidos como equipo'        },
    { word:'PASIÓN',      bg: NINAS, tagline:'Corazón Real Sporting'     },
    { word:'LIDERAZGO',   bg: NINOS, tagline:'Formamos campeones'        },
  ];

  const TOTAL_MS  = 5000;
  const SLIDE_MS  = TOTAL_MS / values.length;

  const panel       = document.getElementById('panel');
  const valueWord   = document.getElementById('valueWord');
  const goldBar     = document.getElementById('goldBar');
  const tagline     = document.getElementById('tagline');
  const bgPhoto     = document.getElementById('bgPhoto');
  const progressFill= document.getElementById('progressFill');
  const dotsEl      = document.getElementById('dots');
  const preloader   = document.getElementById('preloader');

  values.forEach((_,i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i===0?' active':'');
    d.id = 'dot-'+i;
    dotsEl.appendChild(d);
  });

  function reflow(el) { void el.offsetWidth; }

  function resetAnim() {
    ['expand','collapse'].forEach(c => panel.classList.remove(c));
    ['appear'].forEach(c => {
      valueWord.classList.remove(c);
      goldBar.classList.remove(c);
      tagline.classList.remove(c);
    });
    reflow(panel); reflow(valueWord);
  }

  function showSlide(idx) {
    const v = values[idx];
    bgPhoto.classList.remove('active');
    bgPhoto.style.backgroundImage = `url(${v.bg})`;
    setTimeout(() => bgPhoto.classList.add('active'), 40);

    document.querySelectorAll('.dot').forEach((d,i) =>
      d.classList.toggle('active', i===idx));

    valueWord.textContent = v.word;
    tagline.textContent   = v.tagline;

    resetAnim();
    panel.classList.add('expand');
    setTimeout(() => {
      valueWord.classList.add('appear');
      goldBar.classList.add('appear');
      tagline.classList.add('appear');
    }, 30);
  }

  let current = 0, startTime = null;

  function nextSlide() {
    resetAnim();
    panel.classList.add('collapse');
    setTimeout(() => { current++; showSlide(current); }, 360);
  }

  function tick(ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    progressFill.style.width = Math.min(100, (elapsed/TOTAL_MS)*100) + '%';

    const target = Math.floor(elapsed / SLIDE_MS);
    if (target > current && current < values.length-1) nextSlide();

    if (elapsed < TOTAL_MS) {
      requestAnimationFrame(tick);
    } else {
      progressFill.style.width = '100%';
      setTimeout(() => {
        preloader.classList.add('done');
        setTimeout(() => preloader.remove(), 600);
      }, 200);
    }
  }

  showSlide(0);
  requestAnimationFrame(tick);
})();
