// ── NEURAL NETWORK CANVAS (home page only) ──
const canvas = document.getElementById('neural-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let nodes = [], mouse = { x: -999, y: -999 };
  const NODE_COUNT = 55, MAX_DIST = 160;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2.5 + 1,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  function drawNet() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy; n.pulse += 0.02;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

      const dm = Math.hypot(n.x - mouse.x, n.y - mouse.y);
      if (dm < 120) { n.x += (n.x - mouse.x) * 0.015; n.y += (n.y - mouse.y) * 0.015; }

      const pulse = 0.6 + 0.4 * Math.sin(n.pulse);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${0.5 * pulse})`;
      ctx.fill();
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.35;
          const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
          grad.addColorStop(0, `rgba(0,212,255,${alpha})`);
          grad.addColorStop(1, `rgba(123,47,255,${alpha})`);
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawNet);
  }

  resize(); initNodes(); drawNet();
  window.addEventListener('resize', () => { resize(); initNodes(); });
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
}

// ── COUNTER ANIMATION (home page only) ──
function animateCounter(el, target) {
  let start = 0;
  const dur = 1800;
  const step = timestamp => {
    if (!start) start = timestamp;
    const p = Math.min((timestamp - start) / dur, 1);
    el.textContent = Math.floor(p * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target + (el.dataset.count >= 90 ? '%' : '+');
  };
  requestAnimationFrame(step);
}

// ── INTERSECTION OBSERVER (scroll reveal) ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Counters
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCounter(el, parseInt(el.dataset.count));
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// Skill bars
document.querySelectorAll('.skill-bar-fill').forEach(bar => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { bar.style.width = bar.dataset.width + '%'; obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  obs.observe(bar);
});

// ── PROJECT FILTER (projects page only) ──
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      if (filter === 'all') {
        card.classList.remove('hidden');
      } else {
        const tags = card.dataset.tags || '';
        card.classList.toggle('hidden', !tags.includes(filter));
      }
    });
  });
});

// ── NAV SCROLL ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  nav.style.background = window.scrollY > 40
    ? 'rgba(5,10,24,0.97)'
    : 'rgba(5,10,24,0.85)';
});

// ── MOBILE MENU ──
const hamburgerBtn = document.getElementById('hamburger');
const mobileMenuEl = document.getElementById('mobile-menu');
const mobileCloseBtn = document.getElementById('mobile-close');

if (hamburgerBtn && mobileMenuEl) {
  hamburgerBtn.addEventListener('click', () => mobileMenuEl.classList.add('open'));
}
if (mobileCloseBtn && mobileMenuEl) {
  mobileCloseBtn.addEventListener('click', () => mobileMenuEl.classList.remove('open'));
}
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenuEl && mobileMenuEl.classList.remove('open'));
});

// ── CONTACT FORM (contact page only) ──
function handleFormSubmit() {
  const name = document.getElementById('form-name').value.trim();
  const email = document.getElementById('form-email').value.trim();
  const subject = document.getElementById('form-subject').value.trim();
  const message = document.getElementById('form-message').value.trim();
  const feedback = document.getElementById('form-feedback');

  if (!name || !email || !message) {
    feedback.style.display = 'block';
    feedback.style.background = 'rgba(255,80,80,0.1)';
    feedback.style.border = '1px solid rgba(255,80,80,0.3)';
    feedback.style.color = '#ff8080';
    feedback.textContent = 'Please fill in name, email, and message.';
    return;
  }

  const mailtoLink = `mailto:alishbaharoon988@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
  window.open(mailtoLink, '_blank');

  feedback.style.display = 'block';
  feedback.style.background = 'rgba(0,212,255,0.1)';
  feedback.style.border = '1px solid rgba(0,212,255,0.3)';
  feedback.style.color = 'var(--cyan)';
  feedback.textContent = '✓ Opening your email client — thanks for reaching out!';
}

// ── SMOOTH SCROLL OFFSET (in-page anchors only) ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});
