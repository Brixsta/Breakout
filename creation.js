import * as index from "./index.js";
import * as classes from "./classes.js";

export function drawBackground() {
  let bg = index.global.bgImg;
  if (index.global.level === 1) bg.src = "./bg1.png";
  if (index.global.level === 2) bg.src = "./bg2.png";
  if (index.global.level === 3) bg.src = "./bg3.png";
  const pattern = index.ctx.createPattern(bg, "repeat");
  index.ctx.fillStyle = pattern;
  index.ctx.fillRect(0, 0, index.canvas.width, index.canvas.height);
}

export function drawEdges() {
  // change edge picture when level changes
  if (index.global.level === 1) index.global.edgeImg.src = "./edge1.png";
  if (index.global.level === 2) index.global.edgeImg.src = "./edge2.png";
  if (index.global.level === 3) index.global.edgeImg.src = "./edge3.png";

  index.ctx.strokeStyle = "rgba(0,0,0,.5)";
  const edge = index.global.edgeSize;
  const pattern = index.ctx.createPattern(index.global.edgeImg, "repeat");
  index.ctx.fillStyle = pattern;

  // top edge
  index.ctx.fillRect(0, 0, index.canvas.width, edge);

  // left edge
  index.ctx.fillRect(0, 0, edge, index.canvas.height);
  if (index.global.level === 1)
    index.ctx.strokeRect(edge, edge, 0.0625, index.canvas.height);

  // right edge
  index.ctx.fillRect(
    index.canvas.width - edge,
    0,
    index.canvas.width,
    index.canvas.height
  );
  if (index.global.level === 1) {
    index.ctx.strokeRect(
      index.canvas.width - edge,
      edge,
      0.0625,
      index.canvas.height
    );
  }
}

export function createMap() {
  const ROWS = index.global.ROWS;
  const COLS = index.global.COLS;
  const map = index.global.map;
  for (let i = 0; i < ROWS * COLS; i++) {
    let random = Math.floor(Math.random() * 3);
    if (random > 0) map.push(true);
    else map.push(false);
    map.push(true);
  }
}

export function createBricks() {
  const map = index.global.map;
  const bricks = index.global.bricks;
  const ROWS = index.global.ROWS;
  const COLS = index.global.COLS;
  let BRICK_HEIGHT = index.global.BRICK_HEIGHT;
  let BRICK_WIDTH = index.global.BRICK_WIDTH;
  BRICK_HEIGHT += 2;
  BRICK_WIDTH += 2;

  const edge = index.global.edgeSize;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      let index = ROWS * row + col;
      if (map[index]) {
        let random = Math.floor(Math.random() * 10);
        const brick = new classes.Brick(
          col * BRICK_WIDTH + 2 + edge,
          row * BRICK_HEIGHT + 1 + edge,
          BRICK_WIDTH - 2,
          BRICK_HEIGHT - 2
        );
        if (random >= 0 && random <= 5) {
          brick.health = 1;
        } else if (random >= 6 && random < 9) {
          brick.health = 2;
        } else if (random === 9) {
          brick.health = 3;
        }
        bricks.push(brick);
      }
    }
  }
}
