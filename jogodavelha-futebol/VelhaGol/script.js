const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");
const scroreP1El = document.getElementById("scoreP1");
const scroreP2El = document.getElementById("scoreP2");
const p1Card = document.getElementById("p1Card");
const p2Card = document.getElementById("p2Card");
const resetScoreButton = document.getElementById("resetScore");
const penaltyModal = document.getElementById("penaltyModal");
const penaltyInfo = document.getElementById("penaltyInfo");
const penaltyResult = document.getElementById("penaltyResult");
const penaltyButtons = document.getElementById("penaltyButtons");


let currentPlayer = "⚽";
let gameActive = true;
let gameState = Array(9).fill("")
let scoreP1 = 0;
let scoreP2 = 0;

const winningCoditions = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]
// ===============================
// PÊNALTI (MODAL)
// ===============================
function openPenaltyShootout() {
  gameActive = false;
  penaltyInfo.textContent = `Quem bate: ${currentPlayer}`;
  penaltyResult.textContent = "";
  penaltyModal.classList.remove("hidden");
}
function closePenaltyShootout() {
  penaltyModal.classList.add("hidden");
}
function randomPenaltyShooter() {
  return Math.random() < 0.5 ? "⚽" : "👟";
}
// ===============================
// LÓGICA DO PÊNALTI
// ===============================
function handlePenalty(shot) {
  const options = ["esquerda", "meio", "direita"];
  const keeper = options[Math.floor(Math.random() * 3)];
  if (shot !== keeper) {
    // GOL: ponto pro jogador atual
    penaltyResult.textContent = `⚽ GOOOL! Goleiro foi ${keeper}.`;
    if (currentPlayer === "⚽") scoreP1++;
    else scoreP2++;
  } else {
    // DEFESA: ponto pro outro jogador
    penaltyResult.textContent = `🧤 DEFENDEU! Goleiro foi ${keeper}.`;
    if (currentPlayer === "⚽") scoreP2++;
    else scoreP1++;
  }
  updateScore();
  saveScores();
  setTimeout(() => {
    closePenaltyShootout();
    resetGame();
  }, 1200);
}

// ===============================
// RESETAR PLACAR
// ===============================
function resetScores() {
    scoreP1 = 0;
    scoreP2 = 0;
 updateScore();
 saveScores(); // salva 0-0 no localStorage
}
resetScoreButton.addEventListener("click", resetScores);
// ===============================
// ATIVAR TURNO
// ===============================
function updateTurnUI() {
    statusText.textContent = `Vez do jogador: ${currentPlayer}`;
    p1Card.classList.toggle("active", currentPlayer === "⚽");
    p2Card.classList.toggle("active", currentPlayer === "👟");
}
// ===============================
// ATUALIZAR PLACAR
// ===============================
function updateScore() {
    scroreP1El.textContent = scoreP1;
    scroreP2El.textContent = scoreP2;
}
// ===============================
// SALVAR F5
// ===============================
function saveScores() {
    localStorage.setItem("scoreP1", scoreP1);
    localStorage.setItem("scoreP2", scoreP2);
}
function loadScores() {
    const savedP1 = localStorage.getItem("scoreP1", scoreP1);
    const savedP2 = localStorage.getItem("scoreP2", scoreP2);
    
    scoreP1 = savedP1 ? Number(savedP1) : 0;
    scoreP2 = savedP2 ? Number(savedP2) : 0;

    updateScore();
}
// ===============================
// CRIA O TABULEIRO NA TELA
// ===============================
function createBoard() {
    board.innerHTML = ""; // limpa o tabuleiro antes de criar
    for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div")
    cell.classList.add("cell");
    cell.dataset.index = i; // guarda o índice da casa
    cell.addEventListener("click", handleCellClick); // quando clicar, chama a função handleCellClick
    board.appendChild(cell);  // coloca a célula dentro do tabuleiro
 }
}
// ===============================
// QUANDO O JOGADOR CLICA EM UMA CASA
// ===============================
function handleCellClick(event) {
  const clickedCell = event.target;
  const index = Number(clickedCell.dataset.index);
  // bloqueios
  if (!gameActive) return;
  if (gameState[index] !== "") return;
  // marca no estado e na tela
  gameState[index] = currentPlayer;
  clickedCell.textContent = currentPlayer;
  // checa vitória/empate (isso pode desligar o gameActive)
  checkResult();
  // se o jogo acabou, NÃO troca jogador e NÃO muda o status
  if (!gameActive) return;
  // troca jogador
  currentPlayer = currentPlayer === "⚽" ? "👟" : "⚽";
  updateTurnUI();
}

// ===============================
// VERIFICAR VITÓRIA OU EMPATE
// ==============================
function checkResult() {
  let roundwon = false;
  // percorre todas as combinações de vitória
  for (let i = 0; i < winningCoditions.length; i++) {
    const [a, b, c] = winningCoditions[i];
    // se a primeira posição está vazia, não tem como ser vitória
    if (gameState[a] === "") continue;
    // se as 3 posições são iguais, é vitória
    if (gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      roundwon = true;
      break;
    }
  }
  // se ganhou
  if (roundwon) {
    // soma ponto no placar
    if (currentPlayer === "⚽") {
    scoreP1++;
    } else {
    scoreP2++;
    }
    // atualiza na tela
    updateScore();
    saveScores();
    statusText.textContent = `Jogador ${currentPlayer} venceu!`;
    gameActive = false;
    return;
}
if (!gameState.includes("")) {
  statusText.textContent = "Empate! Vamos para os pênaltis 🥅";
  // sorteia quem vai bater
  currentPlayer = randomPenaltyShooter();
  // atualiza o destaque no placar e o texto
  updateTurnUI();
  // abre o modal do pênalti
  openPenaltyShootout();
}
  }
// ===============================
// REINICIAR O JOGO
// ===============================
function resetGame() {
    gameActive = true; // jogo volta a ficar ativo
    currentPlayer = '⚽';  // jogador inicial
    gameState = Array(9).fill("");  // limpa o estado do tabuleiro
    statusText.textContent = `Vez do jogador: ${currentPlayer}`; // atualiza o texto de status
    createBoard();
    updateTurnUI();
}
document.addEventListener("DOMContentLoaded", () => {
    const penaltyButtons = document.querySelectorAll(".penalty-buttons button");
    penaltyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
    handlePenalty(btn.dataset.shot);
    });
  });
});

// ===============================
// BOTÃO DE RESET
// ===============================
resetButton.addEventListener("click", resetGame); // quando clicar no botão, chama resetGame
// ===============================
// INICIA O JOGO
// ===============================
createBoard();
statusText.textContent = `Vez do jogador: ${currentPlayer}`;
updateTurnUI();
loadScores();

