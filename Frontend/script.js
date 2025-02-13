//script.js
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const toggleTheme = document.getElementById("toggleTheme");
  const scrollBtn = document.getElementById("scrollToTop");

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

  // Theme Toggle
  if (toggleTheme) {
    toggleTheme.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        // Check if dark mode is enabled
        const isDarkMode = document.body.classList.contains("dark-mode");

        // Change toggle button icon
        toggleTheme.textContent = isDarkMode ? "☀️" : "🌙";

        // Save theme preference
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");

        // Change logo instantly
        updateLogo(isDarkMode);
    });

    // Function to update the logo (INSTANT CHANGE, NO FADE)
    function updateLogo(isDarkMode) {
        let logo = document.getElementById("logo");
        if (logo) {
            logo.src = isDarkMode ? "codingclub2.png" : "codingclub.png";
        }
    }

    // Load theme preference on page load
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        toggleTheme.textContent = "☀️";
        updateLogo(true); // Set logo to dark mode on load
    } else {
        updateLogo(false); // Set logo to light mode on load
    }
}


// scroll button
        const scrollBtn = document.getElementById("scrollToTop");
        
        window.onscroll = function() {
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                scrollBtn.style.display = "flex";
            } else {
                scrollBtn.style.display = "none";
            }
        };
        
        scrollBtn.addEventListener("click", function() {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

// footer



// Share functionality
const currentURL = encodeURIComponent(window.location.href);

document.getElementById('facebookShare').href = `https://www.facebook.com/sharer/sharer.php?u=${currentURL}`;
document.getElementById('twitterShare').href = `https://twitter.com/intent/tweet?url=${currentURL}&text=Check%20this%20out!`;
document.getElementById('linkedinShare').href = `https://www.linkedin.com/sharing/share-offsite/?url=${currentURL}`;
document.getElementById('whatsappShare').href = `https://api.whatsapp.com/send?text=Check%20this%20out:%20${currentURL}`;

document.addEventListener("DOMContentLoaded", function () {
  const messageInput = document.getElementById("message");
  const charCount = document.getElementById("charCount");
  const maxLength = messageInput.getAttribute("maxlength");

  messageInput.addEventListener("input", function () {
      let currentLength = messageInput.value.length;
      charCount.textContent = `${currentLength} / ${maxLength}`;

      // *Change color if limit is close*
      if (currentLength > maxLength * 0.9) {
          charCount.style.color = "red";  // Alert user when near limit
      } else {
          charCount.style.color = "#555"; // Normal state
      }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const greetingContainer = document.getElementById("greeting");

  function getGreeting() {
      let hours = new Date().getHours();
      let greetingText = "";

      if (hours >= 5 && hours < 12) {
          greetingText = "Good Morning!";
      } else if (hours >= 12 && hours < 17) {
          greetingText = "Good Afternoon!";
      } else if (hours >= 17 && hours < 21) {
          greetingText = "Good Evening!";
      } else {
          greetingText = "Good Night!";
      }

      alert(greetingText);
  }

  getGreeting();
});

