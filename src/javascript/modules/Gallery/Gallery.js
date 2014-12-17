/*
 * Embedded Galleries Gallery
 * @module Gallery
 *
 */

var hammer = require('hammerjs');

var GalleryItemCollection = require('./GalleryItemCollection');
var LazyLoader            = require('./LazyLoader');

var util   = require('util');
var events = require('events');

var errUtils = require('../../utils').error;
var domUtils = require('../../utils').dom;


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
    this.panEl       = hammer(containerEl);
    this.galleryEl   = containerEl.children[0];

    this.galleryItemCollection = new GalleryItemCollection(this._getGalleryItems());

    this.currX     = 0;
    this.prevDelta = 0;

    if (this.options.lazyLoad) {
        this.lazyLoader = new LazyLoader(this.containerEl, {
            spinnerEl: this.containerEl
        });
    }

    this._setDimensions();
    this._startListening();
    this._preventImageDrag();

}


/*
 * Inherit EventEmitter
 */
util.inherits(Gallery, events.EventEmitter);


/*
 * Default options
 */
Gallery.defaults = {
    RESISTANCE_LEVEL: 15,
    lazyLoad: false,
    classNames: {
        galleryItem: 'EmbeddedGallery-item',
        animating: 'animating',
        loading: 'loading'
    }
};


/*
 * Internal Listeners
 */
Gallery.eventListeners = {

    onPanChangeX: function moveX (e) {
        var nextX = this._calculateNextX(e.deltaX);
        this._moveX(nextX);
    },

    onPanEnd: function snap (e) {
        if (this._borderReached) {
            this._snapBack();
        } else {
            this._snapToNextItem(e.deltaX);
        }

        // reset delta - this is being used to calculate the x movement
        this.prevDelta = 0;
    },

    onTap: function (e) {
        var target = e.target;
        var targetIndex;

        // for now only images are supported
        if (target.tagName !== "IMG") {
            return;
        }

        // get the index of the parent el (li) element
        targetIndex = domUtils.getIndexOfChildEl(this.galleryEl, target.parentNode);

        // emit tap event
        this.emit('tap', targetIndex);
    }

};


/*
 * DOM Listeners
 */
Gallery.prototype.handleEvent = function (e) {

    switch (e.type) {
        case 'resize':
        case 'load':
            this._setDimensions();
    }

};


/**
 * Brings the Gallery back into position after one of the horizontal borders
 * have been crossed
 *
 * @return {undefined}
 */
Gallery.prototype._snapBack = function () {

    var nextX;

    if (this._leftBorderReached) {
        nextX = 0;
    }

    // if container is bigger than Gallery no snapping to right edge
    if (this._rightBorderReached) {
        nextX = -(this.galleryWidth - this.containerInnerWidth);
    }

    this._resetBorderReached();
    this._moveX(nextX, { animated: true });

};


/**
 * Moves the Gallery to the next item
 *
 * @return {undefined}
 */
Gallery.prototype._snapToNextItem = function (deltaX) {

    var nextX = this._calculateNextX(deltaX);
    var nextItem =this.galleryItemCollection.getItemByXOffset(nextX);
    var borderReached = false;

    if (deltaX < 0) {
        nextItem += 1;
    }

    nextX = -(this.galleryItemCollection.getOffsetForItem(nextItem).xOffset);

    this._checkIfBorderReached(nextX);

    if (this._borderReached) {
        this._snapBack();
    } else {
        this._moveX(nextX, { animated: true });
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
Gallery.prototype._setDimensions = function () {

    this.galleryItemCollection.setDimensions();

    this.galleryWidth = domUtils.getElsWidth(this._getGalleryItems());

    this.galleryEl.style.width = this.galleryWidth + 'px';

    this.containerInnerWidth = domUtils.getElInnerWidth(this.containerEl);

};


/**
 *  Resets border reachead booleans
 *
 * @return {undefined}
 */
Gallery.prototype._resetBorderReached = function () {

    this._borderReached = false;
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

    window.addEventListener('load', this);
    window.addEventListener('resize', this);

    // Panel User Interactions
    this.panEl
        .on('panleft panright', Gallery.eventListeners.onPanChangeX.bind(this))
        .on('panend', Gallery.eventListeners.onPanEnd.bind(this))
        .on('tap', Gallery.eventListeners.onTap.bind(this));

    if (this.options.lazyLoad) {
        this.lazyLoader.on('imagesLoaded', this._setDimensions.bind(this));
    }

};


/**
 * Moves the Gallery to position x
 *
 * @private
 * @param x
 * @return {undefined}
 */
Gallery.prototype._moveX = function (nextX, options) {

    options = options || {};

    if (options.animated) {
        this.galleryEl.classList.add(this.options.classNames.animating);
    } else {
        this.galleryEl.classList.remove(this.options.classNames.animating);
    }

    this.galleryEl.style.webkitTransform = "translate3d("+ nextX +"px,0,0)";
    this.currX = nextX;

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
        this._borderReached = true;
    }

    if(Math.abs(nextX) + this.containerInnerWidth  > this.galleryWidth) {
        this._rightBorderReached = true;
        this._borderReached = true;
    }

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
Gallery.prototype._calculateNextX = function (deltaX) {

    var nextX, borderReached;

    nextX = this.currX + deltaX - this.prevDelta;

    this._checkIfBorderReached(nextX);

    if (this._borderReached) {
        nextX = this.currX + ((deltaX - this.prevDelta) / (Math.abs(deltaX) / this.galleryWidth + this.options.RESISTANCE_LEVEL));
    }

    this.prevDelta = deltaX;

    return nextX;

};


/**
 * Prevents images within the gallery from being dragged
 *
 * @private
 * @return {undefined}
 */
Gallery.prototype._preventImageDrag = function () {

    var imagesArr = domUtils.getElArr(this.containerEl.querySelectorAll('img'));

    imagesArr.forEach(function (imgEl) {

        imgEl.ondragstart = preventImageDrag;

    });

    function preventImageDrag (e) {
        return false;
    }

};


module.exports = Gallery;
