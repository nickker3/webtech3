// timer.js: Beheert timers voor kaarten en spel

function startCardTimer(duration, callback) {
    setTimeout(() => {
        callback();
    }, duration * 1000);
}

// Voorbeeld gebruik:
startCardTimer(5, () => {
    console.log("De kaarten worden gesloten.");
});
