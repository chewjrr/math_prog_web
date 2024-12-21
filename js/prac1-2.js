export function startPrac1_2(container) {
    container.innerHTML = `
        <div class="prac-boxes">
            <canvas class="prac-box" id="canvas1" width="250" height="250"></canvas>
            <canvas class="prac-box" id="canvas2" width="250" height="250"></canvas>
        </div>
        <div class="controls">
            <button id="start-stop-button">Старт</button>
            <input type="number" id="ball-count" value="5" min="1" max="20">
        </div>
    `;

    const canvas1 = document.getElementById('canvas1');
    const canvas2 = document.getElementById('canvas2');
    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');
    const ballCountInput = document.getElementById('ball-count');
    const startStopButton = document.getElementById('start-stop-button');

    const ballRadius = 12.5;
    const maxBalls = 20;
    const ballColors = [
        '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF',
        '#00FFFF', '#FFA500', '#800080', '#008000', '#808080'
    ];

    let singleBall = null;
    let balls = [];
    let animationId;
    let isAnimating = false;

    function getRandomColor() {
        return ballColors[Math.floor(Math.random() * ballColors.length)];
    }

    function getRandomPosition(max) {
        return Math.floor(Math.random() * max);
    }

    function createBall(canvas) {
        return {
            x: getRandomPosition(canvas.width - ballRadius * 2) + ballRadius,
            y: getRandomPosition(canvas.height - ballRadius * 2) + ballRadius,
            dx: Math.random() > 0.5 ? 2 : -2,
            dy: Math.random() > 0.5 ? 2 : -2,
            color: getRandomColor()
        };
    }

    function drawBall(ctx, ball) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
    }

    function updateBalls() {
        const count = parseInt(ballCountInput.value, 10);
        while (balls.length < count) {
            const ball = createBall(canvas2);
            balls.push(ball);
        }
        while (balls.length > count) {
            balls.pop();
        }
    }

    function animate() {
        ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

        if (singleBall) {
            singleBall.x += singleBall.dx;
            singleBall.y += singleBall.dy;

            if (singleBall.x - ballRadius < 0 || singleBall.x + ballRadius > canvas1.width) {
                singleBall.dx = -singleBall.dx;
            }
            if (singleBall.y - ballRadius < 0 || singleBall.y + ballRadius > canvas1.height) {
                singleBall.dy = -singleBall.dy;
            }

            drawBall(ctx1, singleBall);
        }

        balls.forEach(ball => {
            ball.x += ball.dx;
            ball.y += ball.dy;

            if (ball.x - ballRadius < 0 || ball.x + ballRadius > canvas2.width) {
                ball.dx = -ball.dx;
            }
            if (ball.y - ballRadius < 0 || ball.y + ballRadius > canvas2.height) {
                ball.dy = -ball.dy;
            }

            drawBall(ctx2, ball);
        });

        balls.forEach((ball1, i) => {
            for (let j = i + 1; j < balls.length; j++) {
                const ball2 = balls[j];
                const dx = ball1.x - ball2.x;
                const dy = ball1.y - ball2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 2 * ballRadius) {
                    const tempDx = ball1.dx;
                    const tempDy = ball1.dy;
                    ball1.dx = ball2.dx;
                    ball1.dy = ball2.dy;
                    ball2.dx = tempDx;
                    ball2.dy = tempDy;

                    const overlap = 2 * ballRadius - distance;
                    ball1.x += dx / distance * overlap / 2;
                    ball1.y += dy / distance * overlap / 2;
                    ball2.x -= dx / distance * overlap / 2;
                    ball2.y -= dy / distance * overlap / 2;
                }
            }
        });

        animationId = requestAnimationFrame(animate);
    }

    startStopButton.addEventListener('click', () => {
        if (isAnimating) {
            cancelAnimationFrame(animationId);
            startStopButton.textContent = 'Старт';
        } else {
            singleBall = createBall(canvas1);
            updateBalls();
            animate();
            startStopButton.textContent = 'Стоп';
        }
        isAnimating = !isAnimating;
    });

    ballCountInput.addEventListener('input', updateBalls);
    updateBalls();
}
