// Canvas and context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const gameWidth = canvas.width;
const gameHeight = canvas.height;
let gameRunning = true;
let gameStarted = false;

// Paddle properties
const paddleHeight = 80;
const paddleWidth = 10;
const paddleSpeed = 6;

// Player paddle (left)
const player = {
    x: 10,
    y: gameHeight / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    score: 0
};

// Computer paddle (right)
const computer = {
    x: gameWidth - paddleWidth - 10,
    y: gameHeight / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    score: 0
};

// Ball properties
const ball = {
    x: gameWidth / 2,
    y: gameHeight / 2,
    radius: 6,
    dx: 5,
    dy: 5,
    speed: 5
};

// Input handling
const keys = {};

// Arrow keys
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    if (e.key === ' ') {
        e.preventDefault();
        gameStarted = !gameStarted;
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mouse movement
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    
    // Move paddle to mouse position
    player.y = mouseY - paddleHeight / 2;
    
    // Keep paddle in bounds
    if (player.y < 0) player.y = 0;
    if (player.y + paddleHeight > gameHeight) {
        player.y = gameHeight - paddleHeight;
    }
});

// Update game state
function update() {
    if (!gameStarted) return;

    // Move player paddle with arrow keys
    if (keys['ArrowUp'] && player.y > 0) {
        player.y -= paddleSpeed;
    }
    if (keys['ArrowDown'] && player.y < gameHeight - paddleHeight) {
        player.y += paddleSpeed;
    }

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > gameHeight) {
        ball.dy = -ball.dy;
        // Clamp ball position
        ball.y = ball.y - ball.radius < 0 ? ball.radius : gameHeight - ball.radius;
    }

    // Ball collision with left and right walls (reset ball)
    if (ball.x - ball.radius < 0) {
        computer.score++;
        resetBall();
    }
    if (ball.x + ball.radius > gameWidth) {
        player.score++;
        resetBall();
    }

    // Ball collision with paddles
    checkPaddleCollision(player);
    checkPaddleCollision(computer);

    // Computer AI
    moveComputerPaddle();

    // Update scoreboard
    document.getElementById('playerScore').textContent = player.score;
    document.getElementById('computerScore').textContent = computer.score;
}

// Check collision between ball and paddle
function checkPaddleCollision(paddle) {
    // Check if ball is in the paddle's horizontal range
    if (
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.x + ball.radius > paddle.x &&
        ball.y > paddle.y &&
        ball.y < paddle.y + paddle.height
    ) {
        // Reverse ball direction
        ball.dx = -ball.dx;
        
        // Add some variation based on where the ball hits the paddle
        const collidePoint = ball.y - (paddle.y + paddle.height / 2);
        collidePoint / (paddle.height / 2);
        ball.dy = collidePoint * 5;

        // Ensure ball doesn't get stuck in paddle
        ball.x = paddle.x < gameWidth / 2 
            ? paddle.x + paddle.width + ball.radius 
            : paddle.x - ball.radius;

        // Increase ball speed slightly
        ball.speed = Math.min(8, ball.speed + 0.5);
        updateBallSpeed();
    }
}

// Computer AI
function moveComputerPaddle() {
    const computerCenter = computer.y + computer.height / 2;
    const ballCenter = ball.y;

    if (computerCenter < ballCenter - 35) {
        computer.y += paddleSpeed * 0.7;
    } else if (computerCenter > ballCenter + 35) {
        computer.y -= paddleSpeed * 0.7;
    }

    // Keep computer paddle in bounds
    if (computer.y < 0) computer.y = 0;
    if (computer.y + computer.height > gameHeight) {
        computer.y = gameHeight - computer.height;
    }
}

// Reset ball to center
function resetBall() {
    ball.x = gameWidth / 2;
    ball.y = gameHeight / 2;
    ball.speed = 5;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() - 0.5) * ball.speed;
}

// Update ball speed
function updateBallSpeed() {
    const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    ball.dx = (ball.dx / speed) * ball.speed;
    ball.dy = (ball.dy / speed) * ball.speed;
}

// Draw functions
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawMiddleLine() {
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(gameWidth / 2, 0);
    ctx.lineTo(gameWidth / 2, gameHeight);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    drawRect(0, 0, gameWidth, gameHeight, '#000');

    // Draw middle line
    drawMiddleLine();

    // Draw paddles
    drawRect(player.x, player.y, player.width, player.height, '#00ff88');
    drawRect(computer.x, computer.y, computer.width, computer.height, '#ff006e');

    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, '#fff');

    // Draw start/pause message
    if (!gameStarted) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press SPACE to start', gameWidth / 2, gameHeight / 2);
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
