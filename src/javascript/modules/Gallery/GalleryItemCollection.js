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

    this._itemsDimensionsMap = this._getItemsDimensionsMap();

}


GalleryItemCollection.prototype._getItemsDimensionsMap = function () {

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

    return dimensionsMap;

};


GalleryItemCollection.prototype._getItemsDimensions = function (el) {

    var dimensions = domUtil.getElDimensions(el);

};


GalleryItemCollection.prototype.getOffsetForItem = function (n) {

    return this._itemsDimensionsMap[n];

};


module.exports = GalleryItemCollection;
