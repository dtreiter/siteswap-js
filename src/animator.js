import {Siteswap} from './siteswap.js';
import {Graphic} from './graphic.js';

/* The number of frames between each throw. */
const FRAME_RATE = 30;
const DEFAULT_PATTERN = "97531";

class Animator {
  #tosses = DEFAULT_PATTERN;
  #graphic = new Graphic();
  /* Represents the pattern as an array of numeral values. */
  #siteswap = undefined;

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
    this.#siteswap.tick();
  }
}

const animator = new Animator();
