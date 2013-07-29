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
    this.initFrame().initNav().initControls();

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
   * @returns {Dawn} fluent interface
   * @api private
   */
  Dawn.prototype.redraw = function redraw(e) {
    this.frame.style.height = this.parent.offsetHeight + 'px';
    this.frame.style.width = this.parent.offsetWidth + 'px';

    return this;
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
    this.atomic = new Atomic(atom);

    return this;
  };

  Dawn.prototype.initControls = function initControls() {
    var attr = { type: 'radio', name: 'dawn' }
      , i = this.content.length;

    this.radio = [];
    while (i--) {
      this.radio.unshift(element = d.createElement('input'));
      this.viewport.insertBefore(this.setAttributes(element, attr), this.viewport.firstChild);
    }
  };

  /**
   * Toggle the navigation visibility.
   *
   * @returns {Dawn} fluent interface
   * @api private
   */
  Dawn.prototype.toggle = function toggle() {
    this[this.nav.getAttribute('class') === 'hide' ? 'show' : 'hide'].call(this);
    return this;
  };

  /**
   * Hide the viewport.
   *
   * @returns {Dawn} fluent interface
   * @api private
   */
  Dawn.prototype.hide = function hide() {
    this.nav.setAttribute('class', 'hide');
    this.viewport.setAttribute('class', 'dawn hide');
    return this;
  };

  /**
   * Show the viewport.
   *
   * @returns {Dawn} fluent interface
   * @api private
   */
  Dawn.prototype.show = function show() {
    this.nav.setAttribute('class', 'show');
    this.viewport.setAttribute('class', 'dawn show');
    return this;
  };

  /**
   * Listen to keypresses to control the overlay.
   *
   * @param {Event} e
   * @returns {Dawn} fluent interface
   * @api private
   */
  Dawn.prototype.hotkeys = function hotkeys(e) {
    e = map[e.keyCode];

    if (e) this[e].call(this);
    return this;
  };

  // Initialize getting started instance, more than one doensn't make sense.
  Dawn.instance = new Dawn(document.getElementsByClassName('dawn')[0]);

  // Expose constructor and current instances to window.
  w.Dawn = Dawn;
})(window, document);
