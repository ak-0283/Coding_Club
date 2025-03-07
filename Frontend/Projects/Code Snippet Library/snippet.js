function addSnippet() {
    let code = document.getElementById("codeInput").value;
    if (code.trim() === "") {
        alert("Please enter a valid snippet");
        return;
    }
    
    let snippetDiv = document.createElement("div");
    snippetDiv.classList.add("snippet");
    
    let pre = document.createElement("pre");
    pre.textContent = code;
    
    let button = document.createElement("button");
    button.classList.add("copy-btn");
    button.textContent = "Copy";
    button.onclick = function () {
        navigator.clipboard.writeText(code);
        alert("Copied to clipboard!");
    };
    
    snippetDiv.appendChild(pre);
    snippetDiv.appendChild(button);
    document.getElementById("snippetContainer").appendChild(snippetDiv);
    document.getElementById("codeInput").value = "";
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