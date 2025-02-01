document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.card');
    const scoreElement = document.getElementById("score");
    const timerElement = document.getElementById("timer");
    const pauseButton = document.getElementById("pauseButton");

    let score = 0;
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let gameStarted = false;
    let secondsElapsed = 0;
    let timerInterval;

    let gameState = { revealedIndexes: [] };

    // Verifica si el usuario viene de "Volver a empezar"
    const resetGame = localStorage.getItem('resetGame');

    if (resetGame === "true") {
        localStorage.removeItem('resetGame');
        localStorage.removeItem('score');
        localStorage.removeItem('timeElapsed');
        localStorage.removeItem('gameState');
    } else {
        // Recuperar puntuación y tiempo si existen
        const savedScore = localStorage.getItem('score');
        const savedTime = localStorage.getItem('timeElapsed');
        const savedState = localStorage.getItem('gameState');

        if (savedScore) {
            score = parseInt(savedScore);
            scoreElement.textContent = score;
        }

        if (savedTime) {
            secondsElapsed = parseInt(savedTime);
        }

        if (savedState) {
            gameState = JSON.parse(savedState);
        }
    }

    function startTimer() {
        if (!gameStarted) {
            gameStarted = true;
            timerInterval = setInterval(() => {
                secondsElapsed++;
                localStorage.setItem('timeElapsed', secondsElapsed);
                const minutes = Math.floor(secondsElapsed / 60).toString().padStart(2, "0");
                const seconds = (secondsElapsed % 60).toString().padStart(2, "0");
                timerElement.textContent = `${minutes}:${seconds}`;
            }, 1000);
        }
    }

    function announceMessage(message) {
        const announcer = document.getElementById('screen-reader-announcer');
        announcer.textContent = "";
        setTimeout(() => {
            announcer.textContent = message;
        }, 200);
    }

    cards.forEach((card, index) => {
        card.dataset.index = index;
        const imgSrc = card.getAttribute('data-imagen');
        const imgAlt = card.getAttribute('alt') || 'Imagen de la tarjeta';
        const imgElement = document.createElement('img');
        imgElement.src = imgSrc;
        imgElement.alt = imgAlt;
        imgElement.style.display = 'none';
        card.appendChild(imgElement);

        if (gameState.revealedIndexes.includes(index)) {
            card.classList.add('revealed');
            imgElement.style.display = 'block';
            card.innerHTML = "";
            card.appendChild(imgElement);
            card.setAttribute('aria-live', 'polite');
            card.setAttribute('aria-label', imgAlt);
        }

        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                handleCardSelection(card);
            }
        });

        card.addEventListener('click', () => {
            handleCardSelection(card);
        });
    });

    // Mover el foco con las flechas
    document.addEventListener('keydown', (event) => {
        const focusedCard = document.activeElement;

        if (event.key === "ArrowRight") {
            const nextCard = focusedCard.nextElementSibling;
            if (nextCard && nextCard.classList.contains('card')) {
                nextCard.focus();
            }
        } else if (event.key === "ArrowLeft") {
            const previousCard = focusedCard.previousElementSibling;
            if (previousCard && previousCard.classList.contains('card')) {
                previousCard.focus();
            }
        } else if (event.key === "ArrowDown") {
            const currentIndex = Array.from(cards).indexOf(focusedCard);
            const nextRowStartIndex = currentIndex + 4; // Ajusta el número según las filas en tu diseño

            if (nextRowStartIndex < cards.length) {
                cards[nextRowStartIndex].focus();
            }
        } else if (event.key === "ArrowUp") {
            const currentIndex = Array.from(cards).indexOf(focusedCard);
            const prevRowStartIndex = currentIndex - 4; // Ajusta el número según las filas en tu diseño

            if (prevRowStartIndex >= 0) {
                cards[prevRowStartIndex].focus();
            }
        }
    });

    function handleCardSelection(card) {
        startTimer();
        if (lockBoard || card.classList.contains('revealed')) return;

        const originalText = card.innerHTML;

        card.classList.add('revealed');
        const img = card.querySelector('img');
        img.style.display = 'block';
        card.innerHTML = "";
        card.appendChild(img);
        card.setAttribute('aria-live', 'polite');
        card.setAttribute('aria-label', img.alt);

        const cardIndex = parseInt(card.dataset.index);
        if (!gameState.revealedIndexes.includes(cardIndex)) {
            gameState.revealedIndexes.push(cardIndex);
            localStorage.setItem("gameState", JSON.stringify(gameState));
        }

        if (!firstCard) {
            firstCard = card;
            firstCard.originalText = originalText; // Guardamos el texto original en la primera carta
            return;
        }
        secondCard = card;
        secondCard.originalText = originalText; // Guardamos el texto original en la segunda carta
        lockBoard = true;
    
        const firstImage = firstCard.querySelector('img').src;
        const secondImage = secondCard.querySelector('img').src;

        if (firstImage === secondImage) {
            score += 10;
            scoreElement.textContent = score;
            localStorage.setItem('score', score);
            announceMessage("¡Acertaste! Selecciona pares de nuevo");
            firstCard.removeEventListener('click', handleCardSelection);
            secondCard.removeEventListener('click', handleCardSelection);
            resetBoard();
        } else {
            setTimeout(() => {
                announceMessage("Fallaste");

                const firstIndex = parseInt(firstCard.dataset.index);
                const secondIndex = parseInt(secondCard.dataset.index);
                gameState.revealedIndexes = gameState.revealedIndexes.filter(i => i !== firstIndex && i !== secondIndex);
                localStorage.setItem("gameState", JSON.stringify(gameState));

                const firstImg = firstCard.querySelector('img');
                firstCard.classList.remove('revealed');
                firstImg.style.display = 'none';
                firstCard.innerHTML = firstCard.originalText;
                firstCard.appendChild(firstImg);
                firstCard.removeAttribute('aria-label');

                const secondImg = secondCard.querySelector('img');
                secondCard.classList.remove('revealed');
                secondImg.style.display = 'none';
                secondCard.innerHTML = secondCard.originalText;
                secondCard.appendChild(secondImg);
                secondCard.removeAttribute('aria-label');

                resetBoard();
            }, 2000);
        }
    }

    function resetBoard() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }

    // Botón para pausar el juego y redirigir a pausa.html
    if (pauseButton) {
        pauseButton.addEventListener("click", () => {
            localStorage.setItem('score', score);
            localStorage.setItem('timeElapsed', secondsElapsed);
            clearInterval(timerInterval);
            window.location.href = "pausa.html";
        });
    }

    // Si existe un botón para "Volver a empezar", lo manejamos
    const resetButton = document.getElementById("resetButton");
    if (resetButton) {
        resetButton.addEventListener("click", () => {
            localStorage.setItem('resetGame', "true");
            window.location.href = "juego.html"; // Recargar el juego limpio
        });
    }
});
