
document.addEventListener('DOMContentLoaded', function () {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    document.getElementById('dob').setAttribute('max', dateString);

    // Calculate age on button click
    document.getElementById('calculate-btn').addEventListener('click', calculateAge);

    // Also calculate on Enter key when date field is focused
    document.getElementById('dob').addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            calculateAge();
        }
    });

    function calculateAge() {
        const dobInput = document.getElementById('dob');
        const resultCard = document.getElementById('result-card');
        const resultMessage = document.getElementById('result-message');
        const ageYearsEl = document.getElementById('age-years');
        const monthsEl = document.getElementById('months');
        const daysEl = document.getElementById('days');

        // Validate input
        if (!dobInput.value) {
            resultMessage.textContent = "Please select your date of birth";
            resultCard.classList.add('show');
            return;
        }

        // Get dates
        const birthDate = new Date(dobInput.value);
        const today = new Date();

        // Check for future date
        if (birthDate > today) {
            resultMessage.textContent = "Date of birth cannot be in the future";
            resultCard.classList.add('show');
            return;
        }

        // Calculate years
        let ageYears = today.getFullYear() - birthDate.getFullYear();

        // Calculate months and days for exact age
        let ageMonths = today.getMonth() - birthDate.getMonth();
        let ageDays = today.getDate() - birthDate.getDate();

        // Adjust if needed
        if (ageDays < 0) {
            // Borrow from months
            ageMonths--;
            // Get days in previous month
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            ageDays += lastMonth.getDate();
        }

        if (ageMonths < 0) {
            // Borrow from years
            ageYears--;
            ageMonths += 12;
        }

        // Display the results
        resultMessage.textContent = "Your age is";
        ageYearsEl.textContent = `${ageYears} years`;
        monthsEl.textContent = ageMonths;
        daysEl.textContent = ageDays;

        // Show the result card with animation
        resultCard.classList.add('show');

        // Calculate total days alive for fun fact
        const millisecondsAlive = today - birthDate;
        const daysAlive = Math.floor(millisecondsAlive / (1000 * 60 * 60 * 24));

        // Add a small delay before showing the fun fact
        setTimeout(() => {
            const funFactEl = document.createElement('p');
            funFactEl.textContent = `You've been alive for approximately ${daysAlive.toLocaleString()} days!`;
            funFactEl.style.marginTop = '20px';
            funFactEl.style.fontSize = '14px';
            funFactEl.style.color = '#6c757d';

            // Remove previous fun fact if exists
            const existingFunFact = document.querySelector('.fun-fact');
            if (existingFunFact) {
                existingFunFact.remove();
            }

            funFactEl.classList.add('fun-fact');
            resultCard.appendChild(funFactEl);
        }, 800);
    }
});

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
