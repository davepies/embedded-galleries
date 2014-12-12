/*
 * Embedded Galleries Gallery
 * @module Gallery
 *
 */

var hammer = require('hammerjs');

var GalleryItemCollection = require('./GalleryItemCollection');

var errUtils = require('../../utils').error;
var domUtils = require('../../utils').dom;

var MODULE_NAME = 'GalleryItemCollection';


/**
 * Sets up a sliding gallery within the given element
 *
 * @constructor
 * @alias module:Gallery
 * @param {domElement} containerEl
 * @return {undefined}
 */
function Gallery (containerEl) {

    if (!(containerEl instanceof HTMLElement)) {
        errUtils.throwError('First parameter must be of type HTMLElement');
    }

    // @TODO: Pass in options and merge
    this.options = Gallery.defaults;

    this.containerEl = containerEl;
    this.panEl = hammer(containerEl);
    this.galleryEl = containerEl.children[0];

    this.galleryItemCollection = new GalleryItemCollection(this._getGalleryItems());

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
Gallery.defaults = {
    RESISTANCE_LEVEL: 15,
    classNames: {
        galleryItem: 'EmbeddedGallery-item',
        animating: 'animating'
    }
};


/*
 * Listeners
 */
Gallery.eventListeners = {

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
 * Calculates and sets the widths of the container and Gallery elements
 *
 * @return {undefined}
 */
Gallery.prototype._getGalleryItems = function () {

    return this.galleryEl.querySelectorAll('.' + this.options.classNames.galleryItem);

};


/**
 * Calculates and sets the widths of the container and Gallery elements
 *
 * @return {undefined}
 */
Gallery.prototype._setWidths = function () {

    this.galleryWidth = domUtils.getElsWidth(this._getGalleryItems());

    this.galleryEl.style.width = this.galleryWidth + 'px';

    this.containerInnerWidth = domUtils.getElInnerWidth(this.containerEl);

};


/**
 * Brings the Gallery back into position after one of the horizontal borders
 * have been crossed
 *
 * @return {undefined}
 */
Gallery.prototype._snapBack = function () {

    if (this._leftBorderReached) {
        this.nextX = 0;
    }

    // if container is bigger than Gallery no snapping to right edge
    if (this._rightBorderReached) {
        this.nextX = -(this.galleryWidth - this.containerInnerWidth);
    }

    this._resetBorderReached();
    this._moveToNextX();

};


/**
 *  Resets border reachead booleans
 *
 * @return {undefined}
 */
Gallery.prototype._resetBorderReached = function () {

    this._rightBorderReached = false;
    this._leftBorderReached = false;

};


/**
 * Binds all the event listeners needed for navigating the Gallery
 *
 * @private
 * @return {undefined}
 */
Gallery.prototype._startListening = function () {

    window.onresize = this._setWidths.bind(this);

    this.panEl.on('panleft panright', Gallery.eventListeners.onPanChangeX.bind(this));
    this.panEl.on('panend', Gallery.eventListeners.onPanEnd.bind(this));

};


/**
 * Moves the Gallery to position x
 *
 * @private
 * @param x
 * @return {undefined}
 */
Gallery.prototype._moveToNextX = function () {

    this.galleryEl.style.webkitTransform = "translate3d("+ this.nextX +"px,0,0)";
    this.currX = this.nextX;

};


/**
 * Checks if either the right or left border has been reached
 *
 * @param x
 * @return {undefined}
 */
Gallery.prototype._checkIfBorderReached = function (nextX) {

    // if the container is bigger than the Gallery then never scroll to right
    if(this.containerInnerWidth > this.galleryWidth || nextX > 0) {
        this._leftBorderReached = true;
        return true;
    }

    if(Math.abs(nextX) + this.containerInnerWidth  > this.galleryWidth) {
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
Gallery.prototype._setNextX = function (deltaX) {

    var nextX, borderReached;

    nextX = this.currX + deltaX - this.prevDelta;

    borderReached = this._checkIfBorderReached(nextX);

    if (borderReached) {
        nextX = this.currX + ((deltaX - this.prevDelta) / (Math.abs(deltaX) / this.galleryWidth + this.options.RESISTANCE_LEVEL));
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
Gallery.prototype._preventImageDrag = function () {

    var images = this.containerEl.querySelectorAll('img');

    function preventImageDrag (e) {
        return false;
    }

    [].slice.call(images).forEach(function (imgEl) {

        imgEl.ondragstart = preventImageDrag;

    });

};


module.exports = Gallery;
