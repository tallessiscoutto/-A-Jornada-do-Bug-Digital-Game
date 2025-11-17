const menuBtn = document.querySelector("[data-action='menu']");
const replayBtn = document.querySelector("[data-action='replay']");
const soundBtn = document.querySelector("[data-action='sound']");
const canvas = document.getElementById("fireworks");
const ctx = canvas ? canvas.getContext("2d") : null;
const bgMusic = new Audio("./assets/resources/GPW Tarzan Boy.mp3");
bgMusic.loop = true;
const BASE_VOLUME = 0.5;
bgMusic.volume = 0;

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
}

if (replayBtn) {
  replayBtn.addEventListener("click", () => {
    localStorage.removeItem("fase1Completa");
    localStorage.removeItem("fase2Completa");
    localStorage.removeItem("fase3Completa");
    localStorage.removeItem("fase4Completa");
    localStorage.removeItem("jogoCompleto");
    localStorage.removeItem("progressoJogo");
    window.location.href = "../index.html";
  });
}

function updateSoundLabel() {
  if (!soundBtn) return;
  const muted = bgMusic.muted || bgMusic.paused;
  soundBtn.textContent = muted ? "🔈 Ativar música" : "🔇 Mutar música";
}

function fadeTo(targetVolume, duration = 500) {
  const start = bgMusic.volume;
  const delta = targetVolume - start;
  const startTime = performance.now();

  return new Promise((resolve) => {
    function step(now) {
      const t = Math.min((now - startTime) / duration, 1);
      bgMusic.volume = Math.max(0, Math.min(1, start + delta * t));
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    }
    requestAnimationFrame(step);
  });
}

async function startMusic() {
  const audioLiberado = localStorage.getItem("audioLiberado") === "1";
  try {
    bgMusic.muted = false;
    bgMusic.volume = 0;
    await bgMusic.play();
    await fadeTo(BASE_VOLUME);
    localStorage.setItem("audioLiberado", "1");
    pendingResume = false;
  } catch (err) {
    // Autoplay bloqueado: manter pausado e pedir interação
    pendingResume = true;
    bgMusic.muted = true;
    bgMusic.pause();
    if (audioLiberado) {
      const resumeOnInteraction = async () => {
        document.removeEventListener("pointerdown", resumeOnInteraction);
        await startMusic();
      };
      document.addEventListener("pointerdown", resumeOnInteraction, { once: true });
    }
  } finally {
    updateSoundLabel();
  }
}

if (soundBtn) {
  soundBtn.addEventListener("click", async () => {
    if (pendingResume || bgMusic.paused || bgMusic.muted) {
      bgMusic.muted = false;
      try {
        if (bgMusic.paused) {
          await bgMusic.play();
        }
        await fadeTo(BASE_VOLUME);
        pendingResume = false;
      } catch (err) {
        bgMusic.muted = true;
        bgMusic.pause();
      }
    } else {
      await fadeTo(0);
      bgMusic.pause();
      bgMusic.muted = true;
    }
    updateSoundLabel();
  });
}
// Fireworks animation
let particles = [];
let animationId;
let spawnTimer;
let pendingResume = false;

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function spawnFirework() {
  if (!ctx) return;
  const x = Math.random() * window.innerWidth;
  const y = window.innerHeight * (0.2 + Math.random() * 0.35);
  const colors = ["#76e3ff", "#a78bfa", "#fb7185", "#22c55e", "#facc15"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const count = 24 + Math.floor(Math.random() * 12);

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = 2 + Math.random() * 2.4;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 60 + Math.random() * 30,
      color,
      alpha: 1,
      radius: 2 + Math.random() * 1.6,
    });
  }
}

function drawFireworks() {
  if (!ctx || (!particles.length && !spawnTimer)) return;

  animationId = requestAnimationFrame(drawFireworks);
  // fade previous frame softly to avoid trilhos permanentes
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "lighter";

  particles = particles.filter((p) => p.life > 0 && p.alpha > 0);

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.02; // gravity
    p.vx *= 0.99; // drag
    p.vy *= 0.99;
    p.life -= 1;
    p.alpha -= 0.012;

    if (p.life < 20) {
      p.alpha *= 0.9;
      p.radius *= 0.9;
    }

    ctx.globalAlpha = Math.max(p.alpha, 0);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(
      p.x * (canvas.width / window.innerWidth),
      p.y * (canvas.height / window.innerHeight),
      Math.max(p.radius, 0.5),
      0,
      Math.PI * 2
    );
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // quando nada mais está animando, limpa tudo
  if (!spawnTimer && particles.length === 0) {
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    window.removeEventListener("resize", resizeCanvas);
  }
}

function startFireworks() {
  if (!canvas || !ctx) return;
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  spawnFirework();
  spawnTimer = setInterval(spawnFirework, 900);

  drawFireworks();

  setTimeout(() => {
    clearInterval(spawnTimer);
    spawnTimer = null;
    setTimeout(() => cancelAnimationFrame(animationId), 2500);
  }, 6000);
}

window.addEventListener("DOMContentLoaded", () => {
  if (soundBtn) {
    soundBtn.textContent = "🔇 Mutar música";
  }
  startMusic();
  startFireworks();
});
