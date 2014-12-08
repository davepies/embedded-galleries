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
    this.panEl = hammer(containerEl);
    this.sliderEl = containerEl.children[0];

    this.currX = 0;
    this.nextX = 0;
    this.prevDelta = 0;

    this._setWidths();
    this._startListening();
    this._preventImageDrag();

}


/*
 * Default options
 */
Slider.defaults = {
    RESISTANCE_LEVEL: 15
};


/*
 * Listeners
 */
Slider.eventListeners = {

    onPanChangeX: function (e) {
        this._setNextX(e.deltaX);
        this._moveToNextX();
    },
    onPanEnd: function (e) {

        if (this._leftBorderReached || this._rightBorderReached) {
            this._snapBack();
        }

        // reset delta - this is being used to calculate the x movement
        this.prevDelta = 0;

    }

};


/**
 * Calculates and sets the widths of the container and slider elements
 *
 * @return {undefined}
 */
Slider.prototype._setWidths = function () {

    this.containerWidth = this.containerEl.getBoundingClientRect().width || this.containerEl.offsetWidth;
    this.sliderWidth = this.sliderEl.getBoundingClientRect().width || this.sliderWidth.offsetWidth;

};


/**
 * Brings the slider back into position after one of the horizontal borders
 * have been crossed
 *
 * @return {undefined}
 */
Slider.prototype._snapBack = function () {

    if (this._leftBorderReached) {
        this.nextX = 0;
    }

    // if container is bigger than slider no snapping to right edge
    if (this._rightBorderReached) {
        this.nextX = -(this.sliderWidth - this.containerWidth);
    }

    this._resetBorderReached();
    this._moveToNextX();

};


/**
 *  Resets border reachead booleans
 *
 * @return {undefined}
 */
Slider.prototype._resetBorderReached = function () {
    this._rightBorderReached = false;
    this._leftBorderReached = false;
};


/**
 * Binds all the event listeners needed for navigating the Gallery
 *
 * @private
 * @return {undefined}
 */
Slider.prototype._startListening = function () {

    window.onresize = this._setWidths.bind(this);

    this.panEl.on('panleft panright', Slider.eventListeners.onPanChangeX.bind(this));
    this.panEl.on('panend', Slider.eventListeners.onPanEnd.bind(this));

};


/**
 * Moves the slider to position x
 *
 * @private
 * @param x
 * @return {undefined}
 */
Slider.prototype._moveToNextX = function () {

    this.sliderEl.style.webkitTransform = "translate3d("+ this.nextX +"px,0,0)";
    this.currX = this.nextX;

};


/**
 * Checks if either the right or left border has been reached
 *
 * @param x
 * @return {undefined}
 */
Slider.prototype._checkIfBorderReached = function (nextX) {

        // if the container is bigger than the slider then never scroll to right
        if(this.containerWidth > this.sliderWidth || nextX > 0) {
            this._leftBorderReached = true;
            return true;
        }

        if(Math.abs(nextX) + this.containerWidth > this.sliderWidth) {
            this._rightBorderReached = true;
            return true;
        }

        return false;

};


/**
 * Calculates the x value for the transition
 * adds resistance if either of the horizontal borders have been reached
 *
 * @private
 * @param deltaX
 * @param isFinal
 * @return {undefined}
 */
Slider.prototype._setNextX = function (deltaX) {

    var nextX, borderReached;

    nextX = this.currX + deltaX - this.prevDelta;

    borderReached = this._checkIfBorderReached(nextX);

    if (borderReached) {
        nextX = this.currX + ((deltaX - this.prevDelta) / (Math.abs(deltaX) / this.sliderWidth + Slider.defaults.RESISTANCE_LEVEL));
    }

    this.prevDelta = deltaX;
    this.nextX = nextX;


};


/**
 * Prevents images within the gallery from being dragged
 *
 * @private
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
