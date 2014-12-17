/*
 * Embedded Galleries Gallery
 * @module LazyLoader
 *
 */

var util   = require('util');
var events = require('events');

var utils = require('../../utils');

/**
 * Lazyloader that handles loading of imgs and defers them to after the onload event
 *
 * @constructor
 * @alias module:LazyLoader
 * @param {nodeList} els
 * @param {Object} options
 * @return {undefined}
 */
function LazyLoader (containerEl, options) {

    var imgs;

    this.options = options || {};
    this._hasLoaded = false;

    this.options.loadingClassName = options.loadingClassName || 'loading';

    if (!(containerEl instanceof HTMLElement)) {
        utils.error.throwError('First parameter must be of type NodeList.');
    }

    imgs = containerEl.querySelectorAll('img');
    this.imgsToLoadArr = this._getLazyLoadImgs(imgs);

    if(!this.imgsToLoadArr.length) {
        return;
    }

    this.addLoadingIndicator();

    this._addListeners();

}


/*
 * Inherit EventEmitter
 */
util.inherits(LazyLoader, events.EventEmitter);


LazyLoader.prototype.handleEvent = function (e) {

    if (e.type === 'load') {
        this.lazyLoad();
    }

};


/**
 * Walks trough a NodeList of img elements and changes data attribute to src
 *
 * @return {undefined}
 */
LazyLoader.prototype.lazyLoad = function () {

    if (this._hadLoaded) {
        return;
    }

    var imgsToLoad = this.imgsToLoadArr.length;
    var imgsLoaded = 0;

    this.imgsToLoadArr.forEach(function (img) {
        img.onload = checkIfAllImagesLoaded.bind(this);
        // @TODO: add data-small-src to options
        img.setAttribute('src', img.getAttribute('data-small-src'));
        img.removeAttribute('data-small-src');
    }, this);

    this._hasLoaded = true;

    function checkIfAllImagesLoaded () {
        imgsLoaded += 1;

        if (imgsToLoad === imgsLoaded) {
            this.removeLoadingIndicator();
            this.emit('imagesLoaded');
        }
    }

};


/**
 * Goes trough an Array of images and filters out elements with a src attribute
 * as they don't need to be lazy loaded
 *
 * @private
 * @return {Array}
 */
LazyLoader.prototype._getLazyLoadImgs = function (imgs) {

    var imgsArr = utils.dom.getElArr(imgs);
    var filteredImgs;

    filteredImgs = imgsArr.filter(removeImgWithSrcAttr);

    return filteredImgs;

    function removeImgWithSrcAttr (img) {
        return !img.getAttribute('src');
    }

};


/**
 * Adds a loading class to the container element
 *
 * @return {undefined}
 */
LazyLoader.prototype.addLoadingIndicator = function () {

    if (this.options.spinnerEl instanceof HTMLElement) {
        this.options.spinnerEl.classList.add(this.options.loadingClassName);
    }

};


/**
 * Removes a loading class to the container element
 *
 * @return {undefined}
 */
LazyLoader.prototype.removeLoadingIndicator = function () {

    if (this.options.spinnerEl instanceof HTMLElement) {
        this.options.spinnerEl.classList.remove(this.options.loadingClassName);
    }

};


/**
 * Adds DOM Event listeners
 *
 * @private
 * @return {undefined}
 */
LazyLoader.prototype._addListeners = function () {

    window.addEventListener('load', this);

};


module.exports = LazyLoader;
