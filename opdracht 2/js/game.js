// game.js: Beheert de spel-logica, zoals het controleren van paren

function checkPair(card1, card2) {
    if (card1.dataset.value === card2.dataset.value) {
        card1.classList.add("found");
        card2.classList.add("found");
        return true;
    }
    return false;
}

// Voeg meer logica toe om kaarten om te draaien en het spel te controleren
