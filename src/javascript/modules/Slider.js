/*
 * Embedded Galleries Slider
 * @module Slider
 * @author david.pisek@news.com.au
 */

var hammer = require('hammerjs');

function error (msg) {
    throw new Error(msg);
}

/**
 * Sets up a sliding gallery within the given element
 *
 * @constructor
 * @alias module:slider
 * @param {domElement} containerEl
 * @return {undefined}
 */
function Slider (containerEl) {

    if (!(containerEl instanceof HTMLElement)) {
        error('First parameter must be of type HTMLElement');
    }

    this.containerEl = containerEl;
    this.sliderEl = containerEl.children[0];
    this.interactiveEl = hammer(containerEl);

    this._startListening();

    this._preventImageDrag();

}

/**
 * Binds all the event listeners needed for navigating the Gallery
 *
 * @return {undefined}
 */
Slider.prototype._startListening = function () {

    this.interactiveEl.on('panleft', function (e) {
        console.log(e);
    });

};

/**
 * Prevents images within the gallery from being dragged
 *
 * @return {undefined}
 */
Slider.prototype._preventImageDrag = function () {

    var images = this.containerEl.querySelectorAll('img');

    function preventImageDrag (e) {
        return false;
    }

    [].slice.call(images).forEach(function (imgEl) {

        imgEl.ondragstart = preventImageDrag;

    });

};

module.exports = Slider;
