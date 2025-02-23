let timer;
        let isRunning = false;
        let startTime, elapsedTime = 0;

        function startStopwatch() {
            if (!isRunning) {
                startTime = Date.now() - elapsedTime;
                timer = setInterval(updateTime, 10);
                isRunning = true;
            }
        }

        function stopStopwatch() {
            clearInterval(timer);
            isRunning = false;
        }

        function resetStopwatch() {
            clearInterval(timer);
            isRunning = false;
            elapsedTime = 0;
            document.getElementById("display").innerText = "00:00:00";
        }

        function updateTime() {
            elapsedTime = Date.now() - startTime;
            let milliseconds = Math.floor((elapsedTime % 1000) / 10);
            let seconds = Math.floor((elapsedTime / 1000) % 60);
            let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);

            document.getElementById("display").innerText = 
                `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
        }