const logos = document.querySelectorAll(".logo-item");
const dropZones = document.querySelectorAll(".drop-zone");
const winModal = document.getElementById("win");
const resetBtn = document.getElementById("resetBtn");
const menuBtn = document.getElementById("menuBtn");

let correctDrops = 0;


logos.forEach((logo) => {
  logo.addEventListener("dragstart", (e) => {
    logo.classList.add("dragging");
    e.dataTransfer.setData("so", logo.dataset.so);
  });

  logo.addEventListener("dragend", () => {
    logo.classList.remove("dragging");
  });
});

dropZones.forEach((zone) => {
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone.style.background = "rgba(255, 255, 255, 0.1)";
    zone.style.borderColor = "#76e3ff";
  });

  zone.addEventListener("dragleave", () => {
    zone.style.background = "rgba(0, 0, 0, 0.1)";
    zone.style.borderColor = "rgba(255, 255, 255, 0.2)";
  });

  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    const draggedSO = e.dataTransfer.getData("so");
    const correctSO = zone.id.replace("drop-", "");

    zone.style.background = "rgba(0, 0, 0, 0.1)";
    zone.style.borderColor = "rgba(255, 255, 255, 0.2)";

    if (zone.classList.contains("filled")) return;

    if (draggedSO === correctSO) {
      zone.textContent = "✅ " + draggedSO.toUpperCase() + " instalado!";
      zone.classList.add("filled");
      document
        .querySelector(`.station-card[data-so='${draggedSO}']`)
        .classList.add("filled");
      correctDrops++;

      const logo = document.querySelector(`.logo-item[data-so='${draggedSO}']`);
      logo.style.opacity = "0.5";
      logo.setAttribute("draggable", false);

      if (correctDrops === dropZones.length) showWin();
    } else {
      zone.textContent = "❌ Errado! Tente novamente.";
      setTimeout(() => {
        zone.textContent = "Arraste o SO aqui!";
      }, 1500);
    }
  });
});

function showWin() {
  winModal.style.display = "grid";
}

resetBtn.addEventListener("click", () => {
  winModal.style.display = "none";
  correctDrops = 0;

  dropZones.forEach((zone) => {
    zone.textContent = "Arraste o SO aqui!";
    zone.classList.remove("filled");
    zone.style.borderColor = "rgba(255, 255, 255, 0.2)";
  });

  document.querySelectorAll(".station-card").forEach((card) => {
    card.classList.remove("filled");
  });

  logos.forEach((logo) => {
    logo.style.opacity = "1";
    logo.setAttribute("draggable", true);
  });
});

menuBtn.addEventListener("click", () => {
  window.location.href = "../index.html";
});
window.addEventListener("DOMContentLoaded", () => {
  const fase3Completa = localStorage.getItem("fase3Completa");
  if (!fase3Completa) {
    alert("⚠️ Complete a Fase 3 primeiro!");
    setTimeout(() => {
      window.location.href = "../Fase 3/index.html";
    }, 1000);
  }
});

const PROGRESS_KEY = "progressoJogo";

function carregarProgresso() {
  const data = localStorage.getItem(PROGRESS_KEY);
  return data ? JSON.parse(data) : {};
}

function salvarProgresso(progresso) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progresso));
}

function registrarConclusaoFase4() {
  localStorage.setItem("fase4Completa", "true");

  const progresso = carregarProgresso();

  if (!progresso.fasesConcluidas) {
    progresso.fasesConcluidas = {};
  }

  progresso.fasesConcluidas.fase4 = true;
  progresso.ultimaFase = 4;
  progresso.atualizadoEm = new Date().toISOString();

  salvarProgresso(progresso);
}
