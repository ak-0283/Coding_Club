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
  