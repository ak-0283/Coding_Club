let board = ['', '', '', '', '', '', '', '', ''];
        let currentPlayer = 'X';
        let gameActive = true;
        let score = { X: 0, O: 0 };
        function renderBoard() {
            const boardElement = document.getElementById("board");
            boardElement.innerHTML = '';
            board.forEach((cell, index) => {
                const cellElement = document.createElement("div");
                cellElement.classList.add("cell");
                cellElement.innerText = cell;
                cellElement.addEventListener("click", () => makeMove(index));
                boardElement.appendChild(cellElement);
            });
        }
        
        function makeMove(index) {
            if (board[index] === '' && gameActive) {
                board[index] = currentPlayer;
                checkWinner();
                currentPlayer = 'O';
                renderBoard();
                
                if (gameActive && currentPlayer === 'O') {
                    setTimeout(aiMove, 500);
                }
            }
        }
        
        function aiMove() {
            let emptyCells = board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
            if (emptyCells.length > 0) {
                let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                board[randomIndex] = 'O';
                checkWinner();
                currentPlayer = 'X';
                renderBoard();
            }
        }
        
        function checkWinner() {
            const winningCombinations = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ];
            
            winningCombinations.forEach(combo => {
                const [a, b, c] = combo;
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    document.getElementById("result").innerText = `Player ${board[a]} wins!`;
                    score[board[a]]++;
                    updateScore();
                    gameActive = false;
                }
            });
            
            if (!board.includes('') && gameActive) {
                document.getElementById("result").innerText = "It's a tie!";
                gameActive = false;
            }
        }
        
        function updateScore() {
            document.getElementById("score").innerText = `X: ${score.X} | O: ${score.O}`;
        }
        
        function resetGame() {
            board = ['', '', '', '', '', '', '', '', ''];
            currentPlayer = 'X';
            gameActive = true;
            document.getElementById("result").innerText = "Player X's turn!";
            renderBoard();
        }
        
        renderBoard();

// Theme Toggle
if (toggleTheme) {
    toggleTheme.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

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