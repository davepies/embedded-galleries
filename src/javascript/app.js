var hammer = require('hammerjs');
var Gallery = require('./modules/Gallery');
var Lightbox = require('./modules/Lightbox');
var gallery = new Gallery(document.querySelector('.EmbeddedGallery'));
var galleryLightbox = new Lightbox(document.querySelector('.EmbeddedGallery'));