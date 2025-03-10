
document.addEventListener('DOMContentLoaded', function () {
    // Enhanced quotes collection with categories
    const quotesCollection = [
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "motivation" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "success" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "motivation" },
        { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", category: "life" },
        { text: "Act as if what you do makes a difference. It does.", author: "William James", category: "motivation" },
        { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs", category: "life" },
        { text: "Happiness depends upon ourselves.", author: "Aristotle", category: "wisdom" },
        { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", category: "success" },
        { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein", category: "wisdom" },
        { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "success" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "motivation" },
        { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "life" },
        { text: "The best way to predict the future is to create it.", author: "Peter Drucker", category: "success" },
        { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu", category: "wisdom" },
        { text: "What you seek is seeking you.", author: "Rumi", category: "wisdom" }
    ];

    // DOM elements
    const quoteElement = document.getElementById('quote');
    const authorElement = document.getElementById('author');
    const newQuoteBtn = document.getElementById('new-quote-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const copyBtn = document.getElementById('copy-btn');
    const tweetBtn = document.getElementById('tweet-btn');
    const categoryTags = document.getElementById('categories');
    const quoteCountElement = document.getElementById('quote-count');

    // State variables
    let currentQuotes = [...quotesCollection];
    let quoteHistory = [];
    let currentQuoteIndex = -1;
    let activeCategory = 'all';

    // Initialize
    updateQuoteCount();
    generateQuote();

    // Event listeners
    newQuoteBtn.addEventListener('click', generateQuote);
    prevBtn.addEventListener('click', showPreviousQuote);
    nextBtn.addEventListener('click', showNextQuote);
    copyBtn.addEventListener('click', copyQuote);
    tweetBtn.addEventListener('click', tweetQuote);

    // Category filters
    categoryTags.addEventListener('click', function (e) {
        if (e.target.classList.contains('category-tag')) {
            // Update active category
            document.querySelectorAll('.category-tag').forEach(tag => {
                tag.classList.remove('active');
            });
            e.target.classList.add('active');

            // Filter quotes
            activeCategory = e.target.dataset.category;
            filterQuotesByCategory();

            // Reset history and generate new quote
            quoteHistory = [];
            currentQuoteIndex = -1;
            generateQuote();
        }
    });

    // Functions
    function filterQuotesByCategory() {
        if (activeCategory === 'all') {
            currentQuotes = [...quotesCollection];
        } else {
            currentQuotes = quotesCollection.filter(quote => quote.category === activeCategory);
        }
        updateQuoteCount();
    }

    function updateQuoteCount() {
        quoteCountElement.textContent = currentQuotes.length > 0 ?
            `${currentQuoteIndex + 1 > 0 ? currentQuoteIndex + 1 : 0} of ${currentQuotes.length}` :
            'No quotes found';

        // Update navigation button states
        prevBtn.disabled = currentQuoteIndex <= 0;
        prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
        nextBtn.disabled = currentQuoteIndex >= quoteHistory.length - 1;
        nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
    }

    function generateQuote() {
        if (currentQuotes.length === 0) {
            quoteElement.textContent = "No quotes found for this category.";
            authorElement.textContent = "";
            return;
        }

        // Fade out
        fadeElements(true);

        setTimeout(() => {
            // Get random quote
            let randomIndex = Math.floor(Math.random() * currentQuotes.length);
            let randomQuote = currentQuotes[randomIndex];

            // Update text
            quoteElement.textContent = `"${randomQuote.text}"`;
            authorElement.textContent = `— ${randomQuote.author}`;

            // Add to history
            quoteHistory = quoteHistory.slice(0, currentQuoteIndex + 1);
            quoteHistory.push(randomIndex);
            currentQuoteIndex = quoteHistory.length - 1;

            // Update count
            updateQuoteCount();

            // Fade in
            fadeElements(false);
        }, 300);
    }

    function showPreviousQuote() {
        if (currentQuoteIndex > 0) {
            fadeElements(true);

            setTimeout(() => {
                currentQuoteIndex--;
                const quoteIndex = quoteHistory[currentQuoteIndex];
                const previousQuote = currentQuotes[quoteIndex];

                quoteElement.textContent = `"${previousQuote.text}"`;
                authorElement.textContent = `— ${previousQuote.author}`;

                updateQuoteCount();
                fadeElements(false);
            }, 300);
        }
    }

    function showNextQuote() {
        if (currentQuoteIndex < quoteHistory.length - 1) {
            fadeElements(true);

            setTimeout(() => {
                currentQuoteIndex++;
                const quoteIndex = quoteHistory[currentQuoteIndex];
                const nextQuote = currentQuotes[quoteIndex];

                quoteElement.textContent = `"${nextQuote.text}"`;
                authorElement.textContent = `— ${nextQuote.author}`;

                updateQuoteCount();
                fadeElements(false);
            }, 300);
        }
    }

    function copyQuote() {
        if (quoteElement.textContent) {
            const quoteText = quoteElement.textContent;
            const authorText = authorElement.textContent;
            const fullQuote = `${quoteText} ${authorText}`;

            navigator.clipboard.writeText(fullQuote).then(() => {
                // Show feedback
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 1500);
            });
        }
    }

    function tweetQuote() {
        if (quoteElement.textContent) {
            const quoteText = quoteElement.textContent.replace(/"/g, '');
            const authorText = authorElement.textContent;
            const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quoteText + ' ' + authorText)}`;
            window.open(tweetUrl, '_blank');
        }
    }

    function fadeElements(fadeOut) {
        if (fadeOut) {
            quoteElement.classList.add('fading');
            authorElement.classList.add('fading');
        } else {
            quoteElement.classList.remove('fading');
            authorElement.classList.remove('fading');
        }
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
