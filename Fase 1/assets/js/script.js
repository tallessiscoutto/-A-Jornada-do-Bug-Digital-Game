const tray = document.getElementById("tray");
const items = [...document.querySelectorAll(".item")];
const slots = [...document.querySelectorAll(".slot")];
const messages = document.getElementById("messages");
const win = document.getElementById("win");
const resetBtn = document.getElementById("resetBtn");
const muteBtn = document.getElementById("muteBtn");
 
const state = { correct: 0, total: items.length, speak: true };

// ---------- NARRAÇÃO (Web Speech Synthesis) ----------
function speak(text) {
  if (!state.speak) return;
  try {
    // interrompe falas anteriores para evitar fila longa
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    // preferir voz pt-BR se disponível
    const voices = window.speechSynthesis.getVoices();
    const br = voices.find((v) => /pt(-|_)BR/i.test(v.lang));
    if (br) utter.voice = br;
    utter.lang = br ? br.lang : "pt-BR";
    utter.rate = 1.0;
    utter.pitch = 1.05;
    window.speechSynthesis.speak(utter);
  } catch (e) {
    /* sem suporte */
  }
}

if (muteBtn) {
  muteBtn.addEventListener("click", () => {
    state.speak = !state.speak;
    muteBtn.setAttribute("aria-pressed", String(state.speak));
    muteBtn.textContent = state.speak ? "🔊 Narração" : "🔇 Narração";
  });
}

// ---------- MENSAGENS E CHECAGEM ----------
function showMsg(text, type = "info") {
  messages.innerHTML = "";
  const div = document.createElement("div");
  div.className = `msg ${type === "ok" ? "ok" : type === "err" ? "err" : ""}`;
  div.innerHTML =
    type === "ok" ? `⭐ ${text}` : type === "err" ? `⚠️ ${text}` : `💡 ${text}`;
  messages.appendChild(div);
  // fala apenas para ok/err e algumas infos chaves
  if (type === "ok" || type === "err" || /começar|dica/i.test(text))
    speak(text);
}

function checkWin() {
  if (state.correct === state.total) {
    // Salva o progresso da Fase 1
    localStorage.setItem("fase1Completa", "true");
    setTimeout(() => {
      win.style.display = "grid";
      confettiBurst();
      speak("Parabéns! Tudo conectado. Você desbloqueou a Fase 2!");
    }, 250);
  }
}

// ---------- CONFETTI ----------
function confettiBurst() {
  const count = 36;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "star";
    s.style.left = 50 + (Math.random() * 40 - 20) + "%";
    s.style.top = "45%";
    document.body.appendChild(s);
    const dx = (Math.random() * 2 - 1) * 200;
    const dy = Math.random() * -1 * 300 - 100;
    s.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        {
          transform: `translate(${dx}px, ${dy}px) scale(${
            Math.random() * 1 + 0.6
          })`,
          opacity: 0,
        },
      ],
      {
        duration: 900 + Math.random() * 600,
        easing: "cubic-bezier(.2,.8,.2,1)",
      }
    ).onfinish = () => s.remove();
  }
}

// ---------- EFEITOS SONOROS (WebAudio) ----------
let audioCtx;
function playChime(ok = true) {
  try {
    audioCtx =
      audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = ok ? "triangle" : "sawtooth";
    o.frequency.setValueAtTime(ok ? 740 : 200, audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(
      ok ? 1200 : 140,
      audioCtx.currentTime + 0.18
    );
    g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, audioCtx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
    o.connect(g).connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + 0.36);
  } catch (e) {
    /* ignora */
  }
}

// ---------- DRAG & DROP ----------
items.forEach((it) => {
  it.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/device", it.dataset.device);
    e.dataTransfer.effectAllowed = "move";
    it.setAttribute("aria-grabbed", "true");
    it.style.boxShadow = "0 12px 26px rgba(0,0,0,.55)";
  });
  it.addEventListener("dragend", () => {
    it.setAttribute("aria-grabbed", "false");
    it.style.boxShadow = "";
  });
});

slots.forEach((slot) => {
  slot.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    slot.classList.add("highlight");
  });
  slot.addEventListener("dragleave", () => slot.classList.remove("highlight"));
  slot.addEventListener("drop", (e) => {
    e.preventDefault();
    slot.classList.remove("highlight");
    const device = e.dataTransfer.getData("text/device");
    const item = items.find((i) => i.dataset.device === device);
    if (!item) return;
    if (slot.classList.contains("correct")) {
      showMsg("Este espaço já está ocupado. Tente outro 😊", "err");
      playChime(false);
      return;
    }
    if (slot.dataset.slot === device) {
      slot.appendChild(item);
      item.classList.add("locked");
      item.setAttribute("draggable", "false");
      slot.classList.add("correct");
      const okText = `${capitalize(device)} conectado!`;
      showMsg(okText, "ok");
      playChime(true);
      pop(item);
      state.correct++;
      checkWin();
    } else {
      tray.appendChild(item);
      wiggle(item);
      playChime(false);
      showMsg("Ops! Esse não é o lugar. Tente de novo!", "err");
    }
  });
});

function wiggle(el) {
  el.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-8px)" },
      { transform: "translateX(8px)" },
      { transform: "translateX(0)" },
    ],
    { duration: 280, easing: "ease-in-out" }
  );
}
function pop(el) {
  el.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.06)" },
      { transform: "scale(1)" },
    ],
    { duration: 220, easing: "ease-out" }
  );
}
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

resetBtn.addEventListener("click", resetGame);
function resetGame() {
  win.style.display = "none";
  messages.innerHTML = "";
  state.correct = 0;
  slots.forEach((s) => s.classList.remove("correct"));
  items.forEach((it) => {
    tray.appendChild(it);
    it.classList.remove("locked");
    it.setAttribute("draggable", "true");
  });
  showMsg(
    "Vamos começar! Combine as figuras com os lugares certos. Dica: Teclado e Mouse usam USB.",
    "info"
  );
}

// Botão para ir para a Fase 2
const nextPhaseBtn = document.getElementById("nextPhaseBtn");
if (nextPhaseBtn) {
  nextPhaseBtn.addEventListener("click", () => {
    window.location.href = "../Fase 2/index.html";
  });
}

// Botão para voltar ao menu
const menuBtnHeader = document.getElementById("menuBtn");
if (menuBtnHeader) {
  menuBtnHeader.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
}

showMsg(
  "Vamos começar! Combine as figuras com os lugares certos. Dica: Teclado e Mouse usam USB.",
  "info"
);
