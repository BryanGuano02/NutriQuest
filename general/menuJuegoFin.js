window.onload = () => {
    // Recuperar los valores del almacenamiento local
    const score = localStorage.getItem('score');
    const time = localStorage.getItem('time');

    // Verificar si los datos existen y mostrarlos en los elementos correspondientes
    if (score !== null) {
        document.getElementById('score').textContent = score;
    }

    if (time !== null) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        // Actualizar el formato del tiempo
        document.getElementById('timer').textContent = `${pad(minutes)}:${pad(seconds)}`;
    }
}

function pad(number) {
    return number < 10 ? '0' + number : number;
}