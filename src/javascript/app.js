var Gallery = require('./modules/Gallery');
var Lightbox = require('./modules/Lightbox');

var galleryEl = document.querySelector('.EmbeddedGallery');

var gallery = new Gallery(galleryEl);
var lightbox = new Lightbox(galleryEl);

gallery.on('tap', function (index) {
    lightbox.open(index);
});
