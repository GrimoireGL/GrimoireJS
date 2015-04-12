var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var jThree;
(function (jThree) {
    var Color;
    (function (Color) {
        var Color4 = (function (_super) {
            __extends(Color4, _super);
            function Color4(r, g, b, a) {
                _super.call(this);
                this.a = a;
                this.r = r;
                this.g = g;
                this.b = b;
            }
            Object.defineProperty(Color4.prototype, "ElementCount", {
                get: function () {
                    return 4;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color4.prototype, "A", {
                get: function () {
                    return this.a;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color4.prototype, "R", {
                get: function () {
                    return this.r;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color4.prototype, "G", {
                get: function () {
                    return this.g;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color4.prototype, "B", {
                get: function () {
                    return this.b;
                },
                enumerable: true,
                configurable: true
            });
            return Color4;
        })(jThree.Mathematics.Vector.VectorBase);
        Color.Color4 = Color4;
    })(Color = jThree.Color || (jThree.Color = {}));
})(jThree || (jThree = {}));
//# sourceMappingURL=Color.js.map