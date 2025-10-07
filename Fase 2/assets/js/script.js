const arquivos = document.querySelectorAll('.arquivo2');
const destinos = document.querySelectorAll('.destino');
const mensagem = document.getElementById('mensagem');

let arquivoAtual = null;

arquivos.forEach(arquivo => {
    arquivo.addEventListener('dragstart', () => {
        arquivoAtual = arquivo;
        setTimeout(() => (arquivo.style.display = 'none'), 0);
    });

    arquivo.addEventListener('dragend', () => {
        setTimeout(() => {
            arquivo.style.display = 'block';
            arquivoAtual = null;
        }, 0);
    });
});

destinos.forEach(destino => {
    destino.addEventListener('dragover', e => {
        e.preventDefault();
        destino.style.backgroundColor = '#e0f7ff';
    });

    destino.addEventListener('dragleave', () => {
        destino.style.backgroundColor = 'white';
    });

    destino.addEventListener('drop', () => {
        destino.style.backgroundColor = 'white';

        if (arquivoAtual) {
            destino.appendChild(arquivoAtual);

            if (destino.id === 'Nuvem') {
                mostrarMensagem("☁️ Upload concluído! Agora você pode acessar seus arquivos de qualquer lugar.");
                animarUpload(arquivoAtual);
            } else if (destino.id === 'PC') {
                mostrarMensagem("💻 Arquivo armazenado localmente. Acesso rápido garantido!");
            }

            verificarFimDoJogo();
        }
    });
});

function mostrarMensagem(texto) {
    mensagem.textContent = texto;
    mensagem.style.opacity = '1';
    setTimeout(() => {
        mensagem.style.opacity = '0.8';
    }, 2500);
}

function animarUpload(elemento) {
    elemento.style.transition = 'transform 0.4s ease';
    elemento.style.transform = 'scale(1.2)';
    setTimeout(() => {
        elemento.style.transform = 'scale(1)';
    }, 400);
}

function verificarFimDoJogo() {
    const arquivosRestantes = document.querySelectorAll('.area-arquivos .arquivo2');
    if (arquivosRestantes.length === 0) {
        mensagem.textContent = "🎉 Parabéns! Você organizou todos os arquivos corretamente!";
        mensagem.style.color = "green";
        mensagem.style.opacity = "1";
    }
}