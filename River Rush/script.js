const jogo = document.querySelector('.jogo');
const cenario = document.getElementById('cenario');
const nave = document.getElementById('nave');
const Pontuacao = document.getElementById('pontuacao');
const Tempo = document.getElementById('tempo');
const telaGameOver = document.getElementById('gameOver');
const telaStart = document.getElementById('Telainicio');
const PontuacaoFinal = document.getElementById('PontuacaoFinal');

let estado = {
    fimDeJogo: true,
    pontuacao: 0,
    tempo: 30,
    velocidade: 5,        
    cenarioY: 0,        
    naveX: 450,    
    entidades: []  
};
let timerInterval;
const teclas = { ArrowLeft: false, ArrowRight: false, a: false, d: false };

window.addEventListener('keydown', (e) => {
    if (teclas.hasOwnProperty(e.key)) teclas[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    if (teclas.hasOwnProperty(e.key)) teclas[e.key] = false;
});
function startGame() {
    telaStart.style.display = 'none';
    estado.fimDeJogo = false;
    
    timerInterval = setInterval(() => {
        if (estado.fimDeJogo) return;
        estado.tempo--;
        Tempo.innerText = estado.tempo;
        
        if (estado.tempo <= 0) {
            encerrarJogo();
        }
    }, 1000);
    
    requestAnimationFrame(atualizarJogo);
}
function atualizarJogo() {
    if (estado.fimDeJogo) return;

    estado.velocidade += 0.005;

    estado.cenarioY += estado.velocidade;
    cenario.style.backgroundPositionY = `${estado.cenarioY}px`;

    const velocidadeNave = 7;
    if (teclas.ArrowLeft || teclas.a) estado.naveX -= velocidadeNave;
    if (teclas.ArrowRight || teclas.d) estado.naveX += velocidadeNave;

    const limiteEsquerdo = 246;
    const limiteDireito = 654;

    if (estado.naveX < limiteEsquerdo) estado.naveX = limiteEsquerdo;
    if (estado.naveX > limiteDireito) estado.naveX = limiteDireito;
    
    nave.style.left = `${estado.naveX}px`;

    if (Math.random() < 0.02) gerarEntidade();
    for (let i = estado.entidades.length - 1; i >= 0; i--) {
        let entidade = estado.entidades[i];
        
        entidade.y += estado.velocidade;
        entidade.elemento.style.top = `${entidade.y}px`;

        const caixaNave = {
            esquerda: estado.naveX - 35, direita: estado.naveX + 35,
            topo: 900 - 122 - 20, fundo: 900 - 20
        };
        const caixaEntidade = {
            esquerda: entidade.x - 15, direita: entidade.x + 15,
            topo: entidade.y, fundo: entidade.y + 30
        };

        if (caixaNave.esquerda < caixaEntidade.direita &&
            caixaNave.direita > caixaEntidade.esquerda &&
            caixaNave.topo < caixaEntidade.fundo &&
            caixaNave.fundo > caixaEntidade.topo) {            
            
            if (entidade.tipo === 'moeda') {
                estado.pontuacao += 10;
                estado.tempo = 30;
                
                Pontuacao.innerText = estado.pontuacao;
                Tempo.innerText = estado.tempo;
                
                entidade.elemento.remove();
                estado.entidades.splice(i, 1);
            } else if (entidade.tipo === 'bomba') {
                encerrarJogo();
            }
        } 
        else if (entidade.y > 900) {
            entidade.elemento.remove();
            estado.entidades.splice(i, 1);
        }
    }
    requestAnimationFrame(atualizarJogo);
}
function gerarEntidade() {
    const tipo = Math.random() > 0.3 ? 'moeda' : 'bomba'; 
    const spawnMin = 215;
    const spawnMax = 685;
    const x = Math.random() * (spawnMax - spawnMin) + spawnMin; 
    
    const elemento = document.createElement('div');
    elemento.className = tipo;
    elemento.style.left = `${x}px`;
    elemento.style.top = `-50px`; 
    jogo.appendChild(elemento);

    estado.entidades.push({ elemento, tipo, x, y: -50 });
}
function encerrarJogo() {
    estado.fimDeJogo = true;
    clearInterval(timerInterval);
    nave.classList.add('destruida');
    
    PontuacaoFinal.innerText = estado.pontuacao;
    telaGameOver.style.display = 'flex';
}

function restartGame() {
    location.reload();
}