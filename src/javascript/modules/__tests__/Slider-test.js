jest.dontMock('../Slider');

var Slider = require('../Slider');

describe('Slider Module', function () {

    it('should throw an error if the first argument is not an instance of HTMLElement', function () {

        expect(function () {
            new Slider()
        }).toThrow('First parameter must be of type HTMLElement');

    });

});
