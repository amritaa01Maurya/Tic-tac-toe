let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'O';
let gameOver = false;

const pop = new Audio('pop.mp3');
const boardContainer = document.getElementById('board');
const statusText = document.getElementById('status');

function drawBoard() {
  boardContainer.innerHTML = '';
  board.forEach(function(cell, idx) {
    const cellDiv = document.createElement('div');
    cellDiv.classList.add('cell');
    cellDiv.innerText = cell;
    cellDiv.addEventListener('click', function(){ nextMove(idx)});
    boardContainer.appendChild(cellDiv);
  });
}

function nextMove(idx) {
  if (board[idx] === '' && !gameOver) {
    board[idx] = currentPlayer;
    pop.currentTime = 0;
    pop.play();
    checkWinner();
    if(!gameOver){
      currentPlayer = currentPlayer === 'X'?'O':'X';
    }
    drawBoard();

    if(currentPlayer === 'X'){
      setTimeout(computerMove, 300);
    }
  }
}


// smart computer player

function computerMove() {
  if (gameOver) return;

  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'X';
      let score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  nextMove(move);
}

function minimax(newBoard, depth, isMaximizing) {
  let result = evaluateWinner(newBoard);
  if (result !== null) {
    const scores = {
      X: 1,
      O: -1,
      draw: 0
    };
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === '') {
        newBoard[i] = 'X';
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === '') {
        newBoard[i] = 'O';
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function evaluateWinner(b) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (const pattern of winPatterns) {
    const [a, b1, c] = pattern;
    if (b[a] && b[a] === b[b1] && b[b1] === b[c]) {
      return b[a]; // 'X' or 'O'
    }
  }

  if (!b.includes('')) {
    return 'draw';
  }

  return null; // No winner yet
}


function checkWinner() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            statusText.innerText = `${board[a]} wins!`;
            gameOver = true;
            return;
        }
    }

    if (!board.includes('')) {
        statusText.innerText = "It's a draw!";
        gameOver = true;
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'O';// to make sure first move is made by human player
    gameOver = false;
    statusText.innerText = '';
    drawBoard();
}

drawBoard();