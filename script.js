const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Base64 car images
const carImg = new Image();
carImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAQCAYAAADNo/U5AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAL/wAAC/8BKkn61AAAAAd0SU1FB+UIHQcUBGQovgQAAABoSURBVCjPY/j//z8DJYARwDHBhFBBYgzgYBTBLFf9H1gAE6HwEMg2LCJ0AcSm+IkGAAogFgBiGYSEI2xgDJlBUbqKTDpxgIDgiySMJ8QFYpSmAWhpB9gM6DqhKcN5DgAEBAC3iw7tVRi93AAAAAElFTkSuQmCC";

const enemyImg = new Image();
enemyImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAQCAYAAADNo/U5AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAL/wAAC/8BKkn61AAAAAd0SU1FB+UIHQgXFFU/mg8AAABmSURBVCjPY/j//z8DJYARwDHBhFBBYgzgYBTBLFf9H1gAE6HwEMg2LCJ0AcSm+IkGAAogFgBiGYSEI2xgDJlBUbqKTDpxgIDgiySMJ8QFYpSmAWhpB9gM6DqhKcN5DgAECALg8zvhnSlZsAAAAAElFTkSuQmCC";

let car = { x: 180, y: 500, width: 40, height: 80 };
let enemyCars = [];
let score = 0;
let muted = false;

// Draw car image
function drawCarImage(img, x, y) {
  ctx.drawImage(img, x, y, 40, 80);
}

// Spawn enemy
function spawnEnemyCar() {
  let x = Math.floor(Math.random() * 360);
  enemyCars.push({ x: x, y: -80 });
}

// Game loop
function update() {
  ctx.fillStyle = "#555";
  ctx.fillRect(0, 0, canvas.width, canvas.height); // road color

  drawCarImage(carImg, car.x, car.y);

  enemyCars.forEach((enemy, index) => {
    enemy.y += 5;
    drawCarImage(enemyImg, enemy.x, enemy.y);

    // Collision detection
    if (
      car.x < enemy.x + 40 &&
      car.x + 40 > enemy.x &&
      car.y < enemy.y + 80 &&
      car.y + 80 > enemy.y
    ) {
      speak("Car ahead! Slow down!");
      alert("Game Over! Score: " + score);
      resetGame();
    }

    if (enemy.y > 600) {
      enemyCars.splice(index, 1);
      score++;
      document.getElementById('score').innerText = "Score: " + score;
      if (score % 5 === 0) speak("Great driving!");
    }
  });

  requestAnimationFrame(update);
}

function resetGame() {
  enemyCars = [];
  score = 0;
  car.x = 180;
  document.getElementById('score').innerText = "Score: 0";
}

// Voice
function speak(message) {
  if (muted) return;
  document.getElementById('voiceMessage').innerText = "AI: " + message;
  let utterance = new SpeechSynthesisUtterance(message);
  speechSynthesis.speak(utterance);
}

// Controls
document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowLeft" && car.x > 0) car.x -= 20;
  if (e.key === "ArrowRight" && car.x < 360) car.x += 20;
});

// Touch controls
canvas.addEventListener('touchstart', function (e) {
  let touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
  if (touchX < car.x) {
    car.x -= 20;
  } else {
    car.x += 20;
  }
});

// Mute toggle
document.getElementById('muteButton').addEventListener('click', () => {
  muted = !muted;
  document.getElementById('muteButton').innerText = muted ? "Unmute" : "Mute";
});

// Spawn cars every 1.5s
setInterval(spawnEnemyCar, 1500);

update();
