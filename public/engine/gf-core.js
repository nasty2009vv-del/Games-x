/**
 * GameForge Core Engine v1.0
 * This script is injected into the sandbox iframe to provide the GameForge API.
 */

window.GF = (() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const entities = [];
  const keys = {};

  // Input Handling
  window.addEventListener('keydown', (e) => keys[e.code] = true);
  window.addEventListener('keyup', (e) => keys[e.code] = false);

  const GF = {
    canvas,
    ctx,
    dt: 0,
    time: 0,
    
    // Core Lifecycle
    init: () => {},
    update: () => {},
    draw: () => {},

    // Input API
    Input: {
      isDown: (code) => !!keys[code],
      getAxis: (axis) => {
        if (axis === 'Horizontal') return (keys['ArrowRight'] || keys['KeyD'] ? 1 : 0) - (keys['ArrowLeft'] || keys['KeyA'] ? 1 : 0);
        if (axis === 'Vertical') return (keys['ArrowDown'] || keys['KeyS'] ? 1 : 0) - (keys['ArrowUp'] || keys['KeyW'] ? 1 : 0);
        return 0;
      }
    },

    // Graphics API
    Draw: {
      clear: (color = '#1a1b26') => {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      },
      rect: (x, y, w, h, color = '#fff') => {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
      },
      circle: (x, y, r, color = '#fff') => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      },
      text: (str, x, y, size = 20, color = '#fff') => {
        ctx.fillStyle = color;
        ctx.font = `${size}px sans-serif`;
        ctx.fillText(str, x, y);
      }
    },

    // Entity API
    Entity: {
      create: (props) => {
        const ent = { id: Math.random().toString(36).substr(2, 9), ...props };
        entities.push(ent);
        return ent;
      },
      getAll: () => entities
    }
  };

  let lastTime = 0;
  const loop = (timestamp) => {
    GF.dt = (timestamp - lastTime) / 1000;
    GF.time = timestamp / 1000;
    lastTime = timestamp;

    if (GF.dt < 0.1) {
      GF.update(GF.dt);
      GF.draw();
    }
    requestAnimationFrame(loop);
  };

  // Start the machine
  setTimeout(() => {
    GF.init();
    requestAnimationFrame(loop);
  }, 100);

  // Capture logs
  const originalLog = console.log;
  console.log = (...args) => {
    originalLog(...args);
    window.parent.postMessage({ type: 'GF_LOG', msg: args.join(' ') }, '*');
  };

  return GF;
})();
