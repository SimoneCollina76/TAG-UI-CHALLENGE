/* Marty Supreme — interactions (mirrors the Figma prototype) */
(function () {
  'use strict';

  var DESIGN_WIDTH = 1440;
  var stage = document.getElementById('stage');

  /* ---------- Layout modes (Figma frames as guidelines) ----------
     desktop >= 1024px : the 1440px canvas is scaled to the viewport
     tablet  601-1023  : fluid layout (Figma "Tablet — 768")
     mobile  <= 600    : fluid layout (Figma "Mobile — 402")        */
  var DESKTOP_MIN = 1024;
  var rating = document.querySelector('.rating');
  function isDesktop() { return document.documentElement.clientWidth >= DESKTOP_MIN; }
  function fit() {
    var w = document.documentElement.clientWidth;
    if (w >= DESKTOP_MIN) {
      stage.style.zoom = w / DESIGN_WIDTH;
      rating.style.zoom = '';
    } else {
      stage.style.zoom = '';
      // tablet: the rating banner keeps its proportions, scaled to the column
      var avail = rating.parentElement.clientWidth;
      var cs = getComputedStyle(rating.parentElement);
      avail -= parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      rating.style.zoom = Math.min(1, avail / 1235);
    }
  }
  fit();
  window.addEventListener('resize', fit);

  function scrollToId(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- Header menu: hover / selected (single-select) ---------- */
  var menuBtns = Array.prototype.slice.call(document.querySelectorAll('.menu__btn'));
  menuBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      menuBtns.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      scrollToId(btn.dataset.target);
    });
  });

  /* ---------- Mobile menu (hamburger -> centred overlay) ---------- */
  var burger = document.getElementById('burger');
  var mmenu = document.getElementById('mobileMenu');
  function openMenu() {
    mmenu.hidden = false; void mmenu.offsetWidth; mmenu.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.getElementById('mmenuClose').focus();
  }
  function closeMenu() {
    mmenu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    setTimeout(function () { if (!mmenu.classList.contains('is-open')) mmenu.hidden = true; }, 300);
  }
  burger.addEventListener('click', openMenu);
  document.getElementById('mmenuClose').addEventListener('click', closeMenu);
  mmenu.addEventListener('click', function (e) { if (e.target === mmenu) closeMenu(); });
  mmenu.querySelectorAll('.mmenu__item').forEach(function (it) {
    it.addEventListener('click', function () {
      mmenu.querySelectorAll('.mmenu__item').forEach(function (b) { b.classList.toggle('is-active', b === it); });
      closeMenu();
      scrollToId(it.dataset.target);
    });
  });

  /* ---------- Footer menu ---------- */
  document.querySelectorAll('.footer__menu button').forEach(function (b) {
    b.addEventListener('click', function () { scrollToId(b.dataset.target); });
  });

  /* ---------- Sound buttons (icon swaps waves <-> muted) ---------- */
  function setSoundIcon(btn, on) {
    var icon = btn.querySelector('.icon');
    icon.classList.toggle('icon--muted', on);
    icon.classList.toggle('icon--waves', !on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  /* Synopsis: Marty's story audio */
  var synBtn = document.getElementById('synopsisSound');
  var synAudio = document.getElementById('synopsisAudio');
  synBtn.addEventListener('click', function () {
    if (synAudio.paused) { synAudio.play(); setSoundIcon(synBtn, true); synBtn.setAttribute('aria-label', 'Pause Marty\'s story'); }
    else { synAudio.pause(); setSoundIcon(synBtn, false); synBtn.setAttribute('aria-label', 'Play Marty\'s story'); }
  });
  synAudio.addEventListener('ended', function () { setSoundIcon(synBtn, false); });

  /* ---------- Resources: hover swaps image -> video / image ---------- */
  document.querySelectorAll('.media[data-hover-video], .media[data-hover-img]').forEach(function (m) {
    var layer;
    if (m.dataset.hoverVideo) {
      layer = document.createElement('video');
      layer.src = m.dataset.hoverVideo;
      layer.muted = true; layer.loop = true; layer.playsInline = true; layer.preload = 'none';
    } else {
      layer = document.createElement('img');
      layer.src = m.dataset.hoverImg; layer.alt = ''; layer.loading = 'lazy';
    }
    layer.className = 'media__hover';
    layer.setAttribute('aria-hidden', 'true');
    m.appendChild(layer);
    m.addEventListener('mouseenter', function () {
      m.classList.add('is-hover');
      if (layer.tagName === 'VIDEO') { layer.currentTime = 0; var p = layer.play(); if (p) p.catch(function () {}); }
    });
    m.addEventListener('mouseleave', function () {
      m.classList.remove('is-hover');
      if (layer.tagName === 'VIDEO') layer.pause();
    });
  });

  /* ---------- Trailer ---------- */
  var tVideo = document.getElementById('trailerVideo');
  var tPlay = document.getElementById('trailerPlay');
  var tSound = document.getElementById('trailerSound');
  var trailer = document.getElementById('trailer');
  var userPaused = false;

  function syncPlay() {
    var playing = !tVideo.paused && !tVideo.ended;
    tPlay.classList.toggle('is-playing', playing);
    tPlay.setAttribute('aria-pressed', playing ? 'true' : 'false');
    tPlay.setAttribute('aria-label', playing ? 'Pause trailer' : 'Play trailer');
  }
  tVideo.addEventListener('play', syncPlay);
  tVideo.addEventListener('pause', syncPlay);

  trailer.addEventListener('mouseenter', function () {
    if (!userPaused) { var p = tVideo.play(); if (p) p.catch(function () {}); }
  });
  trailer.addEventListener('mouseleave', function () { tVideo.pause(); });
  tPlay.addEventListener('click', function () {
    if (tVideo.paused) { userPaused = false; tVideo.play(); }
    else { userPaused = true; tVideo.pause(); }
  });
  tSound.addEventListener('click', function () {
    tVideo.muted = !tVideo.muted;
    setSoundIcon(tSound, !tVideo.muted);
    tSound.setAttribute('aria-label', tVideo.muted ? 'Unmute trailer' : 'Mute trailer');
    if (!tVideo.muted && tVideo.paused) { userPaused = false; tVideo.play(); }
  });
  tVideo.addEventListener('ended', function () { scrollToId('tickets'); });

  /* ---------- CTA button: Selected -> (3s) Default; hover; click -> Selected ---------- */
  var cta = document.getElementById('ctaBtn');
  var ctaTimer;
  function ctaSelect() {
    cta.classList.add('is-selected');
    clearTimeout(ctaTimer);
    ctaTimer = setTimeout(function () { cta.classList.remove('is-selected'); }, 3000);
  }
  ctaSelect();
  cta.addEventListener('click', ctaSelect);

  /* ---------- Cast: BIO overlay ---------- */
  var actorBtn = document.getElementById('actorBtn');
  var bio = document.getElementById('bioCard');
  var cast = document.getElementById('cast');
  function placeBio() {
    if (!isDesktop()) { bio.style.left = ''; bio.style.top = ''; return; } // tablet/mobile: centred by CSS
    // Figma: manual overlay at (+390, -45) from the button
    var b = actorBtn.getBoundingClientRect(), c = cast.getBoundingClientRect();
    var z = parseFloat(stage.style.zoom) || 1;
    // getBoundingClientRect is in zoomed px in some browsers, unzoomed in others: normalise via offset ratio
    var ratio = c.width / cast.offsetWidth || z;
    bio.style.left = ((b.left - c.left) / ratio + 390) + 'px';
    bio.style.top = ((b.top - c.top) / ratio - 45) + 'px';
  }
  function openBio() {
    placeBio();
    bio.hidden = false;
    void bio.offsetWidth; bio.classList.add('is-open');
  }
  function closeBio() {
    bio.classList.remove('is-open');
    setTimeout(function () { if (!bio.classList.contains('is-open')) bio.hidden = true; }, 800);
  }
  actorBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (bio.hidden) openBio(); else closeBio();
  });

  /* ---------- Press slider: crossfade every 5s ---------- */
  var cards = document.querySelectorAll('.press__card');
  var pi = 0;
  setInterval(function () {
    cards[pi].classList.remove('is-active');
    pi = (pi + 1) % cards.length;
    cards[pi].classList.add('is-active');
  }, 5500);

  /* ---------- Footer: share overlay + socials ---------- */
  var shareBtn = document.getElementById('shareBtn');
  var shareOv = document.getElementById('shareOverlay');
  function flashSelected(el) {
    el.classList.add('is-selected');
    setTimeout(function () { el.classList.remove('is-selected'); }, 800);
  }
  shareBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    flashSelected(shareBtn);
    if (shareOv.hidden) {
      shareOv.hidden = false;
      void shareOv.offsetWidth; shareOv.classList.add('is-open');
    } else { closeShare(); }
  });
  function closeShare() {
    shareOv.classList.remove('is-open');
    setTimeout(function () { if (!shareOv.classList.contains('is-open')) shareOv.hidden = true; }, 300);
  }
  document.querySelectorAll('.social').forEach(function (s) {
    s.addEventListener('click', function () { flashSelected(s); });
  });

  /* ---------- Close overlays on click outside / Esc ---------- */
  document.addEventListener('click', function (e) {
    if (!bio.hidden && !bio.contains(e.target)) closeBio();
    if (!shareOv.hidden && !shareOv.contains(e.target)) closeShare();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (!bio.hidden) closeBio(); if (!shareOv.hidden) closeShare(); if (!mmenu.hidden) closeMenu(); }
  });
})();
