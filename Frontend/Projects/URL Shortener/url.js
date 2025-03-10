function shortenUrl() {
    let longUrl = document.getElementById("longUrl").value;
    if (!longUrl) {
        alert("Please enter a valid URL");
        return;
    }

    // Add http:// prefix if missing
    if (!longUrl.startsWith('http://') && !longUrl.startsWith('https://')) {
        longUrl = 'https://' + longUrl;
    }

    let shortCode = Math.random().toString(36).substring(2, 8);
    let shortUrl = `https://short.ly/${shortCode}`;
    document.getElementById("shortUrl").innerHTML = `Shortened URL: <a href="${longUrl}" target="_blank">${shortUrl}</a>`;
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

