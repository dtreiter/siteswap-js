import {Ball, GRAVITY} from './ball.js';

export const TOSS_DURATION = 8;

const BALL_SIZE = 10;
const TOSS_WIDTH = 180;

function getArrayMax(numArray) {
  return Math.max.apply(null, numArray);
}

/**
* Enum for possible hands.
* @readonly
* @enum {number}
*/
const Hand = {
  "RIGHT" : 0,
  "LEFT"  : 1
};

export class Siteswap {
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
  }

  #createBall(tossIndex) {
    /* Initialize each ball. */
    let hand;
    let ballX;
    const ballY = 20;
    if (tossIndex % 2 == 1) {
      ballX = (this.graphic.w - TOSS_WIDTH) / 2;
      hand = Hand.LEFT;
    } else {
      ballX = (this.graphic.w + TOSS_WIDTH) / 2;
      hand = Hand.RIGHT;
    }
    return new Ball(this.graphic, ballX, ballY, BALL_SIZE, hand, "#ff0000");
  }

  toss() {
    /* When a ball gets tossed, it gets moved ahead in the balls array
       according to the toss number. The balls array wraps around using
       modulo numSites. */
    const toss = this.tosses[this.nextToss];
    const ball = this.balls[this.curSite];
    if (ball === 0 && toss === 0) {
      return;
    } else if (ball === 0 && toss !== 0) {
      /* Non-empty toss but no ball at this site. Only happens during
       * initialization of the pattern. */
      this.balls[this.curSite] = this.#createBall(this.curSite);
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
