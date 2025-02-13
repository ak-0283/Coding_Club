    function getGreeting() {
            const hours = new Date().getHours();
            let greeting;

            if (hours >= 5 && hours < 12) {
                greeting = "Good Morning! 🌅\nWelcome to Coding Club";
            } else if (hours >= 12 && hours < 18) {
                greeting = "Good Afternoon! ☀️\nWelcome to Coding Club";
            } else {
                greeting = "Good Night! 🌙\nWelcome to Coding Club";
            }

            document.getElementById("greeting").innerHTML = greeting.replace(/\n/g, "<br>"); // Preserve line breaks
        }

        function closeCard() {
            document.getElementById("overlay").style.display = "none";
        }

        getGreeting();