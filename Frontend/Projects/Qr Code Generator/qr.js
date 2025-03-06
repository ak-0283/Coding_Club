function generateQR() {
    let qrText = document.getElementById("text").value;
    let qrContainer = document.getElementById("qrcode");
    qrContainer.innerHTML = "";

    if (qrText.trim() !== "") {
        new QRCode(qrContainer, {
            text: qrText,
            width: 200,
            height: 200
        });
    } else {
        alert("Please enter valid text or URL");
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