/*
 * Embedded Galleries Lightbox
 * @module Lightbox
 * @author erik.panchenko@news.com.au
 */

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

  var lightbox = document.createElement('ul');
  lightbox.classList.add('EmbeddedGallery-lightbox');

  var items = this._getLightboxItems();   
  console.log('items count: '+items.length); 
  for (var i = 0; i < items.length; ++i) {
      lightbox.innerHTML += '<li><img src='+items[i].getAttribute('data-src')+'><p class="caption">'+items[i].getAttribute('data-caption')+'</p></li>';
  }
  this.containerEl.appendChild(lightbox);

  var lightbox_trigger = document.createElement('a');
  lightbox_trigger.href = "#";
  lightbox_trigger.classList.add('EmbeddedGallery-lightbox-open');
  lightbox_trigger.innerHTML += 'lightbox';
  this.containerEl.appendChild(lightbox_trigger);  

};

/**
 * Builds the lightbox HTML markup.
 *
 * @private
 * @param x
 * @return {object}
 */
Lightbox.prototype._getLightboxItems = function () {

  var items = this.containerEl.querySelectorAll('li img');
  return items;

};

Lightbox.prototype.open = function () {

    document.querySelector('.EmbeddedGallery-lightbox').classList.add('active');

};

Lightbox.prototype.close = function () {

    document.querySelector('.EmbeddedGallery-lightbox').classList.remove('active');

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

  document.querySelector('.EmbeddedGallery-lightbox-open').addEventListener('click', this.open);
  //Esc button > Close

};

module.exports = Lightbox;
