'use strict';

//
// Modules included via browserify.
//
var Atomic = require('atomic');

//
// KeyCodes mapped to functions.
//
var map = {
  38: 'previous',
  40: 'next',
  72: 'nav',
  83: 'focus',
  84: 'toggle'
};

/**
 * Initialize getting started.
 *
 * @Constructor
 * @param {Element} start
 * @api public
 */
function EOS(viewport) {
  this.viewport = viewport;
  this.parent = viewport.parentNode;

  this.initialize();
}

/**
 * Initialize the iframe, load the website and add the navigation.
 *
 * @param {Element} start
 * @api public
 */
EOS.prototype.initialize = function initialize() {
  // Get the content and its articles.
  this.content = this.viewport.getElementsByTagName('section')[0];
  this.articles = this.content.getElementsByTagName('article');

  // Initialize the iframe, navigation and hidden controls.
  this.initFrame().initNav();

  // Change the dimensions of the iframe on window resize.
  window.addEventListener('resize', this.redraw.bind(this));

  // Listen to keypresses and determine UI actions.
  window.addEventListener('keydown', this.hotkeys.bind(this));
};

/**
 * Proxy setAttribute from Atomic.
 *
 * @api private
 */
EOS.prototype.setAttributes = Atomic.prototype.setAttributes;

/**
 * Get text from the element.
 *
 * @returns {String} text
 * @api private
 */
EOS.prototype.text = function text(element) {
  return element.innerText || element.textContent;
};

/**
 * Change dimensions of the iframe, for instance on window resize.
 *
 * @api private
 */
EOS.prototype.redraw = function redraw() {
  this.setAttributes(this.frame, {
      height: this.parent.offsetHeight + 'px'
    , width: this.parent.offsetWidth + 'px'
  });
};

/**
 * Setup the iframe and the content.
 *
 * @returns {EOS} fluent interface
 * @api private
 */
EOS.prototype.initFrame = function initFrame() {
  var frame = this.frame = document.createElement('iframe');

  // Set the attributes and insert the iframe in EOS.
  this.setAttributes(frame, {
      seamless: true
    , height: this.parent.offsetHeight + 'px'
    , width: this.parent.offsetWidth + 'px'
    , src: this.viewport.getAttribute('data-load')
  });

  this.viewport.insertBefore(frame, this.viewport.firstChild);
  return this;
};

/**
 * Initialize the navigation and the Atomic progress bar.
 *
 * @returns {EOS} fluent interface
 * @api private
 */
EOS.prototype.initNav = function initNav() {
  var parts = ['<input type=text value=0 readonly><ol>', '</ol><canvas></canvas>']
    , atom = this.setAttributes(document.createElement('section'), { class: 'atomic' })
    , nav = this.viewport.getElementsByTagName('nav')[0]
    , style = window.getComputedStyle(this.articles[0])
    , n = this.articles.length
    , i = n
    , control, title, article;

  while (i--) {
    article = this.articles[i];
    title = article.getElementsByTagName('h1')[0];
    parts.splice(1, 0, '<li><label>' + this.text(title) + '</label></li>');

    // Add labels for each article panel.
    article.appendChild(
      this.setAttributes(document.createElement('label'), { for: 'i' + i })
    );
  }

  // Add the electrons and add Atomic to the DOM before constructing,
  // otherwise getComputedStyle will fail as it is not attached to the DOM.
  atom.innerHTML = parts.join('');
  nav.appendChild(atom);

  // Keep track of the current step and max steps.
  this.index = -1;
  this.searchbox = nav.getElementsByTagName('input')[0];
  this.atomic = new Atomic(atom, this.viewport);
  this.max = n - 1;

  // Listen to change events in the radio buttons and mitigate to update.
  while (n--) this.atomic.radio[n].addEventListener('change', this.update.bind(this, n));

  // Listen to searches.
  nav.getElementsByTagName('form')[0].addEventListener('submit', this.search.bind(this));
  return this;
};

/**
 * Search the content of each article and highlight the terms.
 *
 * @param {Event} e
 * @api private
 */
EOS.prototype.search = function search(e) {
  e.preventDefault();

  var v = this.searchbox.value
    , i = this.articles.length
    , regexp = new RegExp('(' + v + ')', 'ig')
    , article, all, n;

  // Only search against proper input.
  if (!v) return;

  while (i--) {
    article = this.articles[i];

    // Only do a full search on each child if it is part of the content.
    if (!regexp.test(this.text(article))) continue;

    all = article.getElementsByTagName('*');
    n = all.length;

    while (n--) {
      all[n].innerHTML = this.text(all[n]).replace(regexp, '<mark>$1</mark>');
    }
  }
};

/**
 * Render the various elements on the page.
 *
 * @api private
 */
EOS.prototype.render = function render() {
  this.reset().atomic.update(this.atomic.radio[this.index].value);
};

/**
 * Update the current step.
 *
 * @param {Number} n step number
 * @api private
 */
EOS.prototype.update = function update(n) {
  this.reset();
  this.index = n;
};

/**
 * Go to the previous step.
 *
 * @param {Event} e
 * @api private
 */
EOS.prototype.previous = function previous(e) {
  if (--this.index < 0) this.index = 0;
  this.render();
};

/**
 * Go to the next step.
 *
 * @param {Event} e
 * @api private
 */
EOS.prototype.next = function next(e) {
  if (++this.index > this.max) this.index = this.max;
  this.render();
};

/**
 * Toggle the navigation visibility.
 *
 * @param {Event} e
 * @api private
 */
EOS.prototype.toggle = function toggle(e) {
  if (document.activeElement === this.searchbox) return;
  this.setClass(~this.viewport.getAttribute('class').indexOf('hide') ? '' : 'hide');
};

/**
 * Set a specific class on the viewport.
 *
 * @returns {EOS} fluent interface
 * @api private
 */
EOS.prototype.setClass = function setClass(className) {
  this.viewport.setAttribute('class', 'eos ' + className);
  return this;
};

/**
 * Toggle the navigation/intro.
 *
 * @param {Event} e
 * @api private
 */
EOS.prototype.nav = function nav(e) {
  if (document.activeElement === this.searchbox) return;
  this.setClass(~this.viewport.getAttribute('class').indexOf('nav') ? '' : 'nav');
};

/**
 * Focus the search box.
 *
 * @param {Event} e
 * @api private
 */
EOS.prototype.focus = function focus(e) {
  var active = document.activeElement;
  if (active === this.searchbox || !this.searchbox) return;

  e.preventDefault();
  this.setClass('nav').searchbox.focus();
};

/**
 * Restore the state and call the mapped function.
 *
 * @returns {EOS} fluent interface
 * @api private
 */
EOS.prototype.reset = function reset() {
  this.searchbox.blur();
  this.viewport.setAttribute('class', 'eos');
  return this;
};

/**
 * Listen to keypresses to control the overlay.
 *
 * @param {Event} e
 * @api private
 */
EOS.prototype.hotkeys = function hotkeys(e) {
  if (map[e.keyCode]) this[map[e.keyCode]].call(this, e);
};

//
// Export the module.
//
module.exports = EOS;