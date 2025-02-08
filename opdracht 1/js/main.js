document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const gameMessage = document.getElementById("game-message");
    const pairsFoundElement = document.getElementById("pairs-found");
    const boardSizeDropdown = document.getElementById("board-size");
    let boardSize = 6; // Standaard 6x6
    let totalCards, letters, gameBoard;
    let firstCard = null;
    let secondCard = null;
    let isProcessing = false;
    let startTime = null;
    let timerInterval;

    // Start spel knop
    document.getElementById("start-game").addEventListener("click", startGame);

    // Start een nieuw spel
    function startGame() {
        // Haal gekozen bordgrootte op uit de dropdown
        const selectedSize = boardSizeDropdown.value;
        boardSize = parseInt(selectedSize.split("x")[0]); // Extract het getal, bijvoorbeeld '6' uit '6x6'

        totalCards = boardSize * boardSize;
        letters = generateRandomLetters(totalCards / 2); // Genereer paren

        resetGame();
        gameBoard = createGameBoard(letters);
        renderBoard(gameBoard);
        gameMessage.textContent = "Het spel is gestart! Vind de paren.";
    }

    // Reset spelstatus
    function resetGame() {
        grid.innerHTML = "";
        gameBoard = [];
        firstCard = null;
        secondCard = null;
        isProcessing = false;
        startTime = null;
        pairsFoundElement.textContent = "0";
        clearInterval(timerInterval);
        updateTimer(true); // Reset timer
    }

    // Genereer willekeurige letters
    function generateRandomLetters(count) {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const selected = [];
        while (selected.length < count) {
            const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
            if (!selected.includes(randomLetter)) selected.push(randomLetter);
        }
        return [...selected, ...selected].sort(() => Math.random() - 0.5); // Dubbele letters en shuffle
    }

    // Maak speelbord
    function createGameBoard(letters) {
        return letters.map((letter, index) => ({
            id: index,
            letter,
            status: "closed", // Mogelijke statussen: closed, open, found
        }));
    }

    // Render speelbord
    function renderBoard(board) {
        console.log("Render speelbord:", board.map(card => `${card.letter}:${card.status}`));
        grid.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`; // Dynamische grid kolommen
        grid.innerHTML = board
            .map(
                (card) => `
            <div 
                class="card ${card.status}" 
                data-id="${card.id}" 
                aria-label="${card.status === "closed" ? "Gesloten kaart" : card.letter}">
                ${card.status === "open" || card.status === "found" ? card.letter : ""}
            </div>`
            )
            .join("");

        // Voeg event listeners toe aan kaarten
        document.querySelectorAll(".card").forEach(card => {
            card.addEventListener("click", (e) => handleCardClick(e.target));
        });
    }

    // Handle kaart klik
    function handleCardClick(cardElement) {
        const cardId = parseInt(cardElement.getAttribute("data-id"));
        const card = gameBoard[cardId];

        // Blokkeer klikken tijdens verwerking
        if (isProcessing) return;

        // Klik op reeds geopende kaart negeren
        if (card.status !== "closed") return;

        // Open de kaart
        card.status = "open";
        renderBoard(gameBoard);

        if (!firstCard) {
            firstCard = card;
        } else if (!secondCard) {
            secondCard = card;
            checkMatch(); // Controleer match
        }
    }

    // Controleer of de twee kaarten een match zijn
    function checkMatch() {
        if (firstCard.letter === secondCard.letter) {
            // Match gevonden
            firstCard.status = "found";
            secondCard.status = "found";
            firstCard = null;
            secondCard = null;
            pairsFoundElement.textContent = parseInt(pairsFoundElement.textContent) + 1;
            renderBoard(gameBoard);
            checkGameOver();
        } else {
            // Geen match
            isProcessing = true;
            setTimeout(() => {
                firstCard.status = "closed";
                secondCard.status = "closed";
                firstCard = null;
                secondCard = null;
                renderBoard(gameBoard);
                isProcessing = false;
            }, 1000);
        }
    }

    // Controleer of het spel voorbij is
    function checkGameOver() {
        const foundCards = gameBoard.filter((card) => card.status === "found").length;
        if (foundCards === totalCards) {
            clearInterval(timerInterval);
            const totalTime = Math.floor((Date.now() - startTime) / 1000);
            gameMessage.textContent = `Gefeliciteerd! Je hebt het spel voltooid in ${totalTime} seconden.`;
        }
    }

    // Timer updaten
    function updateTimer(reset = false) {
        const timerElement = document.getElementById("elapsed-time");
        if (reset) {
            timerElement.textContent = "00:00";
            return;
        }
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, "0");
        const seconds = String(elapsedTime % 60).padStart(2, "0");
        timerElement.textContent = `${minutes}:${seconds}`;
    }
});
