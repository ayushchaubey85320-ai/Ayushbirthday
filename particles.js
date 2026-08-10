/* ==========================================================================
   INTERACTIVE CANVAS PARTICLE ENGINE (Cyber Electric Sparks, Shockwaves, Confetti)
   ========================================================================== */

export class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.particles = [];
    this.mouseTrail = [];
    this.confetti = [];
    
    this.mouse = { x: -1000, y: -1000, active: false };

    this.initCanvas();
    this.createInitialParticles(70);
    this.bindEvents();
    this.animate();
  }

  initCanvas() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.initCanvas());

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;
      this.addMouseTrailParticle(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
        this.addMouseTrailParticle(this.mouse.x, this.mouse.y);
      }
    });
  }

  createInitialParticles(count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 6 + 3,
        speedY: Math.random() * 1.2 + 0.4,
        swaySpeed: Math.random() * 0.03 + 0.01,
        swayAngle: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.7 + 0.3,
        color: this.getRandomParticleColor(),
        type: Math.random() > 0.4 ? 'dumbbell' : 'spark'
      });
    }
  }

  getRandomParticleColor() {
    const colors = [
      '#00f2fe', '#ffd700', '#ff0055', '#ffffff', '#0077ff'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  addMouseTrailParticle(x, y) {
    this.mouseTrail.push({
      x: x + (Math.random() - 0.5) * 15,
      y: y + (Math.random() - 0.5) * 15,
      size: Math.random() * 8 + 4,
      opacity: 1,
      life: 0.04,
      color: this.getRandomParticleColor(),
      type: Math.random() > 0.5 ? 'dumbbell' : 'spark'
    });
  }

  triggerConfettiBurst(x, y) {
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 14 + 5;
      this.confetti.push({
        x: x || this.width / 2,
        y: y || this.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        size: Math.random() * 10 + 4,
        color: this.getRandomParticleColor(),
        opacity: 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12
      });
    }
  }

  drawSpark(x, y, size, color, opacity) {
    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    this.ctx.fillStyle = color;
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = size * 2;

    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  drawDumbbell(x, y, size, color, opacity) {
    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = size * 1.5;

    // Handle bar
    this.ctx.lineWidth = size * 0.4;
    this.ctx.beginPath();
    this.ctx.moveTo(x - size * 1.2, y);
    this.ctx.lineTo(x + size * 1.2, y);
    this.ctx.stroke();

    // Weight plates
    this.ctx.fillRect(x - size * 1.4, y - size * 0.8, size * 0.4, size * 1.6);
    this.ctx.fillRect(x + size * 1.0, y - size * 0.8, size * 0.4, size * 1.6);
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Floating Particles
    this.particles.forEach((p) => {
      p.y -= p.speedY;
      p.swayAngle += p.swaySpeed;
      p.x += Math.sin(p.swayAngle) * 0.8;

      if (p.y < -20) {
        p.y = this.height + 20;
        p.x = Math.random() * this.width;
      }

      if (p.type === 'dumbbell') {
        this.drawDumbbell(p.x, p.y, p.size, p.color, p.opacity);
      } else {
        this.drawSpark(p.x, p.y, p.size, p.color, p.opacity);
      }
    });

    // Mouse Trail Particles
    for (let i = this.mouseTrail.length - 1; i >= 0; i--) {
      const trail = this.mouseTrail[i];
      trail.opacity -= trail.life;
      trail.y -= 1;
      if (trail.type === 'dumbbell') {
        this.drawDumbbell(trail.x, trail.y, trail.size, trail.color, trail.opacity);
      } else {
        this.drawSpark(trail.x, trail.y, trail.size, trail.color, trail.opacity);
      }
      if (trail.opacity <= 0) {
        this.mouseTrail.splice(i, 1);
      }
    }

    // Confetti Burst Particles
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.25; // gravity
      c.opacity -= 0.015;
      c.rotation += c.rotationSpeed;

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(c.opacity, 0);
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate((c.rotation * Math.PI) / 180);
      this.ctx.fillStyle = c.color;
      this.ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 1.4);
      this.ctx.restore();

      if (c.opacity <= 0) {
        this.confetti.splice(i, 1);
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}
