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
let score = 0;
let timerInterval;
let secondsElapsed = 0;

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

    if (currentImage.healthy === isHealthyChoice) {
        score++;
        feedback.textContent = '✔';
        feedback.className = 'correct';
        feedback.classList.remove('hidden');
        setTimeout(showNextImage, 2000);
    } else {
        stopTimer();
        feedback.textContent = '✖';
        feedback.className = 'incorrect';
        feedback.classList.remove('hidden');
        setTimeout(() => {
            feedback.classList.add('hidden');
            infoText.textContent = currentImage.info;
            infoBox.classList.remove('hidden');
        }, 2000);
    }

    updateScore();
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

// function showNextImage() {
//     const feedback = document.getElementById('feedback');
//     const infoBox = document.getElementById('info-box');

//     feedback.classList.add('hidden');
//     infoBox.classList.add('hidden');

//     currentIndex = (currentIndex + 1) % images.length;
//     const nextImage = images[currentIndex];
//     document.getElementById('food-image').src = nextImage.src;
//     document.getElementById('food-name').textContent = nextImage.name;
// }
function showNextImage() {
    const feedback = document.getElementById('feedback');
    const infoBox = document.getElementById('info-box');

    feedback.classList.add('hidden');
    infoBox.classList.add('hidden');

    currentIndex = (currentIndex + 1) % images.length;
    const nextImage = images[currentIndex];
    const foodImageElement = document.getElementById('food-image');
    foodImageElement.src = nextImage.src;
    foodImageElement.alt = nextImage.name;
    document.getElementById('food-name').textContent = nextImage.name;
}

function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            secondsElapsed++;
            const minutes = Math.floor(secondsElapsed / 60);
            const seconds = secondsElapsed % 60;
            document.getElementById('timer').textContent = `${pad(minutes)}:${pad(seconds)}`;
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

// Initialize timer on page load
window.onload = () => {
    startTimer();
};
