
// Game elements
const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const healthFill = document.getElementById('health-fill');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

// Game state
let gameRunning = false;
let score = 0;
let health = 100;
let playerX = window.innerWidth / 2;
let playerY = window.innerHeight - 100;
let bullets = [];
let enemies = [];
let powerUps = [];
let stars = [];
let keysPressed = {};
let lastShot = 0;
let lastEnemySpawn = 0;
let lastPowerUpSpawn = 0;
let rapidFire = false;
let rapidFireTimeout = null;

// Game settings
const playerSpeed = 10;
const bulletSpeed = 12;
const enemySpeed = 3;
let enemySpawnInterval = 1500;
const powerUpSpawnInterval = 10000;
const shootCooldown = 300;
const collisionDistance = 25;

// Initialize game
function init() {
    // Set player position
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';

    // Create stars
    createStars();

    // Event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);

    // Start animation
    requestAnimationFrame(gameLoop);
}

// Create stars
function createStars() {
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const size = Math.random() * 2 + 1;
        const speed = Math.random() * 3 + 1;

        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = x + 'px';
        star.style.top = y + 'px';
        star.style.opacity = Math.random() * 0.7 + 0.3;

        gameContainer.appendChild(star);

        stars.push({
            element: star,
            x: x,
            y: y,
            speed: speed
        });
    }
}

// Update stars
function updateStars() {
    stars.forEach(star => {
        star.y += star.speed;

        if (star.y > window.innerHeight) {
            star.y = 0;
            star.x = Math.random() * window.innerWidth;
        }

        star.element.style.top = star.y + 'px';
        star.element.style.left = star.x + 'px';
    });
}

// Handle key down
function handleKeyDown(event) {
    keysPressed[event.key] = true;
}

// Handle key up
function handleKeyUp(event) {
    keysPressed[event.key] = false;
}

// Update player
function updatePlayer() {
    if ((keysPressed['ArrowLeft'] || keysPressed['a']) && playerX > 25) {
        playerX -= playerSpeed;
    }

    if ((keysPressed['ArrowRight'] || keysPressed['d']) && playerX < window.innerWidth - 25) {
        playerX += playerSpeed;
    }

    player.style.left = playerX + 'px';

    // Shooting
    if ((keysPressed[' '] || keysPressed['ArrowUp']) &&
        Date.now() - lastShot > (rapidFire ? 100 : shootCooldown)) {
        createBullet();
        lastShot = Date.now();
    }
}

// Create bullet
function createBullet() {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');

    bullet.style.left = playerX + 'px';
    bullet.style.top = playerY - 20 + 'px';

    gameContainer.appendChild(bullet);

    bullets.push({
        element: bullet,
        x: playerX,
        y: playerY - 20
    });
}

// Update bullets
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];

        bullet.y -= bulletSpeed;
        bullet.element.style.top = bullet.y + 'px';

        // Check if bullet is off screen
        if (bullet.y < 0) {
            bullet.element.remove();
            bullets.splice(i, 1);
            continue;
        }

        // Check for collisions with enemies
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];

            const dx = bullet.x - enemy.x;
            const dy = bullet.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < collisionDistance) {
                // Create explosion
                createExplosion(enemy.x, enemy.y);

                // Remove enemy and bullet
                enemy.element.remove();
                bullet.element.remove();
                enemies.splice(j, 1);
                bullets.splice(i, 1);

                // Update score
                score += 10;
                scoreElement.textContent = score;
                break;
            }
        }
    }
}

// Create enemy
function createEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');

    const x = Math.random() * (window.innerWidth - 40) + 20;
    const y = -20;

    enemy.style.left = x + 'px';
    enemy.style.top = y + 'px';

    gameContainer.appendChild(enemy);

    enemies.push({
        element: enemy,
        x: x,
        y: y,
        speed: enemySpeed + Math.random() * 2
    });

    lastEnemySpawn = Date.now();
}

// Update enemies
function updateEnemies() {
    // Spawn new enemies
    if (Date.now() - lastEnemySpawn > enemySpawnInterval && gameRunning) {
        createEnemy();

        // Increase difficulty
        enemySpawnInterval = Math.max(300, enemySpawnInterval - 10);
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];

        enemy.y += enemy.speed;
        enemy.element.style.top = enemy.y + 'px';

        // Check if enemy is off screen
        if (enemy.y > window.innerHeight + 20) {
            enemy.element.remove();
            enemies.splice(i, 1);

            // Decrease health
            health -= 10;
            updateHealth();

            if (health <= 0 && gameRunning) {
                gameOver();
            }

            continue;
        }

        // Check for collision with player
        const dx = enemy.x - playerX;
        const dy = enemy.y - playerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < collisionDistance && gameRunning) {
            // Create explosion
            createExplosion(enemy.x, enemy.y);

            // Remove enemy
            enemy.element.remove();
            enemies.splice(i, 1);

            // Decrease health
            health -= 20;
            updateHealth();

            if (health <= 0) {
                gameOver();
            }
        }
    }
}

// Create power-up
function createPowerUp() {
    const powerUp = document.createElement('div');
    powerUp.classList.add('power-up');

    const x = Math.random() * (window.innerWidth - 40) + 20;
    const y = -20;

    powerUp.style.left = x + 'px';
    powerUp.style.top = y + 'px';

    // Determine power-up type
    const type = Math.random() < 0.5 ? 'rapid' : 'health';

    if (type === 'rapid') {
        powerUp.style.backgroundColor = '#ff00ff';
        powerUp.style.boxShadow = '0 0 10px #ff00ff';
    } else {
        powerUp.style.backgroundColor = '#00ff00';
        powerUp.style.boxShadow = '0 0 10px #00ff00';
    }

    gameContainer.appendChild(powerUp);

    powerUps.push({
        element: powerUp,
        x: x,
        y: y,
        type: type
    });

    lastPowerUpSpawn = Date.now();
}

// Update power-ups
function updatePowerUps() {
    // Spawn new power-up
    if (Date.now() - lastPowerUpSpawn > powerUpSpawnInterval && gameRunning) {
        createPowerUp();
    }

    for (let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp = powerUps[i];

        powerUp.y += 3;
        powerUp.element.style.top = powerUp.y + 'px';

        // Check if power-up is off screen
        if (powerUp.y > window.innerHeight + 20) {
            powerUp.element.remove();
            powerUps.splice(i, 1);
            continue;
        }

        // Check for collision with player
        const dx = powerUp.x - playerX;
        const dy = powerUp.y - playerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < collisionDistance && gameRunning) {
            // Apply power-up effect
            if (powerUp.type === 'rapid') {
                activateRapidFire();
            } else {
                activateHealthBoost();
            }

            // Remove power-up
            powerUp.element.remove();
            powerUps.splice(i, 1);
        }
    }
}

// Activate rapid fire
function activateRapidFire() {
    rapidFire = true;

    // Clear previous timeout
    if (rapidFireTimeout) {
        clearTimeout(rapidFireTimeout);
    }

    // Create visual effect
    player.style.backgroundColor = '#ff00ff';
    player.style.boxShadow = '0 0 10px #ff00ff';

    // Set timeout to deactivate
    rapidFireTimeout = setTimeout(() => {
        rapidFire = false;
        player.style.backgroundColor = '#00ffff';
        player.style.boxShadow = '0 0 10px #00ffff';
    }, 5000);
}

// Activate health boost
function activateHealthBoost() {
    health = Math.min(100, health + 30);
    updateHealth();

    // Create visual effect
    healthFill.style.boxShadow = '0 0 10px #00ff00';

    setTimeout(() => {
        healthFill.style.boxShadow = 'none';
    }, 1000);
}

// Create explosion
function createExplosion(x, y) {
    const explosion = document.createElement('div');
    explosion.classList.add('explosion');

    explosion.style.left = x + 'px';
    explosion.style.top = y + 'px';

    gameContainer.appendChild(explosion);

    // Animation
    let size = 0.2;
    let opacity = 1;

    const explode = setInterval(() => {
        size += 0.1;
        opacity -= 0.05;

        explosion.style.transform = `translate(-50%, -50%) scale(${size})`;
        explosion.style.opacity = opacity;

        if (opacity <= 0) {
            clearInterval(explode);
            explosion.remove();
        }
    }, 20);
}

// Update health
function updateHealth() {
    healthFill.style.width = health + '%';

    if (health < 30) {
        healthFill.style.backgroundColor = '#ff0000';
    } else if (health < 60) {
        healthFill.style.backgroundColor = '#ffff00';
    } else {
        healthFill.style.backgroundColor = '#00ff00';
    }
}

// Game loop
function gameLoop() {
    updateStars();

    if (gameRunning) {
        updatePlayer();
        updateBullets();
        updateEnemies();
        updatePowerUps();
    }

    requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
    gameRunning = true;
    startScreen.style.display = 'none';
}

// Game over
function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverScreen.style.display = 'flex';
}

// Restart game
function restartGame() {
    // Clear all game elements
    bullets.forEach(bullet => bullet.element.remove());
    enemies.forEach(enemy => enemy.element.remove());
    powerUps.forEach(powerUp => powerUp.element.remove());

    // Reset game state
    bullets = [];
    enemies = [];
    powerUps = [];
    score = 0;
    health = 100;
    playerX = window.innerWidth / 2;
    playerY = window.innerHeight - 100;
    enemySpawnInterval = 1500;
    rapidFire = false;

    // Clear timeouts
    if (rapidFireTimeout) {
        clearTimeout(rapidFireTimeout);
    }

    // Update UI
    scoreElement.textContent = '0';
    updateHealth();
    player.style.backgroundColor = '#00ffff';
    player.style.boxShadow = '0 0 10px #00ffff';
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';

    // Hide game over screen
    gameOverScreen.style.display = 'none';

    // Start game
    gameRunning = true;
}

// Handle window resize
window.addEventListener('resize', () => {
    playerY = window.innerHeight - 100;
    player.style.top = playerY + 'px';
});

// Initialize game
init();

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
