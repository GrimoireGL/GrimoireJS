var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var jThree;
(function (jThree) {
    var Mathematics;
    (function (Mathematics) {
        var jThreeObject = jThree.Base.jThreeObject;
        var DegreeMilliSecoundUnitConverter = (function (_super) {
            __extends(DegreeMilliSecoundUnitConverter, _super);
            function DegreeMilliSecoundUnitConverter() {
                _super.apply(this, arguments);
            }
            DegreeMilliSecoundUnitConverter.prototype.toRadian = function (val) {
                return jThreeMath.PI / 180 * val;
            };
            DegreeMilliSecoundUnitConverter.prototype.fromRadian = function (radian) {
                return 180 / jThreeMath.PI * radian;
            };
            DegreeMilliSecoundUnitConverter.prototype.toMilliSecound = function (val) {
                return val * 1000;
            };
            DegreeMilliSecoundUnitConverter.prototype.fromMilliSecound = function (milliSecound) {
                return milliSecound / 1000;
            };
            return DegreeMilliSecoundUnitConverter;
        })(jThreeObject);
        Mathematics.DegreeMilliSecoundUnitConverter = DegreeMilliSecoundUnitConverter;
        var jThreeMath = (function (_super) {
            __extends(jThreeMath, _super);
            function jThreeMath(unitConverter) {
                _super.call(this);
                this.converter = unitConverter || new DegreeMilliSecoundUnitConverter();
            }
            jThreeMath.prototype.radianResult = function (f) {
                return this.converter.fromRadian(f());
            };
            jThreeMath.prototype.radianRequest = function (v, f) {
                return f(this.converter.toRadian(v));
            };
            jThreeMath.prototype.getCurrentConverter = function () {
                return this.converter;
            };
            /**
             * 正弦
             */
            jThreeMath.prototype.sin = function (val) {
                return this.radianRequest(val, function (val) {
                    return Math.sin(val);
                });
            };
            /**
             * 余弦
             */
            jThreeMath.prototype.cos = function (val) {
                return this.radianRequest(val, function (val) {
                    return Math.cos(val);
                });
            };
            /**
             * 正接
             */
            jThreeMath.prototype.tan = function (val) {
                return this.radianRequest(val, function (val) {
                    return Math.tan(val);
                });
            };
            jThreeMath.prototype.asin = function (val) {
                return this.radianResult(function () {
                    return Math.asin(val);
                });
            };
            jThreeMath.prototype.acos = function (val) {
                return this.radianResult(function () {
                    return Math.acos(val);
                });
            };
            jThreeMath.prototype.atan = function (val) {
                return this.radianResult(function () {
                    return Math.atan(val);
                });
            };
            jThreeMath.range = function (val, lower, higher) {
                if (val >= lower && val < higher) {
                    return true;
                }
                else {
                    return false;
                }
            };
            jThreeMath.PI = Math.PI;
            jThreeMath.E = Math.E;
            return jThreeMath;
        })(jThreeObject);
        Mathematics.jThreeMath = jThreeMath;
    })(Mathematics = jThree.Mathematics || (jThree.Mathematics = {}));
})(jThree || (jThree = {}));
//# sourceMappingURL=Math.js.map