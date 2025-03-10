
// Game variables
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const restartButton = document.getElementById('restart-button');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const levelInfoElement = document.getElementById('level-info');

// Game state
let score = 0;
let lives = 3;
let level = 1;
let gameRunning = false;
let gamePaused = false;

// Ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 8,
    dx: 4,
    dy: -4,
    color: '#FF6347'
};

// Paddle properties
const paddle = {
    width: 80,
    height: 10,
    x: (canvas.width - 80) / 2,
    y: canvas.height - 20,
    dx: 8,
    color: '#4CAF50'
};

// Brick properties
const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 50;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 50;
const brickOffsetLeft = 25;
const bricks = [];

// Initialize bricks
function initBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            // Set different colors for different rows
            let brickColor;
            switch (r) {
                case 0:
                    brickColor = '#FF6347'; // Red
                    break;
                case 1:
                    brickColor = '#FFA500'; // Orange
                    break;
                case 2:
                    brickColor = '#FFD700'; // Yellow
                    break;
                case 3:
                    brickColor = '#00CED1'; // Turquoise
                    break;
                case 4:
                    brickColor = '#9370DB'; // Purple
                    break;
            }

            bricks[c][r] = {
                x: c * (brickWidth + brickPadding) + brickOffsetLeft,
                y: r * (brickHeight + brickPadding) + brickOffsetTop,
                width: brickWidth,
                height: brickHeight,
                status: 1,
                color: brickColor
            };
        }
    }
}

// Draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

// Draw the paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = paddle.color;
    ctx.fill();
    ctx.closePath();
}

// Draw the bricks
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                ctx.beginPath();
                ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
                ctx.fillStyle = bricks[c][r].color;
                ctx.fill();
                ctx.strokeStyle = '#000';
                ctx.strokeRect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
                ctx.closePath();
            }
        }
    }
}

// Update score display
function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

// Update lives display
function updateLives() {
    livesElement.textContent = `Lives: ${lives}`;
}

// Update level display
function updateLevel() {
    levelInfoElement.textContent = `Level: ${level}`;
}

// Check for collisions with bricks
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brick = bricks[c][r];
            if (brick.status === 1) {
                if (
                    ball.x > brick.x &&
                    ball.x < brick.x + brickWidth &&
                    ball.y > brick.y &&
                    ball.y < brick.y + brickHeight
                ) {
                    ball.dy = -ball.dy;
                    brick.status = 0;
                    score += 10;
                    updateScore();

                    // Check if all bricks are gone
                    if (score === brickRowCount * brickColumnCount * 10 * level) {
                        level++;
                        ball.dx *= 1.1; // Increase ball speed
                        ball.dy *= 1.1;
                        resetBall();
                        paddle.width = Math.max(40, paddle.width - 5); // Decrease paddle width
                        initBricks();
                        updateLevel();
                    }
                }
            }
        }
    }
}

// Move the paddle
function movePaddle() {
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.dx;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}

// Reset the ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1) * (1 + (level - 1) * 0.1);
    ball.dy = -4 * (1 + (level - 1) * 0.1);
}

// Game over function
function gameOver() {
    gameRunning = false;
    gameOverElement.style.display = 'block';
    finalScoreElement.textContent = `Final Score: ${score}`;
}

// Draw everything
function draw() {
    if (!gameRunning || gamePaused) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw elements
    drawBricks();
    drawBall();
    drawPaddle();

    // Collision detection with walls
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
        // Check if ball hits the paddle
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy = -ball.dy;

            // Adjust ball direction based on where it hit the paddle
            const hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
            ball.dx = hitPoint * 5; // Max 5, min -5
        } else {
            // Ball missed the paddle
            lives--;
            updateLives();

            if (lives === 0) {
                gameOver();
            } else {
                resetBall();
            }
        }
    }

    // Collision detection with bricks
    collisionDetection();

    // Move the paddle
    movePaddle();

    // Move the ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Continue the animation
    requestAnimationFrame(draw);
}

// Keyboard controls
let rightPressed = false;
let leftPressed = false;

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

// Mouse/touch controls
function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.width / 2;
    }
}

function touchMoveHandler(e) {
    e.preventDefault();
    const relativeX = e.touches[0].clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.width / 2;
    }
}

// Start the game
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gamePaused = false;
        score = 0;
        lives = 3;
        level = 1;
        paddle.width = 80;
        updateScore();
        updateLives();
        updateLevel();

        initBricks();
        resetBall();
        gameOverElement.style.display = 'none';

        startButton.textContent = 'Restart Game';
        pauseButton.textContent = 'Pause';

        draw();
    } else {
        // Restart the game
        score = 0;
        lives = 3;
        level = 1;
        paddle.width = 80;
        updateScore();
        updateLives();
        updateLevel();

        initBricks();
        resetBall();
    }
}

// Pause the game
function togglePause() {
    if (gameRunning) {
        gamePaused = !gamePaused;
        pauseButton.textContent = gamePaused ? 'Resume' : 'Pause';

        if (!gamePaused) {
            draw();
        }
    }
}

// Event listeners
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);
document.addEventListener('touchmove', touchMoveHandler, { passive: false });
startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', togglePause);
restartButton.addEventListener('click', startGame);

// Initialize bricks
initBricks();
drawBricks();
drawBall();
drawPaddle();

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
