const languages = [
    { name: "C++", emoji: "🔷" },
    { name: "C", emoji: "🔵" },
    { name: "JS", emoji: "🟨" },
    { name: "Python", emoji: "🐍" },
    { name: "Java", emoji: "☕" },
    { name: "Go", emoji: "🐹" },
    { name: "Ruby", emoji: "💎" },
    { name: "PHP", emoji: "🐘" }
];


let languageCards = [...languages, ...languages];
let shuffledCards = [];
let selectedCards = [];
let matchedCards = [];

const gameBoard = document.getElementById("gameBoard");
const restartButton = document.getElementById("restartButton");
const winMessage = document.getElementById("winMessage");


function initGame() {

    gameBoard.innerHTML = "";
    winMessage.textContent = "";
    selectedCards = [];
    matchedCards = [];

    shuffledCards = languageCards.sort(() => 0.5 - Math.random());


    shuffledCards.forEach((language, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.index = index;
        card.addEventListener("click", () => flipCard(card, language));
        gameBoard.appendChild(card);
    });
}


function flipCard(card, language) {
    if (
        selectedCards.length < 2 &&
        !card.classList.contains("flipped") &&
        !matchedCards.includes(card)
    ) {
        card.textContent = language.emoji + " " + language.name;
        card.classList.add("flipped");
        selectedCards.push({ card, language });

        if (selectedCards.length === 2) {
            setTimeout(checkMatch, 500);
        }
    }
}


function checkMatch() {
    const [first, second] = selectedCards;
    if (first.language.name === second.language.name) {
        matchedCards.push(first.card, second.card);

        if (matchedCards.length === shuffledCards.length) {
            winMessage.textContent = "Congratulations! You've won!";
        }
    } else {
        first.card.textContent = "";
        first.card.classList.remove("flipped");
        second.card.textContent = "";
        second.card.classList.remove("flipped");
    }
    selectedCards = [];
}


restartButton.addEventListener("click", initGame);


initGame();

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