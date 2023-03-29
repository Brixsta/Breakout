import * as index from "./index.js";

export class Paddle {
  constructor() {
    this.width = 150;
    this.height = 25;
    this.y = index.canvas.height - 50;
    this.x = index.canvas.width / 2 - this.width / 2;
    this.color = "purple";
  }

  draw() {
    index.ctx.strokeStyle = "black";
    const edge = index.global.edgeSize;
    if (this.x < edge) this.x = edge;
    if (this.x > index.canvas.width - this.width - edge)
      this.x = index.canvas.width - this.width - edge;

    const gradient = index.ctx.createLinearGradient(
      this.x,
      this.y,
      this.x,
      this.y + this.height
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.5, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(255,255,255,1)");

    index.ctx.fillStyle = gradient;

    // draw the outline of the saucer
    index.ctx.lineWidth = 3;
    index.ctx.beginPath();
    index.ctx.strokeRect(this.x, this.y, this.width, this.height);

    index.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  detectBallCollision() {
    const ball = index.ball;
    const centerOfPaddle = this.x + this.width / 2;
    let distFromCenter;

    if (
      ball.x > this.x &&
      ball.x < this.x + this.width &&
      ball.y > this.y &&
      ball.y < this.y + this.height
    ) {
      // play bounce sound
      const bounce = new Audio("./bounce.mp3");
      bounce.play();
      bounce.volume = 0.5;

      // hits further from the center cause a greater xVelocity
      distFromCenter = centerOfPaddle - ball.x;
      ball.yVelocity *= -1;
      ball.xVelocity = distFromCenter * -0.25;
    }
  }

  update() {
    this.draw();
    this.detectBallCollision();
  }
}

export class Ball {
  constructor() {
    this.x = index.canvas.width / 2;
    this.y = index.canvas.height / 2 - 100;
    this.radius = 10;
    this.xVelocity = -5;
    this.yVelocity = 7;
    this.color = "white";
  }

  draw() {
    index.ctx.fillStyle = this.color;
    index.ctx.beginPath();
    index.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    index.ctx.stroke();
    index.ctx.fill();
  }

  move() {
    const edge = index.global.edgeSize;
    this.x += this.xVelocity;
    this.y += this.yVelocity;

    if (this.x > index.canvas.width - this.radius - edge) this.xVelocity *= -1;
    if (this.x < edge + this.radius) this.xVelocity *= -1;
    if (this.y < this.radius + edge) this.yVelocity *= -1;

    // player dies by falling vertically off the edge
    if (this.y > index.canvas.height && index.global.inPlay) {
      index.decrementLives();
      const died = new Audio("./died.mp3");
      died.volume = 0.05;
      died.play();
      index.global.inPlay = false;
      index.createCountdownContainer("Respawning..");
      index.restoreBallDefaults();
      this.yVelocity *= -1;
    }

    // stops the ball from getting stuck at the top
    if (this.y < edge + this.radius) this.y = edge + this.radius;

    // stops ball from getting stuck on left
    if (this.x < edge) this.x = edge + this.radius;

    // stops ball from getting stuck on right
    if (this.x > index.canvas.width - edge)
      this.x = index.canvas.width - edge - this.radius;
  }

  update() {
    if (index.global.inPlay) {
      this.draw();
      this.move();
    }
  }
}

export class Brick {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = "blue";
    this.health = null;
    this.alive = true;
  }

  draw() {
    if (this.alive) {
      let gradient;
      index.ctx.strokeStyle = "black";
      if (this.color === "orange") {
        gradient = index.ctx.createLinearGradient(
          this.x,
          this.y,
          this.x,
          this.y + this.height
        );
        gradient.addColorStop(0, "orangered");
        gradient.addColorStop(0.5, "orange");
        gradient.addColorStop(1, "orangered");
        index.ctx.fillStyle = gradient;
      } else if (this.color === "red") {
        gradient = index.ctx.createLinearGradient(
          this.x,
          this.y,
          this.x,
          this.y + this.height
        );
        gradient.addColorStop(0, "darkred");
        gradient.addColorStop(0.5, "red");
        gradient.addColorStop(1, "darkred");
        index.ctx.fillStyle = gradient;
      } else if (this.color === "white") {
        gradient = index.ctx.createLinearGradient(
          this.x,
          this.y,
          this.x,
          this.y + this.height
        );
        gradient.addColorStop(0, "darkgray");
        gradient.addColorStop(0.5, "whitesmoke");
        gradient.addColorStop(1, "darkgray");
        index.ctx.fillStyle = gradient;
      }
      index.ctx.strokeRect(this.x, this.y, this.width, this.height);
      index.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  detectBallCollision() {
    const ball = index.ball;
    if (
      ball.x + ball.radius > this.x &&
      ball.x < this.x + this.width &&
      ball.y + ball.radius > this.y &&
      ball.y < this.y + this.height + ball.radius &&
      this.alive
    ) {
      this.decrementHealth();
      this.checkAllBricksGone();
      const tink = new Audio("./tink.mp3");
      tink.play();
      tink.volume = 0.35;
      ball.yVelocity *= -1;
      index.global.score += 25;
      index.incrementScore();
    }
  }

  decrementHealth() {
    this.health--;
    if (this.health === 0) this.alive = false;
  }

  changeColor() {
    if (this.health === 3) this.color = "red";
    if (this.health === 2) this.color = "orange";
    if (this.health === 1) this.color = "white";
  }

  checkAllBricksGone() {
    const bricks = index.global.bricks.filter((brick) => brick.alive);

    if (bricks.length === 0) {
      index.incrementLevel();
    }
  }

  update() {
    this.draw();
    this.detectBallCollision();
    this.changeColor();
  }
}

export class Portal {
  constructor() {
    this.count = 0;
    this.interval = 300;
  }
  draw() {
    const edgeSize = index.global.edgeSize;
    const portalImg = index.global.portalImg;
    portalImg.src = "./portal.png";
    const pattern = index.ctx.createPattern(portalImg, "repeat");
    index.ctx.fillStyle = pattern;
    index.ctx.fillRect(0, 224, edgeSize, 128);
  }

  openPortal() {
    this.count++;
    if (this.count === this.interval) {
      this.count = 0;
      const opening1 = new PortalOpening("up");
      const opening2 = new PortalOpening("down");
      index.global.portalOpenings.push(opening1);
      index.global.portalOpenings.push(opening2);
    }
  }

  update() {
    this.draw();
    this.openPortal();
  }
}

class PortalOpening {
  constructor(direction) {
    this.x = 0;
    this.y = 288;
    this.width = 32;
    this.height = 0;
    this.direction = direction;
    this.velocity = 0.25;
  }

  draw() {
    index.ctx.fillStyle = "black";
    index.ctx.fillRect(this.x, this.y, this.width, this.height);

    if (this.direction === "down") this.height += this.velocity;
    if (this.direction === "up") this.height -= this.velocity;

    if (Math.abs(this.height) > 64) {
      this.velocity = 0;
    }
  }

  update() {
    if (index.global.inPlay && index.global.lives > 0) this.draw();
  }
}
