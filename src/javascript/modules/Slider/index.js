/*
 * Embedded Galleries Slider
 * @module Slider
 * @author david.pisek@news.com.au
 */

var hammer = require('hammerjs');
var Lightbox = require('./../Lightbox');

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
  this.containerWidth = this.containerEl.getBoundingClientRect().width || container.offsetWidth;

  this.sliderEl = containerEl.children[0];
  this.sliderWidth = this.sliderEl.getBoundingClientRect().width || container.offsetWidth;

  this.interactiveEl = hammer(containerEl);

  this.currX = 0;
  this.prevDelta = 0;

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
    this.currX = this._calcCurrX(e.deltaX);
    this._slide();
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
 * Brings the slider back into position after one of the horizontal borders
 * have been crossed
 *
 * @return {undefined}
 */
Slider.prototype._snapBack = function () {

  if (this._leftBorderReached) {
    this.currX = 0;
    this._leftBorderReached = false;
  }

  if (this._rightBorderReached) {
    this.currX = -(this.sliderWidth - this.containerWidth);
    this._rightBorderReached = false;
  }

  this._move();

};


/**
 * Binds all the event listeners needed for navigating the Gallery
 *
 * @private
 * @return {undefined}
 */
Slider.prototype._startListening = function () {

  this.interactiveEl.on('panleft panright', Slider.eventListeners.onPanChangeX.bind(this));
  this.interactiveEl.on('panend', Slider.eventListeners.onPanEnd.bind(this));

};


/**
 * Sliding Action
 *
 * @private
 * @return {undefined}
 */
Slider.prototype._slide = function () {

  var borderReached = this._borderReached(this.currX);

  switch(borderReached) {
    case 0:
      break;
    case -1:
      this._leftBorderReached = true;
      break;
    case 1:
      this._rightBorderReached = true;
  }

  this._move();

};


/**
 * Moves the slider to position x
 *
 * @private
 * @param x
 * @return {undefined}
 */
Slider.prototype._move = function () {

  this.sliderEl.style.webkitTransform = "translate3d("+ this.currX +"px,0,0)";

};


/**
 * Checks if either the right or left border has been reached
 * returns left: -1 right: 1 - otherwise 0
 *
 * @param x
 * @return {undefined}
 */
Slider.prototype._borderReached = function (x) {

  if (x > 0) {
    return -1;
  }

  if (Math.abs(x) + this.containerWidth > this.sliderWidth) {
    return 1;
  }

  return 0;

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
Slider.prototype._calcCurrX = function (deltaX) {

  var x, borderReached;

  x = this.currX + deltaX - this.prevDelta;
  borderReached = this._borderReached(x);

  if (borderReached === -1 || borderReached === 1) {
    x = this.currX + ((deltaX - this.prevDelta) / (Math.abs(deltaX) / this.sliderWidth + Slider.defaults.RESISTANCE_LEVEL));
  }

  this.prevDelta = deltaX;

  return x;

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
