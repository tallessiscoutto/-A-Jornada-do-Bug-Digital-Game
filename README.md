# 🎮 A Jornada do Bug - Jogo Educacional Digital

Um jogo educacional interativo com **2 fases integradas** para ensinar conceitos de informática de forma divertida e acessível!

## 🌟 Características

### ✨ Sistema Integrado de Fases
- **Progressão automatizada** entre as fases
- **Salvamento de progresso** usando localStorage
- **Navegação fluida** entre os níveis
- **Visual moderno e consistente** em ambas as fases

### 🎯 Fase 1 - Conectar os Dispositivos
Aprenda sobre periféricos e portas do computador!
- 🖱️ **Mouse** → Porta USB
- ⌨️ **Teclado** → Porta USB  
- 🖥️ **Monitor** → Porta de Vídeo
- 🖨️ **Impressora** → USB/Rede

**Funcionalidades:**
- Drag & drop intuitivo
- Narração por voz (Web Speech API)
- Feedback visual e sonoro
- Dicas contextuais
- Animações suaves
- Desbloqueio automático da Fase 2

### ☁️ Fase 2 - Organizando Dados na Nuvem
Entenda a diferença entre armazenamento local e na nuvem!
- 📸 **Fotos** → Idealmente na Nuvem (backup seguro)
- 📄 **Documentos** → Idealmente na Nuvem (acesso universal)
- 🎵 **Música** → Idealmente no PC (acesso offline rápido)

**Funcionalidades:**
- Interface moderna e profissional
- Barra de progresso visual
- Sistema educacional flexível
- Feedback inteligente sobre escolhas
- Navegação entre fases
- Confetes e celebração ao completar

## 🎨 Design

### Paleta de Cores Unificada
```css
--bg: #0b1020        /* Fundo escuro profundo */
--panel: #101943     /* Painéis */
--accent: #76e3ff    /* Destaque azul */
--ok: #22c55e        /* Verde sucesso */
--warn: #ffb020      /* Laranja aviso */
--text: #eef3ff      /* Texto claro */
```

### Recursos Visuais
- ✅ Gradientes modernos
- ✅ Ícones SVG customizados
- ✅ Animações CSS suaves
- ✅ Design responsivo
- ✅ Efeitos de áudio (Web Audio API)
- ✅ Confetes animados
- ✅ Feedback visual imediato

## 🚀 Como Usar

### Começando
1. Abra `História 1/index.html` no navegador
2. Complete a Fase 1 conectando todos os dispositivos
3. Clique em "Ir para Fase 2 🚀"
4. Organize os arquivos na Fase 2
5. Navegue livremente entre as fases!

### Requisitos
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- JavaScript habilitado
- Suporte a HTML5 Drag & Drop API
- (Opcional) Permissão para narração por voz

## 🎯 Objetivos Educacionais

### Fase 1
- Reconhecer periféricos básicos do computador
- Entender diferentes tipos de portas e conexões
- Desenvolver coordenação motora (drag & drop)

### Fase 2
- Compreender armazenamento local vs. nuvem
- Aprender vantagens de cada tipo
- Desenvolver pensamento crítico sobre organização de dados

## 🔧 Estrutura do Projeto

```
📁 -A-Jornada-do-Bug-Digital-Game/
├── 📁 Fase 1/           # Fase 1
│___assets/
│     ├── index.html           # Interface da Fase 1
│      ├── css/
│       │   └── style.css    # Estilos da Fase 1
│       └── js/
│           └── script.js           # Logica da Fase 1
├── 📁 Fase 2/               # Fase 2
│   ├── index.html           # Interface da Fase 2
│   └── assets/
│       ├── css/
│       │   └── style.css    # Estilos da Fase 2
│       └── js/
│           └── script.js    # Lógica da Fase 2
└── README.md                # Documentação
├── 📁 Fase 3/               # Fase 3
│   ├── index.html           # Interface da Fase 3
│   └── assets/
│       ├── css/
│       │   └── style.css    # Estilos da Fase 3
│       └── js/
│           └── script.js    # Lógica da Fase 3
└── README.md                # Documentação
├── 📁 Fase 4/               # Fase 4
│   ├── index.html           # Interface da Fase 4
│   └── assets/
│       ├── css/
│       │   └── style.css    # Estilos da Fase 4
│       └── js/
│           └── script.js    # Lógica da Fase 4
└── README.md                # Documentação
```

## 🎮 Funcionalidades Técnicas

### Integração entre Fases
- `localStorage.setItem('fase1Completa', 'true')` ao completar Fase 1
- Verificação automática de acesso à Fase 2
- Redirecionamento inteligente
- Navegação bidirecional

### Acessibilidade
- ♿ ARIA labels e roles
- 🎤 Narração por voz opcional
- 🎨 Alto contraste visual
- ⌨️ Feedback claro de estados

### Performance
- 🚀 Animações otimizadas
- 💾 Armazenamento local eficiente
- 🎯 SVG para gráficos escaláveis
- ⚡ Código modular e limpo

## 🏆 Conquistas

- ✅ **Fase 1 Completa** - Conectou todos os dispositivos
- ✅ **Fase 2 Completa** - Organizou todos os arquivos
- 🎓 **Expert Digital** - Completou ambas as fases!

## 👨‍💻 Desenvolvimento

Criado com:
- HTML5 (Drag & Drop API)
- CSS3 (Animações, Grid, Flexbox)
- JavaScript Vanilla (ES6+)
- Web Speech API (Narração)
- Web Audio API (Efeitos sonoros)
- LocalStorage API (Progressão)

## 📝 Licença

Projeto educacional livre para uso em escolas e instituições de ensino.

---

**Desenvolvido com 💙 para tornar o aprendizado de informática divertido e acessível!**
