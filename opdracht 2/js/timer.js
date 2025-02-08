let timer;
let secondsElapsed = 0;

function startTimer() {
    clearInterval(timer); // Zorgt ervoor dat er geen dubbele timers lopen
    secondsElapsed = 0;
    updateTimerDisplay();

    timer = setInterval(() => {
        secondsElapsed++;
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    let minutes = Math.floor(secondsElapsed / 60);
    let seconds = secondsElapsed % 60;
    document.getElementById("elapsed-time").textContent =
        (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

function stopTimer() {
    clearInterval(timer);
}
