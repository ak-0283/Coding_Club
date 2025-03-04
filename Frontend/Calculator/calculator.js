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
