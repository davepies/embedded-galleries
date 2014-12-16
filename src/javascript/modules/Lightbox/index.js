/*
 * Embedded Galleries Lightbox
 * @module Lightbox
 * @author erik.panchenko@news.com.au
 */

var errUtils = require('../../utils').error;
var domUtils = require('../../utils').dom; 

function error (msg) {

    throw new Error(msg);

}


/**
 * Sets up a lighbox with a gallery from within the given element
 *
 * @constructor
 * @alias module:Lightbox
 * @param {domElement} containerEl
 * @return {undefined}
 */
function Lightbox (containerEl) {

    if (!(containerEl instanceof HTMLElement)) {
        error('First parameter must be of type HTMLElement');
    }

    this.containerEl = containerEl;

    this._constructHTML();

    this._startListening();

}

/**
 * Builds the lightbox HTML markup.
 *
 * @private
 * @return {undefined}
 */
Lightbox.prototype._constructHTML = function () {

    var lightbox = document.createElement('div');
    lightbox.classList.add('EmbeddedGallery-lightbox');
    lightbox.innerHTML += '<div class="overlay"></div>';
    lightbox.innerHTML += '<div class="nav"><a href="#" class="close">close</a></div>';

    var items = this._getLightboxItems();   
    for (var i = 0; i < items.length; ++i) {
        lightbox.innerHTML += '<figure><img src='+items[i].getAttribute('data-src')+'><figcaption>'+items[i].getAttribute('data-caption')+'</figcaption></figure>';
    }
    this.containerEl.appendChild(lightbox);

    /*var lightbox_open = document.createElement('div');
    lightbox_open.classList.add('lightbox-open');
    lightbox_open.innerHTML += '<a href="#">open lightbox</a>';
    this.containerEl.appendChild(lightbox_open);  */

};

/**
 * Gets all images and their corresponding captions for the lightbox.
 *
 * @private
 * @param x
 * @return {object}
 */
Lightbox.prototype._getLightboxItems = function () {

    var items = this.containerEl.querySelectorAll('li img');
    return items;

};

/**
 * Opens lightbox.
 *
 * @public
 * @return {undefined}
 */
Lightbox.prototype.open = function (pos) {

    pos = pos || 0;

    document.querySelector('.EmbeddedGallery-lightbox').classList.add('active');

    if(pos > 0) {

        this.jump(pos);

    }

    this._jumpTo(3);

};

/**
 * Builds the lightbox HTML markup.
 *
 * @private
 * @return {undefined}
 */
Lightbox.prototype._close = function () {

    document.querySelector('.EmbeddedGallery-lightbox').classList.remove('active');

};

/**
 * Scrolls the page to the position.
 *
 * @private
 * @param jump
 * @return {undefined}
 */
Lightbox.prototype._jumpTo = function (pos) {

    var figures = document.querySelectorAll('.EmbeddedGallery-lightbox figure');
    figures = domUtils.getElArr(figures);
    var y = domUtils.getElYoffset(figures[pos]);
    this._scrollTo(document.body, y, 100);

};

Lightbox.prototype._scrollTo = function (element, to, duration) {

    if (duration < 0) {
        return;
    }
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 2;

    setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        console.log(duration + " " + element.scrollTop + " " + perTick);
        this._scrollTo(element, to, duration - 2);
    }.bind(this), 10);

};


/*
 * Listeners
 */
Lightbox.eventListeners = {


};


/**
 * Binds all the event listeners needed for navigating the Gallery
 *
 * @private
 * @return {undefined}
 */
Lightbox.prototype._startListening = function () {

  document.querySelector('.EmbeddedGallery-lightbox .close').addEventListener('click', this._close);
  //Esc button > Close

};

module.exports = Lightbox;
