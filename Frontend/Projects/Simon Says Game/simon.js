let sequence = [];
let playerSequence = [];
let colors = ['green', 'red', 'blue', 'yellow'];
let level = 0;
let isPlayerTurn = false;

function startGame() {
    sequence = [];
    playerSequence = [];
    level = 0;
    isPlayerTurn = false;
    document.getElementById("status").innerText = "Watch the sequence!";
    nextRound();
}

function nextRound() {
    level++;
    playerSequence = [];
    sequence.push(colors[Math.floor(Math.random() * 4)]);
    playSequence();
}

function playSequence() {
    isPlayerTurn = false;
    let i = 0;
    const interval = setInterval(() => {
        highlight(sequence[i]);
        i++;
        if (i >= sequence.length) {
            clearInterval(interval);
            setTimeout(() => {
                isPlayerTurn = true;
                document.getElementById("status").innerText = "Your turn!";
            }, 500);
        }
    }, 1000);
}

function highlight(color) {
    let square = document.getElementById(color);
    square.classList.add("active");
    setTimeout(() => {
        square.classList.remove("active");
    }, 500);
}

function playerClick(color) {
    if (!isPlayerTurn) return;
    playerSequence.push(color);
    highlight(color);
    checkSequence();
}

function checkSequence() {
    let index = playerSequence.length - 1;
    if (playerSequence[index] !== sequence[index]) {
        document.getElementById("status").innerText = "Game Over! Press Start to Play Again.";
        return;
    }
    if (playerSequence.length === sequence.length) {
        document.getElementById("status").innerText = `Good Job! Level ${level}`;
        setTimeout(nextRound, 1000);
    }
}

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