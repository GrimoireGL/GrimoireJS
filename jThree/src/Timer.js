var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var jThree;
(function (jThree) {
    var JThreeObject = jThree.Base.jThreeObject;
    var Timer = (function (_super) {
        __extends(Timer, _super);
        function Timer() {
            _super.call(this);
            this.currentFrame = 0;
            this.time = 0;
            this.timeFromLast = 0;
        }
        Object.defineProperty(Timer.prototype, "CurrentFrame", {
            get: function () {
                return this.currentFrame;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timer.prototype, "Time", {
            get: function () {
                return this.time;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timer.prototype, "TimeFromLast", {
            get: function () {
                return this.timeFromLast;
            },
            enumerable: true,
            configurable: true
        });
        return Timer;
    })(JThreeObject);
    jThree.Timer = Timer;
    var ContextTimer = (function (_super) {
        __extends(ContextTimer, _super);
        function ContextTimer() {
            _super.apply(this, arguments);
        }
        ContextTimer.prototype.updateTimer = function () {
            this.currentFrame++;
            var date = Date.now();
            this.TimeFromLast = date - this.Time;
            this.time = date;
        };
        return ContextTimer;
    })(Timer);
    jThree.ContextTimer = ContextTimer;
})(jThree || (jThree = {}));
//# sourceMappingURL=Timer.js.map