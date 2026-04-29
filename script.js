/* ============================================================
   SUBIN PORTFOLIO — script.js
   ============================================================ */

(function () {
  'use strict';

  // ── DOM refs ──────────────────────────────────────────────
  const intro          = document.getElementById('intro');
  const businessCard   = document.getElementById('businessCard');
  const fanScene       = document.getElementById('fanScene');
  const fanStage       = document.getElementById('fanStage');
  const fanCards       = Array.from(document.querySelectorAll('.fan-card'));
  const overlay        = document.getElementById('transitionOverlay');
  const portfolioPage  = document.getElementById('portfolioPage');
  const portTitle      = document.getElementById('portTitle');
  const portCount      = document.getElementById('portCount');
  const portGrid       = document.getElementById('portGrid');
  const backBtn        = document.getElementById('backBtn');

  // ── State ─────────────────────────────────────────────────
  let introPlayed = false;
  let fanReady    = false;

  // ── Fanned positions: [translateX, translateY, rotateZ] ──
  // 5 cards spread like a fan, slight perspective arc
  const fanPositions = [
    { x: -210, y: 20,  rz: -22, ry:  8 },
    { x: -105, y: -15, rz: -11, ry:  4 },
    { x:    0, y: -30, rz:   0, ry:  0 },
    { x:  105, y: -15, rz:  11, ry: -4 },
    { x:  210, y: 20,  rz:  22, ry: -8 },
  ];

  // ── Mock portfolio data ───────────────────────────────────
  const portfolioData = {
    branding: [
      { label: 'Studio Identity', bg: 'linear-gradient(135deg,#E8DDD0,#C9BAA8)' },
      { label: 'Type Specimen', bg: 'linear-gradient(135deg,#2D2D2D,#555)' },
      { label: 'Annual Report', bg: 'linear-gradient(135deg,#F0E6D3,#D4C3A8)' },
      { label: 'Packaging System', bg: 'linear-gradient(135deg,#1A1A1A,#3A3A3A)' },
      { label: 'Brand Manual', bg: 'linear-gradient(135deg,#FAFAFA,#E0E0DA)' },
      { label: 'Visual Identity', bg: 'linear-gradient(135deg,#C8B8A2,#9E8B74)' },
    ],
    motion: [
      { label: 'Title Sequence', bg: 'linear-gradient(135deg,#0A0A1A,#1C1C2E)' },
      { label: 'Loop Reel', bg: 'linear-gradient(135deg,#0D0D22,#2A0A4A)' },
      { label: 'UI Animation', bg: 'linear-gradient(135deg,#162030,#0F2535)' },
      { label: '3D Explainer', bg: 'linear-gradient(135deg,#1A1228,#2E184A)' },
      { label: 'Brand Reveal', bg: 'linear-gradient(135deg,#080818,#16162A)' },
      { label: 'Kinetic Type', bg: 'linear-gradient(135deg,#0C1020,#1E2040)' },
    ],
    uxui: [
      { label: 'Health App', bg: 'linear-gradient(135deg,#F4E8FF,#DFC4FF)' },
      { label: 'Finance Dashboard', bg: 'linear-gradient(135deg,#E8D5FF,#C49EFF)' },
      { label: 'E-commerce', bg: 'linear-gradient(135deg,#F0E0FF,#D4B0FF)' },
      { label: 'Design System', bg: 'linear-gradient(135deg,#EAD5FF,#C8A0F0)' },
      { label: 'Onboarding Flow', bg: 'linear-gradient(135deg,#F8EEFF,#E2C8FF)' },
      { label: 'AR Interface', bg: 'linear-gradient(135deg,#DCC0FF,#B890E8)' },
    ],
    illustration: [
      { label: 'Editorial Series', bg: 'linear-gradient(135deg,#FFF0D9,#F4D9A8)' },
      { label: 'Character Set', bg: 'linear-gradient(135deg,#FFE8C8,#F0C880)' },
      { label: 'Poster Collection', bg: 'linear-gradient(135deg,#FFF4E0,#FFD898)' },
      { label: 'Book Cover', bg: 'linear-gradient(135deg,#F8E4C0,#E8C87C)' },
      { label: 'Pattern Design', bg: 'linear-gradient(135deg,#FFECD0,#FFCA70)' },
      { label: 'Map Illustration', bg: 'linear-gradient(135deg,#FDE8B8,#F4C860)' },
    ],
    photography: [
      { label: 'Studio Series', bg: 'linear-gradient(135deg,#0A0A0A,#1A1A1A)' },
      { label: 'Fashion Editorial', bg: 'linear-gradient(135deg,#141414,#282828)' },
      { label: 'Urban Study', bg: 'linear-gradient(135deg,#0C0C0C,#202020)' },
      { label: 'Still Life', bg: 'linear-gradient(135deg,#181818,#2A2A2A)' },
      { label: 'Portrait Series', bg: 'linear-gradient(135deg,#101010,#1E1E1E)' },
      { label: 'Conceptual', bg: 'linear-gradient(135deg,#0E0E0E,#222222)' },
    ],
  };

  const fieldLabels = {
    branding:     'Branding',
    motion:       'Motion',
    uxui:         'UX / UI',
    illustration: 'Illustration',
    photography:  'Photography',
  };

  // ── 1. Click / scroll on intro → go to fan scene ─────────
  function goToFanScene() {
    if (introPlayed) return;
    introPlayed = true;

    // Animate card spinning vertically (rotateX) before fading out
    const inner = businessCard.querySelector('.card__inner');
    inner.style.transition = 'transform 0.8s cubic-bezier(0.22,1,0.36,1)';
    inner.style.transform  = 'rotateX(90deg)';

    setTimeout(() => {
      intro.classList.add('fade-out');

      setTimeout(() => {
        intro.classList.add('hidden');
        fanScene.classList.remove('hidden');
        triggerFanAnimation();
      }, 600);
    }, 500);
  }

  businessCard.addEventListener('click', goToFanScene);
  window.addEventListener('wheel',     () => goToFanScene(), { once: true });
  window.addEventListener('touchstart', () => goToFanScene(), { once: true });

  // ── 2. Fan animation ──────────────────────────────────────
  function triggerFanAnimation() {
    // First: all cards appear stacked (scale up from 0)
    fanCards.forEach((card, i) => {
      card.style.opacity   = '0';
      card.style.transform = 'translateY(60px) scale(0.85)';
      card.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s var(--ease-spring) ${i * 0.06}s`;
    });

    // Appear stacked
    requestAnimationFrame(() => {
      fanCards.forEach(card => {
        card.style.opacity   = '1';
        card.style.transform = 'translateY(0) scale(1)';
      });

      // After cards appear, fan them out
      setTimeout(() => {
        fanStage.classList.add('fanned');
        fanCards.forEach((card, i) => {
          const p = fanPositions[i];
          const delay = i * 0.07;
          card.style.transition = `transform 0.75s var(--ease-spring) ${delay}s, box-shadow 0.3s ease, opacity 0.4s ease`;
          card.style.transform  =
            `translate(${p.x}px, ${p.y}px) rotateZ(${p.rz}deg) rotateY(${p.ry}deg)`;
        });

        fanReady = true;
        addHintToFan();
      }, 600);
    });
  }

  function addHintToFan() {
    const hint = document.createElement('p');
    hint.className = 'fan__hint';
    hint.textContent = 'hover & click a card';
    fanScene.appendChild(hint);
  }

  // ── 3. Hover: lift & tilt individual card ─────────────────
  fanCards.forEach((card, i) => {
    card.addEventListener('mouseenter', () => {
      if (!fanReady) return;
      const p = fanPositions[i];
      card.style.transform =
        `translate(${p.x}px, ${p.y - 28}px) rotateZ(${p.rz * 0.5}deg) rotateY(${p.ry}deg) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
      if (!fanReady) return;
      const p = fanPositions[i];
      card.style.transform =
        `translate(${p.x}px, ${p.y}px) rotateZ(${p.rz}deg) rotateY(${p.ry}deg)`;
    });

    // Subtle 3-D mouse parallax
    card.addEventListener('mousemove', (e) => {
      if (!fanReady) return;
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      const p    = fanPositions[i];
      card.style.transform =
        `translate(${p.x}px, ${p.y - 28}px) rotateZ(${p.rz * 0.5}deg) rotateY(${p.ry + dx * 8}deg) rotateX(${-dy * 6}deg) scale(1.05)`;
    });

    // ── 4. Click → transition ─────────────────────────────
    card.addEventListener('click', () => {
      if (!fanReady) return;
      fanReady = false;
      const field = card.dataset.field;
      const color = card.dataset.color;
      startTransition(card, field, color);
    });
  });

  // ── 5. Transition: card expands to fill screen ────────────
  function startTransition(card, field, color) {
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;

    // Place overlay at the card's center
    overlay.style.background     = color;
    overlay.style.width           = rect.width  + 'px';
    overlay.style.height          = rect.height + 'px';
    overlay.style.left            = cx - rect.width  / 2 + 'px';
    overlay.style.top             = cy - rect.height / 2 + 'px';
    overlay.style.transformOrigin = '50% 50%';
    overlay.style.borderRadius    = '18px';
    overlay.style.transform       = 'scale(1)';

    // Force reflow
    overlay.offsetWidth;

    overlay.classList.add('expand');

    setTimeout(() => {
      showPortfolioPage(field, color);
    }, 600);
  }

  // ── 6. Portfolio grid page ────────────────────────────────
  function showPortfolioPage(field, bgColor) {
    const isDark = isColorDark(bgColor);
    const items  = portfolioData[field] || [];

    portTitle.textContent = fieldLabels[field] || field;
    portCount.textContent = items.length + ' works';
    portGrid.innerHTML    = '';

    portfolioPage.style.background = bgColor;
    portfolioPage.style.color      = isDark ? '#F5F0EB' : '#0D0D0D';
    portfolioPage.classList.toggle('dark-page', isDark);
    portfolioPage.classList.remove('hidden');

    // Animate items in with stagger
    items.forEach((item, i) => {
      const el    = document.createElement('div');
      el.className = 'port-item';
      el.style.animationDelay = `${0.1 + i * 0.07}s`;

      const bg   = document.createElement('div');
      bg.className = 'port-item__bg';
      bg.style.background = item.bg;

      const label = document.createElement('div');
      label.className = 'port-item__label';
      label.textContent = item.label;

      el.appendChild(bg);
      el.appendChild(label);
      portGrid.appendChild(el);
    });

    // Collapse overlay (reverse)
    setTimeout(() => {
      overlay.classList.remove('expand');
      overlay.style.transform = 'scale(0)';
      overlay.style.transition = 'transform 0.5s ease';
      setTimeout(() => { overlay.style.transition = 'none'; }, 500);
    }, 50);
  }

  // ── 7. Back button ────────────────────────────────────────
  backBtn.addEventListener('click', () => {
    // Quick white flash to go back
    const flash = document.createElement('div');
    flash.style.cssText = `
      position:fixed;inset:0;z-index:200;
      background:var(--cream);
      opacity:0;
      transition:opacity 0.35s ease;
      pointer-events:none;
    `;
    document.body.appendChild(flash);

    requestAnimationFrame(() => {
      flash.style.opacity = '1';
      setTimeout(() => {
        portfolioPage.classList.add('hidden');
        portGrid.innerHTML = '';
        fanScene.classList.remove('hidden');
        fanReady = false;

        // Reset and re-fan
        fanStage.classList.remove('fanned');
        fanCards.forEach((card, i) => {
          const p = fanPositions[i];
          card.style.transition = 'none';
          card.style.opacity    = '0';
          card.style.transform  = 'translateY(60px) scale(0.85)';
        });

        setTimeout(() => {
          flash.style.opacity = '0';
          setTimeout(() => { flash.remove(); }, 350);
          triggerFanAnimation();
        }, 100);
      }, 300);
    });
  });

  // ── Utility: is a hex/hsl color perceived as dark? ────────
  function isColorDark(hex) {
    if (!hex || hex[0] !== '#') return false;
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0,2), 16);
    const g = parseInt(c.substring(2,4), 16);
    const b = parseInt(c.substring(4,6), 16);
    // Perceived luminance
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    return lum < 128;
  }

})();