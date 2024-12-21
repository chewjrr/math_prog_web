export function startPrac10(container) {
    const style = `
        .race-container {
            position: relative;
            width: 800px;
            height: 600px;
            background-color: #fff;
            border: 1px solid #000;
            margin: 0 auto;
        }
        .participant {
            position: absolute;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            text-align: center;
            line-height: 40px;
            font-size: 24px;
        }
        .info {
            position: absolute;
            top: 10px;
            left: 10px;
            font-size: 18px;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = style;
    document.head.appendChild(styleSheet);

    const width = 800;
    const height = 600;
    const radius = 200;
    const centerX = width / 2;
    const centerY = height / 2;
    const numParticipants = 5; // Устанавливаем количество гонщиков на 5
    const numLaps = 5; // Устанавливаем количество кругов для завершения гонки
    const characters = ['🐢', '🐇', '🐉', '🐎', '🐕'];
    const colors = ['red', 'green', 'blue', 'yellow', 'purple'];

    let participants = [];
    for (let i = 0; i < numParticipants; i++) {
        participants.push({
            name: characters[i],
            position: 0,
            speed: Math.random() * 0.04 + 0.05, // Увеличиваем начальную скорость
            direction: 1, // Все двигаются в одном направлении
            distance: 0, // Добавляем отслеживание пройденного пути
            laps: 0 // Добавляем отслеживание количества кругов
        });
    }

    function updatePosition(participant) {
        participant.position += participant.speed * participant.direction;
        participant.distance += participant.speed; // Обновляем пройденный путь
        if (participant.position >= 2 * Math.PI) {
            participant.position -= 2 * Math.PI;
            participant.laps += 1;
        }
    }

    function calculateCoordinates(position) {
        const x = centerX + radius * Math.cos(position);
        const y = centerY + radius * Math.sin(position);
        return { x: Math.round(x), y: Math.round(y) };
    }

    container.innerHTML = `
        <div class="race-container" id="race-container"></div>
        <div class="info" id="info"></div>
    `;

    const raceContainer = document.getElementById('race-container');
    const info = document.getElementById('info');

    function drawParticipants() {
        raceContainer.innerHTML = '';
        participants.forEach((participant, index) => {
            const { x, y } = calculateCoordinates(participant.position);
            const participantElement = document.createElement('div');
            participantElement.classList.add('participant');
            participantElement.style.backgroundColor = colors[index];
            participantElement.style.left = `${x - 20}px`; // Центрируем участника
            participantElement.style.top = `${y - 20}px`; // Центрируем участника
            participantElement.innerText = participant.name;
            raceContainer.appendChild(participantElement);
        });
    }

    function updateInfo() {
        participants.sort((a, b) => b.laps - a.laps || b.distance - a.distance);
        info.innerHTML = participants.map(participant => `${participant.name}: ${participant.laps} кругов`).join('<br>');
    }

    function gameLoop() {
        participants.forEach(updatePosition);
        participants.forEach(participant => {
            participant.speed = Math.random() * 0.1 + 0.05; // Случайно меняем скорость
        });
        drawParticipants();
        updateInfo();

        if (participants.every(participant => participant.laps >= numLaps)) {
            clearInterval(gameInterval);
            alert('Гонка завершена!');
            printFinalPositions();
        }
    }
    
    const gameInterval = setInterval(gameLoop, 100);
}
