document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const gameMessage = document.getElementById("game-message");
    const pairsFoundElement = document.getElementById("pairs-found");
    const boardSizeDropdown = document.getElementById("board-size");
    let boardSize = 6; // Standaard 6x6
    let totalCards, gameBoard;
    let firstCard = null;
    let secondCard = null;
    let isProcessing = false;
    let startTime = null;
    let timerInterval;

    document.getElementById("start-game").addEventListener("click", startGame);

    async function startGame() {
        const selectedSize = boardSizeDropdown.value;
        boardSize = parseInt(selectedSize.split("x")[0]);

        totalCards = boardSize * boardSize;

        resetGame();
        await generateCards(); // Wacht tot de kaarten en afbeeldingen zijn gegenereerd
        startTimer();
        gameMessage.textContent = "Het spel is gestart! Vind de paren.";
    }

    async function fetchDogImages(count) {
        let urls = [];
        while (urls.length < count) {
            let response = await fetch("https://dog.ceo/api/breeds/image/random");
            let data = await response.json();
            if (!urls.includes(data.message)) {
                urls.push(data.message); // Unieke afbeeldingen
            }
        }
        return urls;
    }

    async function generateCards() {
        let imageUrls = await fetchDogImages(totalCards / 2);
        let cardImages = [...imageUrls, ...imageUrls];
        shuffle(cardImages);

        gameBoard = cardImages.map((imageUrl, index) => ({
            id: index,
            image: imageUrl,
            status: "closed",
        }));

        renderBoard();
    }

    function renderBoard() {
        grid.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
        grid.innerHTML = gameBoard
            .map(
                (card) => `
                <div class="card ${card.status}" data-id="${card.id}">
                    ${card.status === "open" || card.status === "found" ?
                    `<img src="${card.image}" class="card-img">` : ""}
                </div>`
            )
            .join("");

        document.querySelectorAll(".card").forEach(card => {
            card.addEventListener("click", (e) => handleCardClick(e.target));
        });
    }

    document.getElementById("card-color").addEventListener("input", function () {
        const selectedColor = this.value;
        document.querySelectorAll(".card.closed").forEach(card => {
            card.style.backgroundColor = selectedColor;
        });
    });

    function handleCardClick(cardElement) {
        const cardId = parseInt(cardElement.getAttribute("data-id"));
        const card = gameBoard[cardId];

        if (isProcessing || card.status !== "closed") return;

        card.status = "open";
        renderBoard();

        if (!firstCard) {
            firstCard = card;
        } else if (!secondCard) {
            secondCard = card;
            checkMatch();
        }
    }

    function checkMatch() {
        if (firstCard.image === secondCard.image) {
            firstCard.status = "found";
            secondCard.status = "found";
            firstCard = null;
            secondCard = null;
            pairsFoundElement.textContent = parseInt(pairsFoundElement.textContent) + 1;
            renderBoard();
            checkGameOver();
        } else {
            isProcessing = true;
            setTimeout(() => {
                firstCard.status = "closed";
                secondCard.status = "closed";
                firstCard = null;
                secondCard = null;
                renderBoard();
                isProcessing = false;
            }, 1000);
        }
    }

    function checkGameOver() {
        const foundCards = gameBoard.filter((card) => card.status === "found").length;
        if (foundCards === totalCards) {
            clearInterval(timerInterval);
            const totalTime = Math.floor((Date.now() - startTime) / 1000);
            gameMessage.textContent = `Gefeliciteerd! Je hebt het spel voltooid in ${totalTime} seconden.`;
        }
    }

    function resetGame() {
        grid.innerHTML = "";
        gameBoard = [];
        firstCard = null;
        secondCard = null;
        isProcessing = false;
        startTime = null;
        pairsFoundElement.textContent = "0";
        clearInterval(timerInterval);
        updateTimer(true);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(() => updateTimer(), 1000);
    }

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
