module.exports = {

    throwError: function (msg, moduleName) {
        throw new Error(moduleName || '' + msg);
    }

};
