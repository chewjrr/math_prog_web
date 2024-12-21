export function startPrac8(container) {
    const style = `
        .labyrinth-container {
            display: grid;
            grid-template-columns: repeat(10, 30px);
            grid-template-rows: repeat(10, 30px);
            gap: 2px;
        }
        .labyrinth-cell {
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            cursor: pointer;
        }
        .wall {
            background-color: #000;
            color: #fff;
        }
        .path {
            background-color: #fff;
            color: #000;
        }
        .object {
            background-color: #00f;
            color: #fff;
        }
        .exit {
            background-color: #0f0;
            color: #fff;
        }
        .path-highlight {
            background-color: #33d0ff;
        }
        .button-container {
            margin-top: 20px;
        }
        button {
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = style;
    document.head.appendChild(styleSheet);

    const initialLabyrinth = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 3, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 1, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 2], // Выход (красная клетка)
    ];

    let labyrinth = initialLabyrinth;
    let x = 1;
    let y = 1;
    let path = [];

    container.innerHTML = `
        <div class="button-container">
            <button id="find-path-button">Построить маршрут</button>
        </div>
        <div class="labyrinth-container" id="labyrinth-container"></div>
    `;

    const labyrinthContainer = document.getElementById('labyrinth-container');
    const findPathButton = document.getElementById('find-path-button');

    function createLabyrinth() {
        labyrinthContainer.innerHTML = '';
        for (let i = 0; i < labyrinth.length; i++) {
            for (let j = 0; j < labyrinth[i].length; j++) {
                const cell = document.createElement('div');
                cell.classList.add('labyrinth-cell');
                if (labyrinth[i][j] === 1) {
                    cell.classList.add('wall');
                } else if (labyrinth[i][j] === 3) {
                    cell.classList.add('object');
                } else if (labyrinth[i][j] === 2) {
                    cell.classList.add('exit');
                } else if (path.some(([py, px]) => py === i && px === j)) {
                    cell.classList.add('path-highlight');
                }
                cell.dataset.x = j;
                cell.dataset.y = i;
                cell.addEventListener('click', () => toggleCell(j, i));
                labyrinthContainer.appendChild(cell);
            }
        }
    }

    function toggleCell(cellX, cellY) {
        if (labyrinth[cellY][cellX] === 1) {
            labyrinth[cellY][cellX] = 0;
        } else if (labyrinth[cellY][cellX] === 0) {
            labyrinth[cellY][cellX] = 1;
        }
        createLabyrinth();
    }

    function handleKeyPress(event) {
        let newX = x;
        let newY = y;

        switch (event.key) {
            case 'ArrowUp':
                newY -= 1;
                break;
            case 'ArrowDown':
                newY += 1;
                break;
            case 'ArrowLeft':
                newX -= 1;
                break;
            case 'ArrowRight':
                newX += 1;
                break;
            default:
                return;
        }

        // Проверка валидности движения
        if (newX >= 0 && newX < labyrinth[0].length && newY >= 0 && newY < labyrinth.length) {
            const cellValue = labyrinth[newY][newX];

            if (cellValue === 1) {
                return;
            }

            labyrinth[y][x] = 0;
            labyrinth[newY][newX] = 3;
            x = newX;
            y = newY;

            // Проверка на выход
            if (cellValue === 2) {
                alert('Вы прошли лабиринт!');
            }

            createLabyrinth();
        }
    }

    function findPath() {
        const queue = [[y, x, []]];
        const visited = new Set();
        visited.add(`${y},${x}`);

        while (queue.length > 0) {
            const [currentY, currentX, currentPath] = queue.shift();

            if (labyrinth[currentY][currentX] === 2) {
                path = currentPath;
                createLabyrinth();
                return;
            }

            const directions = [
                [0, 1],
                [1, 0],
                [0, -1],
                [-1, 0],
            ];

            for (const [dy, dx] of directions) {
                const newY = currentY + dy;
                const newX = currentX + dx;
                const key = `${newY},${newX}`;

                if (
                    newY >= 0 &&
                    newY < labyrinth.length &&
                    newX >= 0 &&
                    newX < labyrinth[0].length &&
                    !visited.has(key)
                ) {
                    const cellValue = labyrinth[newY][newX];
                    if (cellValue !== 1) {
                        visited.add(key);
                        queue.push([newY, newX, [...currentPath, [newY, newX]]]);
                    }
                }
            }
        }

        // Если очередь пуста и путь не найден
        alert('Путь не найден!');
    }

    document.addEventListener('keydown', handleKeyPress);
    findPathButton.addEventListener('click', findPath);

    createLabyrinth();
}
