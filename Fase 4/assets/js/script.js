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
