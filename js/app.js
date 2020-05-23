document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.querySelector('.game-board');
  let cells = Array.from(document.querySelectorAll('.game-board div'));
  const scoreBoard = document.querySelector('.score-board');
  const startBtn = document.querySelector('.start-btn');
  const rowHeight = 10;

  const lTetromino = [  
    [2, rowHeight, rowHeight+1, rowHeight+2], // [6, 14, 15, 16]
    [1, rowHeight+1, rowHeight*2+1, rowHeight*2+2], // [5, 15, 25, 26]
    [rowHeight, rowHeight+1, rowHeight+2, rowHeight*2], // [14, 15, 16, 24]
    [0, 1, rowHeight+1, rowHeight*2+1] // [4, 5, 15, 25]
  ]

  const tTetromino = [  
    [1, rowHeight, rowHeight+1, rowHeight+2], // [5, 14, 15, 16]
    [1, rowHeight+1, rowHeight+2, rowHeight*2+1], // [5, 15, 16, 25]
    [rowHeight, rowHeight+1, rowHeight+2, rowHeight*2+1], // [14, 15, 16, 25]
    [1, rowHeight, rowHeight+1, rowHeight*2+1] // [5, 14, 15, 25]
  ]

  const zTetromino = [  
    [1, 2, rowHeight, rowHeight+1], // [5, 6, 14, 15]
    [0, rowHeight, rowHeight+1, rowHeight*2+1], // [4, 14, 15, 25]
    [1, 2, rowHeight, rowHeight+1], // [5, 6, 14, 15]
    [0, rowHeight, rowHeight+1, rowHeight*2+1] // [4, 14, 15, 25]
  ]

  const oTetromino = [  
    [1, 2, rowHeight+1, rowHeight+2], // [5, 6, 15, 16]
    [1, 2, rowHeight+1, rowHeight+2], // [5, 6, 15, 16]
    [1, 2, rowHeight+1, rowHeight+2], // [5, 6, 15, 16]
    [1, 2, rowHeight+1, rowHeight+2] // [5, 6, 15, 16]
  ]

  const iTetromino = [  
    [0, 1, 2, 3], // [3, 4, 5, 6]
    [1, rowHeight+1, rowHeight*2+1, rowHeight*3+1], // [4, 14, 24, 34]
    [0, 1, 2, 3], // [3, 4, 5, 6]
    [1, rowHeight+1, rowHeight*2+1, rowHeight*3+1] // [4, 14, 24, 34]
  ]
  
  const tetrominoes = [lTetromino, tTetromino, zTetromino, oTetromino, iTetromino];
  
  let currentPosition = 3;
  let selectTetromino = Math.floor(Math.random() * tetrominoes.length);
  let tetrominoRotation = Math.floor(Math.random() * lTetromino.length);
  let currentTetromino = tetrominoes[selectTetromino][tetrominoRotation];

  function draw() {
    currentTetromino.forEach(index => {
      switch (selectTetromino) {
        case 0:
          cells[currentPosition + index].classList.add('ltetromino');
          break;
        case 1:
          cells[currentPosition + index].classList.add('ttetromino');
          break;
        case 2:
          cells[currentPosition + index].classList.add('ztetromino');
          break;
        case 3:
          cells[currentPosition + index].classList.add('otetromino');
          break;
        case 4:
          cells[currentPosition + index].classList.add('itetromino');
          break;
      }
    })
  }
  
  function undraw() {
    currentTetromino.forEach(index => {
      switch (selectTetromino) {
        case 0:
          cells[currentPosition + index].classList.remove('ltetromino');
          break;
        case 1:
          cells[currentPosition + index].classList.remove('ttetromino');
          break;
        case 2:
          cells[currentPosition + index].classList.remove('ztetromino');
          break;
        case 3:
          cells[currentPosition + index].classList.remove('otetromino');
          break;
        case 4:
          cells[currentPosition + index].classList.remove('itetromino');
          break;
      }
    })
    currentPosition += rowHeight;
  }

  function moveDown() {
    if (currentPosition < 160) {
      undraw();
      draw();
    }
  }

  draw();

  setInterval(moveDown, 1000);
  
})