/**
 * Hero block � Cecabank canvas constellation
 * Replaces the previous carousel implementation.
 *
 * Authored table structure:
 * | hero        |
 * | title text  |
 *
 * The first cell of the first row is used as the h1 title.
 */
export default function decorate(block) {
  if (block.dataset.initialized) return;
  block.dataset.initialized = 'true';

  // Extract title from first row
  const firstRow = block.querySelector(':scope > div');
  let titleText = '';
  if (firstRow) {
    const titleEl = firstRow.querySelector('h1, h2, h3, h4, h5, h6, p');
    titleText = titleEl ? titleEl.textContent.trim() : firstRow.textContent.trim();
  }

  // Clear block
  block.textContent = '';

  // Canvas (behind content)
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.className = 'hero-canvas';
  block.appendChild(canvas);

  // Title
  const titleH1 = document.createElement('h1');
  titleH1.className = 'hero-title';
  titleH1.textContent = titleText;
  block.appendChild(titleH1);

  // === Canvas Constellation Engine ===
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isTouchOnly = window.matchMedia('(hover: none)');

  const NODE_COUNT = 80;
  const PROXIMITY = 130;
  const ATTRACTION_RADIUS = 250; // larger zone so nodes track the cursor from farther away
  const NODE_SPEED = 0.3; // slower base drift

  const tealColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary-color').trim() || '#00A8B5';

  let ctx;
  let nodes = [];
  const mouse = { x: -9999, y: -9999, active: false };
  let animationId = null;

  function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const bigint = parseInt(clean, 16);
    /* eslint-disable no-bitwise */
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    /* eslint-enable no-bitwise */
  }

  const [r, g, b] = hexToRgb(tealColor);

  function resizeCanvas() {
    canvas.width = block.offsetWidth;
    canvas.height = block.offsetHeight;
  }

  function createNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i += 1) {
      const bvx = (Math.random() - 0.5) * NODE_SPEED;
      const bvy = (Math.random() - 0.5) * NODE_SPEED;
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: bvx,
        vy: bvy,
        baseVx: bvx,
        baseVy: bvy,
      });
    }
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    nodes.forEach((node) => {
      // Cursor tracking (desktop only) — nodes actively follow the pointer
      if (!isTouchOnly.matches && mouse.active) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < ATTRACTION_RADIUS && dist > 0) {
          // Strong pull: closer nodes follow faster
          const strength = 1 - dist / ATTRACTION_RADIUS;
          node.vx += (dx / dist) * strength * 1.5;
          node.vy += (dy / dist) * strength * 1.5;
        }
      }

      // Light drift back to base when cursor is away
      if (!mouse.active) {
        node.vx = node.vx * 0.97 + node.baseVx * 0.03;
        node.vy = node.vy * 0.97 + node.baseVy * 0.03;
      } else {
        // Gentle drag when cursor is active so nodes don't fly off
        node.vx *= 0.88;
        node.vy *= 0.88;
      }

      // Clamp speed
      const speed = Math.sqrt(node.vx ** 2 + node.vy ** 2);
      const maxSpeed = mouse.active ? NODE_SPEED * 8 : NODE_SPEED * 3;
      if (speed > maxSpeed) {
        node.vx = (node.vx / speed) * maxSpeed;
        node.vy = (node.vy / speed) * maxSpeed;
      }

      node.x += node.vx;
      node.y += node.vy;

      // Bounce off edges
      if (node.x < 0 || node.x > canvas.width) {
        node.vx *= -1;
        node.baseVx *= -1;
        node.x = Math.max(0, Math.min(canvas.width, node.x));
      }
      if (node.y < 0 || node.y > canvas.height) {
        node.vy *= -1;
        node.baseVy *= -1;
        node.y = Math.max(0, Math.min(canvas.height, node.y));
      }
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < PROXIMITY) {
          const alpha = (1 - dist / PROXIMITY) * 0.6;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},0.8)`;
      ctx.fill();
    });

    animationId = requestAnimationFrame(draw);
  }

  function init() {
    ctx = canvas.getContext('2d');
    resizeCanvas();
    createNodes();
    if (!prefersReduced.matches) {
      draw();
    }
  }

  // Mouse interaction
  block.addEventListener('mousemove', (e) => {
    if (isTouchOnly.matches) return;
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  block.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Resize handler
  const resizeObs = new ResizeObserver(() => {
    resizeCanvas();
  });
  resizeObs.observe(block);

  // Respect reduced motion preference change
  prefersReduced.addEventListener('change', () => {
    if (prefersReduced.matches) {
      if (animationId) cancelAnimationFrame(animationId);
      animationId = null;
    } else {
      draw();
    }
  });

  init();
}
