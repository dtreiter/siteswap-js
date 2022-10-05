/* The number of frames between each throw. */
const FRAME_RATE    =  30;
const TOSS_DURATION =   8;
const TOSS_WIDTH    = 180;
const BALL_SIZE     =  10;
const GRAVITY       = .98;
const DEFAULT_PATTERN = "97531";

/**
* Enum for possible hands.
* @readonly
* @enum {number}
*/
const Hand = {
  "RIGHT" : 0,
  "LEFT"  : 1
};

function getArrayMax(numArray) {
  return Math.max.apply(null, numArray);
}

class Siteswap {
  constructor(graphic, tosses) {
    this.graphic = graphic;
    this.tosses = tosses;

    /* Used to go through the tosses array. */
    this.nextToss = 0;
    /* Used to go through the site queue. */
    this.curSite = 0;
    this.period = this.tosses.length;

    /* The number of balls is the average of the tosses. */
    this.numBalls = this.tosses.reduce((a, b) => a + b) / this.tosses.length;
    this.numSites = getArrayMax(this.tosses);
    this.balls = new Array();

    /* Initialize the whole sites queue to zeros. */
    for (let i = 0; i < this.numSites; i++) {
      this.balls.push(0);
    }

    /* Initialize each ball. */
    let hand;
    let ballX;
    const ballY = 20;
    for (let i = 0; i < this.numBalls; i++) {
      if (i % 2 == 1) {
        ballX = (this.graphic.w - TOSS_WIDTH) / 2;
        hand = Hand.LEFT;
      }
      else {
        ballX = (this.graphic.w + TOSS_WIDTH) / 2;
        hand = Hand.RIGHT;
      }
      this.balls[i] = new Ball(this.graphic, ballX, ballY, BALL_SIZE, hand, "#ff0000");
    }
  }

  toss() {
    /* When a ball gets tossed, it gets moved ahead in the balls array
       according to the toss number. The balls array wraps around using
       modulo numSites. */
    const toss = this.tosses[this.nextToss];
    const ball = this.balls[this.curSite];
    if (ball == 0) {
      /* No ball at this site. */
      return;
    }

    /* Calculate velocities for ball. */
    /* For dx we check to see if toss is odd or even to determine if the
       ball changes sides. */
    let dx;
    if (toss % 2 == 0) {
      dx = 0;
    }
    else if (ball.hand == Hand.RIGHT) {
      dx = -TOSS_WIDTH / (toss * TOSS_DURATION);
      ball.hand = Hand.LEFT;
    }
    else if (ball.hand == Hand.LEFT) {
      dx = TOSS_WIDTH / (toss * TOSS_DURATION);
      ball.hand = Hand.RIGHT;
    }
    let dy = toss * 0.5 * GRAVITY * TOSS_DURATION;

    ball.toss(dx, dy);

    /* Update the balls array. */
    const nextSite = (this.curSite + toss) % this.numSites;
    /* Only update if the ball swapped sites. */
    if (nextSite != this.curSite) {
      this.balls[nextSite] = ball;
      this.balls[this.curSite] = 0;
    }

    this.nextToss = (this.nextToss + 1) % this.period;
    this.curSite  = (this.curSite  + 1) % this.numSites;
  }

  update() {
    this.balls.forEach(ball => {
      /* TODO This is ugly. */
      if (ball != 0) {
        ball.update();
      }
    });
  }

  draw() {
    this.balls.forEach(ball => {
      if (ball != 0) {
        ball.draw();
      }
    });
  }
}

class Graphic {
  canvas = document.getElementById("animator");
  context = this.canvas.getContext("2d");
  w = this.canvas.width;
  h = this.canvas.height;

  clear() {
    this.context.clearRect(0, 0, this.w, this.h);
  }

  fillCircle(x, y, r, color) {
    const graphicY = this.h - y;
    this.context.beginPath();
    this.context.arc(x, graphicY, r, 0, 2*Math.PI);
    this.context.fillStyle = color;
    this.context.fill();
  }
}

class Ball {
  decay = 0.4;
  dx = 0;
  dy = 0;
  ddy = -GRAVITY;

  constructor(graphic, x, y, r, hand, color) {
    this.graphic = graphic;
    this.x = x;
    this.y = y;
    this.r = r;
    this.hand = hand;
    this.color = color;
  }

  update() {
    /* Gravity */
    this.dy += this.ddy;

    let newX = this.x + this.dx;
    let newY = this.y + this.dy;

    if (newX - this.r < 0 || newX + this.r > this.graphic.w) {
        this.dx = -this.decay * this.dx;
        newX = this.x + this.dx;
    }
    if (newY - this.r < 0 || newY + this.r > this.graphic.h) {
        this.dy = -this.decay * this.dy;
        newY = this.y + this.dy;
    }

    /* Keep the ball from bouncing forever. */
    if (newY < this.r+2 && Math.abs(this.dy) < 3) newY = this.r;
    if (newY < this.r+2 && Math.abs(this.dx) < 3) newX = this.x;
    
    this.x = newX;
    this.y = newY;
  }

  toss(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }

  draw() {
    this.graphic.fillCircle(this.x, this.y, this.r, this.color);
  }
}

class Animator {
  #tosses = DEFAULT_PATTERN;
  #graphic = new Graphic();
  /* Represents the pattern as an array of numeral values. */
  #siteswap = undefined;
  /* Used to call siteswap.toss every TOSS_DURATION number of frames. */
  #loopNum = 0;

  constructor() {
    this.setPattern(DEFAULT_PATTERN);

    /* TODO Use requestAnimationFrame() instead of setInterval */
    setInterval(this.mainLoop.bind(this), 1000/FRAME_RATE);
  }

  /**
   * Sets the pattern for the animator and restarts animation.
   * @param {string} pattern - The siteswap pattern.
   */
  setPattern(pattern) {
    /* TODO pattern should be an interface rather than a string? */
    this.#tosses = pattern.split("").map(toss => {
      /* This is a trick to make sure all tosses are numeral values.
        * i.e. "b" -> 11. */
      return parseInt(toss, 36);
    });
    this.#siteswap = new Siteswap(this.#graphic, this.#tosses);
  }

  mainLoop() {
    this.#graphic.clear();

    if (this.#loopNum == 0) {
      this.#siteswap.toss();
    }
    this.#siteswap.update();
    this.#siteswap.draw();

    this.#loopNum = (this.#loopNum + 1) % TOSS_DURATION;
  }
}

const animator = new Animator();
