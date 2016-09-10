var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
var GrimoireInterface_1 = require("./Core/GrimoireInterface");
var GomlLoader_1 = require("./Core/Node/GomlLoader");
/**
 * Provides procedures for initializing.
 */
var GrimoireInitializer = (function () {
    function GrimoireInitializer() {
    }
    /**
     * Start initializing
     * @return {Promise<void>} The promise which will be resolved when all of the Goml script was loaded.
     */
    GrimoireInitializer.initialize = function () {
        GrimoireInitializer._copyGLConstants();
        yield GrimoireInitializer._waitForDOMLoading();
        yield GrimoireInterface_1["default"].resolvePlugins();
        yield GomlLoader_1["default"].loadForPage();
    };
    /**
     * Ensure WebGLRenderingContext.[CONSTANTS] is exisiting.
     * Some of the browsers contains them in prototype.
     */
    GrimoireInitializer._copyGLConstants = function () {
        if (WebGLRenderingContext.ONE) {
            // Assume the CONSTANTS are already in WebGLRenderingContext
            // Chrome,Firefox,IE,Edge...
            return;
        }
        // Otherwise like ""Safari""
        for (var propName in WebGLRenderingContext.prototype) {
            if (/^[A-Z]/.test(propName)) {
                var property = WebGLRenderingContext.prototype[propName];
                WebGLRenderingContext[propName] = property;
            }
        }
    };
    /**
     * Obtain the promise object which will be resolved when DOMContentLoaded event was rised.
     * @return {Promise<void>} the promise
     */
    GrimoireInitializer._waitForDOMLoading = function () {
        return new Promise(function (resolve) {
            window.addEventListener("DOMContentLoaded", function () {
                resolve();
            });
        });
    };
    return GrimoireInitializer;
})();
/**
 * Just start the process.
 */
GrimoireInitializer.initialize();
exports["default"] = GrimoireInterface_1["default"];
