document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.querySelector('.game-board');
  let cells = Array.from(document.querySelectorAll('.game-board div'));
  const scoreBoard = document.querySelector('.score-board');
  const startBtn = document.querySelector('.start-btn');
  const rowHeight = 10;

  const lTetromino = [  
    [6, rowHeight+4, rowHeight+5, rowHeight+6], // [6, 14, 15, 16]
    [5, rowHeight+5, rowHeight*2+5, rowHeight*2+6], // [5, 15, 25, 26]
    [rowHeight+4, rowHeight+5, rowHeight+6, rowHeight*2+4], // [14, 15, 16, 24]
    [4, 5, rowHeight+5, rowHeight*2+5] // [4, 5, 15, 25]
  ]

  const tTetromino = [  
    [], // [5, 14, 15, 16]
    [], // [5, 15, 16, 25]
    [], // [14, 15, 16, 25]
    [] // [5, 14, 15, 25]
  ]

  const zTetromino = [  
    [], // [5, 6, 14, 15]
    [], // [4, 14, 15, 25]
    [], // [5, 6, 14, 15]
    [] // [4, 14, 15, 25]
  ]

  const oTetromino = [  
    [], // [5, 6, 15, 16]
    [], // [5, 6, 15, 16]
    [], // [5, 6, 15, 16]
    [], // [5, 6, 15, 16]

  ]

  const iTetromino = [  
    [], // [3, 4, 5, 6]
    [], // [4, 14, 24, 34]
    [], // [3, 4, 5, 6]
    [], // [4, 14, 24, 34]
  ]
  
  const tetrominoes = [lTetromino, tTetromino, zTetromino, oTetromino, iTetromino];
  
  let currentPosition = 0, nextPosition;
  let rotation = Math.floor(Math.random() * lTetromino.length);
  let current = tetrominoes[0][rotation];

  function draw() {
    current.forEach(index => {
      cells[currentPosition + index].classList.add('tetromino');
    })
  }
  
  function undraw() {
    current.forEach(index => {
      cells[currentPosition + index].classList.remove('tetromino');
    })
    currentPosition += rowHeight;
  }

  function moveDown() {
    if (currentPosition != 160) {
      undraw();
      draw();
    }
  }

  draw();

  setInterval(moveDown, 1000);
  
})