// Chave usada para guardar o progresso no navegador
const PROGRESS_KEY = "progressoJogo";

// Lê o progresso salvo (se não tiver nada, volta objeto vazio)
function carregarProgresso() {
  const data = localStorage.getItem(PROGRESS_KEY);
  return data ? JSON.parse(data) : {};
}

// Salva o progresso atualizado
function salvarProgresso(progresso) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progresso));
}

// REGISTRA que a Fase 4 foi concluída
function registrarConclusaoFase4() {
  const progresso = carregarProgresso();

  if (!progresso.fasesConcluidas) {
    progresso.fasesConcluidas = {};
  }

  progresso.fasesConcluidas.fase4 = true;        // marca fase 4 como concluída
  progresso.ultimaFase = 4;                      // opcional, indica última fase alcançada
  progresso.atualizadoEm = new Date().toISOString();

  salvarProgresso(progresso);
}
