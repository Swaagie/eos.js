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
    this.content = this.viewport.getElementsByTagName('section')[0];
    this.articles = this.content.getElementsByTagName('article');

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
   * @api private
   */
  Dawn.prototype.redraw = function redraw() {
    this.setAttributes(this.frame, {
        height: this.parent.offsetHeight + 'px'
      , width: this.parent.offsetWidth + 'px'
    });
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
      , nav = this.nav = this.viewport.getElementsByTagName('nav')[0]
      , style = w.getComputedStyle(this.articles[0])
      , n = this.articles.length
      , i = n
      , control, title;

    // Show the nav as soon as it is clicked.
    nav.addEventListener('click', this.show.bind(this, true));

    while (i--) {
      title = this.articles[i].getElementsByTagName('h1')[0];
      parts.splice(1, 0, '<li><label>' + (title.innerText || title.textContent) + '</label></li>');

      // Add labels for each article panel.
      this.articles[i].appendChild(
        this.setAttributes(d.createElement('label'), { for: 'i' + i })
      );

      // Clone each panel and add frames to the navigation.
      nav.insertBefore(this.articles[i].cloneNode(true), nav.children[1]);
    }

    // Add the electrons and add Atomic to the DOM before constructing,
    // otherwise getComputedStyle will fail as it is not attached to the DOM.
    atom.innerHTML = parts.join('');
    nav.appendChild(atom);

    // Keep track of the current step and max steps.
    this.index = 0;
    this.atomic = new Atomic(atom, this.viewport);
    this.max = n - 1;

    // Listen to change events in the radio buttons and mitigate to update.
    while (n--) this.atomic.radio[n].addEventListener('change', this.update.bind(this, n));

    return this;
  };

  /**
   * Render the various elements on the page.
   *
   * @api private
   */
  Dawn.prototype.render = function render() {
    this.atomic.update(this.atomic.radio[this.index].value);
  };

  /**
   * Update the current step.
   *
   * @param {Number} n step number
   * @api private
   */
  Dawn.prototype.update = function update(n) {
    this.index = n;
  };

  /**
   * Go to the previous step.
   *
   * @api private
   */
  Dawn.prototype.previous = function previous() {
    if (--this.index < 0) this.index = 0;
    this.render();
  };

  /**
   * Go to the next step.
   *
   * @api private
   */
  Dawn.prototype.next = function next() {
    if (++this.index > this.max) this.index = this.max;
    this.render();
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
