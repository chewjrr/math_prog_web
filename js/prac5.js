export function startPrac5(container) {
    container.innerHTML = `
        <div class="prac-box">
            <canvas id="mandelbrotCanvas" width="800" height="800"></canvas>
            <canvas id="networkCanvas" width="800" height="800"></canvas>
        </div>
    `;

    const mandelbrotCanvas = document.getElementById('mandelbrotCanvas');
    const networkCanvas = document.getElementById('networkCanvas');
    const mandelbrotCtx = mandelbrotCanvas.getContext('2d');
    const networkCtx = networkCanvas.getContext('2d');

    // Рисование Мандельбротовского фрактала
    drawMandelbrot(mandelbrotCtx);

    // Построение сетевого графа
    drawNetwork(networkCtx);

    function drawMandelbrot(ctx) {
        const width = mandelbrotCanvas.width;
        const height = mandelbrotCanvas.height;
        const maxIterations = 1000;

        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const c_re = (x / width) * 3.5 - 2.5;
                const c_im = (y / height) * 2 - 1;
                let z_re = 0;
                let z_im = 0;
                let iteration = 0;

                while (z_re * z_re + z_im * z_im <= 4 && iteration < maxIterations) {
                    const new_z_re = z_re * z_re - z_im * z_im + c_re;
                    const new_z_im = 2 * z_re * z_im + c_im;
                    z_re = new_z_re;
                    z_im = new_z_im;
                    iteration++;
                }

                const index = (x + y * width) * 4;
                const color = iteration === maxIterations ? 0 : iteration % 256;
                data[index] = color;
                data[index + 1] = color;
                data[index + 2] = color;
                data[index + 3] = 255;
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }

    function drawNetwork(ctx) {
        const numNodes = 10;
        const nodes = [];
        const edges = [];

        // Генерация узлов
        for (let i = 0; i < numNodes; i++) {
            const x = Math.random() * networkCanvas.width;
            const y = Math.random() * networkCanvas.height;
            nodes.push({ x, y });
        }

        // Генерация ребер
        for (let i = 0; i < numNodes; i++) {
            for (let j = i + 1; j < numNodes; j++) {
                if (Math.random() < 0.3) {
                    edges.push({ from: i, to: j });
                }
            }
        }

        // Рисование узлов
        ctx.fillStyle = 'blue';
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Рисование ребер
        ctx.strokeStyle = 'gray';
        edges.forEach(edge => {
            const fromNode = nodes[edge.from];
            const toNode = nodes[edge.to];
            ctx.beginPath();
            ctx.moveTo(fromNode.x, fromNode.y);
            ctx.lineTo(toNode.x, toNode.y);
            ctx.stroke();
        });
    }
}
