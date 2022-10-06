const LIMIT = 100;
const PARSER = new DOMParser();

// string -> string
function getVal(selector) {
  return Number(document.querySelector(selector).value);
}

const numBalls = () => getVal('#num-balls');
const maxHeight = () => getVal('#max-height');
const period = () => getVal('#period');

const listItem = siteswap =>`<li onclick="setPattern('${siteswap}')">${siteswap}</li>`;

// string[] -> void
function showResults(patterns) {
  const list = document.querySelector('#siteswaps-list');
  let innerHtml = '';
  for (const pattern of patterns) {
    innerHtml += listItem(pattern);
  }
  list.innerHTML = innerHtml;
}

function setPattern(siteswap) {
  animator.setPattern(siteswap);
}

function generate() {
  const siteswaps = generator.generateSwaps(numBalls(), maxHeight(), period(), LIMIT);
  showResults(siteswaps);
}
