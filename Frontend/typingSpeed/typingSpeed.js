let startTime,
  interval,
  personalBest = localStorage.getItem("personalBest") || null;
const textElement = document.getElementById("text");
const inputElement = document.getElementById("input");
const timeElement = document.getElementById("time");
const speedElement = document.getElementById("speed");
const accuracyElement = document.getElementById("accuracy");
const personalBestElement = document.getElementById("personalBest");
if (personalBest) personalBestElement.textContent = personalBest;

inputElement.addEventListener("input", () => {
  if (!startTime) {
    startTime = new Date().getTime();
    interval = setInterval(updateTime, 1000);
  }
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
  speedElement.textContent = Math.floor(wordsTyped / elapsedTime) || 0;
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
  if (inputElement.value.trim() === textElement.textContent) {
    clearInterval(interval);
    const elapsedTime = (new Date().getTime() - startTime) / 1000;

    if (!personalBest || elapsedTime < personalBest) {
      personalBest = elapsedTime;
      localStorage.setItem("personalBest", personalBest);
      personalBestElement.textContent = personalBest.toFixed(2);
    }
  }
}

function resetTest() {
  clearInterval(interval);
  startTime = null;
  inputElement.value = "";
  timeElement.textContent = "0";
  speedElement.textContent = "0";
  accuracyElement.textContent = "0";
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.setItem("darkMode", "disabled");
  }
}

window.onload = function () {
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }
};
