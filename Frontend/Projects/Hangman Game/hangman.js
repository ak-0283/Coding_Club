
document.addEventListener('DOMContentLoaded', function () {
    // Game data with categories and hints
    const wordList = [
        { word: "javascript", category: "Programming", hint: "A popular scripting language for web development" },
        { word: "algorithm", category: "Programming", hint: "A step-by-step procedure for solving a problem" },
        { word: "function", category: "Programming", hint: "A reusable block of code that performs a specific task" },
        { word: "variable", category: "Programming", hint: "A container for storing data values" },
        { word: "database", category: "Programming", hint: "An organized collection of structured information" },
        { word: "framework", category: "Programming", hint: "A platform for developing software applications" },
        { word: "interface", category: "Programming", hint: "A boundary across which two components exchange information" },
        { word: "iteration", category: "Programming", hint: "The process of repeating a set of instructions" },
        { word: "compiler", category: "Programming", hint: "Translates code written in one language to another" },
        { word: "debugging", category: "Programming", hint: "The process of finding and resolving defects" },
        { word: "keyboard", category: "Hardware", hint: "Used for inputting text and commands into a computer" },
        { word: "monitor", category: "Hardware", hint: "Visual display for computers" },
        { word: "processor", category: "Hardware", hint: "The brain of the computer" },
        { word: "internet", category: "Technology", hint: "Global network of connected computers" },
        { word: "software", category: "Technology", hint: "Programs and operating information used by a computer" }
    ];

    // DOM elements
    const wordDisplay = document.getElementById('word-display');
    const keyboard = document.getElementById('keyboard');
    const message = document.getElementById('message');
    const newGameBtn = document.getElementById('new-game-btn');
    const hintBtn = document.getElementById('hint-btn');
    const attemptsLeftElement = document.getElementById('attempts-left');
    const gamesWonElement = document.getElementById('games-won');
    const gamesLostElement = document.getElementById('games-lost');
    const categoryBadge = document.getElementById('category-badge');
    const hintElement = document.getElementById('hint');
    const themeSwitch = document.getElementById('theme-switch');
    const hangmanParts = document.querySelectorAll('.hangman-part');

    // Game state
    let currentWord = "";
    let currentCategory = "";
    let currentHint = "";
    let guessedLetters = [];
    let correctLetters = [];
    let wrongAttempts = 0;
    let maxAttempts = 6;
    let gamesWon = 0;
    let gamesLost = 0;
    let hintUsed = false;
    let gameActive = true;

    // Initialize the game
    initGame();

    // Event listeners
    newGameBtn.addEventListener('click', initGame);
    hintBtn.addEventListener('click', showHint);
    themeSwitch.addEventListener('click', toggleTheme);

    // Function to initialize a new game
    function initGame() {
        // Reset game state
        guessedLetters = [];
        correctLetters = [];
        wrongAttempts = 0;
        hintUsed = false;
        gameActive = true;

        // Select a random word
        const randomIndex = Math.floor(Math.random() * wordList.length);
        const wordData = wordList[randomIndex];

        currentWord = wordData.word.toLowerCase();
        currentCategory = wordData.category;
        currentHint = wordData.hint;

        // Update UI
        updateWordDisplay();
        updateHangman();
        updateMessage("Guess a letter to start the game");

        attemptsLeftElement.textContent = maxAttempts;
        categoryBadge.textContent = currentCategory;
        hintElement.textContent = "";

        // Create keyboard
        createKeyboard();

        // Enable hint button
        hintBtn.disabled = false;
    }

    // Function to create the keyboard
    function createKeyboard() {
        keyboard.innerHTML = "";
        for (let i = 0; i < 26; i++) {
            const letter = String.fromCharCode(97 + i); // a-z

            const button = document.createElement('button');
            button.textContent = letter;
            button.className = 'key';
            button.id = `key-${letter}`;

            button.addEventListener('click', () => {
                if (gameActive && !guessedLetters.includes(letter)) {
                    guessLetter(letter);
                }
            });

            keyboard.appendChild(button);
        }
    }

    // Function to handle letter guesses
    function guessLetter(letter) {
        if (!gameActive || guessedLetters.includes(letter)) {
            return;
        }

        guessedLetters.push(letter);
        const keyElement = document.getElementById(`key-${letter}`);

        if (currentWord.includes(letter)) {
            // Correct guess
            correctLetters.push(letter);
            keyElement.classList.add('correct');

            // Check for win
            const allLettersGuessed = currentWord.split('').every(char =>
                correctLetters.includes(char) || char === ' '
            );

            if (allLettersGuessed) {
                handleWin();
            }
        } else {
            // Incorrect guess
            wrongAttempts++;
            keyElement.classList.add('incorrect');
            attemptsLeftElement.textContent = maxAttempts - wrongAttempts;

            // Update hangman display
            updateHangman();

            // Check for game over
            if (wrongAttempts >= maxAttempts) {
                handleLoss();
            }
        }

        // Update the word display with guessed letters
        updateWordDisplay();
    }

    // Function to update the word display
    function updateWordDisplay() {
        wordDisplay.innerHTML = "";

        for (const char of currentWord) {
            const letterBox = document.createElement('div');
            letterBox.className = 'letter-box';

            if (correctLetters.includes(char) || char === ' ') {
                letterBox.textContent = char;
                letterBox.classList.add('revealed');
            } else {
                letterBox.textContent = '';
            }

            wordDisplay.appendChild(letterBox);
        }
    }

    // Function to update hangman figure
    function updateHangman() {
        // Always show the gallows
        hangmanParts[0].style.opacity = "1"; // base
        hangmanParts[1].style.opacity = "1"; // pole
        hangmanParts[2].style.opacity = "1"; // support
        hangmanParts[3].style.opacity = "1"; // top

        // Show body parts based on wrong attempts
        for (let i = 0; i < wrongAttempts; i++) {
            if (i + 4 < hangmanParts.length) {
                hangmanParts[i + 4].style.opacity = "1";
            }
        }
    }

    // Function to show hint
    function showHint() {
        if (!hintUsed && gameActive) {
            hintElement.textContent = `Hint: ${currentHint}`;
            hintUsed = true;
            hintBtn.disabled = true;
        }
    }

    // Function to update message
    function updateMessage(text, type = '') {
        message.textContent = text;
        message.className = 'message';

        if (type) {
            message.classList.add(type);
        }
    }

    // Function to handle win
    function handleWin() {
        gameActive = false;
        gamesWon++;
        gamesWonElement.textContent = gamesWon;
        updateMessage("🎉 Congratulations! You've guessed the word!", 'win');
        disableKeyboard();
    }

    // Function to handle loss
    function handleLoss() {
        gameActive = false;
        gamesLost++;
        gamesLostElement.textContent = gamesLost;

        // Reveal the word
        revealWord();

        updateMessage(`💀 Game Over! The word was: ${currentWord}`, 'lose');
        disableKeyboard();
    }

    // Function to reveal the word after loss
    function revealWord() {
        wordDisplay.innerHTML = "";

        for (const char of currentWord) {
            const letterBox = document.createElement('div');
            letterBox.className = 'letter-box revealed';
            letterBox.textContent = char;

            if (!correctLetters.includes(char) && char !== ' ') {
                letterBox.style.color = 'var(--danger)';
            }

            wordDisplay.appendChild(letterBox);
        }
    }

    // Function to disable keyboard after game ends
    function disableKeyboard() {
        const keys = document.querySelectorAll('.key');
        keys.forEach(key => {
            if (!key.classList.contains('correct') && !key.classList.contains('incorrect')) {
                key.disabled = true;
            }
        });
    }

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