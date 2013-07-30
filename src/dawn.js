(function initDawn(w, d) {
  'use strict';

  /**
   * KeyCodes mapped to functions.
   *
   * @type {Array}
   * @api private
   */
  var map = {
      27: 'hide'
    , 37: 'previous'
    , 38: 'previous'
    , 39: 'next'
    , 40: 'next'
    , 84: 'toggle'
  };

  /**
   * Initialize getting started.
   *
   * @Constructor
   * @param {Element} start
   * @api public
   */
  function Dawn(viewport) {
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
  Dawn.prototype.initialize = function initialize() {
    // Get the content and its articles.
    this.content = this.viewport.getElementsByTagName('article');

    // Initialize the iframe, navigation and hidden controls.
    this.initFrame().initNav();

    // Change the dimensions of the iframe on window resize.
    w.addEventListener('resize', this.redraw.bind(this));

    // Listen to keypresses and determine UI actions.
    w.addEventListener('keydown', this.hotkeys.bind(this));
  };

  /**
   * Proxy setAttribute from Atomic.
   *
   * @api private
   */
  Dawn.prototype.setAttributes = Atomic.prototype.setAttributes;

  /**
   * Change dimensions of the iframe, for instance on window resize.
   *
   * @param {Event} e
   * @api private
   */
  Dawn.prototype.redraw = function redraw(e) {
    this.frame.style.height = this.parent.offsetHeight + 'px';
    this.frame.style.width = this.parent.offsetWidth + 'px';
  };

  /**
   * Setup the iframe and the content.
   *
   * @returns {Dawn} fluent interface
   * @api private
   */
  Dawn.prototype.initFrame = function initFrame() {
    var frame = this.frame = d.createElement('iframe');

    // Set the attributes and insert the iframe in Dawn.
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
   * @returns {Dawn} fluent interface
   * @api private
   */
  Dawn.prototype.initNav = function initNav() {
    var parts = ['<input type=text value=0 readonly><ol>', '</ol><canvas></canvas>']
      , atom = this.setAttributes(d.createElement('section'), { class: 'atomic' })
      , nav = this.nav = d.createElement('nav')
      , i = this.content.length
      , radio = []
      , title;

    while (i--) {
      title = this.content[i].getElementsByTagName('h1')[0];
      parts.splice(1, 0, '<li><label>' + (title.innerText || title.textContent) + '</label></li>');

    }

    // Add the electrons.
    atom.innerHTML = parts.join('');
    nav.appendChild(atom);

    // Show the nav as soon as it is clicked on the bottom.
    nav.addEventListener('click', this.show.bind(this, true));

    // Insert the navigation and construct atomic after, otherwise the
    // getComputedStyle will fail as it is not attached to the DOM.
    this.viewport.insertBefore(nav, this.viewport.firstChild);
    this.atomic = new Atomic(atom, this.viewport);

    // Keep track of the current step and max steps.
    this.index = 0;
    this.max = this.atomic.radio.length - 1;

    return this;
  };

  /**
   * Go to the previous step.
   *
   * @api private
   */
  Dawn.prototype.previous = function previous() {
    if (--this.index < 0) this.index = 0;
    this.atomic.update(this.atomic.radio[this.index].value);
  };

  /**
   * Go to the next step.
   *
   * @api private
   */
  Dawn.prototype.next = function next() {
    if (++this.index > this.max) this.index = this.max;
    this.atomic.update(this.atomic.radio[this.index].value);
  };

  /**
   * Toggle the navigation visibility.
   *
   * @api private
   */
  Dawn.prototype.toggle = function toggle() {
    this[this.nav.getAttribute('class') === 'hide' ? 'show' : 'hide'].call(this);
  };

  /**
   * Hide the viewport.
   *
   * @api private
   */
  Dawn.prototype.hide = function hide() {
    this.nav.setAttribute('class', 'hide');
    this.viewport.setAttribute('class', 'dawn hide');
  };

  /**
   * Show the viewport.
   *
   * @api private
   */
  Dawn.prototype.show = function show() {
    this.nav.setAttribute('class', 'show');
    this.viewport.setAttribute('class', 'dawn show');
  };

  /**
   * Listen to keypresses to control the overlay.
   *
   * @param {Event} e
   * @api private
   */
  Dawn.prototype.hotkeys = function hotkeys(e) {
    e = map[e.keyCode];
    if (e) this[e].call(this);
  };

  // Initialize getting started instance, more than one doensn't make sense.
  Dawn.instance = new Dawn(document.getElementsByClassName('dawn')[0]);

  // Expose constructor and current instances to window.
  w.Dawn = Dawn;
})(window, document);
