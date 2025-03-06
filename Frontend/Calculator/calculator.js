function appendValue(value) {
  document.getElementById("display").value += value;
}
function clearDisplay() {
  document.getElementById("display").value = "";
}
function calculateResult() {
  try {
    let expression = document.getElementById("display").value;
    let result = eval(expression);
    document.getElementById("display").value = result;
    addToHistory(expression + " = " + result);
  } catch {
    document.getElementById("display").value = "Error";
  }
}
function addToHistory(entry) {
  let historyList = document.getElementById("history-list");
  let newEntry = document.createElement("p");
  newEntry.textContent = entry;
  historyList.prepend(newEntry);
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

document.addEventListener("keydown", function (event) {
  const key = event.key;
  if (!isNaN(key) || ["+", "-", "*", "/", "."].includes(key)) {
    appendValue(key);
  } else if (key === "Enter") {
    calculateResult();
  } else if (key === "Backspace") {
    let display = document.getElementById("display");
    display.value = display.value.slice(0, -1);
  }
});
