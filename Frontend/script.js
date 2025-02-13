document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const toggleTheme = document.querySelector(".toggle-btn"); // Fix class selector
  const scrollBtn = document.getElementById("scrollToTop");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const closeMenu = document.getElementById("closeMenu");
  const menuToggleButton = document.querySelector(".menu-toggle-btn"); // NEW: Select button inside the menu

  if (form) {
      form.addEventListener("submit", function (event) {
          event.preventDefault();
          alert("Thank you for contacting us!");
          form.reset();
      });
  }

  // Scroll button visibility
  if (scrollBtn) {
      window.addEventListener("scroll", function () {
          if (window.scrollY > 200) {
              scrollBtn.style.display = "flex";
          } else {
              scrollBtn.style.display = "none";
          }
      });

      scrollBtn.addEventListener("click", function () {
          window.scrollTo({ top: 0, behavior: "smooth" });
      });
  }

  // Theme Toggle (outside menu)
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

  // Ensure menu is hidden on load using CSS (not JS)
  navLinks.style.transform = "translateX(100%)";
  navLinks.style.position = "fixed"; // Prevents layout shifts

  // Open menu when clicking the hamburger button
  hamburger.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevents immediate closing
      navLinks.style.transform = "translateX(0)"; // Slide in
  });

  // Close menu when clicking the cross button
  closeMenu.addEventListener("click", function () {
      navLinks.style.transform = "translateX(100%)"; // Slide out
  });

  // Close menu when clicking anywhere outside the menu
  document.addEventListener("click", function (event) {
      if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
          navLinks.style.transform = "translateX(100%)"; // Hide menu
      }
  });

  // Prevent clicks inside the menu from closing it
  navLinks.addEventListener("click", function (event) {
      event.stopPropagation();
  });

  // Stop closing menu when clicking the toggle button inside
  if (menuToggleButton) {
      menuToggleButton.addEventListener("click", function (event) {
          event.stopPropagation(); // Prevents menu from closing
          document.body.classList.toggle("dark-mode");

          // Save theme preference
          const isDarkMode = document.body.classList.contains("dark-mode");
          menuToggleButton.textContent = isDarkMode ? "☀️" : "🌙";
          localStorage.setItem("theme", isDarkMode ? "dark" : "light");
      });

      // Load theme preference inside the menu on page load
      if (localStorage.getItem("theme") === "dark") {
          document.body.classList.add("dark-mode");
          menuToggleButton.textContent = "☀️";
      }
  }
});
