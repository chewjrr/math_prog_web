export function startPrac11(container) {
    // Устанавливаем стили для контейнера
    container.style.position = 'relative';
    container.style.width = '700px';
    container.style.height = '500px';
    container.style.backgroundColor = 'black';
    container.style.overflow = 'hidden';
    container.style.margin = '0 auto'; // Центрируем контейнер по горизонтали

    // Создаем элемент для отображения счетчика патронов
    const ammoCounter = document.createElement('div');
    ammoCounter.style.position = 'absolute';
    ammoCounter.style.top = '10px';
    ammoCounter.style.left = '10px';
    ammoCounter.style.color = 'white';
    ammoCounter.style.fontSize = '20px';
    container.appendChild(ammoCounter);

    // Создаем элемент для отображения очков
    const scoreCounter = document.createElement('div');
    scoreCounter.style.position = 'absolute';
    scoreCounter.style.top = '10px';
    scoreCounter.style.right = '10px';
    scoreCounter.style.color = 'white';
    scoreCounter.style.fontSize = '20px';
    container.appendChild(scoreCounter);

    // Создаем элемент для отображения лучшего счета
    const highScoreCounter = document.createElement('div');
    highScoreCounter.style.position = 'absolute';
    highScoreCounter.style.top = '40px';
    highScoreCounter.style.right = '10px';
    highScoreCounter.style.color = 'white';
    highScoreCounter.style.fontSize = '20px';
    container.appendChild(highScoreCounter);

    // Создаем элемент для отображения частоты появления врагов и их скоростей
    const statsCounter = document.createElement('div');
    statsCounter.style.position = 'absolute';
    statsCounter.style.top = '10px';
    statsCounter.style.left = '50%';
    statsCounter.style.transform = 'translateX(-50%)';
    statsCounter.style.color = 'white';
    statsCounter.style.fontSize = '20px';
    statsCounter.style.textAlign = 'center';
    container.appendChild(statsCounter);

    let score = 0; // Переменная для хранения очков
    let highScore = parseInt(localStorage.getItem('highScore')) || 0; // Лучший счет из localStorage
    let enemyFrequency = 2000; // Начальная частота появления врагов
    let bigEnemySpeed = 1; // Начальная скорость большого врага
    let mediumEnemySpeed = 2; // Начальная скорость среднего врага
    let smallEnemySpeed = 3; // Начальная скорость маленького врага

    // Функция для обновления счетчика очков
    function updateScoreCounter() {
        scoreCounter.textContent = `Очки: ${score}`;

        // Обновляем лучший счет, если текущий счет превышает лучший
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }

        // Если текущий счет равен лучшему счету, отображаем одно и то же значение
        if (score === highScore) {
            highScoreCounter.textContent = `Лучший счет: ${score}`;
        } else {
            highScoreCounter.textContent = `Лучший счет: ${highScore}`;
        }

        // Обновляем частоту появления врагов и их скорости каждые 100 очков
        if (score > 0 && score % 25 === 0) {
            enemyFrequency = Math.max(1000, enemyFrequency - 10);
            bigEnemySpeed = Math.min(2, bigEnemySpeed + 0.1);
            mediumEnemySpeed = Math.min(3, mediumEnemySpeed + 0.1);
            smallEnemySpeed = Math.min(4, smallEnemySpeed + 0.1);
            updateStatsCounter();
        }
    }

    // Функция для обновления статистики
    function updateStatsCounter() {
        statsCounter.textContent = `Част: ${enemyFrequency}\nБиг: ${bigEnemySpeed.toFixed(1)}\nСред: ${mediumEnemySpeed.toFixed(1)}\nМал: ${smallEnemySpeed.toFixed(1)}`;
    }

    // Загружаем звуки
    const shotSound = new Audio('src/shot.mp3');
    shotSound.volume = 0.55; // Уменьшаем громкость на 45%
    const reloadSound = new Audio('src/reload.mp3');
    const endSound = new Audio('src/end.mp3');
    endSound.volume = 0.55;
    const enemySound = new Audio('src/enemy.mp3');
    const playerSound = new Audio('src/player.mp3');

    // Функция для создания звезды
    function createStar() {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        const size = Math.random() * 3 + 1; // Размер звезды от 1 до 4 пикселей
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.backgroundColor = 'white';
        star.style.borderRadius = '50%';

        // Случайное положение звезды в пикселях
        star.style.top = `${Math.random() * 500}px`;
        star.style.left = `${Math.random() * 700}px`;

        // Добавляем звезду в контейнер
        container.appendChild(star);

        // Анимация перемещения звезды
        function moveStar() {
            const speed = Math.random() * 0.5 + 0.5; // Скорость звезды
            let currentTop = parseFloat(star.style.top);
            currentTop += speed;
            star.style.top = `${currentTop}px`;

            // Если звезда вышла за пределы экрана, перемещаем её вверх
            if (currentTop > 500) {
                star.style.top = '0px';
                star.style.left = `${Math.random() * 700}px`;
            }

            requestAnimationFrame(moveStar);
        }

        moveStar();
    }

    // Создаем несколько звезд
    for (let i = 0; i < 200; i++) {
        createStar();
    }

    // Создаем синий квадрат (корабль)
    const player = document.createElement('div');
    player.style.position = 'absolute';
    player.style.width = '50px';
    player.style.height = '50px';
    player.style.backgroundColor = 'blue';
    player.style.top = '425px'; // Чуть выше нижней части экрана
    player.style.left = '325px'; // Центрируем по горизонтали
    container.appendChild(player);

    // Переменные для управления движением
    let isMovingLeft = false;
    let isMovingRight = false;
    let speed = 5; // Скорость движения
    let ammo = 10; // Количество патронов
    let isReloading = false; // Флаг перезарядки
    let canShoot = true; // Флаг для задержки между выстрелами
    let shootDelay = 750; // Задержка между выстрелами

    // Функция для управления движением квадрата
    function movePlayer() {
        let currentLeft = parseFloat(player.style.left);

        if (isMovingLeft && currentLeft > 0) {
            currentLeft -= speed;
        }
        if (isMovingRight && currentLeft < 650) {
            currentLeft += speed;
        }

        player.style.left = `${currentLeft}px`;
        requestAnimationFrame(movePlayer);
    }

    // Функция для стрельбы
    function shoot() {
        if (canShoot && ammo > 0 && !isReloading) {
            canShoot = false;
            shotSound.currentTime = 0; // Сбрасываем текущее время воспроизведения
            shotSound.play(); // Воспроизводим звук выстрела
            const bullet = document.createElement('div');
            bullet.style.position = 'absolute';
            bullet.style.width = '5px';
            bullet.style.height = '10px';
            bullet.style.backgroundColor = 'red';
            bullet.style.top = `${parseFloat(player.style.top) - 10}px`;
            bullet.style.left = `${parseFloat(player.style.left) + 22.5}px`;
            container.appendChild(bullet);

            // Анимация движения пули
            function moveBullet() {
                let currentTop = parseFloat(bullet.style.top);
                currentTop -= 5;
                bullet.style.top = `${currentTop}px`;

                // Проверка столкновений с врагами
                const enemies = document.querySelectorAll('.enemy');
                enemies.forEach(enemy => {
                    if (isCollision(bullet, enemy) && !enemy.classList.contains('boss')) {
                        container.removeChild(enemy);
                        container.removeChild(bullet);
                        enemySound.play(); // Воспроизводим звук при уничтожении врага
                        if (Math.random() < 0.1) {
                            createBonus(enemy);
                        }
                        // Начисляем очки за уничтожение врага
                        if (enemy.style.width === '60px') {
                            score += 10;
                        } else if (enemy.style.width === '50px') {
                            score += 15;
                        } else if (enemy.style.width === '40px') {
                            score += 25;
                        }
                        updateScoreCounter();

                        // Заменяем врага на enemy.gif
                        const enemyGif = document.createElement('img');
                        enemyGif.src = 'src/enemy.gif';
                        enemyGif.style.position = 'absolute';
                        enemyGif.style.width = enemy.style.width;
                        enemyGif.style.height = enemy.style.height;
                        enemyGif.style.top = enemy.style.top;
                        enemyGif.style.left = enemy.style.left;
                        container.appendChild(enemyGif);

                        // Анимация исчезновения enemy.gif
                        setTimeout(() => {
                            container.removeChild(enemyGif);
                        }, 500); // enemy.gif будет отображаться в течение 0.5 секунды
                    }
                });

                // Если пуля вышла за пределы экрана, удаляем её
                if (currentTop < 0) {
                    container.removeChild(bullet);
                } else {
                    requestAnimationFrame(moveBullet);
                }
            }

            moveBullet();
            ammo--;
            updateAmmoCounter();

            // Задержка между выстрелами
            setTimeout(() => {
                canShoot = true;
            }, shootDelay);
        } else if (ammo === 0 && !isReloading) {
            reload();
        }
    }

    // Функция для обновления счетчика патронов
    function updateAmmoCounter() {
        if (isReloading) {
            ammoCounter.textContent = 'Перезарядка';
        } else {
            ammoCounter.textContent = `Патроны: ${ammo}`;
        }
    }

    // Функция для перезарядки
    function reload() {
        if (!isReloading) {
            isReloading = true;
            reloadSound.play(); // Воспроизводим звук перезарядки
            ammoCounter.textContent = 'Перезарядка';
            setTimeout(() => {
                ammo = 10;
                isReloading = false;
                updateAmmoCounter();
            }, 3500);
        }
    }

    // Функция для создания врагов
    function createEnemy(type) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.style.position = 'absolute';

        switch (type) {
            case 'big':
                enemy.style.width = '60px';
                enemy.style.height = '60px';
                enemy.style.backgroundColor = 'brown';
                enemy.style.top = '-60px';
                enemy.style.left = `${Math.random() * 640}px`;
                enemy.speed = bigEnemySpeed; // Скорость большого врага
                break;
            case 'medium':
                enemy.style.width = '50px';
                enemy.style.height = '50px';
                enemy.style.backgroundColor = 'red';
                enemy.style.top = '-50px';
                enemy.style.left = `${Math.random() * 650}px`;
                enemy.speed = mediumEnemySpeed; // Скорость среднего врага
                break;
            case 'small':
                enemy.style.width = '40px';
                enemy.style.height = '40px';
                enemy.style.backgroundColor = 'orange';
                enemy.style.top = '-40px';
                enemy.style.left = `${Math.random() * 660}px`;
                enemy.speed = smallEnemySpeed; // Скорость маленького врага
                break;
            case 'boss':
                enemy.style.width = '80px';
                enemy.style.height = '80px';
                enemy.style.backgroundColor = 'gray';
                enemy.style.top = '-80px';
                enemy.style.left = `${Math.random() * 620}px`;
                enemy.speed = 3; // Скорость босса
                enemy.classList.add('boss'); // Добавляем класс для босса
                break;
        }

        container.appendChild(enemy);

        // Анимация движения врага
        function moveEnemy() {
            let currentTop = parseFloat(enemy.style.top);
            currentTop += enemy.speed;
            enemy.style.top = `${currentTop}px`;

            // Проверка столкновения с игроком
            if (isCollision(enemy, player)) {
                container.removeChild(enemy);
                container.removeChild(player);
                playerSound.play(); // Воспроизводим звук при уничтожении игрока

                // Заменяем игрока на player.gif
                const playerGif = document.createElement('img');
                playerGif.src = 'src/player.gif';
                playerGif.style.position = 'absolute';
                playerGif.style.width = '50px';
                playerGif.style.height = '50px';
                playerGif.style.top = player.style.top;
                playerGif.style.left = player.style.left;
                container.appendChild(playerGif);

                // Анимация исчезновения player.gif
                setTimeout(() => {
                    container.removeChild(playerGif);
                    alert(`Игра окончена: ваш счет: ${score}, лучший счет: ${highScore}`);
                    location.reload(); // Перезагружаем страницу
                }, 500); // player.gif будет отображаться в течение 0.5 секунды
            }

            // Если враг вышел за пределы экрана, удаляем его и начисляем очки
            if (currentTop > 500) {
                if (!enemy.classList.contains('destroyed')) {
                    endSound.play(); // Воспроизводим звук при достижении врагом конца экрана
                    if (enemy.classList.contains('boss')) {
                        score += 10;
                    } else {
                        score += 1;
                    }
                    updateScoreCounter();
                    enemy.classList.add('destroyed'); // Помечаем врага как уничтоженного
                }
                container.removeChild(enemy);
            } else {
                requestAnimationFrame(moveEnemy);
            }
        }

        moveEnemy();
    }

    // Функция для создания бонусов
    function createBonus(enemy) {
        const bonus = document.createElement('div');
        bonus.style.position = 'absolute';
        bonus.style.width = '15px';
        bonus.style.height = '15px';
        bonus.style.top = enemy.style.top;
        bonus.style.left = enemy.style.left;
        bonus.style.backgroundColor = 'yellow';
        container.appendChild(bonus);

        // Анимация движения бонуса
        function moveBonus() {
            let currentTop = parseFloat(bonus.style.top);
            currentTop += 2;
            bonus.style.top = `${currentTop}px`;

            // Проверка столкновения с игроком
            if (isCollision(bonus, player)) {
                container.removeChild(bonus);
                applyYellowBonus();
            } else if (currentTop > 500) {
                container.removeChild(bonus);
            } else {
                requestAnimationFrame(moveBonus);
            }
        }

        moveBonus();
    }

    // Функция для применения желтого бонуса
    function applyYellowBonus() {
        shootDelay = 250;
        ammo = 999;
        setTimeout(() => {
            shootDelay = 750;
            ammo = 10;
        }, 15000);
    }

    // Функция для проверки столкновений
    function isCollision(obj1, obj2) {
        const rect1 = obj1.getBoundingClientRect();
        const rect2 = obj2.getBoundingClientRect();
        return !(
            rect1.top > rect2.bottom ||
            rect1.bottom < rect2.top ||
            rect1.right < rect2.left ||
            rect1.left > rect2.right
        );
    }

    // Создаем врагов с интервалом
    function spawnEnemies() {
        const enemyType = ['big', 'medium', 'small', 'boss'][Math.floor(Math.random() * 4)];
        createEnemy(enemyType);
        setTimeout(spawnEnemies, enemyFrequency);
    }

    spawnEnemies();

    // Обработчики событий для клавиш
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            isMovingLeft = true;
        } else if (event.key === 'ArrowRight') {
            isMovingRight = true;
        } else if (event.key === 'ArrowUp') {
            shoot();
        } else if (event.key === 'ArrowDown') {
            reload();
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowLeft') {
            isMovingLeft = false;
        } else if (event.key === 'ArrowRight') {
            isMovingRight = false;
        }
    });

    // Запускаем анимацию движения
    movePlayer();
    updateAmmoCounter();
    updateScoreCounter();
    updateStatsCounter();
}
