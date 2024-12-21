export function startPrac7(container) {
    container.innerHTML = `
        <style>
            .prac-box {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 800px;
                height: 400px;
                margin-top: 20px;
            }

            .game-container {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
            }

            .canvas-container {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 400px;
                height: 400px;
                margin: 10px;
            }

            canvas {
                border: 1px solid black;
            }
        </style>
        <div class="prac-box">
            <div class="game-container">
                <div class="canvas-container">
                    <canvas id="mazeCanvas" width="400" height="400"></canvas>
                </div>
                <div class="canvas-container">
                    <canvas id="pathCanvas" width="400" height="400" style="background-color: black;"></canvas>
                </div>
            </div>
        </div>
    `;

    const CELL_SIZE = 40;
    const MAZE_WIDTH = 10;
    const MAZE_HEIGHT = 10;

    const maze = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
        [1, 0, 0, 0, 0, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 1]
    ];

    let player_x = 5;
    let player_y = 5;

    const mazeCanvas = document.getElementById('mazeCanvas');
    const pathCanvas = document.getElementById('pathCanvas');
    const mazeCtx = mazeCanvas.getContext('2d');
    const pathCtx = pathCanvas.getContext('2d');

    const pathPoints = [];
    pathPoints.push([player_x, player_y]);

    function drawMaze() {
        mazeCtx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
        for (let y = 0; y < MAZE_HEIGHT; y++) {
            for (let x = 0; x < MAZE_WIDTH; x++) {
                if (maze[y][x] === 1) {
                    mazeCtx.fillStyle = 'black';
                    mazeCtx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                } else if (x === player_x && y === player_y) {
                    mazeCtx.fillStyle = 'blue';
                    mazeCtx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }
    }

    function drawPath() {
        pathCtx.clearRect(0, 0, pathCanvas.width, pathCanvas.height);
        pathCtx.fillStyle = 'red';
        pathPoints.forEach(point => {
            const [x, y] = point;
            pathCtx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        });
    }

    function onKeyPress(event) {
        let new_x = player_x;
        let new_y = player_y;

        if (event.key === "ArrowUp") {
            new_y -= 1;
        } else if (event.key === "ArrowDown") {
            new_y += 1;
        } else if (event.key === "ArrowLeft") {
            new_x -= 1;
        } else if (event.key === "ArrowRight") {
            new_x += 1;
        }

        if (new_x >= 0 && new_x < MAZE_WIDTH && new_y >= 0 && new_y < MAZE_HEIGHT && maze[new_y][new_x] === 0) {
            player_x = new_x;
            player_y = new_y;

            if (!pathPoints.some(point => point[0] === player_x && point[1] === player_y)) {
                pathPoints.push([player_x, player_y]);
                drawPath();
            }
        }

        drawMaze();
    }

    document.addEventListener('keydown', onKeyPress);
    drawMaze();
    drawPath();
}
