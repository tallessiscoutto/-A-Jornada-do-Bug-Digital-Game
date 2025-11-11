// Fase 3 - Gerenciador de Tarefas Rápido
// Sistema de gerenciamento de memória e CPU

class TaskManager {
  constructor() {
    this.programs = [
      { name: "Editor de Vídeo", usage: 40, element: null, closed: false },
      { name: "Jogo de Corrida", usage: 35, element: null, closed: false },
      { name: "Navegador", usage: 15, element: null, closed: false },
      { name: "Calculadora", usage: 5, element: null, closed: false },
    ];

    this.totalUsage = 95; // Uso inicial total
    this.safeLevel = 30; // Nível seguro de CPU
    this.gameWon = false;

    this.init();
  }

  init() {
    // Verificar se Fase 2 foi completada
    this.checkPhase2Access();
    this.setupProgramElements();
    this.setupEventListeners();
    this.updateCPUDisplay();
  }

  checkPhase2Access() {
    const fase2Completa = localStorage.getItem("fase2Completa");
    if (!fase2Completa) {
      this.showFeedback("⚠️ Complete a Fase 2 primeiro!", "error");
      setTimeout(() => {
        window.location.href = "../Fase 2/index.html";
      }, 2000);
    }
  }

  setupProgramElements() {
    const programCards = document.querySelectorAll(".program-card");

    programCards.forEach((card, index) => {
      if (this.programs[index]) {
        this.programs[index].element = card;
      }
    });
  }

  setupEventListeners() {
    // Event listeners para botões de fechar programas
    const closeButtons = document.querySelectorAll(".close-btn");
    closeButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        this.closeProgram(index);
      });
    });

    // Event listeners para botões de controle
    const resetBtn = document.getElementById("resetbtn");
    const menuBtn = document.getElementById("menuBtn");
    const nextPhaseBtn = document.getElementById("nextPhaseBtn");

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.resetGame();
      });
    }

    if (menuBtn) {
      menuBtn.addEventListener("click", () => {
        window.location.href = "../index.html";
      });
    }

    if (nextPhaseBtn) {
      nextPhaseBtn.addEventListener("click", () => {
        window.location.href = "../Fase 4/index.html";
      });
    }
  }

  closeProgram(programIndex) {
    const program = this.programs[programIndex];

    if (program.closed) {
      return; // Programa já foi fechado
    }

    // Marcar programa como fechado
    program.closed = true;

    // Reduzir uso total de CPU
    this.totalUsage -= program.usage;

    // Adicionar efeito visual de fechamento
    const card = program.element;
    if (card) {
      card.style.opacity = "0.5";
      card.style.transform = "scale(0.95)";
      card.style.transition = "all 0.3s ease";

      // Desabilitar botão
      const closeBtn = card.querySelector(".close-btn");
      if (closeBtn) {
        closeBtn.textContent = "Fechado";
        closeBtn.disabled = true;
        closeBtn.style.backgroundColor = "#ccc";
      }
    }

    // Atualizar display de CPU
    this.updateCPUDisplay();

    // Verificar condição de vitória
    this.checkWinCondition();

    // Feedback visual
    this.showFeedback(`Programa "${program.name}" fechado! Memória liberada.`);
  }

  updateCPUDisplay() {
    const cpuBar = document.getElementById("cpu-bar");
    const cpuStatus = document.getElementById("cpu-status");

    if (!cpuBar || !cpuStatus) return;

    // Atualizar largura da barra
    cpuBar.style.width = `${this.totalUsage}%`;

    // Atualizar cores e texto baseado no nível de uso
    if (this.totalUsage > 70) {
      // Alto uso - vermelho
      cpuBar.className = "cpu-bar high";
      cpuStatus.className = "cpu-status high-text";
      cpuStatus.textContent = `O sistema está sobrecarregado! (${this.totalUsage}% Uso)`;
    } else if (this.totalUsage > 40) {
      // Médio uso - amarelo
      cpuBar.className = "cpu-bar medium";
      cpuStatus.className = "cpu-status medium-text";
      cpuStatus.textContent = `Sistema funcionando normalmente (${this.totalUsage}% Uso)`;
    } else {
      // Baixo uso - verde
      cpuBar.className = "cpu-bar low";
      cpuStatus.className = "cpu-status low-text";
      cpuStatus.textContent = `Sistema otimizado! (${this.totalUsage}% Uso)`;
    }
  }

  checkWinCondition() {
    if (this.totalUsage <= this.safeLevel && !this.gameWon) {
      this.gameWon = true;
      this.showWinScreen();
    }
  }

  showWinScreen() {
    // Salvar progresso da Fase 3
    localStorage.setItem("fase3Completa", "true");

    const winScreen = document.getElementById("win");
    if (winScreen) {
      winScreen.style.display = "grid";
    }

    // Feedback de vitória
    this.showFeedback(
      "Parabéns! Memória liberada! O sistema pode respirar.",
      "success"
    );
  }

  showFeedback(message, type = "info") {
    // Criar elemento de feedback temporário
    const feedback = document.createElement("div");
    feedback.className = `feedback ${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${
              type === "success"
                ? "#4CAF50"
                : type === "error"
                ? "#f44336"
                : "#2196F3"
            };
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            animation: slideIn 0.3s ease-out;
        `;

    document.body.appendChild(feedback);

    // Remover após 3 segundos
    setTimeout(() => {
      feedback.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => {
        if (feedback.parentNode) {
          feedback.parentNode.removeChild(feedback);
        }
      }, 300);
    }, 3000);
  }

  resetGame() {
    // Resetar estado dos programas
    this.programs.forEach((program) => {
      program.closed = false;
      if (program.element) {
        program.element.style.opacity = "1";
        program.element.style.transform = "scale(1)";

        const closeBtn = program.element.querySelector(".close-btn");
        if (closeBtn) {
          closeBtn.textContent = "Fechar";
          closeBtn.disabled = false;
          closeBtn.style.backgroundColor = "";
        }
      }
    });

    // Resetar uso de CPU
    this.totalUsage = 95;
    this.gameWon = false;

    // Esconder tela de vitória
    const winScreen = document.getElementById("win");
    if (winScreen) {
      winScreen.style.display = "none";
    }

    // Atualizar display
    this.updateCPUDisplay();

    this.showFeedback("Jogo reiniciado!");
  }
}

// Adicionar estilos CSS para animações via JavaScript
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .cpu-bar {
        transition: width 0.5s ease, background-color 0.3s ease;
    }
    
    .program-card {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    .close-btn:disabled {
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);

// Inicializar o jogo quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  new TaskManager();
});
