document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.querySelector('.game-board');
  let cells = Array.from(document.querySelectorAll('.game-board div'));
  const scoreBoard = document.querySelector('.score');
  const startBtn = document.querySelector('.start-btn');
  const rowHeight = 10;
  const audio = document.querySelector('.bg-music');
  const audioControl = document.querySelector('.control');
  const audioOn = document.querySelector('.control-on');
  const audioOff = document.querySelector('.control-off');
  let timerId = null;
  let score = 0;
  let counter = 0;
  let gameStarted = false;
  let gamePaused = false;
  let gameFinished = false;
  let interval = 1000;
  let frozen = false;
  let illuminate = false;
  let illuminatePos = 0;

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
  
  let selectTetromino = Math.floor(Math.random() * tetrominoes.length);
  let tetrominoRotation = 0;
  let currentTetromino = tetrominoes[selectTetromino][tetrominoRotation];

  let currentPosition = 3;
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
  }
  
  function moveDown() {
      undraw();
      currentPosition += rowHeight;
      draw();
      freeze();
  }

  // assign function to keycodes
  // arrowLeft key: 37
  // arrowUp key: 38
  // arrowRight key: 39
  // arrowDown key: 40
  // d : 68
  let keyTimerId;
  let keyPressed = false;
  function control(e) {
    console.log('key pressed');
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      if (keyPressed) return;
      keyPressed = true;
      clearInterval(keyTimerId);
      keyTimerId = setInterval(moveDown, 50);
    } else if (e.keyCode === 68) {
      while (!frozen) {
        moveDown();
      }
    }
  }

  function clear(e) {
    if (e.keyCode === 40) {
      clearInterval(keyTimerId);
      keyPressed = false;
    }
  }

  let xDown, yDown;
  function handleTouch(e) {
    const firstTouch = (e.touches || e.originalEvent.touches)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
  }

  function handleSwipe(e) {
    if (!xDown || !yDown) return;

    const xUp = e.touches[0].clientX;
    const yUp = e.touches[0].clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) { // swipe left
        moveLeft();
      } else { // swipe right
        moveRight();
      }
    } else {
      if (yDiff > 0) { // swipe up
        rotate();
      } else { // swipe down
        while (!frozen) {
          moveDown();
        }
      }
    }

    xDown = null;
    yDown = null;
  }

  let selectUpNextTetromino = 0;
  function freeze() {
    if (currentTetromino.some(index => cells[currentPosition + index + rowHeight].classList.contains('taken'))) {
      frozen = true;
      currentTetromino.forEach(index => cells[currentPosition + index].classList.add('taken'))
      // start a new tetromino falling
      selectTetromino = selectUpNextTetromino;
      selectUpNextTetromino = Math.floor(Math.random() * tetrominoes.length);
      currentTetromino = tetrominoes[selectTetromino][tetrominoRotation];
      currentPosition = 3;
      addScore();
      draw();
      displayNext();
      gameOver();
    } else {
      frozen = false;
    }
  }

  // move tetromino left, unless it is at the edge or there is  a blockage
  function moveLeft() {
    undraw();
    const isAtLeftEdge = currentTetromino.some(index => (currentPosition + index) % rowHeight === 0);
    if (!isAtLeftEdge) currentPosition -= 1;
    if (currentTetromino.some(index => cells[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1;
    }
    draw();
  }

  // move tetromino right, unless it is at the edge or there is  a blockage
  function moveRight() {
    undraw();
    const isAtRightEdge = currentTetromino.some(index => (currentPosition + index) % rowHeight === rowHeight - 1);
    if (!isAtRightEdge) currentPosition += 1;
    if (currentTetromino.some(index => cells[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1;
    }
    draw();
  }

  function rotate() {
    const isAtRightEdge = currentTetromino.some(index => (currentPosition + index) % rowHeight === rowHeight - 1);
    const isAtLeftEdge = currentTetromino.some(index => (currentPosition + index) % rowHeight === 0);
    undraw();
    tetrominoRotation++;
    if (tetrominoRotation === currentTetromino.length) {  // if rotation gets to 4, make it go back to 0
      tetrominoRotation = 0;
    }
    currentTetromino = tetrominoes[selectTetromino][tetrominoRotation];

    if (currentTetromino.some(index => cells[currentPosition + index + rowHeight].classList.contains('taken'))) {
      return;
    } else {
      draw();
    }

    if (isAtLeftEdge) {
      let exceedLeftEdge = currentTetromino.some(index => (currentPosition + index) % rowHeight === rowHeight - 1);
      while (exceedLeftEdge) {
        undraw();
        currentPosition += 1;
        draw();
        exceedLeftEdge = currentTetromino.some(index => (currentPosition + index) % rowHeight === rowHeight - 1);
      }
    } else if (isAtRightEdge) {
      let exceedRightEdge = currentTetromino.some(index => (currentPosition + index) % rowHeight === 0);
      while (exceedRightEdge) {
        undraw();
        currentPosition -= 1;
        draw();
        exceedRightEdge = currentTetromino.some(index => (currentPosition + index) % rowHeight === 0);
      }
    }
  }

  // show up-next tetromino in up-next display
  const upNextCells = document.querySelectorAll('.up-next-display div');
  const upNextCellWidth = 4;
  let upNextIndex = 0;

  // tetrominoes without rotation
  const upNextTetrominoes = [
    [8, 11, 12, 13],
    [7, 11, 12, 13],
    [7, 8, 11, 12],
    [7, 8, 12, 13],
    [11, 12, 13, 14]
  ]

  // display tetromino in up next display
  function displayNext() {
    // remove any trace of a tetromino from the entire grid
    upNextCells.forEach(cell => {
      cell.classList.remove('ltetromino');
      cell.classList.remove('ttetromino');
      cell.classList.remove('ztetromino');
      cell.classList.remove('otetromino');
      cell.classList.remove('itetromino');
    })

    upNextTetrominoes[selectUpNextTetromino].forEach(index => {
      switch (selectUpNextTetromino) {
        case 0:
          upNextCells[upNextIndex + index].classList.add('ltetromino');
          break;
        case 1:
          upNextCells[upNextIndex + index].classList.add('ttetromino');
          break;
        case 2:
          upNextCells[upNextIndex + index].classList.add('ztetromino');
          break;
        case 3:
          upNextCells[upNextIndex + index].classList.add('otetromino');
          break;
        case 4:
          upNextCells[upNextIndex + index].classList.add('itetromino');
          break;
      }
    });
  }

  function handleAudio() {
    if (!audio.muted) {
      audio.muted = true;
      audioOn.classList.remove('control-active');
      audioOff.classList.add('control-active');
    } else {
      audio.muted = false;
      audioOff.classList.remove('control-active');
      audioOn.classList.add('control-active');
    }
  }

  // start game
  // keycodes
  // spacebar: 32
  // m: 77
  document.addEventListener('keydown', e => {
    if (e.keyCode === 32) {
      handleStart();
    } else if (e.keyCode === 77) {
      handleAudio();
    }
  })



  function handleStart() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      gamePaused = true;
    } else {
      draw();
      gameStarted = true;
      gamePaused = false;
      timerId = setInterval(moveDown, interval);
      displayNext(); 
    }

    if (gameStarted && !gamePaused) {
      audio.play();
      audioOn.classList.add('control-active');
      audioOff.classList.remove('control-active');
      audioControl.addEventListener('click', handleAudio); 

      document.addEventListener('keydown', control);
      document.addEventListener('keyup', clear);
      
      // touch event handlers        
      gameBoard.addEventListener('touchstart', handleTouch);
      gameBoard.addEventListener('touchmove', handleSwipe);
    } else {
      audio.pause();
      audioOff.classList.add('control-active');
      audioOn.classList.remove('control-active');
      audioControl.removeEventListener('click', handleAudio);

      document.removeEventListener('keydown', control);
      document.removeEventListener('keyup', clear);
      
      // touch event handlers        
      gameBoard.removeEventListener('touchstart', handleTouch);
      gameBoard.removeEventListener('touchmove', handleSwipe);
    }
    scoreBoard.innerHTML = score;
    startBtn.innerHTML = gamePaused ? "Resume" : "Pause";
  }

  // add event listener to start button
  startBtn.addEventListener('click', handleStart);
  startBtn.innerHTML = gameStarted ? "Pause" : "Start";

  function speedUp() {
    clearInterval(timerId);
    if (interval > 400) {
      interval -= 150;
    } else {
      interval -= 50;
    }
    timerId = setInterval(moveDown, interval);
    audio.playbackRate += 0.1;
  }

  // add score
  function addScore() {
    for (let i = 0; i < 199; i += rowHeight) {
      const rows = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
  
      if (rows.every(index => cells[index].classList.contains('taken'))) {
        score += 100;
        counter++;
        if (counter > 10) {
          speedUp();
          counter = 0;
        }
        scoreBoard.innerHTML = score;
        rows.forEach(index => {
          cells[index].className = '';
        })
        const cellsRemoved = cells.splice(i, rowHeight);
        cells = cellsRemoved.concat(cells);
        cells.forEach(cell => gameBoard.appendChild(cell))
      }
    }
  }

  function gameOver() {
    if (currentTetromino.some(index => cells[currentPosition + index].classList.contains('taken'))) {
      gameFinished = true;
      scoreBoard.innerHTML = 'game over';
      clearInterval(timerId);
      clearInterval(keyTimerId);
      console.log(keyTimerId);
      document.removeEventListener('keydown', control);
      document.removeEventListener('keyup', clear);
      gameBoard.removeEventListener('touchstart', handleTouch);
    }
    startBtn.innerHTML = gameFinished ? "Game Over" : "Pause";
  }

})
