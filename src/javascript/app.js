var hammer = require('hammerjs');
var Slider = require('./modules/Slider');
var Lightbox = require('./modules/Lightbox');

var gallerySlider = new Slider(document.querySelector('.EmbeddedGallery'));
var galleryLightbox = new Lightbox(document.querySelector('.EmbeddedGallery'));