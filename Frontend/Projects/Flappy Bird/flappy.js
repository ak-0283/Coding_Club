const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");
const scoreDisplay = document.getElementById("scoreDisplay");
const controlsInfo = document.getElementById("controlsInfo");

canvas.width = 400;
canvas.height = 500;

let bird = {
    x: 50,
    y: 150,
    radius: 15,
    velocity: 0,
    gravity: 0.5,
    jump: -8,
    rotation: 0,
    wingPosition: 0,
    wingDirection: 1
};

let pipes = [];
let clouds = [];
let pipeWidth = 50;
let pipeGap = 120;
let pipeSpeed = 2;
let score = 0;
let gameOver = false;
let gameStarted = false;
let frameCount = 0;

// Create some initial clouds
for (let i = 0; i < 5; i++) {
    clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * 100,
        width: 40 + Math.random() * 30,
        speed: 0.5 + Math.random() * 0.5
    });
}

function drawBird() {
    ctx.save();
    ctx.translate(bird.x, bird.y);

    // Rotate bird based on velocity
    bird.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, bird.velocity * 0.1));
    ctx.rotate(bird.rotation);

    // Bird body
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
    ctx.fill();

    // Bird wing
    ctx.fillStyle = "#FF6347";
    ctx.beginPath();
    bird.wingPosition += 0.2 * bird.wingDirection;
    if (bird.wingPosition > 3 || bird.wingPosition < -3) {
        bird.wingDirection *= -1;
    }
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-20, bird.wingPosition * 2, -5, 15);
    ctx.fill();

    // Bird eye
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(8, -5, 3, 0, Math.PI * 2);
    ctx.fill();

    // Bird beak
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.moveTo(bird.radius, 0);
    ctx.lineTo(bird.radius + 10, -5);
    ctx.lineTo(bird.radius + 10, 5);
    ctx.fill();

    ctx.restore();
}

function drawClouds() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    clouds.forEach(cloud => {
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.width / 3, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.width / 4, cloud.y - cloud.width / 6, cloud.width / 4, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.width / 2, cloud.y, cloud.width / 3, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.width / 4, cloud.y + cloud.width / 6, cloud.width / 4, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateClouds() {
    clouds.forEach(cloud => {
        cloud.x -= cloud.speed;
        if (cloud.x + cloud.width < 0) {
            cloud.x = canvas.width + cloud.width;
            cloud.y = Math.random() * 100;
        }
    });
}

function drawPipes() {
    pipes.forEach(pipe => {
        // Draw top pipe
        ctx.fillStyle = "#2E8B57";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        // Pipe cap
        ctx.fillStyle = "#3CB371";
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, pipeWidth + 10, 20);

        // Draw bottom pipe
        ctx.fillStyle = "#2E8B57";
        ctx.fillRect(pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height - pipe.topHeight - pipeGap);
        // Pipe cap
        ctx.fillStyle = "#3CB371";
        ctx.fillRect(pipe.x - 5, pipe.topHeight + pipeGap, pipeWidth + 10, 20);
    });
}

function updatePipes() {
    if (gameOver || !gameStarted) return;

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        let topHeight = 50 + Math.random() * (canvas.height - pipeGap - 100);
        pipes.push({
            x: canvas.width,
            topHeight,
            passed: false
        });
    }

    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        // Check if bird passed the pipe
        if (!pipe.passed && bird.x > pipe.x + pipeWidth) {
            pipe.passed = true;
            score++;
            scoreDisplay.textContent = "Score: " + score;

            // Add score animation
            const scoreAnimation = document.createElement("div");
            scoreAnimation.textContent = "+1";
            scoreAnimation.style.position = "absolute";
            scoreAnimation.style.left = (bird.x + 20) + "px";
            scoreAnimation.style.top = (bird.y - 20) + "px";
            scoreAnimation.style.color = "gold";
            scoreAnimation.style.fontSize = "24px";
            scoreAnimation.style.fontWeight = "bold";
            scoreAnimation.style.textShadow = "2px 2px 4px rgba(0,0,0,0.5)";
            scoreAnimation.style.pointerEvents = "none";
            scoreAnimation.style.animation = "fadeUpAndOut 1s forwards";
            document.querySelector(".game-container").appendChild(scoreAnimation);

            setTimeout(() => {
                document.querySelector(".game-container").removeChild(scoreAnimation);
            }, 1000);
        }
    });

    if (pipes.length > 0 && pipes[0].x + pipeWidth < 0) {
        pipes.shift();
    }
}

function checkCollision() {
    if (!gameStarted) return;

    if (bird.y + bird.radius >= canvas.height || bird.y - bird.radius <= 0) {
        endGame();
    }

    pipes.forEach(pipe => {
        if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipeWidth) {
            if (bird.y - bird.radius < pipe.topHeight || bird.y + bird.radius > pipe.topHeight + pipeGap) {
                endGame();
            }
        }
    });
}

function endGame() {
    gameOver = true;
    controlsInfo.style.display = "none";

    // Create game over screen
    const gameOverScreen = document.createElement("div");
    gameOverScreen.className = "start-screen";
    gameOverScreen.style.animation = "fadeIn 0.5s ease";

    const gameOverTitle = document.createElement("h1");
    gameOverTitle.textContent = "Game Over";

    const finalScore = document.createElement("p");
    finalScore.textContent = "Final Score: " + score;

    const restartButton = document.createElement("button");
    restartButton.className = "start-button";
    restartButton.textContent = "Play Again";
    restartButton.addEventListener("click", () => {
        location.reload();
    });

    const restartText = document.createElement("p");
    restartText.innerHTML = "Press <span class='key'>R</span> to restart";
    restartText.style.marginTop = "10px";

    gameOverScreen.appendChild(gameOverTitle);
    gameOverScreen.appendChild(finalScore);
    gameOverScreen.appendChild(restartButton);
    gameOverScreen.appendChild(restartText);

    document.querySelector(".game-container").appendChild(gameOverScreen);
}

function drawBackground() {
    // Draw sky gradient (already set in canvas style)

    // Draw ground
    const groundHeight = 20;
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

    // Draw grass
    ctx.fillStyle = "#32CD32";
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, 5);
}

function update() {
    frameCount++;

    if (gameStarted) {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
    } else {
        // Hovering effect
        bird.y = 150 + Math.sin(frameCount * 0.05) * 10;
    }

    updateClouds();
    updatePipes();
    checkCollision();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawClouds();
    drawPipes();
    drawBird();

    if (!gameOver) {
        requestAnimationFrame(update);
    }
}

function startGame() {
    gameStarted = true;
    startScreen.style.display = "none";
    bird.velocity = bird.jump;
}

function flapWings() {
    if (!gameStarted) {
        startGame();
    } else if (!gameOver) {
        bird.velocity = bird.jump;
    }
}

function restart() {
    if (gameOver) {
        location.reload();
    }
}

// Button event
startButton.addEventListener("click", startGame);

// Mouse event
canvas.addEventListener("click", flapWings);

// Keyboard events
document.addEventListener("keydown", (e) => {
    // Multiple keys for flapping
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault(); // Prevent scrolling with spacebar/arrow keys
        flapWings();
    }

    // Restart game with R key
    if (e.code === "KeyR" && gameOver) {
        restart();
    }
});

// Add touch event for mobile
canvas.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Prevent scrolling on touch devices
    flapWings();
});

// Add keyframe animation for score popup
const style = document.createElement('style');
style.textContent = `
            @keyframes fadeUpAndOut {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(-20px); opacity: 0; }
            }
        `;
document.head.appendChild(style);

update();

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
