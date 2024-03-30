<template>
  <div class="game">
    <div class="game-header">
      <div class="game-score">
        <span class="score-count">{{ score }}</span>
      </div>
    </div>
    <div class="canvas-wrapper">
      <canvas ref="canvas" class="game-canvas" width="320" height="400"></canvas>
    </div>
  </div>
</template>

<script setup>
import {reactive, ref, onMounted} from "vue";

let scoreBlock;
let score = ref(0);

const config = {
  step: 0,
  maxStep: 6,
  sizeCell: 16,
  sizeBerry: 16 / 4
}

const snake = reactive({
  x: 160,
  y: 160,
  dx: config.sizeCell,
  dy: 0,
  tails: [],
  maxTails: 3
});

const berry = reactive({
  x: 0,
  y: 0
});

const canvas = ref(null);
let context;

onMounted(() => {
  canvas.value = document.querySelector(".game-canvas");
  context = canvas.value.getContext("2d");
  scoreBlock = document.querySelector(".game-score .score-count");
  gameLoop();
});

const gameLoop = () => {
  if (!canvas.value) {
    // Если canvas еще не инициализирован, повторите попытку через короткое время
    requestAnimationFrame(gameLoop);
    return;
  }

  requestAnimationFrame(gameLoop);
  if (++config.step < config.maxStep) {
    return;
  }
  config.step = 0;

  context.clearRect(0, 0, canvas.value.width, canvas.value.height);

  drawBerry();
  drawSnake();
}

const drawSnake = () => {
  snake.x += snake.dx;
  snake.y += snake.dy;

  collisionBorder();

  snake.tails.unshift({x: snake.x, y: snake.y});

  if (snake.tails.length > snake.maxTails) {
    snake.tails.pop();
  }

  snake.tails.forEach((el, index) => {
    context.shadowOffsetY = 5; // Устанавливаем смещение тени по оси Y
    context.shadowColor = "rgb(160, 0, 52)"; // Устанавливаем цвет тени

    if (index == 0) {
      // Градиент для головы змеи
      context.fillStyle = "rgb(250, 5, 86)";
    } else {
      // Градиент для тела змеи
      const gradient = context.createLinearGradient(el.x, el.y, el.x + config.sizeCell, el.y + config.sizeCell);
      gradient.addColorStop(0, "rgb(160, 0, 52)");
      gradient.addColorStop(1, "rgb(210, 0, 70)");
      context.fillStyle = gradient;
    }

    // Рисуем квадрат
    context.fillRect(el.x, el.y, config.sizeCell, config.sizeCell);

    if (el.x === berry.x && el.y === berry.y) {
      snake.maxTails++;
      incScore();
      randomPositionBerry();
    }

    for (let i = index + 1; i < snake.tails.length; i++) {
      if (el.x == snake.tails[i].x && el.y == snake.tails[i].y) {
        refreshGame();
      }
    }
  });

  // Сбрасываем смещение тени
  context.shadowOffsetY = 0;
}

const drawBerry = () => {
  context.beginPath();
  context.fillStyle = "#A00034";
  context.arc(
      berry.x + config.sizeCell / 2,
      berry.y + config.sizeCell / 2,
      config.sizeBerry,
      0,
      2 * Math.PI
  );
  context.fill();

  // Сбрасываем смещение тени
  context.shadowOffsetY = 0;
}



const collisionBorder = () => {
  if (snake.x < 0) {
    snake.x = canvas.value.width - config.sizeCell;
  } else if (snake.x >= canvas.value.width) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.value.height - config.sizeCell;
  } else if (snake.y >= canvas.value.height) {
    snake.y = 0;
  }
}

const refreshGame = () => {
  score.value = 0;
  drawScore();

  snake.x = 160;
  snake.y = 160;
  snake.tails = [];
  snake.maxTails = 3;
  snake.dx = config.sizeCell;
  snake.dy = 0;

  randomPositionBerry();
}



const randomPositionBerry = () => {
  berry.x = getRandomInt(0, canvas.value.width / config.sizeCell) * config.sizeCell;
  berry.y = getRandomInt(0, canvas.value.height / config.sizeCell) * config.sizeCell;
}

const incScore = () => {
  score.value++;
  drawScore();
}

const drawScore = () => {
  scoreBlock.innerHTML = score.value;
}

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}
document.addEventListener("keydown", (e) => {
  if (e.code == "ArrowUp" && snake.dy !== config.sizeCell) {
    snake.dy = -config.sizeCell;
    snake.dx = 0;
  } else if (e.code == "ArrowLeft" && snake.dx !== config.sizeCell) {
    snake.dx = -config.sizeCell;
    snake.dy = 0;
  } else if (e.code == "ArrowDown" && snake.dy !== -config.sizeCell) {
    snake.dy = config.sizeCell;
    snake.dx = 0;
  } else if (e.code == "ArrowRight" && snake.dx !== -config.sizeCell) {
    snake.dx = config.sizeCell;
    snake.dy = 0;
  }
});
document.addEventListener("touchstart", handleTouchStart, { passive: false });
document.addEventListener("touchmove", handleTouchMove, { passive: false });
document.addEventListener("touchend", handleTouchEnd, { passive: false });


let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
  event.preventDefault();
  touchEndX = event.touches[0].clientX;
  touchEndY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  // Обработка горизонтального свайпа
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0 && snake.dx !== -config.sizeCell) {
      // Свайп вправо
      snake.dx = config.sizeCell;
      snake.dy = 0;
    } else if (deltaX < 0 && snake.dx !== config.sizeCell) {
      // Свайп влево
      snake.dx = -config.sizeCell;
      snake.dy = 0;
    }
  }
  // Обработка вертикального свайпа
  else {
    if (deltaY > 0 && snake.dy !== -config.sizeCell) {
      // Свайп вниз
      snake.dy = config.sizeCell;
      snake.dx = 0;
    } else if (deltaY < 0 && snake.dy !== config.sizeCell) {
      // Свайп вверх
      snake.dy = -config.sizeCell;
      snake.dx = 0;
    }
  }
}

</script>

<style scoped>
.game {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 90vh;
  background-color: #f0f0f0;
}

.game-header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px 0;
  background-color: #333;
  color: #fff;
  font-size: 24px;
}

.game-score {
  margin-right: 10px;
}

.game-canvas {
  border: 2px solid #333;
  background-color: #fff;
}

.canvas-wrapper {
  margin-top: 20px;
}
</style>
