const correctSound = new Audio('sounds/correct.mp3');
const incorrectSound = new Audio('sounds/incorrect.mp3');

const images = [
    { src: 'img/brocoli.jpg', name: 'Ensalada de brocoli', healthy: true, info: 'El brócoli es saludable porque aporta vitaminas, minerales, fibra y pocas calorías. Además, ayuda a la digestión y mejora tu bienestar.' },
    { src: 'img/hamburguesa.jpg', name: 'Hamburguesa de carne de res', healthy: false, info: 'La hamburguesa puede ser rica en grasas saturadas y calorías. Consumirla en exceso no es saludable.' },
    { src: 'img/cereal-azucarado.jpg', name: 'Tazón de cereal azucarado con leche', healthy: false, info: 'El cereal azucarado suele contener altas cantidades de azúcar y pocos nutrientes. No es la mejor opción para el desayuno diario.' },
    { src: 'img/espinaca.jpg', name: 'Espinaca', healthy: true, info: 'La espinaca es una excelente fuente de hierro, vitaminas y antioxidantes, lo que la hace muy saludable.' },
    { src: 'img/galletas.jpg', name: 'Galletas de dulce con pasas', healthy: false, info: 'Las galletas suelen tener alto contenido de azúcar y grasas, por lo que conviene consumirlas con moderación.' },
    { src: 'img/huevo-cocido.jpg', name: 'Huevos cocidos', healthy: true, info: 'El huevo cocido es rico en proteínas y nutrientes esenciales, una buena adición para una dieta equilibrada.' },
    { src: 'img/manzana.jpg', name: 'Manzanas', healthy: true, info: 'La manzana es rica en fibra y vitamina C, además de ser una excelente opción de snack saludable.' }
];

let currentIndex = 0;
let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;
let secondsElapsed = localStorage.getItem('time') ? parseInt(localStorage.getItem('time')) : 0;
let timerInterval;
const redirectUrl = "../general/html/menuJuegoFin.html"; // Reemplaza con la URL deseada

document.getElementById('healthy').addEventListener('click', () => makeChoice(true));
document.getElementById('unhealthy').addEventListener('click', () => makeChoice(false));
document.getElementById('next-item').addEventListener('click', () => {
    showNextImage();
    startTimer();
});

function makeChoice(isHealthyChoice) {
    const currentImage = images[currentIndex];
    const feedback = document.getElementById('feedback');
    const infoBox = document.getElementById('info-box');
    const infoText = document.getElementById('info-text');
    const healthyButton = document.getElementById('healthy');
    const unhealthyButton = document.getElementById('unhealthy');

    if (currentImage.healthy === isHealthyChoice) {
        score++;
        feedback.textContent = '✔';
        feedback.className = 'correct';
        feedback.classList.remove('hidden');
        correctSound.play();

        // Cambiar el fondo a verde
        if (isHealthyChoice) {
            healthyButton.style.backgroundColor = 'green';
            unhealthyButton.style.backgroundColor = '';
        } else {
            unhealthyButton.style.backgroundColor = 'green';
            healthyButton.style.backgroundColor = '';
        }

        setTimeout(() => {
            showNextImage();
            healthyButton.style.backgroundColor = ''; // Resetear el fondo
            unhealthyButton.style.backgroundColor = ''; // Resetear el fondo
        }, 2000);
    } else {
        stopTimer();
        feedback.textContent = '✖';
        feedback.className = 'incorrect';
        feedback.classList.remove('hidden');
        incorrectSound.play();

        // Cambiar el fondo a rojo
        if (isHealthyChoice) {
            healthyButton.style.backgroundColor = 'red';
            unhealthyButton.style.backgroundColor = '';
        } else {
            unhealthyButton.style.backgroundColor = 'red';
            healthyButton.style.backgroundColor = '';
        }

        setTimeout(() => {
            feedback.classList.add('hidden');
            infoText.textContent = currentImage.info;
            infoBox.classList.remove('hidden');
            healthyButton.style.backgroundColor = ''; // Resetear el fondo
            unhealthyButton.style.backgroundColor = ''; // Resetear el fondo
        }, 2000);
    }
    updateScore();
}

function updateScore() {
    document.getElementById('score').textContent = score;
    // Guardar el puntaje en el almacenamiento local
    localStorage.setItem('score', score);
}

function showNextImage() {
    const feedback = document.getElementById('feedback');
    const infoBox = document.getElementById('info-box');
    feedback.classList.add('hidden');
    infoBox.classList.add('hidden');

    if (currentIndex + 1 >= images.length) {
        // Guardar el puntaje y el tiempo antes de redirigir
        localStorage.setItem('score', score);
        localStorage.setItem('time', secondsElapsed);

        // Redirigir a la página de nivel completado
        window.location.href = redirectUrl;
        return;
    }

    currentIndex++;
    const nextImage = images[currentIndex];
    document.getElementById('food-image').src = nextImage.src;
    document.getElementById('food-image').alt = nextImage.name;
    document.getElementById('food-name').textContent = nextImage.name;
}

function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            secondsElapsed++;
            const minutes = Math.floor(secondsElapsed / 60);
            const seconds = secondsElapsed % 60;
            document.getElementById('timer').textContent = `${pad(minutes)}:${pad(seconds)}`;
            // Guardar el tiempo en el almacenamiento local
            localStorage.setItem('time', secondsElapsed);
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function pad(number) {
    return number < 10 ? '0' + number : number;
}

window.onload = () => {
    // Recuperar el puntaje y el tiempo guardados
    updateScore();
    if (secondsElapsed > 0) {
        startTimer();
    }
};
