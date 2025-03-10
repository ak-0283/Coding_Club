document.addEventListener('DOMContentLoaded', () => {
    // Game variables
    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    const startPauseButton = document.getElementById('start-pause');
    const resetButton = document.getElementById('reset');
    const overlay = document.getElementById('overlay');
    const overlayStart = document.getElementById('overlay-start');
    
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 5, y: 5 };
    let dx = 0;
    let dy = 0;
    let lastDirection = { dx: 0, dy: 0 };
    let score = 0;
    let highScore = 0; // Default high score
    let gameStarted = false;
    let gamePaused = false;
    let gameSpeed = 200; // milliseconds
    let gameInterval;
    let boardSize = 20; // 20x20 grid
    let cellSize;
    
    // Initialize high score display
    highScoreElement.textContent = highScore;
    
    // Calculate cell size based on board dimensions
    function calculateCellSize() {
      const boardRect = gameBoard.getBoundingClientRect();
      cellSize = Math.floor(boardRect.width / boardSize);
      return cellSize;
    }
    
    // Initialize game
    function initGame() {
      calculateCellSize();
      overlay.classList.add('active');
      
      // Event listeners
      document.addEventListener('keydown', changeDirection);
      startPauseButton.addEventListener('click', toggleGame);
      resetButton.addEventListener('click', resetGame);
      overlayStart.addEventListener('click', startGame);
      
      window.addEventListener('resize', () => {
        calculateCellSize();
        drawGame();
      });
    }
    
    // Start game
    function startGame() {
      if (!gameStarted) {
        overlay.classList.remove('active');
        gameStarted = true;
        startPauseButton.textContent = 'Pause';
        
        // Set initial direction
        dx = 1;
        dy = 0;
        lastDirection = { dx: 1, dy: 0 };
        
        // Reset snake
        snake = [{ x: 10, y: 10 }];
        
        // Generate food
        generateFood();
        
        // Start game loop
        gameInterval = setInterval(moveSnake, gameSpeed);
      }
    }
    
    // Toggle game (pause/resume)
    function toggleGame() {
      if (!gameStarted) {
        startGame();
      } else {
        if (gamePaused) {
          // Resume game
          gamePaused = false;
          startPauseButton.textContent = 'Pause';
          gameInterval = setInterval(moveSnake, gameSpeed);
        } else {
          // Pause game
          gamePaused = true;
          startPauseButton.textContent = 'Resume';
          clearInterval(gameInterval);
        }
      }
    }
    
    // Reset game
    function resetGame() {
      clearInterval(gameInterval);
      gameStarted = false;
      gamePaused = false;
      score = 0;
      scoreElement.textContent = score;
      startPauseButton.textContent = 'Start';
      overlay.classList.add('active');
    }
    
    // Generate food
    function generateFood() {
      // Generate random position for food
      let newFoodPosition;
      do {
        newFoodPosition = {
          x: Math.floor(Math.random() * boardSize),
          y: Math.floor(Math.random() * boardSize)
        };
      } while (
        // Make sure food doesn't spawn on snake
        snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y)
      );
      
      food = newFoodPosition;
    }
    
    // Change direction based on key press
    function changeDirection(e) {
      if (!gameStarted || gamePaused) return;
      
      const key = e.key;
      
      // Prevent reversing direction
      if (
        (key === 'ArrowUp' || key === 'w' || key === 'W') && lastDirection.dy !== 1
      ) {
        dx = 0;
        dy = -1;
      } else if (
        (key === 'ArrowDown' || key === 's' || key === 'S') && lastDirection.dy !== -1
      ) {
        dx = 0;
        dy = 1;
      } else if (
        (key === 'ArrowLeft' || key === 'a' || key === 'A') && lastDirection.dx !== 1
      ) {
        dx = -1;
        dy = 0;
      } else if (
        (key === 'ArrowRight' || key === 'd' || key === 'D') && lastDirection.dx !== -1
      ) {
        dx = 1;
        dy = 0;
      }
    }
    
    // Move snake
    function moveSnake() {
      // Save last direction
      lastDirection = { dx, dy };
      
      // Calculate new head position
      const head = { ...snake[0] };
      head.x += dx;
      head.y += dy;
      
      // Check for collisions
      if (
        head.x < 0 || head.x >= boardSize ||
        head.y < 0 || head.y >= boardSize ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        // Game over
        gameOver();
        return;
      }
      
      // Add new head
      snake.unshift(head);
      
      // Check if snake ate food
      if (head.x === food.x && head.y === food.y) {
        // Increase score
        score += 10;
        scoreElement.textContent = score;
        
        // Update high score (in memory only, no localStorage)
        if (score > highScore) {
          highScore = score;
          highScoreElement.textContent = highScore;
        }
        
        // Generate new food
        generateFood();
        
        // Increase speed slightly
        if (gameSpeed > 70) {
          clearInterval(gameInterval);
          gameSpeed -= 5;
          gameInterval = setInterval(moveSnake, gameSpeed);
        }
      } else {
        // Remove tail
        snake.pop();
      }
      
      // Draw game
      drawGame();
    }
    
    // Game over
    function gameOver() {
      clearInterval(gameInterval);
      gameStarted = false;
      gamePaused = false;
      startPauseButton.textContent = 'Start';
      
      // Add game over effect
      gameBoard.classList.add('game-over');
      setTimeout(() => {
        gameBoard.classList.remove('game-over');
      }, 500);
      
      // Show overlay with game over message
      const overlayTitle = overlay.querySelector('h2');
      const overlayMessage = overlay.querySelector('p');
      overlayTitle.textContent = 'Game Over!';
      overlayMessage.textContent = `Your score: ${score}. Press button to play again.`;
      overlay.classList.add('active');
    }
    
    // Draw game
    function drawGame() {
      // Clear game board
      gameBoard.innerHTML = '';
      
      // Draw snake
      snake.forEach((segment, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.classList.add('snake');
        
        // Add special class to head
        if (index === 0) {
          snakeElement.classList.add('snake-head');
        }
        
        snakeElement.style.width = `${cellSize}px`;
        snakeElement.style.height = `${cellSize}px`;
        snakeElement.style.left = `${segment.x * cellSize}px`;
        snakeElement.style.top = `${segment.y * cellSize}px`;
        
        gameBoard.appendChild(snakeElement);
      });
      
      // Draw food
      const foodElement = document.createElement('div');
      foodElement.classList.add('food');
      foodElement.style.width = `${cellSize}px`;
      foodElement.style.height = `${cellSize}px`;
      foodElement.style.left = `${food.x * cellSize}px`;
      foodElement.style.top = `${food.y * cellSize}px`;
      
      gameBoard.appendChild(foodElement);
    }
    
    // Initialize game
    initGame();
  });

  // Theme Toggle
if (toggleTheme) {
  toggleTheme.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");

      // Save theme preference
      const isDarkMode = document.body.classList.contains("dark-mode");
      toggleTheme.textContent = isDarkMode ? "☀️" : "🌙";
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  });

  // Load theme preference on page load
  if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
      toggleTheme.textContent = "☀️";
  }
}