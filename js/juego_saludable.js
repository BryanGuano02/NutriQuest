let score = 0;

document.getElementById('healthy').addEventListener('click', function() {
    document.getElementById('healthy').classList.add('active');
    document.getElementById('unhealthy').classList.remove('active');
    document.getElementById('result-icon').src = 'checkmark.png';
    document.getElementById('result-icon').style.display = 'block';
    score += 10;
    document.getElementById('score').textContent = score;
});

document.getElementById('unhealthy').addEventListener('click', function() {
    document.getElementById('unhealthy').classList.add('active');
    document.getElementById('healthy').classList.remove('active');
    document.getElementById('result-icon').src = 'cross.png';
    document.getElementById('result-icon').style.display = 'block';
    score = Math.max(0, score - 10);
    document.getElementById('score').textContent = score;
});

document.getElementById('next').addEventListener('click', function() {
    document.getElementById('healthy').classList.remove('active');
    document.getElementById('unhealthy').classList.remove('active');
    document.getElementById('result-icon').style.display = 'none';
    // Lógica para cargar el siguiente elemento
});
