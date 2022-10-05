export class Graphic {
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
