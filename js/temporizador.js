"use strict";

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    var timerInterval = setInterval(function() {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(timerInterval);
            display.textContent = "00:00";
            endGame();
        }
    }, 1000);
}
