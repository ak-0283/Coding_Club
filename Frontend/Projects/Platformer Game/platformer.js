// Game variables
const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const restartButton = document.getElementById('restart-button');

let playerPos = { x: 50, y: 0 };
let velocity = { x: 0, y: 0 };
let platforms = [];
let coins = [];
let enemies = [];
let clouds = [];
let score = 0;
let isJumping = false;
let isGameOver = false;
let gameAnimation;

const gravity = 0.5;
const jumpForce = -12;
const moveSpeed = 5;
const gameWidth = 800;
const gameHeight = 500;

// Initialize the game
function initGame() {
    // Reset game state
    playerPos = { x: 50, y: 0 };
    velocity = { x: 0, y: 0 };
    platforms = [];
    coins = [];
    enemies = [];
    clouds = [];
    score = 0;
    isGameOver = false;

    scoreElement.textContent = score;
    gameOverElement.style.display = 'none';
    restartButton.style.display = 'none';

    // Create platforms
    createPlatform(0, gameHeight - 20, gameWidth, 20); // Ground
    createPlatform(100, 400, 200, 20);
    createPlatform(350, 350, 150, 20);
    createPlatform(600, 300, 150, 20);
    createPlatform(450, 250, 100, 20);
    createPlatform(200, 200, 150, 20);
    createPlatform(50, 150, 100, 20);
    createPlatform(350, 120, 80, 20);
    createPlatform(600, 180, 120, 20);

    // Create coins
    createCoin(150, 370);
    createCoin(400, 320);
    createCoin(650, 270);
    createCoin(480, 220);
    createCoin(250, 170);
    createCoin(80, 120);
    createCoin(380, 90);
    createCoin(650, 150);

    // Create enemies
    createEnemy(250, 400);
    createEnemy(400, 350);
    createEnemy(650, 300);
    createEnemy(250, 200);

    // Create clouds
    createCloud(50, 50, 80, 40, 15);
    createCloud(200, 80, 100, 50, 20);
    createCloud(500, 60, 120, 60, 18);
    createCloud(700, 100, 90, 45, 25);

    // Start game loop
    if (gameAnimation) {
        cancelAnimationFrame(gameAnimation);
    }
    gameLoop();
}

// Create a platform
function createPlatform(x, y, width, height) {
    const platform = document.createElement('div');
    platform.className = 'platform';
    platform.style.left = x + 'px';
    platform.style.top = y + 'px';
    platform.style.width = width + 'px';

    gameContainer.appendChild(platform);
    platforms.push({ element: platform, x, y, width, height });
}

// Create a coin
function createCoin(x, y) {
    const coin = document.createElement('div');
    coin.className = 'coin';
    coin.style.left = x + 'px';
    coin.style.top = y + 'px';

    gameContainer.appendChild(coin);
    coins.push({ element: coin, x, y, collected: false });
}

// Create an enemy
function createEnemy(x, y) {
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemy.style.left = x + 'px';
    enemy.style.top = y + 'px';

    gameContainer.appendChild(enemy);
    enemies.push({ element: enemy, x, y });
}

// Create a cloud
function createCloud(x, y, width, height, speed) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    cloud.style.left = x + 'px';
    cloud.style.top = y + 'px';
    cloud.style.width = width + 'px';
    cloud.style.height = height + 'px';
    cloud.style.animationDuration = (30000 / speed) + 'ms';

    gameContainer.appendChild(cloud);
    clouds.push({ element: cloud, x, y, width, height });
}

// Game loop
function gameLoop() {
    if (!isGameOver) {
        updatePlayer();
        checkCollisions();
        renderGame();
        gameAnimation = requestAnimationFrame(gameLoop);
    }
}

// Update player position
function updatePlayer() {
    // Apply gravity
    velocity.y += gravity;

    // Update position
    playerPos.x += velocity.x;
    playerPos.y += velocity.y;

    // Check boundaries
    if (playerPos.x < 0) {
        playerPos.x = 0;
    } else if (playerPos.x > gameWidth - 40) {
        playerPos.x = gameWidth - 40;
    }

    // Check if player fell off the screen
    if (playerPos.y > gameHeight) {
        gameOver();
    }
}

// Check for collisions
function checkCollisions() {
    // Platform collisions
    isJumping = true;
    for (const platform of platforms) {
        if (
            playerPos.y + 60 >= platform.y &&
            playerPos.y + 60 <= platform.y + 10 &&
            playerPos.x + 40 > platform.x &&
            playerPos.x < platform.x + platform.width &&
            velocity.y >= 0
        ) {
            playerPos.y = platform.y - 60;
            velocity.y = 0;
            isJumping = false;
        }
    }

    // Coin collisions
    for (const coin of coins) {
        if (
            !coin.collected &&
            playerPos.x < coin.x + 20 &&
            playerPos.x + 40 > coin.x &&
            playerPos.y < coin.y + 20 &&
            playerPos.y + 60 > coin.y
        ) {
            coin.collected = true;
            coin.element.style.display = 'none';
            score += 10;
            scoreElement.textContent = score;
        }
    }

    // Enemy collisions
    for (const enemy of enemies) {
        if (
            playerPos.x < enemy.x + 30 &&
            playerPos.x + 40 > enemy.x &&
            playerPos.y < enemy.y + 30 &&
            playerPos.y + 60 > enemy.y
        ) {
            gameOver();
        }
    }
}

// Render game elements
function renderGame() {
    player.style.left = playerPos.x + 'px';
    player.style.top = playerPos.y + 'px';

    // Add running animation
    if (velocity.x !== 0) {
        player.style.transform = velocity.x > 0 ? 'scaleX(1)' : 'scaleX(-1)';
    }
}

// Game over function
function gameOver() {
    isGameOver = true;
    gameOverElement.style.display = 'block';
    restartButton.style.display = 'block';
}

// Event listeners for controls
document.addEventListener('keydown', (event) => {
    if (isGameOver) return;

    switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            velocity.x = -moveSpeed;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            velocity.x = moveSpeed;
            break;
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (!isJumping) {
                velocity.y = jumpForce;
                isJumping = true;
            }
            break;
    }
});

document.addEventListener('keyup', (event) => {
    if (
        (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') &&
        velocity.x < 0
    ) {
        velocity.x = 0;
    }
    if (
        (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') &&
        velocity.x > 0
    ) {
        velocity.x = 0;
    }
});

// Restart button event listener
restartButton.addEventListener('click', initGame);

// Initialize the game when the page loads
window.onload = initGame;

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
