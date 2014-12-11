module.exports = {

    getElWidth: function (el) {
        return el.getBoundingClientRect().width || el.offsetWidth;
    }

};
