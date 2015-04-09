var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="../_references.ts"/>
var jThree;
(function (jThree) {
    var Events;
    (function (Events) {
        var jThreeObject = jThree.Base.jThreeObject;
        /**
         * レンダラーの状況の変更内容を示す列挙体
         */
        (function (RendererStateChangedType) {
            RendererStateChangedType[RendererStateChangedType["Add"] = 0] = "Add";
            RendererStateChangedType[RendererStateChangedType["Delete"] = 1] = "Delete";
        })(Events.RendererStateChangedType || (Events.RendererStateChangedType = {}));
        var RendererStateChangedType = Events.RendererStateChangedType;
        /**
         * レンダラーの変更を通知するイベント
         */
        var RendererListChangedEventArgs = (function (_super) {
            __extends(RendererListChangedEventArgs, _super);
            function RendererListChangedEventArgs(changeType, affectedRenderer) {
                _super.call(this);
                this.changeType = changeType;
                this.affectedRenderer = affectedRenderer;
            }
            Object.defineProperty(RendererListChangedEventArgs.prototype, "ChangeType", {
                /**
                 * レンダラへの変更の種類
                 */
                get: function () {
                    return this.changeType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RendererListChangedEventArgs.prototype, "AffectedRenderer", {
                /**
                 * 影響を受けたレンダラ
                 */
                get: function () {
                    return this.affectedRenderer;
                },
                enumerable: true,
                configurable: true
            });
            return RendererListChangedEventArgs;
        })(jThreeObject);
        Events.RendererListChangedEventArgs = RendererListChangedEventArgs;
    })(Events = jThree.Events || (jThree.Events = {}));
})(jThree || (jThree = {}));
//# sourceMappingURL=Event.RendererState.js.map