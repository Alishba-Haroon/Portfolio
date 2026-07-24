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
const img = document.querySelector(".ai-object");

document.addEventListener("mousemove",(e)=>{

    const x=(e.clientX/window.innerWidth-0.5)*20;
    const y=(e.clientY/window.innerHeight-0.5)*15;

    img.style.transform=
    `translateX(${x}px)
     translateY(${y}px)
     rotateY(${x}deg)
     rotateX(${-y}deg)`;

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
/* ============================================
   3D LIVE EFFECTS ADD-ON
   Drop-in file, does not touch your existing script.js
   Just add: <script src="3d-effects.js"></script> after script.js
   ============================================ */

(function () {
  "use strict";

  // ---- CONFIG: change this one color to match your theme ----
  const ACCENT = "124, 92, 255"; // purple, as "r, g, b"

  /* ---------------------------------------------
     1. 3D ROTATING NEURAL NETWORK ON #neural-canvas
  --------------------------------------------- */
  function initNeuralCanvas3D() {
    const canvas = document.getElementById("neural-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width, height;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Generate nodes in 3D space
    const NODE_COUNT = window.innerWidth < 768 ? 40 : 80;
    const RADIUS = Math.min(window.innerWidth, window.innerHeight) * 0.4;
    const nodes = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      nodes.push({
        x: RADIUS * Math.sin(phi) * Math.cos(theta),
        y: RADIUS * Math.sin(phi) * Math.sin(theta),
        z: RADIUS * Math.cos(phi),
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const FOV = 500;
    let angleY = 0;
    let angleX = 0;
    let targetAngleX = 0;
    let targetAngleY = 0;

    // Mouse parallax influences rotation slightly
    window.addEventListener("mousemove", (e) => {
      targetAngleY = (e.clientX / window.innerWidth - 0.5) * 0.6;
      targetAngleX = (e.clientY / window.innerHeight - 0.5) * 0.6;
    });

    function project(node) {
      // Rotate around Y axis
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      let x = node.x * cosY - node.z * sinY;
      let z = node.x * sinY + node.z * cosY;

      // Rotate around X axis
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      let y = node.y * cosX - z * sinX;
      z = node.y * sinX + z * cosX;

      const scale = FOV / (FOV + z);
      return {
        x: width / 2 + x * scale,
        y: height / 2 + y * scale,
        scale,
        z,
      };
    }

    function animate(time) {
      ctx.clearRect(0, 0, width, height);

      angleY += 0.0009;
      angleX += (targetAngleX - angleX) * 0.02;
      angleY += (targetAngleY * 0.3);

      const projected = nodes.map(project);

      // Draw connections between nearby nodes
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const opacity = (1 - dist / 140) * 0.25 * Math.min(a.scale, b.scale);
            ctx.strokeStyle = `rgba(${ACCENT}, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes (closer = bigger + brighter, true 3D depth feel)
      projected.forEach((p, i) => {
        const pulse = Math.sin(time * 0.002 + nodes[i].pulse) * 0.3 + 0.7;
        const size = Math.max(0.5, 2.2 * p.scale * pulse);
        const opacity = Math.min(1, p.scale) * 0.9;

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT}, ${opacity})`;
        ctx.shadowColor = `rgba(${ACCENT}, ${opacity})`;
        ctx.shadowBlur = 8 * p.scale;
        ctx.fill();
      });

      ctx.shadowBlur = 0;
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  /* ---------------------------------------------
     2. 3D TILT ON PROFILE AVATAR (mouse-follow)
  --------------------------------------------- */
  function initAvatarTilt() {
    const wrap = document.querySelector(".profile-avatar-wrap");
    const avatar = document.querySelector(".profile-avatar");
    if (!wrap || !avatar) return;

    const MAX_TILT = 18;

    wrap.addEventListener("mousemove", (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * MAX_TILT;
      const rotateX = -((y - centerY) / centerY) * MAX_TILT;

      avatar.classList.add("tilting");
      avatar.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    wrap.addEventListener("mouseleave", () => {
      avatar.classList.remove("tilting");
      avatar.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    });
  }

  /* ---------------------------------------------
     3. PARALLAX DEPTH ON HERO BACKGROUND LAYERS
  --------------------------------------------- */
  function initParallaxLayers() {
    const gradient = document.querySelector(".hero-bg-gradient");
    const mesh = document.querySelector(".mesh-overlay");
    if (!gradient && !mesh) return;

    window.addEventListener("mousemove", (e) => {
      const xRatio = e.clientX / window.innerWidth - 0.5;
      const yRatio = e.clientY / window.innerHeight - 0.5;

      if (gradient) {
        gradient.style.transform = `translate3d(${xRatio * 25}px, ${yRatio * 25}px, 0) scale(1.05)`;
      }
      if (mesh) {
        mesh.style.transform = `translate3d(${xRatio * -15}px, ${yRatio * -15}px, 0)`;
      }
    });
  }

  /* ---------------------------------------------
     4. LIVE AI TERMINAL — TYPEWRITER TRAINING LOG
  --------------------------------------------- */
  function initAiTerminal() {
    const el = document.getElementById("ai-terminal-text");
    if (!el) return;

    const lines = [
      "$ model.load('alishba/nlp-transformer-v3')",
      "> tokenizing input corpus... done",
      "> epoch 12/50  |  loss: 0.2841  |  acc: 88.4%",
      "> epoch 27/50  |  loss: 0.0913  |  acc: 93.7%",
      "> epoch 45/50  |  loss: 0.0342  |  acc: 95.2%",
      "> validation passed ✔  model saved to /checkpoints",
      "> deploying inference pipeline...",
      "> status: online — ready for requests ✔",
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let currentText = "";
    let deleting = false;

    function tick() {
      const fullLine = lines[lineIndex];

      if (!deleting) {
        currentText = fullLine.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === fullLine.length) {
          deleting = false;
          el.textContent = currentText;
          setTimeout(() => {
            deleting = true;
            tick();
          }, 1400);
          return;
        }
      } else {
        currentText = fullLine.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          deleting = false;
          lineIndex = (lineIndex + 1) % lines.length;
        }
      }

      el.textContent = currentText;
      const speed = deleting ? 20 : 35 + Math.random() * 30;
      setTimeout(tick, speed);
    }

    tick();
  }

  /* ---------------------------------------------
     5. REAL 3D TORUS KNOT (Three.js) — reference-style
        glossy rotating shape behind the profile photo
  --------------------------------------------- */
  function initTorusKnot() {
    const canvas = document.getElementById("torus-canvas");
    const wrap = document.querySelector(".hero-right");
    if (!canvas || !wrap || typeof THREE === "undefined") return;

    let width = wrap.clientWidth + 80;
    let height = wrap.clientHeight + 80;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // Warm gold/amber metallic knot, matching a professional AI-lab look
    const geometry = new THREE.TorusKnotGeometry(1.35, 0.4, 150, 20, 2, 3);
    const material = new THREE.MeshStandardMaterial({
      color: 0xd8a86b,
      metalness: 0.75,
      roughness: 0.25,
      transparent: true,
      opacity: 0.85,
    });
    const knot = new THREE.Mesh(geometry, material);
    scene.add(knot);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffd9a0, 1.1);
    key.position.set(3, 4, 5);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x7c5cff, 0.8);
    rim.position.set(-4, -2, -3);
    scene.add(rim);

    function onResize() {
      width = wrap.clientWidth + 80;
      height = wrap.clientHeight + 80;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener("resize", onResize);

    function animate() {
      knot.rotation.x += 0.004;
      knot.rotation.y += 0.006;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ---------------------------------------------
     INIT
  --------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initNeuralCanvas3D();
    initAvatarTilt();
    initParallaxLayers();
    initAiTerminal();
    initTorusKnot();
  });
})();
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
