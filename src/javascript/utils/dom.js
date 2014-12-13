module.exports = {

    getElArr: function (els) {
        if (els instanceof Array) {
            return els;
        }

        return [].slice.call(els);
    },

    getElWidth: function (el) {
        return el.getBoundingClientRect().width || el.offsetWidth;
    },

    getElHeight: function (el) {
        return el.getBoundingClientRect().height || el.offsetHeight;
    },

    getElDimensions: function (el) {
        return {
            width: this.getElWidth(el),
            height: this.getElHeight(el)
        };
    },

    getElInnerWidth: function (el) {
        return +getComputedStyle(el).getPropertyValue('width').replace('px', '');
    },

    getElsWidth: function (els) {
        if (!els || !els.length) {
            return;
        }

        var elsArr = this.getElArr(els);
        var width = 0;

        elsArr.forEach(function (el) {
            width += this.getElWidth(el);
        }, this);

        return width;
    }

};
