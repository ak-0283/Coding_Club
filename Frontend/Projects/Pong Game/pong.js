document.addEventListener('DOMContentLoaded', function () {
    // Game elements
    const gameBoard = document.getElementById('game-board');
    const paddleLeft = document.getElementById('paddle-left');
    const paddleRight = document.getElementById('paddle-right');
    const ball = document.getElementById('ball');
    const scoreLeftElem = document.getElementById('score-left');
    const scoreRightElem = document.getElementById('score-right');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const gameMessage = document.getElementById('game-message');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');

    // Mobile controls
    const leftUpBtn = document.getElementById('left-up');
    const leftDownBtn = document.getElementById('left-down');
    const rightUpBtn = document.getElementById('right-up');
    const rightDownBtn = document.getElementById('right-down');

    // Game variables
    let gameRunning = false;
    let animationFrameId;
    let lastTime = 0;
    let difficulty = 'normal';

    // Game state
    const state = {
        paddleLeftY: 250,
        paddleRightY: 250,
        ballX: 400,
        ballY: 250,
        ballSpeedX: 5,
        ballSpeedY: 5,
        scoreLeft: 0,
        scoreRight: 0,
        paddleHeight: 100,
        paddleWidth: 15,
        ballSize: 20,
        paddleSpeed: 8,
        keys: {
            w: false,
            s: false,
            ArrowUp: false,
            ArrowDown: false
        },
        touchControls: {
            leftUp: false,
            leftDown: false,
            rightUp: false,
            rightDown: false
        }
    };

    // Initialize paddle positions
    function initPositions() {
        const boardHeight = gameBoard.clientHeight;
        state.paddleLeftY = boardHeight / 2 - state.paddleHeight / 2;
        state.paddleRightY = boardHeight / 2 - state.paddleHeight / 2;
        state.ballX = gameBoard.clientWidth / 2 - state.ballSize / 2;
        state.ballY = boardHeight / 2 - state.ballSize / 2;

        updateElements();
    }

    // Update visual elements based on state
    function updateElements() {
        paddleLeft.style.top = `${state.paddleLeftY}px`;
        paddleLeft.style.height = `${state.paddleHeight}px`;

        paddleRight.style.top = `${state.paddleRightY}px`;
        paddleRight.style.height = `${state.paddleHeight}px`;

        ball.style.left = `${state.ballX}px`;
        ball.style.top = `${state.ballY}px`;

        scoreLeftElem.textContent = state.scoreLeft;
        scoreRightElem.textContent = state.scoreRight;
    }

    // Game loop
    function gameLoop(timestamp) {
        if (!gameRunning) return;

        // Calculate delta time for smooth animations
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        // Move paddles
        movePaddles(deltaTime);

        // Move ball
        moveBall(deltaTime);

        // Check collisions
        checkCollisions();

        // Update visual elements
        updateElements();

        // Continue the game loop
        animationFrameId = requestAnimationFrame(gameLoop);
    }

    // Move paddles based on keyboard input
    function movePaddles(deltaTime) {
        const paddleSpeed = state.paddleSpeed * (deltaTime / 16); // Normalize for 60fps
        const boardHeight = gameBoard.clientHeight;

        // Left paddle (Player 1 - W/S keys)
        if (state.keys.w || state.touchControls.leftUp) {
            state.paddleLeftY = Math.max(0, state.paddleLeftY - paddleSpeed);
        }
        if (state.keys.s || state.touchControls.leftDown) {
            state.paddleLeftY = Math.min(boardHeight - state.paddleHeight, state.paddleLeftY + paddleSpeed);
        }

        // Right paddle (Player 2 - Arrow keys)
        if (state.keys.ArrowUp || state.touchControls.rightUp) {
            state.paddleRightY = Math.max(0, state.paddleRightY - paddleSpeed);
        }
        if (state.keys.ArrowDown || state.touchControls.rightDown) {
            state.paddleRightY = Math.min(boardHeight - state.paddleHeight, state.paddleRightY + paddleSpeed);
        }

        // AI control for right paddle if in single-player mode
        if (difficulty === 'normal') {
            // Simple AI: Follow the ball with some delay
            const paddleCenter = state.paddleRightY + state.paddleHeight / 2;
            const targetY = state.ballY + state.ballSize / 2;

            if (Math.abs(paddleCenter - targetY) > 10) {
                if (paddleCenter < targetY) {
                    state.paddleRightY = Math.min(boardHeight - state.paddleHeight, state.paddleRightY + paddleSpeed * 0.7);
                } else {
                    state.paddleRightY = Math.max(0, state.paddleRightY - paddleSpeed * 0.7);
                }
            }
        }
    }

    // Move the ball
    function moveBall(deltaTime) {
        const speedFactor = deltaTime / 16; // Normalize for 60fps
        state.ballX += state.ballSpeedX * speedFactor;
        state.ballY += state.ballSpeedY * speedFactor;
    }

    // Check for collisions
    function checkCollisions() {
        const boardWidth = gameBoard.clientWidth;
        const boardHeight = gameBoard.clientHeight;

        // Top and bottom walls
        if (state.ballY <= 0 || state.ballY + state.ballSize >= boardHeight) {
            state.ballSpeedY = -state.ballSpeedY;
            playSound('wall');

            // Keep ball in bounds
            if (state.ballY <= 0) {
                state.ballY = 0;
            } else {
                state.ballY = boardHeight - state.ballSize;
            }
        }

        // Left paddle collision
        if (state.ballX <= state.paddleWidth + 20 &&
            state.ballY + state.ballSize >= state.paddleLeftY &&
            state.ballY <= state.paddleLeftY + state.paddleHeight &&
            state.ballSpeedX < 0) {

            handlePaddleHit(paddleLeft, state.paddleLeftY, state.paddleHeight, 1);
        }

        // Right paddle collision
        if (state.ballX + state.ballSize >= boardWidth - state.paddleWidth - 20 &&
            state.ballY + state.ballSize >= state.paddleRightY &&
            state.ballY <= state.paddleRightY + state.paddleHeight &&
            state.ballSpeedX > 0) {

            handlePaddleHit(paddleRight, state.paddleRightY, state.paddleHeight, -1);
        }

        // Left and right walls (scoring)
        if (state.ballX <= 0) {
            // Right player scores
            state.scoreRight++;
            scoreRightElem.classList.add('glow');
            setTimeout(() => {
                scoreRightElem.classList.remove('glow');
            }, 500);
            playSound('score');
            resetBall(-1);

            checkGameEnd();
        } else if (state.ballX + state.ballSize >= boardWidth) {
            // Left player scores
            state.scoreLeft++;
            scoreLeftElem.classList.add('glow');
            setTimeout(() => {
                scoreLeftElem.classList.remove('glow');
            }, 500);
            playSound('score');
            resetBall(1);

            checkGameEnd();
        }
    }

    // Handle paddle hit with angle calculation
    function handlePaddleHit(paddleElem, paddleY, paddleHeight, directionX) {
        // Calculate hit position relative to paddle center (range: -0.5 to 0.5)
        const hitPosition = ((state.ballY + state.ballSize / 2) - (paddleY + paddleHeight / 2)) / paddleHeight;

        // Reverse X direction and adjust angle based on hit position
        state.ballSpeedX = -state.ballSpeedX * 1.05; // Speed up slightly with each hit

        // Add angle based on where the ball hit the paddle
        const maxAngle = 60; // Maximum angle in degrees
        const angle = hitPosition * maxAngle;
        const radians = angle * (Math.PI / 180);

        // Calculate new speed components
        const speed = Math.sqrt(state.ballSpeedX * state.ballSpeedX + state.ballSpeedY * state.ballSpeedY);
        state.ballSpeedX = Math.cos(radians) * speed * directionX;
        state.ballSpeedY = Math.sin(radians) * speed;

        // Ensure minimum vertical speed
        if (Math.abs(state.ballSpeedY) < 2) {
            state.ballSpeedY = hitPosition >= 0 ? 2 : -2;
        }

        // Visual and sound effects
        paddleElem.classList.add('glow');
        setTimeout(() => {
            paddleElem.classList.remove('glow');
        }, 300);

        createHitEffect(state.ballX, state.ballY);
        playSound('paddle');
    }

    // Create visual hit effect
    function createHitEffect(x, y) {
        const effect = document.createElement('div');
        effect.classList.add('hit-effect');
        effect.style.left = `${x}px`;
        effect.style.top = `${y}px`;
        gameBoard.appendChild(effect);

        // Remove effect after animation completes
        setTimeout(() => {
            gameBoard.removeChild(effect);
        }, 600);
    }

    // Reset ball position after scoring
    function resetBall(direction) {
        const boardWidth = gameBoard.clientWidth;
        const boardHeight = gameBoard.clientHeight;

        state.ballX = boardWidth / 2 - state.ballSize / 2;
        state.ballY = boardHeight / 2 - state.ballSize / 2;

        // Randomize ball direction slightly
        const angle = (Math.random() * 60 - 30) * (Math.PI / 180);
        const speed = 5;

        state.ballSpeedX = Math.cos(angle) * speed * direction;
        state.ballSpeedY = Math.sin(angle) * speed;

        // Pause briefly before continuing
        gameRunning = false;
        updateElements();

        gameMessage.textContent = direction > 0 ? "Point: Left Player!" : "Point: Right Player!";
        gameMessage.classList.add('visible');

        setTimeout(() => {
            gameMessage.classList.remove('visible');
            if (state.scoreLeft < 10 && state.scoreRight < 10) {
                gameRunning = true;
                lastTime = performance.now();
                animationFrameId = requestAnimationFrame(gameLoop);
            }
        }, 1000);
    }

    // Check if game is over
    function checkGameEnd() {
        if (state.scoreLeft >= 10 || state.scoreRight >= 10) {
            gameRunning = false;
            const winner = state.scoreLeft >= 10 ? "Left Player" : "Right Player";
            gameMessage.textContent = `${winner} Wins!`;
            gameMessage.classList.add('visible');
            startBtn.textContent = "Play Again";
        }
    }

    // Simple "fake" sound effects using console
    function playSound(type) {
        // This is just a placeholder - in a real game you'd use the Web Audio API
        // console.log(`Sound played: ${type}`);
    }

    // Start game
    function startGame() {
        if (gameRunning) return;

        state.scoreLeft = 0;
        state.scoreRight = 0;
        initPositions();

        gameMessage.classList.remove('visible');
        gameRunning = true;
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(gameLoop);

        startBtn.textContent = "Restart";
    }

    // Reset game
    function resetGame() {
        gameRunning = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        state.scoreLeft = 0;
        state.scoreRight = 0;
        initPositions();

        gameMessage.textContent = "Game Reset";
        gameMessage.classList.add('visible');

        setTimeout(() => {
            gameMessage.classList.remove('visible');
        }, 1000);

        startBtn.textContent = "Start Game";
    }

    // Event listeners
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);

    // Keyboard controls
    document.addEventListener('keydown', function (e) {
        if (e.key in state.keys) {
            state.keys[e.key] = true;
            e.preventDefault();
        }

        // Space to start game
        if (e.key === ' ' && !gameRunning) {
            startGame();
            e.preventDefault();
        }
    });

    document.addEventListener('keyup', function (e) {
        if (e.key in state.keys) {
            state.keys[e.key] = false;
        }
    });

    // Touch/Mobile controls
    function setupTouchControls() {
        // Left paddle controls
        leftUpBtn.addEventListener('touchstart', () => { state.touchControls.leftUp = true; });
        leftUpBtn.addEventListener('touchend', () => { state.touchControls.leftUp = false; });
        leftDownBtn.addEventListener('touchstart', () => { state.touchControls.leftDown = true; });
        leftDownBtn.addEventListener('touchend', () => { state.touchControls.leftDown = false; });

        // Right paddle controls
        rightUpBtn.addEventListener('touchstart', () => { state.touchControls.rightUp = true; });
        rightUpBtn.addEventListener('touchend', () => { state.touchControls.rightUp = false; });
        rightDownBtn.addEventListener('touchstart', () => { state.touchControls.rightDown = true; });
        rightDownBtn.addEventListener('touchend', () => { state.touchControls.rightDown = false; });

        // Mouse events for mobile buttons (for testing on desktop)
        leftUpBtn.addEventListener('mousedown', () => { state.touchControls.leftUp = true; });
        leftUpBtn.addEventListener('mouseup', () => { state.touchControls.leftUp = false; });
        leftDownBtn.addEventListener('mousedown', () => { state.touchControls.leftDown = true; });
        leftDownBtn.addEventListener('mouseup', () => { state.touchControls.leftDown = false; });

        rightUpBtn.addEventListener('mousedown', () => { state.touchControls.rightUp = true; });
        rightUpBtn.addEventListener('mouseup', () => { state.touchControls.rightUp = false; });
        rightDownBtn.addEventListener('mousedown', () => { state.touchControls.rightDown = true; });
        rightDownBtn.addEventListener('mouseup', () => { state.touchControls.rightDown = false; });
    }

    // Difficulty controls
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            difficulty = this.dataset.difficulty;
        });
    });

    // Handle window resize
    window.addEventListener('resize', function () {
        initPositions();
    });

    // Initialize game
    initPositions();
    setupTouchControls();
    gameMessage.classList.add('visible');
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