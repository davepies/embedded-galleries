/*
 * Embedded Galleries Slider
 * @module GalleryItemCollection
 *
 */

var MODULE_NAME = 'GalleryItemCollection';

var domUtils = require('../../utils').dom;
var errUtils = require('../../utils').error;


/**
 * Contains dimensions for a gallery item - for sliding to its position
 *
 * @constructor
 * @alias module:GalleryItemCollection
 * @param {domElementList} els
 * @return {undefined}
 */
function GalleryItemCollection (els) {

    if (!els instanceof NodeList || !els instanceof Array) {
        errUtils.throw('Failed to init GalleryItemCollection: els needs be of type NodeList or Array', MODULE_NAME);
    }

    // turn nodelist into array if not already
    this._items = domUtils.getElArr(els);

    this.setDimensions();

}


GalleryItemCollection.prototype.setDimensions = function () {

    var dimensionsMap = [];
    var lastOffset = 0;

    this._items.forEach(function pushItemDimensions (item) {
        dimensionsMap.push(domUtils.getElDimensions(item));
    });

    dimensionsMap.map(function addXOffsets (item) {
        item.xOffset = lastOffset;
        lastOffset += item.width;
        return item;
    });

    this._itemsDimensionsMap = dimensionsMap;

};


GalleryItemCollection.prototype._getItemsDimensions = function (el) {

    var dimensions = domUtil.getElDimensions(el);

};


GalleryItemCollection.prototype.getOffsetForItem = function (n) {

    return this._itemsDimensionsMap[n];

};


GalleryItemCollection.prototype.getItemByXOffset = function (xOffset) {

    var currentItem = 0;

    this._itemsDimensionsMap.forEach(function (item, i) {
        if (Math.abs(xOffset) > item.xOffset &&
            Math.abs(xOffset) < (item.width + item.xOffset)) {
            currentItem = i;
        }
    });

    return currentItem;

};


module.exports = GalleryItemCollection;
