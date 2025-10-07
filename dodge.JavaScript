const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 50,
  width: 50,
  height: 50,
  speed: 5,
  color: 'lime'
};

let keys = {};
let blocks = [];
let score = 0;
let gameOver = false;

// Listen for arrow keys
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

// Create falling blocks
function spawnBlock() {
  const size = Math.random() * 30 + 20;
  blocks.push({
    x: Math.random() * (canvas.width - size),
    y: 0,
    width: size,
    height: size,
    color: 'red',
    speed: Math.random() * 3 + 2
  });
}

// Collision detection
function isColliding(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

// Game loop
function update() {
  if (gameOver) return;

  // Move player
  if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
  if (keys['ArrowRight'] && player.x + player.width < canvas.width) player.x += player.speed;

  // Update blocks
  for (let i = blocks.length - 1; i >= 0; i--) {
    blocks[i].y += blocks[i].speed;

    if (isColliding(player, blocks[i])) {
      gameOver = true;
      alert(`Game Over! Your score: ${score}`);
      return;
    }

    if (blocks[i].y > canvas.height) {
      blocks.splice(i, 1);
      score++;
    }
  }

  // Occasionally spawn new blocks
  if (Math.random() < 0.02) spawnBlock();

  draw();
  requestAnimationFrame(update);
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw blocks
  blocks.forEach(block => {
    ctx.fillStyle = block.color;
    ctx.fillRect(block.x, block.y, block.width, block.height);
  });

  // Draw score
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Start the game
update();
