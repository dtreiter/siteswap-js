var Animator = (function() {
    "use strict";

    /* The number of frames between each throw. */
    var FRAME_RATE    =  30;
    var TOSS_DURATION =   8;
    var TOSS_WIDTH    = 180;
    var BALL_SIZE     =  10;
    var GRAVITY       = .98;

    var graphic;
    var siteswap;
    var loopNum; /* Used to call siteswap.toss every TOSS_DURATION number of frames. */
    var tosses; /* Represents the pattern as an array of numeral values. */
    var defaultPattern = "97531";

    /**
     * Enum for possible hands.
     * @readonly
     * @enum {number}
     */
    var Hand = {
        "RIGHT" : 0,
        "LEFT"  : 1
    };

    function Animator() {
        graphic = new Graphic();
        /* TODO Has bug with excited state patterns. */
        tosses = defaultPattern;
        this.setPattern(defaultPattern);

        loopNum = 0;
        /* TODO Use requestAnimationFrame() instead of setInterval */
        setInterval(mainLoop, 1000/FRAME_RATE);
    }
    /**
     * Sets the pattern for the animator and restarts animation.
     * @param {string} pattern - The siteswap pattern.
     */
    Animator.prototype.setPattern = function(pattern) {
        /* TODO pattern should be an interface rather than a string? */
        tosses = pattern.split("").map(function(toss) {
            /* This is a trick to make sure all tosses are numeral values.
             * i.e. "b" -> 11. */
            return parseInt(toss, 36);
        });
        siteswap = new Siteswap(graphic, tosses);
    }

    function Graphic() {
        this.canvas = document.getElementById("animator");
        this.context = this.canvas.getContext("2d");
        this.w = this.canvas.width;
        this.h = this.canvas.height;
    }
    Graphic.prototype.clear = function() {
        this.context.clearRect(0, 0, this.w, this.h);
    }
    Graphic.prototype.fillCircle = function(x, y, r, color) {
        var graphicY = this.h - y;
        this.context.beginPath();
        this.context.arc(x, graphicY, r, 0, 2*Math.PI);
        this.context.fillStyle = color;
        this.context.fill();
    }

    function Ball(graphic, x, y, r, hand, color) {
        this.graphic = graphic;
        this.x = x;
        this.y = y;
        this.r = r;
        this.hand = hand;
        this.color = color;
        
        this.decay = 0.4;
        this.dx = 0;
        this.dy = 0;
        this.ddy = -GRAVITY;
    }
    Ball.prototype.update = function() {
        /* Gravity */
        this.dy += this.ddy;

        var newX = this.x + this.dx;
        var newY = this.y + this.dy;

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
    Ball.prototype.toss = function(dx, dy) {
        this.dx = dx;
        this.dy = dy;
    }
    Ball.prototype.draw = function() {
        this.graphic.fillCircle(this.x, this.y, this.r, this.color);
    }

    function Siteswap(graphic, tosses) {
        this.graphic = graphic;
        this.tosses = tosses;

        /* Used to go through the tosses array. */
        this.nextToss = 0;
        /* Used to go through the site queue. */
        this.curSite = 0;
        this.period = this.tosses.length;

        /* The number of balls is the average of the tosses. */
        this.numBalls = this.tosses.reduce(function(a, b) { return a + b; }) / this.tosses.length;
        this.numSites = getArrayMax(this.tosses);
        this.balls = new Array();

        /* Initialize the whole sites queue to zeros. */
        for (var i = 0; i < this.numSites; i++) {
            this.balls.push(0);
        }

        /* Initialize each ball. */
        var hand;
        var ballX;
        var ballY = 20;
        for (var i = 0; i < this.numBalls; i++) {
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
    Siteswap.prototype.toss = function() {
        /* When a ball gets tossed, it gets moved ahead in the balls array
            according to the toss number. The balls array wraps around using
            modulo numSites. */
        var toss = this.tosses[this.nextToss];
        var ball = this.balls[this.curSite];
        if (ball == 0) {
            /* No ball at this site. */
            return;
        }

        /* Calculate velocities for ball. */
        /* For dx we check to see if toss is odd or even to determine if the
            ball changes sides. */
        var dx;
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
        var dy = toss * 0.5 * GRAVITY * TOSS_DURATION;

        ball.toss(dx, dy);

        /* Update the balls array. */
        var nextSite = (this.curSite + toss) % this.numSites;
        /* Only update if the ball swapped sites. */
        if (nextSite != this.curSite) {
            this.balls[nextSite] = ball;
            this.balls[this.curSite] = 0;
        }

        this.nextToss = (this.nextToss + 1) % this.period;
        this.curSite  = (this.curSite  + 1) % this.numSites;
    }
    Siteswap.prototype.update = function() {
        this.balls.forEach(function (ball) {
            /* TODO This is ugly. */
            if (ball != 0) {
                ball.update();
            }
        });
    }
    Siteswap.prototype.draw = function() {
        this.balls.forEach(function (ball) {
            if (ball != 0) {
                ball.draw();
            }
        });
    }

    function mainLoop() {
        graphic.clear();

        if (loopNum == 0) {
            siteswap.toss();
        }
        siteswap.update();
        siteswap.draw();

        loopNum = (loopNum + 1) % TOSS_DURATION;
    }

    /* TODO Put this somewhere else. */
    function getArrayMax(numArray) {
        return Math.max.apply(null, numArray);
    }

    return Animator;
})();

var myAnim = new Animator();
