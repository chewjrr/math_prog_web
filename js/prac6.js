export function startPrac6(container) {
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

            .game-board {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                grid-template-rows: repeat(6, 1fr);
                gap: 2px;
            }

            .game-board div {
                width: 30px;
                height: 30px;
                background-color: lightgray;
                border: 1px solid black;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
            }

            .game-board-label {
                grid-column: span 6;
                background-color: white;
                border: none;
                font-size: 18px;
                font-weight: bold;
                text-align: center;
            }
        </style>
        <div class="prac-box">
            <div>
                <button onclick="startGame(2)">Средний уровень</button>
            </div>
            <div id="game-container"></div>
        </div>
    `;

    window.startGame = function(mode) {
        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = `
            <div class="game-board-container">
                <div class="game-board" id="player-board"></div>
            </div>
            <div class="game-board-container">
                <div class="game-board" id="computer-board"></div>
            </div>
        `;

        class SeaBattle {
            constructor(mode) {
                this.mode = mode;
                this.size = 0;
                this.playerField = [];
                this.computerField = [];
                this.playerDisplayField = [];
                this.computerDisplayField = [];
                this.playerBoxes = [];
                this.computerBoxes = [];
                this.playerTurn = true;
                this.lastHit = null;
                this.playerLastHit = null;
                this.computerLastHit = null;
                this.shotHistory = [];

                if (mode === 2) {
                    this.playerField = this.createField(6);
                    this.computerField = this.createField(6);
                    this.placeShips(this.playerField, [1, 1, 1]);
                    this.placeShips(this.computerField, [1, 1, 1]);
                    this.size = 6;
                }

                this.playerDisplayField = this.createField(this.size);
                this.computerDisplayField = this.createField(this.size);

                this.initializeGameBoard(this.playerBoxes, document.getElementById('player-board'), "Игрок");
                this.initializeGameBoard(this.computerBoxes, document.getElementById('computer-board'), "Компьютер");
                this.updateDisplayBoard();
                if (!this.playerTurn) {
                    this.computerTurn();
                }
            }

            createField(size) {
                return Array.from({ length: size }, () => Array(size).fill(' '));
            }

            placeShips(field, shipSizes) {
                for (let size of shipSizes) {
                    while (true) {
                        const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
                        let x, y;
                        if (orientation === 'horizontal') {
                            x = Math.floor(Math.random() * field.length);
                            y = Math.floor(Math.random() * (field[0].length - size));
                        } else {
                            x = Math.floor(Math.random() * (field.length - size));
                            y = Math.floor(Math.random() * field[0].length);
                        }

                        if (this.canPlaceShip(field, x, y, size, orientation)) {
                            for (let i = 0; i < size; i++) {
                                if (orientation === 'vertical') {
                                    field[x + i][y] = 'S';
                                } else {
                                    field[x][y + i] = 'S';
                                }
                            }
                            this.markNeighbors(field, x, y, size, orientation);
                            break;
                        }
                    }
                }
            }

            canPlaceShip(field, x, y, size, orientation) {
                if (orientation === 'horizontal') {
                    return field[x].slice(y, y + size).every(cell => cell === ' ') &&
                        field.slice(Math.max(0, x - 1), Math.min(field.length, x + 2)).every(row => row.slice(Math.max(0, y - 1), Math.min(field[0].length, y + size + 1)).every(cell => cell === ' '));
                } else {
                    return field.slice(x, x + size).map(row => row[y]).every(cell => cell === ' ') &&
                        field.slice(Math.max(0, x - 1), Math.min(field.length, x + size + 1)).every(row => row.slice(Math.max(0, y - 1), Math.min(field[0].length, y + 2)).every(cell => cell === ' '));
                }
            }

            markNeighbors(field, x, y, size, orientation) {
                for (let i = 0; i < size; i++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        for (let dy = -1; dy <= 1; dy++) {
                            let nx, ny;
                            if (orientation === 'horizontal') {
                                nx = x + dx;
                                ny = y + i + dy;
                            } else {
                                nx = x + i + dx;
                                ny = y + dy;
                            }
                            if (nx >= 0 && nx < field.length && ny >= 0 && ny < field[0].length && field[nx][ny] !== 'S') {
                                field[nx][ny] = '*';
                            }
                        }
                    }
                }
            }

            shoot(field, x, y) {
                if (field[x][y] === 'S') {
                    field[x][y] = 'X';
                    return true;
                } else if (field[x][y] === ' ') {
                    field[x][y] = 'O';
                    return false;
                }
                return null;
            }

            allShipsSunk(field) {
                return field.every(row => row.every(cell => cell !== 'S'));
            }

            initializeGameBoard(pictureBoxes, frame, label) {
                const labelElement = document.createElement('div');
                labelElement.textContent = label;
                labelElement.classList.add('game-board-label');
                frame.parentElement.insertBefore(labelElement, frame);
                for (let i = 0; i < this.size; i++) {
                    const row = [];
                    for (let j = 0; j < this.size; j++) {
                        const pb = document.createElement('div');
                        pb.style.width = '30px';
                        pb.style.height = '30px';
                        pb.style.backgroundColor = 'lightgray';
                        pb.style.border = '1px solid black';
                        pb.style.display = 'flex';
                        pb.style.alignItems = 'center';
                        pb.style.justifyContent = 'center';
                        pb.style.fontSize = '16px';
                        pb.addEventListener('click', () => this.pictureBoxClick(i, j));
                        row.push(pb);
                        frame.appendChild(pb);
                    }
                    pictureBoxes.push(row);
                }
            }

            pictureBoxClick(x, y) {
                if (this.playerTurn) {
                    if (this.computerDisplayField[x][y] === ' ') {
                        const result = this.shoot(this.computerField, x, y);
                        if (result) {
                            this.computerDisplayField[x][y] = 'X';
                            this.playerLastHit = [x, y];
                            this.logShot(x, y, 'hit', 'player');
                            this.updateDisplayBoard();
                            if (this.allShipsSunk(this.computerField)) {
                                alert('Вы победили!');
                                return;
                            }
                        } else {
                            this.computerDisplayField[x][y] = 'O';
                            this.logShot(x, y, 'miss', 'player');
                            this.updateDisplayBoard();
                            this.playerTurn = false;
                            this.computerTurn();
                        }
                    } else {
                        alert('Эта клетка уже была обстреляна.');
                    }
                }
            }

            computerTurn() {
                if (!this.playerTurn) {
                    let hitOccurred = false;
                    while (true) {
                        if (this.computerLastHit) {
                            const [x, y] = this.computerLastHit;
                            const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
                            for (let [dx, dy] of directions) {
                                const nx = x + dx;
                                const ny = y + dy;
                                if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size && this.playerDisplayField[nx][ny] === ' ') {
                                    const result = this.shoot(this.playerField, nx, ny);
                                    if (result) {
                                        this.playerDisplayField[nx][ny] = 'X';
                                        this.computerLastHit = [nx, ny];
                                        hitOccurred = true;
                                        this.logShot(nx, ny, 'hit', 'computer');
                                        this.updateDisplayBoard();
                                        if (this.allShipsSunk(this.playerField)) {
                                            alert('Вы проиграли!');
                                            return;
                                        }
                                        break;
                                    } else {
                                        this.playerDisplayField[nx][ny] = 'O';
                                        this.logShot(nx, ny, 'miss', 'computer');
                                        this.updateDisplayBoard();
                                        break;
                                    }
                                }
                            }
                            if (!hitOccurred) {
                                this.playerTurn = true;
                                this.computerLastHit = null;
                                break;
                            }
                        } else {
                            const x = Math.floor(Math.random() * this.size);
                            const y = Math.floor(Math.random() * this.size);
                            if (this.playerDisplayField[x][y] === ' ') {
                                const result = this.shoot(this.playerField, x, y);
                                if (result) {
                                    this.playerDisplayField[x][y] = 'X';
                                    this.computerLastHit = [x, y];
                                    this.logShot(x, y, 'hit', 'computer');
                                    this.updateDisplayBoard();
                                    if (this.allShipsSunk(this.playerField)) {
                                        alert('Вы проиграли!');
                                        return;
                                    }
                                } else {
                                    this.playerDisplayField[x][y] = 'O';
                                    this.logShot(x, y, 'miss', 'computer');
                                    this.updateDisplayBoard();
                                    this.playerTurn = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            updateDisplayBoard() {
                for (let i = 0; i < this.size; i++) {
                    for (let j = 0; j < this.size; j++) {
                        const playerBox = this.playerBoxes[i][j];
                        const computerBox = this.computerBoxes[i][j];
                        if (this.playerField[i][j] === 'S') {
                            playerBox.style.backgroundColor = 'black';
                        } else if (this.playerDisplayField[i][j] === 'X') {
                            playerBox.style.backgroundColor = 'red';
                        } else if (this.playerDisplayField[i][j] === 'O') {
                            playerBox.style.backgroundColor = 'blue';
                        } else {
                            playerBox.style.backgroundColor = 'lightgray';
                        }

                        if (this.computerDisplayField[i][j] === 'X') {
                            computerBox.style.backgroundColor = 'red';
                        } else if (this.computerDisplayField[i][j] === 'O') {
                            computerBox.style.backgroundColor = 'blue';
                        } else {
                            computerBox.style.backgroundColor = 'lightgray';
                        }
                    }
                }
            }

            logShot(x, y, result, player) {
                this.shotHistory.push({ x, y, result, player });
                console.log(`Shot at (${x}, ${y}) by ${player}: ${result}`);
            }
        }

        const game = new SeaBattle(mode);
    }
}
