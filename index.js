import * as classes from "./classes.js";
import * as creation from "./creation.js";
export const canvas = document.getElementById("game");
export const ctx = canvas.getContext("2d");
const startGameButton = document.querySelector(".start-game-button");

export const global = {
  level: 1,
  score: 0,
  lives: 1,
  inPlay: false,
  theme: new Audio("./theme.mp3"),
  edgeSize: 32,
  BRICK_WIDTH: 89.8,
  BRICK_HEIGHT: 18,
  map: [],
  bricks: [],
  portalOpenings: [],
  ROWS: 8,
  COLS: 8,
  bgImg: new Image(),
  edgeImg: new Image(),
  portalImg: new Image(),
};

window.addEventListener("mousemove", handleMouseMove);
startGameButton.addEventListener("click", handleStartGameButtonClick);

function handleStartGameButtonClick() {
  startGameButton.removeEventListener("click", handleStartGameButtonClick);
  createCountdownContainer("Game is Starting");
  creation.createMap();
  creation.createBricks();
  animate();
}

function handleMouseMove(e) {
  const rect = canvas.getBoundingClientRect();
  const root = document.documentElement;
  const x = e.clientX - rect.left - root.scrollLeft;
  paddle.x = x - paddle.width / 2;
}

export function decrementLives() {
  console.log(global.lives);
  global.lives--;
  if (global.lives === 0) gameOver();
  const livesContainerTitle = document.querySelector(".lives-container-title");
  livesContainerTitle.innerText = `Lives: ${global.lives}`;
}

function gameOver() {
  const audio = new Audio("./gameover.mp3");
  audio.volume = 0.2;
  audio.play();
  console.log("GAME OVER");
  global.theme.pause();
  createGameOverContainer();
}

function createGameOverContainer() {
  const exists = document.querySelector(".game-over-container");
  if (!exists) {
    const gameOverContainer = document.createElement("div");
    gameOverContainer.classList.add("game-over-container");
    const canvasContainer = document.querySelector(".canvas-container");
    canvasContainer.appendChild(gameOverContainer);
    const gameOverContainerTitle = document.createElement("span");
    gameOverContainerTitle.classList.add("game-over-container-title");
    gameOverContainerTitle.innerText = `Game Over`;
    gameOverContainer.appendChild(gameOverContainerTitle);
    const gameOverScoreContainer = document.createElement("div");
    gameOverScoreContainer.classList.add("game-over-score-container");
    gameOverContainer.appendChild(gameOverScoreContainer);
    const gameOverScoreHeader = document.createElement("span");
    gameOverScoreHeader.classList.add("game-over-score-header");
    gameOverScoreHeader.innerText = `Score: ${global.score}`;
    gameOverScoreContainer.appendChild(gameOverScoreHeader);
    const replayButtonContainer = document.createElement("div");
    replayButtonContainer.classList.add("replay-button-container");
    gameOverContainer.appendChild(replayButtonContainer);
    const replayButton = document.createElement("button");
    replayButton.classList.add("replay-button");
    replayButton.innerText = "Replay";
    replayButtonContainer.appendChild(replayButton);

    replayButton.addEventListener("click", handleReplayButtonClick);
  }
}

function handleReplayButtonClick() {
  const replayButton = document.querySelector(".replay-button");
  replayButton.removeEventListener("click", handleReplayButtonClick);
  const gameOverContainer = document.querySelector(".game-over-container");
  gameOverContainer.remove();
  restartGame();
}

function restartGame() {
  global.level = 1;
  global.score = 0;
  global.lives = 1;
  global.inPlay = false;
  global.theme.currentTime = 0;
  global.map = [];
  global.bricks = [];
  global.portalOpenings = [];
  global.ROWS = 8;
  global.COLS = 8;
  creation.createMap();
  creation.createBricks();
  const livesContainerTitle = document.querySelector(".lives-container-title");
  livesContainerTitle.innerText = `Lives: ${global.lives}`;
  createCountdownContainer("Game is Starting");
}

export function restoreBallDefaults() {
  let randomXVelocity = [-5, 5];
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2 - 100;
  ball.xVelocity =
    randomXVelocity[Math.floor(Math.random() * randomXVelocity.length)];
  ball.yVelocity = 7;
  ball.yVelocity *= -1;
}

function drawConsole() {
  const exists = document.querySelector(".console");
  if (!exists) {
    const canvasContainer = document.querySelector(".canvas-container");
    const console = document.createElement("div");
    const scoreContainer = document.createElement("div");
    const scoreContainerTitle = document.createElement("span");
    scoreContainer.appendChild(scoreContainerTitle);
    scoreContainerTitle.innerText = `Score: ${global.score}`;
    scoreContainerTitle.classList.add("score-container-title");
    scoreContainer.classList.add("score-container");
    console.appendChild(scoreContainer);
    const levelContainer = document.createElement("div");
    const levelContainerTitle = document.createElement("span");
    levelContainerTitle.classList.add("level-container-title");
    levelContainer.appendChild(levelContainerTitle);
    levelContainer.classList.add("level-container");
    levelContainerTitle.innerText = `Level: ${global.level}`;
    console.appendChild(levelContainer);
    const livesContainer = document.createElement("div");
    livesContainer.classList.add("lives-container");
    const livesContainerTitle = document.createElement("span");
    livesContainerTitle.classList.add("lives-container-title");
    livesContainerTitle.innerText = `Lives: ${global.lives}`;
    console.appendChild(livesContainer);
    livesContainer.appendChild(livesContainerTitle);
    console.classList.add("console");
    canvasContainer.appendChild(console);
  }
}

export function createCountdownContainer(str) {
  const lives = global.lives;
  if (lives > 0) {
    const canvasContainer = document.querySelector(".canvas-container");
    canvasContainer.classList.add("canvas-container");
    const countdownContainer = document.createElement("div");
    countdownContainer.classList.add("countdown-container");
    canvasContainer.appendChild(countdownContainer);
    const countdownHeader = document.createElement("span");
    countdownHeader.classList.add("countdown-header");
    countdownHeader.innerText = str;
    countdownContainer.appendChild(countdownHeader);
    const countdownText = document.createElement("span");
    countdownText.classList.add("countdown-text");
    countdownText.innerText = "3";
    countdownContainer.appendChild(countdownText);
    createCountdown();
  }
}

export function incrementScore() {
  const scoreContainerTitle = document.querySelector(".score-container-title");
  scoreContainerTitle.innerText = `Score: ${global.score}`;
}

export function incrementLevel() {
  creation.createMap();
  creation.createBricks();
  global.inPlay = false;
  global.level++;
  const levelContainerTitle = document.querySelector(".level-container-title");
  levelContainerTitle.innerText = `Level: ${global.level}`;
  restoreBallDefaults();
  createCountdownContainer(`Level ${global.level} Starting`);
}

function createCountdown() {
  const countdownContainer = document.querySelector(".countdown-container");
  const countdownText = document.querySelector(".countdown-text");
  const start = new Audio("./start.mp3");
  const beep = new Audio("./beep.mp3");
  global.theme.play();
  global.theme.volume = 0.2;
  global.theme.loop = true;
  beep.volume = 0.2;
  beep.play();
  setTimeout(() => {
    countdownText.innerText = "2";
    beep.play();
  }, 1000);

  setTimeout(() => {
    countdownText.innerText = "1";
    beep.play();
  }, 2000);

  setTimeout(() => {
    countdownContainer.classList.add("disappear");
  }, 3000);

  setTimeout(() => {
    start.play();
  }, 3600);

  setTimeout(() => {
    countdownContainer.remove();
    global.inPlay = true;
  }, 4000);
}

const paddle = new classes.Paddle();
export const ball = new classes.Ball();

const portal = new classes.Portal();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConsole();
  creation.drawBackground();
  creation.drawEdges();
  portal.update();
  global.portalOpenings.forEach((opening) => opening.update());
  paddle.update();
  global.bricks.forEach((brick) => brick.update());
  ball.update();
  window.requestAnimationFrame(animate);
}
