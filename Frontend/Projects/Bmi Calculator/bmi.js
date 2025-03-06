function calculateBMI() {
  let weight = document.getElementById("weight").value;
  let height = document.getElementById("height").value;
  if (weight > 0 && height > 0) {
    let bmi = (weight / (height * height)).toFixed(2);
    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 24.9) category = "Normal weight";
    else if (bmi < 29.9) category = "Overweight";
    else category = "Obese";
    document.getElementById("result").innerHTML = `Your BMI: ${bmi} (${category})`;
  } else {
    alert("Please enter valid values for weight and height.");
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