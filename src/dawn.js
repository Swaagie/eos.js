(function initDawn(w, d) {
  'use strict';

  /**
   * Initialize getting started.
   *
   * @Constructor
   * @param {Element} start
   * @api public
   */
  function Dawn(viewport) {
    this.viewport = viewport;
    this.initialize();

    // Change the dimensions of our iframe if the window is resized.
    w.addEventListener('resize', this.redraw.bind(this));
  }

  /**
   * Initialize the iframe, load the website and add the navigation.
   *
   * @param {Element} start
   * @api public
   */
  Dawn.prototype.initialize = function initialize() {
    // Get the articles.
    this.articles = this.viewport.getElementsByTagName('article');

    // Initialize the iframe
    this.initFrame().initNav();
  };

  /**
   * Borrow setAttribute from Atomic.
   *
   * @api private
   */
  Dawn.prototype.setAttributes = Atomic.prototype.setAttributes;

  /**
   * Change dimensions of the iframe, for instance on window resize.
   *
   * @returns {Dawn} fluent interface
   * @api private
   */
  Dawn.prototype.redraw = function redraw() {
    this.setAttributes(this.frame, {
        width: + w.innerWidth + 'px'
      , height: + w.innerHeight + 'px'
    });

    return this;
  };

  /**
   * Setup the iframe.
   *
   * @returns {Dawn} fluent interface
   * @api private
   */
  Dawn.prototype.initFrame = function initFrame() {
    var frame = this.frame = d.createElement('iframe')
      , attributes = {
            style: [
                'left:-' + this.viewport.offsetLeft + 'px'
              , 'top:-' + this.viewport.offsetTop + 'px'
            ].join(';')
          , src: this.viewport.getAttribute('data-load')
          , seamless: true
          , width: + w.innerWidth + 'px'
          , height: + w.innerHeight + 'px'
        };

    // Set the attributes and insert the iframe in Dawn.
    this.viewport.insertBefore(this.setAttributes(frame, attributes), this.viewport.firstChild);
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
      , nav = d.createElement('nav')
      , title;

    for (var i = 0; i < this.articles.length; i++) {
      title = this.articles[i].children[0].innerText;
      parts.splice(1, 0, '<li><label>' + title + '</label></li>');
    }

    // Add the electrons.
    atom.innerHTML = parts.join('');
    nav.appendChild(atom);

    // Insert the navigation.
    this.atomic = new Atomic(atom);
    this.viewport.insertBefore(nav, this.viewport.firstChild);
    return this;
  };

  // Initialize getting started instance, more than one doensn't make sense.
  Dawn.instance = new Dawn(document.getElementsByClassName('dawn')[0]);

  // Expose constructor and current instances to window.
  w.Dawn = Dawn;
})(window, document);
