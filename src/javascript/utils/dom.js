module.exports = {

    getElArr: function (els) {

        return [].slice.call(els);

    },


    getElWidth: function (el) {

        return el.getBoundingClientRect().width || el.offsetWidth;

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
