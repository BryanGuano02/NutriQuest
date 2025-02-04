document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const palabras = document.querySelectorAll(".nombres-comida");
    const recuadros = document.querySelectorAll(".recuadro");
    const niveles = document.querySelectorAll(".nivel img");
    const scoreElement = document.getElementById("score");
    const timerElement = document.getElementById("timer");

    // Variables de estado del juego
    let score = 0;
    let selectedWord = null;
    let selectedNivelIndex = 0;
    let selectedRecuadroIndex = 0;
    let currentSection = "palabras"; // Sección actual dentro del main

    // Para la campana de correcto (asegúrate de tener el archivo bell.mp3 en la ruta indicada)
    const correctSound = new Audio('bell.mp3');

    // Variables para el temporizador
    let seconds = 0;
    let minutes = 0;
    let timerInterval;

    // Recupera score y tiempo guardados (si existen)
    const savedTime = localStorage.getItem('timeElapsed');
    const savedScore = localStorage.getItem('score');
    if (savedTime) {
        // Suponemos que savedTime tiene el formato "mm:ss"
        const parts = savedTime.split(':');
        if (parts.length === 2) {
            minutes = parseInt(parts[0], 10) || 0;
            seconds = parseInt(parts[1], 10) || 0;
        }
    }
    if (savedScore) {
        score = parseInt(savedScore, 10) || 0;
    }
    scoreElement.textContent = score;
    timerElement.textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;

    // Recupera el estado del juego (palabras ya colocadas) desde localStorage
    let gameState = { placed: {} };
    const savedGameState = localStorage.getItem('gameState');
    if (savedGameState) {
        try {
            gameState = JSON.parse(savedGameState);
        } catch (e) {
            gameState = { placed: {} };
        }
    }

    // Si existen palabras ya colocadas, actualiza la interfaz
    if (gameState.placed) {
        // Para cada recuadro, si en gameState se guardó una palabra, se actualiza.
        Object.keys(gameState.placed).forEach(key => {
            const recuadroIndex = parseInt(key, 10);
            const palabraTexto = gameState.placed[key];
            if (recuadros[recuadroIndex]) {
                recuadros[recuadroIndex].textContent = palabraTexto;
                recuadros[recuadroIndex].classList.add("correcto");
            }
            // Se busca la palabra en el listado de opciones y se oculta
            palabras.forEach(pal => {
                if (pal.textContent.trim() === palabraTexto.trim()) {
                    pal.style.display = "none";
                }
            });
        });
    }

    // Inicia el temporizador y actualiza el localStorage
    function startTimer() {
        timerInterval = setInterval(() => {
            seconds++;
            if (seconds === 60) {
                seconds = 0;
                minutes++;
            }
            let timeString = `${formatTime(minutes)}:${formatTime(seconds)}`;
            timerElement.textContent = timeString;
            // Guarda el tiempo transcurrido en localStorage para conservar el estado al pausar
            localStorage.setItem('timeElapsed', timeString);
        }, 1000);
    }

    // Función para detener el temporizador (útil al finalizar el juego o si se pausa)
    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Formatea el tiempo para que siempre aparezca con 2 dígitos (ej. 01, 09, 10)
    function formatTime(time) {
        return time < 10 ? `0${time}` : time;
    }

    // Función para hablar un mensaje usando SpeechSynthesis
    function speakMessage(message) {
        const utterance = new SpeechSynthesisUtterance(message);
        speechSynthesis.speak(utterance);
    }

    // Inicia el temporizador
    startTimer();

    // Guarda el puntaje actualizado en localStorage
    function updateScore(newScore) {
        score = newScore;
        scoreElement.textContent = score;
        localStorage.setItem('score', score);
    }

    // Eventos para las palabras (opciones)
    palabras.forEach((palabra, index) => {
        palabra.setAttribute("tabindex", "0");
        palabra.addEventListener("focus", () => {
            selectedWord = palabra;
            selectedNivelIndex = 0;
            currentSection = "palabras";
        });

        palabra.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && selectedWord) {
                niveles[0].focus();
                currentSection = "piramide";
            } else if (e.key === "ArrowDown" && index < palabras.length - 1) {
                palabras[index + 1].focus();
            } else if (e.key === "ArrowUp" && index > 0) {
                palabras[index - 1].focus();
            } else if (e.key === "ArrowRight") {
                niveles[0].focus();
                currentSection = "piramide";
            }
        });
    });

    // Eventos para los niveles (imágenes de la pirámide)
    niveles.forEach((nivel, index) => {
        nivel.setAttribute("tabindex", "0");

        nivel.addEventListener("focus", () => {
            selectedNivelIndex = index;
            currentSection = "piramide";
        });

        nivel.addEventListener("keydown", (e) => {
            if (e.key === "ArrowDown" && selectedNivelIndex < niveles.length - 1) {
                niveles[selectedNivelIndex + 1].focus();
            } else if (e.key === "ArrowUp" && selectedNivelIndex > 0) {
                niveles[selectedNivelIndex - 1].focus();
            } else if (e.key === "Enter" && selectedWord) {
                handleWordPlacement(selectedNivelIndex);
            } else if (e.key === "ArrowLeft") {
                palabras[0].focus();
                currentSection = "palabras";
            } else if (e.key === "ArrowRight") {
                recuadros[0].focus();
                currentSection = "recuadros";
            }
        });
    });

    // Eventos para los recuadros
    recuadros.forEach((recuadro, index) => {
        recuadro.setAttribute("tabindex", "0");
        recuadro.addEventListener("focus", () => {
            selectedRecuadroIndex = index;
            currentSection = "recuadros";
        });

        recuadro.addEventListener("keydown", (e) => {
            if (e.key === "ArrowDown" && selectedRecuadroIndex < recuadros.length - 1) {
                recuadros[selectedRecuadroIndex + 1].focus();
            } else if (e.key === "ArrowUp" && selectedRecuadroIndex > 0) {
                recuadros[selectedRecuadroIndex - 1].focus();
            } else if (e.key === "ArrowLeft") {
                niveles[0].focus();
                currentSection = "piramide";
            }
        });
    });

    // Función que maneja la colocación de la palabra en el recuadro
    function handleWordPlacement(index) {
        if (selectedWord) {
            const recuadro = recuadros[index];
            // Puedes descomentar estas líneas para depurar la comparación:
            // console.log("Recuadro:", recuadro.dataset.palabra.trim());
            // console.log("Seleccionada:", selectedWord.textContent.trim());

            if (recuadro.dataset.palabra.trim() === selectedWord.textContent.trim()) {
                recuadro.textContent = selectedWord.textContent;
                recuadro.classList.add("correcto");
                updateScore(score + 10); // Actualiza y guarda el puntaje

                // Actualiza el estado del juego con la palabra colocada
                gameState.placed[index] = selectedWord.textContent;
                localStorage.setItem('gameState', JSON.stringify(gameState));

                // Se pronuncia "Correcto" y se reproduce el sonido de campana
                speakMessage("Correcto");
                correctSound.play();

                // Oculta la palabra en el listado para que no se use nuevamente
                selectedWord.style.display = "none";
                selectedWord = null;
                
                // Devuelve el foco a la lista de palabras (al primer elemento visible)
                for (let i = 0; i < palabras.length; i++) {
                    if (palabras[i].style.display !== "none") {
                        palabras[i].focus();
                        break;
                    }
                }
            } else {
                speakMessage("Incorrecto");
            }
        }
    }

    // Guarda el estado actual (puntaje, tiempo y palabras colocadas) antes de abandonar la página
    window.addEventListener("beforeunload", () => {
        localStorage.setItem('score', score);
        localStorage.setItem('timeElapsed', `${formatTime(minutes)}:${formatTime(seconds)}`);
        localStorage.setItem('gameState', JSON.stringify(gameState));
    });
});
