const images = [
    { src: 'img/brocoli.jpg', name: 'Brocoli', healthy: true },
    { src: 'img/hamburguesa.jpg', name: 'Hamburguesa', healthy: false },
    // Agrega más imágenes y sus propiedades aquí...
];

let currentIndex = 0;
let score = 0;

document.getElementById('healthy').addEventListener('click', () => makeChoice(true));
document.getElementById('unhealthy').addEventListener('click', () => makeChoice(false));

function makeChoice(isHealthyChoice) {
    const currentImage = images[currentIndex];
    const feedback = document.getElementById('feedback');

    if (currentImage.healthy === isHealthyChoice) {
        score++;
        feedback.textContent = '✔';
        feedback.className = 'correct';
    } else {
        feedback.textContent = '✖';
        feedback.className = 'incorrect';
    }

    feedback.classList.remove('hidden');
    setTimeout(() => {
        feedback.classList.add('hidden');
        updateScore();
        showNextImage();
    }, 2200);
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    const nextImage = images[currentIndex];
    document.getElementById('food-image').src = nextImage.src;
    document.getElementById('food-name').textContent = nextImage.name;
}
