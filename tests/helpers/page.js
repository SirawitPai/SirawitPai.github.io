/* Helpers that load the real index.html + scripts into Jest's jsdom. */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');
const SCRIPTS = ['assets/js/utils.js', 'assets/js/i18n-data.js', 'assets/js/portfolio.js'];

/** Browser APIs jsdom does not implement. Reduced motion keeps animations synchronous. */
function installBrowserMocks() {
  window.matchMedia = (query) => ({
    matches: query.includes('reduce'),
    media: query,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {},
  });
  // report every observed element as visible straight away
  window.IntersectionObserver = class {
    constructor(callback) { this.callback = callback; }
    observe(target) { this.callback([{ isIntersecting: true, target }], this); }
    unobserve() {}
    disconnect() {}
  };
  window.requestAnimationFrame = () => 0; // don't start the endless animation loop
  window.HTMLCanvasElement.prototype.getContext = () => null;
  Object.defineProperty(window.navigator, 'clipboard', {
    configurable: true,
    value: { writeText: jest.fn(() => Promise.resolve()) },
  });
}

/** Put the page markup into the document (without running it). */
function renderMarkup() {
  const html = read('index.html');
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script[src]').forEach((s) => s.remove());
  document.documentElement.lang = doc.documentElement.lang;
  document.head.innerHTML = doc.head.innerHTML;
  document.body.className = '';
  document.body.innerHTML = doc.body.innerHTML;
}

/** Render the page and run its scripts, optionally with a saved language/theme. */
function loadPage({ lang, theme } = {}) {
  window.localStorage.clear();
  if (lang) window.localStorage.setItem('portfolio-language', lang);
  if (theme) window.localStorage.setItem('portfolio-theme', theme);
  delete window.PortfolioUtils;
  delete window.I18N_TRANSLATIONS;
  installBrowserMocks();
  renderMarkup();
  SCRIPTS.forEach((file) => {
    const script = document.createElement('script');
    script.textContent = read(file);
    document.body.appendChild(script);
  });
}

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));
const text = (selector) => document.querySelector(selector).textContent.replace(/\s+/g, ' ').trim();

module.exports = { ROOT, read, loadPage, renderMarkup, flushPromises, text };
