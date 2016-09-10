/**
 * Most based object for any Grimoire.js related classes.
 * @type {[type]}
 */
var IDObject = (function () {
    function IDObject() {
        this.id = IDObject.getUniqueRandom(10);
    }
    /**
     * Generate random string
     * @param  {number} length length of random string
     * @return {string}        generated string
     */
    IDObject.getUniqueRandom = function (length) {
        return Math.random().toString(36).slice(-length);
    };
    /**
     * Obtain stringfied object.
     * If this method was not overridden, this method return class name.
     * @return {string} stringfied object
     */
    IDObject.prototype.toString = function () {
        return this.getTypeName();
    };
    /**
     * Obtain class name
     * @return {string} Class name of the instance.
     */
    IDObject.prototype.getTypeName = function () {
        var funcNameRegex = /function (.{1,})\(/;
        var result = (funcNameRegex).exec((this).constructor.toString());
        return (result && result.length > 1) ? result[1] : "";
    };
    return IDObject;
})();
exports["default"] = IDObject;
