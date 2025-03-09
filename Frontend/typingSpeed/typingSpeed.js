let startTime,
        interval,
        personalBest = localStorage.getItem("personalBest") || null;
      
      const textElement = document.getElementById("text");
      const inputElement = document.getElementById("input");
      const timeElement = document.getElementById("time");
      const speedElement = document.getElementById("speed");
      const accuracyElement = document.getElementById("accuracy");
      const personalBestElement = document.getElementById("personalBest");
      const successOverlay = document.getElementById("successOverlay");
      const finalTimeElement = document.getElementById("finalTime");
      const finalSpeedElement = document.getElementById("finalSpeed");
      const finalAccuracyElement = document.getElementById("finalAccuracy");
      
      if (personalBest) personalBestElement.textContent = parseFloat(personalBest).toFixed(2);
      
      // Character highlighting for text
      function updateTextHighlighting() {
        const originalText = textElement.textContent;
        const typedText = inputElement.value;
        let highlightedText = '';
        
        for (let i = 0; i < originalText.length; i++) {
          if (i < typedText.length) {
            if (typedText[i] === originalText[i]) {
              highlightedText += `<span class="correct">${originalText[i]}</span>`;
            } else {
              highlightedText += `<span class="incorrect">${originalText[i]}</span>`;
            }
          } else {
            highlightedText += originalText[i];
          }
        }
        
        textElement.innerHTML = highlightedText;
      }
      
      inputElement.addEventListener("input", () => {
        if (!startTime) {
          startTime = new Date().getTime();
          interval = setInterval(updateTime, 1000);
          inputElement.classList.add('active');
        }
        
        updateTextHighlighting();
        checkTypingSpeed();
        checkAccuracy();
        checkCompletion();
      });
      
      function updateTime() {
        const elapsedTime = (new Date().getTime() - startTime) / 1000;
        timeElement.textContent = Math.floor(elapsedTime);
      }
      
      function checkTypingSpeed() {
        const wordsTyped = inputElement.value.trim().split(/\s+/).length;
        const elapsedTime = (new Date().getTime() - startTime) / 1000 / 60;
        const speed = Math.floor(wordsTyped / elapsedTime) || 0;
        speedElement.textContent = speed;
      }
      
      function checkAccuracy() {
        const originalText = textElement.textContent.split("");
        const typedText = inputElement.value.split("");
        let correctCount = 0;
      
        for (let i = 0; i < typedText.length; i++) {
          if (typedText[i] === originalText[i]) {
            correctCount++;
          }
        }
      
        const accuracy =
          typedText.length > 0 ? (correctCount / typedText.length) * 100 : 0;
        accuracyElement.textContent = accuracy.toFixed(2);
      }
      
      function checkCompletion() {
        if (inputElement.value.trim() === textElement.textContent.trim()) {
          clearInterval(interval);
          const elapsedTime = (new Date().getTime() - startTime) / 1000;
          
          // Show success animation
          finalTimeElement.textContent = elapsedTime.toFixed(2);
          finalSpeedElement.textContent = speedElement.textContent;
          finalAccuracyElement.textContent = accuracyElement.textContent;
          showSuccessMessage();
          createConfetti();
      
          if (!personalBest || elapsedTime < personalBest) {
            personalBest = elapsedTime;
            localStorage.setItem("personalBest", personalBest);
            personalBestElement.textContent = personalBest.toFixed(2);
            personalBestElement.parentElement.classList.add('pulse');
            setTimeout(() => {
              personalBestElement.parentElement.classList.remove('pulse');
            }, 3000);
          }
        }
      }
      
      function showSuccessMessage() {
        successOverlay.classList.add('show');
      }
      
      function closeSuccess() {
        successOverlay.classList.remove('show');
        resetTest();
      }
      
      function createConfetti() {
        const colors = ['#ff7e5f', '#feb47b', '#4776E6', '#8E54E9', '#44d9e6'];
        
        for (let i = 0; i < 100; i++) {
          const confetti = document.createElement('div');
          confetti.classList.add('confetti');
          confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
          confetti.style.left = Math.random() * 100 + 'vw';
          confetti.style.top = -10 + 'px';
          confetti.style.width = Math.random() * 10 + 5 + 'px';
          confetti.style.height = confetti.style.width;
          
          document.body.appendChild(confetti);
          
          const animation = confetti.animate(
            [
              { transform: 'translate(0, 0)', opacity: 1 },
              { transform: `translate(${Math.random() * 100 - 50}px, ${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ],
            {
              duration: Math.random() * 3000 + 2000,
              easing: 'cubic-bezier(.215,.61,.355,1)'
            }
          );
          
          animation.onfinish = () => {
            confetti.remove();
          };
        }
      }
      
      function resetTest() {
        clearInterval(interval);
        startTime = null;
        inputElement.value = "";
        timeElement.textContent = "0";
        speedElement.textContent = "0";
        accuracyElement.textContent = "0";
        textElement.innerHTML = "The quick brown fox jumps over the lazy dog.";
        inputElement.classList.remove('active');
        
        // Add reset animation
        inputElement.classList.add('reset');
        setTimeout(() => {
          inputElement.classList.remove('reset');
        }, 500);
      }
      
      function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
        
        const toggleButton = document.querySelector('.toggle-dark-mode');
        if (document.body.classList.contains("dark-mode")) {
          localStorage.setItem("darkMode", "enabled");
          toggleButton.innerHTML = '<span class="moon-icon">☀️</span> Light Mode';
        } else {
          localStorage.setItem("darkMode", "disabled");
          toggleButton.innerHTML = '<span class="moon-icon">🌙</span> Dark Mode';
        }
      }
      
      window.onload = function () {
        if (localStorage.getItem("darkMode") === "enabled") {
          document.body.classList.add("dark-mode");
          const toggleButton = document.querySelector('.toggle-dark-mode');
          toggleButton.innerHTML = '<span class="moon-icon">☀️</span> Light Mode';
        }
        
        // Add initial animation for text
        setTimeout(() => {
          textElement.innerHTML = `<div class="animated-text">${textElement.textContent}</div>`;
          setTimeout(() => {
            textElement.innerHTML = textElement.textContent;
          }, 3000);
        }, 500);
      };