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
  this.containerWidth = this.containerEl.getBoundingClientRect().width || container.offsetWidth;

  this.sliderEl = containerEl.children[0];
  this.sliderWidth = this.sliderEl.getBoundingClientRect().width || container.offsetWidth;

  this.interactiveEl = hammer(containerEl);

  this.currX = 0;
  this.prevDelta = 0;

  this._startListening();

  this._preventImageDrag();

}


Slider.defaults = {
  RESISTANCE_LEVEL: 25
};


/**
 * Binds all the event listeners needed for navigating the Gallery
 *
 * @private
 * @return {undefined}
 */
Slider.prototype._startListening = function () {

  // handlers
  function onPanX(e) {
    this._setCurrX(e.deltaX, e.isFinal);
    this.moveTo(this.currX);
  }

  // reset delta
  function onPanEnd(e) {
    this.prevDelta = 0;
  }

  this.interactiveEl.on('panleft panright', onPanX.bind(this));
  this.interactiveEl.on('panend', onPanEnd.bind(this));

};


Slider.prototype.moveTo = function (x) {
  this.sliderEl.style.webkitTransform = "translate3d("+ x +"px,0,0)";
};


/**
 * Calculates the x value for the transition
 *
 * @private
 * @param deltaX
 * @param isFinal
 * @return {undefined}
 */
Slider.prototype._setCurrX = function (deltaX, isFinal) {

  var x, leftBorderReached, rightBorderReached;

  x = this.currX + deltaX - this.prevDelta;

  if (x > 0) {
    leftBorderReached = true;
  }

  if (Math.abs(x) + this.containerWidth > this.sliderWidth) {
    rightBorderReached = true;
  }

  // set the resistance
  if (leftBorderReached || rightBorderReached) {
    x = this.currX + ((deltaX - this.prevDelta) / (Math.abs(deltaX) / this.sliderWidth + Slider.defaults.RESISTANCE_LEVEL));
  }

  if (isFinal && leftBorderReached) {
    x = 0;
  }

  if (isFinal && rightBorderReached) {
    x = -(this.sliderWidth - this.containerWidth);
  }

  this.currX = x;
  this.prevDelta = deltaX;
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
