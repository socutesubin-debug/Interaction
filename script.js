/* ============================================================
   SUBIN PORTFOLIO — ScrollMagic Version
   ============================================================ */

(function () {
  'use strict';

  const intro = document.getElementById('intro');
  const businessCard = document.getElementById('businessCard');
  const fanScene = document.getElementById('fanScene');
  const fanStage = document.getElementById('fanStage');
  const fanCards = Array.from(document.querySelectorAll('.fan-card'));
  const overlay = document.getElementById('transitionOverlay');
  const portfolioPage = document.getElementById('portfolioPage');
  const portTitle = document.getElementById('portTitle');
  const portCount = document.getElementById('portCount');
  const portGrid = document.getElementById('portGrid');
  const backBtn = document.getElementById('backBtn');

  let introPlayed = false;
  let fanReady = false;
  let selectedField = null;

  const controller = new ScrollMagic.Controller();

  const fanPositions = [
    { x: -210, y: 20, rz: -22, ry: 8 },
    { x: -105, y: -15, rz: -11, ry: 4 },
    { x: 0, y: -30, rz: 0, ry: 0 },
    { x: 105, y: -15, rz: 11, ry: -4 },
    { x: 210, y: 20, rz: 22, ry: -8 },
  ];

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
    branding: 'Branding',
    motion: 'Motion',
    uxui: 'UX / UI',
    illustration: 'Illustration',
    photography: 'Photography',
  };

  init();

  function init() {
    document.body.classList.remove('scroll-lock');

    fanScene.classList.add('hidden');
    portfolioPage.classList.add('hidden');

    setupScrollMagic();
    setupCardHover();
    setupClickEvents();
  }

  function setupScrollMagic() {
    new ScrollMagic.Scene({
      triggerElement: 'body',
      triggerHook: 0,
      duration: window.innerHeight * 0.9,
    })
      .on('progress', function (e) {
        const p = e.progress;

        businessCard.style.transform = `
          translateY(${p * 80}px)
          rotate(${p * 18}deg)
          scale(${1 - p * 0.18})
        `;

        businessCard.style.opacity = 1 - p * 0.85;
        intro.querySelector('.intro__hint').style.opacity = 1 - p * 1.5;
      })
      .on('end', function () {
        if (!introPlayed) goToFanScene();
      })
      .addTo(controller);

    new ScrollMagic.Scene({
      triggerElement: 'body',
      triggerHook: 0,
      offset: window.innerHeight * 1.1,
      duration: window.innerHeight * 1.4,
    })
      .on('progress', function (e) {
        if (!fanReady) return;

        const p = e.progress;

        fanCards.forEach((card, i) => {
          const pos = fanPositions[i];
          const depth = Math.sin(p * Math.PI) * 20;
          const spread = 1 + p * 0.18;

          card.style.transform = `
            translate(${pos.x * spread}px, ${pos.y - depth}px)
            rotateZ(${pos.rz + p * (i - 2) * 4}deg)
            rotateY(${pos.ry}deg)
          `;
        });

        const title = document.querySelector('.fan__title');
        if (title) {
          title.style.transform = `translateY(${-p * 34}px)`;
          title.style.opacity = 1 - p * 0.25;
        }
      })
      .addTo(controller);
  }

  function goToFanScene() {
    if (introPlayed) return;
    introPlayed = true;

    const inner = businessCard.querySelector('.card__inner');

    inner.style.transition = 'transform 0.8s cubic-bezier(0.22,1,0.36,1)';
    inner.style.transform = 'rotateX(90deg)';

    setTimeout(() => {
      intro.classList.add('fade-out');

      setTimeout(() => {
        intro.classList.add('hidden');
        fanScene.classList.remove('hidden');
        triggerFanAnimation();
        window.scrollTo({
          top: window.innerHeight * 1.15,
          behavior: 'smooth',
        });
      }, 600);
    }, 420);
  }

  function triggerFanAnimation() {
    fanCards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(80px) scale(0.86) rotateZ(0deg)';
      card.style.transition = `
        opacity 0.5s ease ${i * 0.06}s,
        transform 0.55s var(--ease-spring) ${i * 0.06}s
      `;
    });

    requestAnimationFrame(() => {
      fanCards.forEach((card) => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      });

      setTimeout(() => {
        fanStage.classList.add('fanned');

        fanCards.forEach((card, i) => {
          const p = fanPositions[i];

          card.style.transition = `
            transform 0.8s var(--ease-spring) ${i * 0.07}s,
            box-shadow 0.3s ease,
            opacity 0.4s ease
          `;

          card.style.transform = `
            translate(${p.x}px, ${p.y}px)
            rotateZ(${p.rz}deg)
            rotateY(${p.ry}deg)
          `;
        });

        fanReady = true;
        addHintToFan();
      }, 620);
    });
  }

  function addHintToFan() {
    if (document.querySelector('.fan__hint')) return;

    const hint = document.createElement('p');
    hint.className = 'fan__hint';
    hint.textContent = 'hover, scroll & click a card';
    fanScene.appendChild(hint);
  }

  function setupCardHover() {
    fanCards.forEach((card, i) => {
      card.addEventListener('mouseenter', () => {
        if (!fanReady) return;
        const p = fanPositions[i];

        card.style.transform = `
          translate(${p.x}px, ${p.y - 34}px)
          rotateZ(${p.rz * 0.5}deg)
          rotateY(${p.ry}deg)
          scale(1.06)
        `;
      });

      card.addEventListener('mouseleave', () => {
        if (!fanReady) return;
        const p = fanPositions[i];

        card.style.transform = `
          translate(${p.x}px, ${p.y}px)
          rotateZ(${p.rz}deg)
          rotateY(${p.ry}deg)
          scale(1)
        `;
      });

      card.addEventListener('mousemove', (e) => {
        if (!fanReady) return;

        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const p = fanPositions[i];

        card.style.transform = `
          translate(${p.x}px, ${p.y - 34}px)
          rotateZ(${p.rz * 0.5}deg)
          rotateY(${p.ry + dx * 9}deg)
          rotateX(${-dy * 7}deg)
          scale(1.06)
        `;
      });
    });
  }

  function setupClickEvents() {
    businessCard.addEventListener('click', goToFanScene);

    fanCards.forEach((card) => {
      card.addEventListener('click', () => {
        if (!fanReady) return;

        fanReady = false;

        const field = card.dataset.field;
        const color = card.dataset.color;

        selectedField = field;
        startTransition(card, field, color);
      });
    });

    backBtn.addEventListener('click', goBackToFan);
  }

  function startTransition(card, field, color) {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    overlay.style.background = color;
    overlay.style.width = rect.width + 'px';
    overlay.style.height = rect.height + 'px';
    overlay.style.left = cx - rect.width / 2 + 'px';
    overlay.style.top = cy - rect.height / 2 + 'px';
    overlay.style.transformOrigin = '50% 50%';
    overlay.style.borderRadius = '18px';
    overlay.style.transform = 'scale(1)';

    overlay.offsetWidth;
    overlay.classList.add('expand');

    fanCards.forEach((item, i) => {
      if (item !== card) {
        item.style.transition = `opacity 0.35s ease ${i * 0.03}s, transform 0.45s ease`;
        item.style.opacity = '0';
        item.style.transform += ' scale(0.85)';
      }
    });

    setTimeout(() => {
      showPortfolioPage(field, color);
    }, 620);
  }

  function showPortfolioPage(field, bgColor) {
    const isDark = isColorDark(bgColor);
    const items = portfolioData[field] || [];

    portTitle.textContent = fieldLabels[field] || field;
    portCount.textContent = items.length + ' works';
    portGrid.innerHTML = '';

    portfolioPage.style.background = bgColor;
    portfolioPage.style.color = isDark ? '#F5F0EB' : '#0D0D0D';
    portfolioPage.classList.toggle('dark-page', isDark);
    portfolioPage.classList.remove('hidden');

    document.body.classList.add('scroll-lock');

    items.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'port-item';
      el.style.animationDelay = `${0.1 + i * 0.08}s`;

      const bg = document.createElement('div');
      bg.className = 'port-item__bg';
      bg.style.background = item.bg;

      const label = document.createElement('div');
      label.className = 'port-item__label';
      label.textContent = item.label;

      el.appendChild(bg);
      el.appendChild(label);
      portGrid.appendChild(el);
    });

    setTimeout(() => {
      overlay.classList.remove('expand');
      overlay.style.transform = 'scale(0)';
      overlay.style.transition = 'transform 0.45s ease';

      setTimeout(() => {
        overlay.style.transition = 'none';
      }, 500);
    }, 80);
  }

  function goBackToFan() {
    const flash = document.createElement('div');

    flash.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 200;
      background: var(--cream);
      opacity: 0;
      transition: opacity 0.35s ease;
      pointer-events: none;
    `;

    document.body.appendChild(flash);

    requestAnimationFrame(() => {
      flash.style.opacity = '1';

      setTimeout(() => {
        portfolioPage.classList.add('hidden');
        portGrid.innerHTML = '';
        fanScene.classList.remove('hidden');
        document.body.classList.remove('scroll-lock');

        fanReady = false;
        fanStage.classList.remove('fanned');

        fanCards.forEach((card) => {
          card.style.transition = 'none';
          card.style.opacity = '0';
          card.style.transform = 'translateY(80px) scale(0.86)';
        });

        setTimeout(() => {
          flash.style.opacity = '0';

          setTimeout(() => {
            flash.remove();
          }, 350);

          triggerFanAnimation();

          window.scrollTo({
            top: window.innerHeight * 1.15,
            behavior: 'smooth',
          });
        }, 120);
      }, 300);
    });
  }

  function isColorDark(hex) {
    if (!hex || hex[0] !== '#') return false;

    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);

    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    return lum < 128;
  }
})();
