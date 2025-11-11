// Elementos DOM
const filesList = document.getElementById("filesList");
const fileItems = [...document.querySelectorAll(".file-item")];
const destinations = [...document.querySelectorAll(".destination")];
const messages = document.getElementById("messages");
const win = document.getElementById("win");
const resetBtn = document.getElementById("resetBtn");
const menuBtn = document.getElementById("menuBtn");
const backBtn = document.getElementById("backBtn");
const muteBtn = document.getElementById("muteBtn");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const state = {
  organized: 0,
  total: fileItems.length,
  speak: true,
  correctPlacements: {
    foto: "cloud", // Fotos vão melhor na nuvem para backup
    documento: "cloud", // Documentos na nuvem para acesso universal
    musica: "pc", // Música no PC para acesso rápido offline
  },
};

// ---------- VERIFICAR SE FASE 1 FOI COMPLETADA ----------
window.addEventListener("DOMContentLoaded", () => {
  const fase1Completa = localStorage.getItem("fase1Completa");
  if (!fase1Completa) {
    showMsg("⚠️ Complete a Fase 1 primeiro!", "err");
    setTimeout(() => {
      window.location.href = "../História 1/index.html";
    }, 2000);
  } else {
    showMsg(
      "Organize os arquivos! Alguns são melhores na nuvem, outros no PC 💾",
      "info"
    );
  }
});

// ---------- NARRAÇÃO (Web Speech Synthesis) ----------
function speak(text) {
  if (!state.speak) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
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
  if (type === "ok" || type === "err" || /começar|organize/i.test(text))
    speak(text);
}

function updateProgress() {
  const percentage = (state.organized / state.total) * 100;
  progressBar.style.width = percentage + "%";
  progressText.textContent = `${state.organized}/${state.total} arquivos organizados`;
}

function checkWin() {
  if (state.organized === state.total) {
    // Salva o progresso da Fase 2
    localStorage.setItem("fase2Completa", "true");
    setTimeout(() => {
      win.style.display = "grid";
      confettiBurst();
      speak(
        "Parabéns! Todos os arquivos organizados. Você é um expert em armazenamento!"
      );
    }, 300);
  }
}

// ---------- CONFETTI ----------
function confettiBurst() {
  const count = 40;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "star";
    s.style.left = 50 + (Math.random() * 40 - 20) + "%";
    s.style.top = "45%";
    document.body.appendChild(s);
    const dx = (Math.random() * 2 - 1) * 250;
    const dy = Math.random() * -1 * 350 - 100;
    s.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        {
          transform: `translate(${dx}px, ${dy}px) scale(${
            Math.random() * 1.2 + 0.6
          })`,
          opacity: 0,
        },
      ],
      {
        duration: 1000 + Math.random() * 600,
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
fileItems.forEach((item) => {
  item.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/file", item.dataset.file);
    e.dataTransfer.effectAllowed = "move";
    item.setAttribute("aria-grabbed", "true");
    item.classList.add("dragging");
  });

  item.addEventListener("dragend", () => {
    item.setAttribute("aria-grabbed", "false");
    item.classList.remove("dragging");
  });
});

destinations.forEach((dest) => {
  dest.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    dest.classList.add("highlight");
  });

  dest.addEventListener("dragleave", () => {
    dest.classList.remove("highlight");
  });

  dest.addEventListener("drop", (e) => {
    e.preventDefault();
    dest.classList.remove("highlight");

    const fileName = e.dataTransfer.getData("text/file");
    const fileItem = fileItems.find((item) => item.dataset.file === fileName);

    if (!fileItem) return;

    // Verifica se já foi organizado
    if (fileItem.classList.contains("locked")) {
      showMsg("Este arquivo já foi organizado! 😊", "err");
      playChime(false);
      return;
    }

    const destId = dest.dataset.destination;
    const correctDest = state.correctPlacements[fileName];

    // Move o arquivo para o destino
    const destFiles = dest.querySelector(".dest-files");
    destFiles.appendChild(fileItem);
    fileItem.classList.add("locked");
    fileItem.setAttribute("draggable", "false");

    // Animação de pop
    pop(fileItem);

    // Verifica se está correto
    let isCorrect = destId === correctDest;

    // Aceita qualquer posição como válida (flexibilidade educacional)
    // Mas dá feedback sobre a escolha ideal
    if (isCorrect) {
      showMsg(
        `✅ Perfeito! ${capitalize(fileName)} organizado(a) no lugar ideal!`,
        "ok"
      );
      playChime(true);
    } else {
      const suggestion =
        correctDest === "cloud"
          ? "Nuvem (acesso de qualquer lugar)"
          : "PC (acesso rápido offline)";
      showMsg(
        `✅ Organizado! Mas sabia que ${capitalize(
          fileName
        )} seria ideal na ${suggestion}?`,
        "ok"
      );
      playChime(true);
    }

    state.organized++;
    updateProgress();
    checkWin();

    // Adiciona classe visual
    if (destFiles.children.length > 0) {
      dest.classList.add("filled");
    }
  });
});

// ---------- ANIMAÇÕES ----------
function pop(el) {
  el.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.08)" },
      { transform: "scale(1)" },
    ],
    { duration: 250, easing: "ease-out" }
  );
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------- BOTÕES DE NAVEGAÇÃO ----------
if (resetBtn) {
  resetBtn.addEventListener("click", resetGame);
}

if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
}

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
}

// Botão para ir para a Fase 3
const nextPhaseBtn = document.getElementById("nextPhaseBtn");
if (nextPhaseBtn) {
  nextPhaseBtn.addEventListener("click", () => {
    window.location.href = "../Fase 3/index.html";
  });
}

function resetGame() {
  win.style.display = "none";
  messages.innerHTML = "";
  state.organized = 0;
  updateProgress();

  destinations.forEach((dest) => {
    dest.classList.remove("filled");
  });

  fileItems.forEach((item) => {
    filesList.appendChild(item);
    item.classList.remove("locked");
    item.setAttribute("draggable", "true");
  });

  showMsg(
    "Vamos reorganizar! Pense: qual arquivo você quer acessar de qualquer lugar? 🤔",
    "info"
  );
}

// Inicialização
updateProgress();
