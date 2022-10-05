export const GRAVITY = .98;

export class Ball {
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
