import JThreeObjectEEWithID from "../../Base/JThreeObjectEEWithID";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
/**
 * Abstract class to provide mouse tracking feature on a part of region on canvas.
 * This class is intended to be used in Canvas and viewport renderer.
 *
 * キャンバス内の特定領域におけるマウスイベントを管理するためのクラス。
 * 主にキャンバス自身や、ビューポートを持つレンダラによる使用を想定されている。
 */
class CanvasRegion extends JThreeObjectEEWithID {
    /**
     * Constructor
     * @param  {HTMLCanvasElement} canvasElement the canvas element which contains this region
     */
    constructor(canvasElement) {
        super();
        /**
         * Whether mouse is on the region or not.
         *
         * マウスが現在このクラスが管理する領域の上に乗っているかどうか。
         */
        this.mouseOver = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.lastMouseDownX = 0;
        this.lastMouseDownY = 0;
        this.mouseDownTracking = false;
        this.mouseLocalX = 0;
        this.mouseLocalY = 0;
        this.canvasElement = canvasElement;
        this.canvasElement.addEventListener("mousemove", this._mouseMoveHandler.bind(this), false);
        this.canvasElement.addEventListener("mouseenter", this._mouseEnterHandler.bind(this), false);
        this.canvasElement.addEventListener("mouseleave", this._mouseLeaveHandler.bind(this), false);
        this.canvasElement.addEventListener("mousedown", this._mouseDownHandler.bind(this), false);
        this.canvasElement.addEventListener("mouseup", this._mouseUpHandler.bind(this), false);
        this.canvasElement.addEventListener("touchend", this._mouseUpHandler.bind(this), false);
        this.canvasElement.addEventListener("touchstart", this._mouseDownHandler.bind(this), false);
        this.canvasElement.addEventListener("touchmove", this._mouseMoveHandler.bind(this), false);
        this.name = this.ID;
    }
    /**
     * The region managed by this class.(This getter should be overridden)
     *
     * このクラスによって管理されている領域(このgetterはオーバーライドされるべきものです。)
     */
    get region() {
        return null;
    }
    /**
     * Dispose used objects and event handlers.
     *
     *使ったオブジェクトやイベントハンドラの破棄
     */
    dispose() {
        this.canvasElement.removeEventListener("mousemove", this._mouseMoveHandler, false);
        this.canvasElement.removeEventListener("mouseenter", this._mouseEnterHandler, false);
        this.canvasElement.removeEventListener("mouseleave", this._mouseLeaveHandler, false);
        return;
    }
    _checkMouseInside(e) {
        // TODO fix bug here
        const rect = this.canvasElement.getBoundingClientRect();
        this.lastMouseX = this.mouseX;
        this.lastMouseY = this.mouseY;
        let clientX;
        if (typeof e.clientX === "undefined") {
            clientX = e.touches[0].clientX;
        }
        else {
            clientX = e.clientX;
        }
        let clientY;
        if (typeof e.clientY === "undefined") {
            clientY = e.touches[0].clientY;
        }
        else {
            clientY = e.clientY;
        }
        this.mouseX = clientX - rect.left;
        this.mouseY = clientY - rect.top;
        this.mouseOver = this.region.contains(this.mouseX, this.mouseY);
        const localPos = this.region.toLocal(this.mouseX, this.mouseY);
        this.mouseLocalX = localPos[0];
        this.mouseLocalY = localPos[1];
        const debug = JThreeContext.getContextComponent(ContextComponents.Debugger);
        debug.setInfo(`MouseState:${this.name}(${this.getTypeName()})`, {
            mouseOver: this.mouseOver,
            mousePositionX: this.mouseX,
            mousePositionY: this.mouseY,
            rawX: this.mouseX,
            rawY: this.mouseY
        });
        return this.mouseOver;
    }
    _mouseMoveHandler(e) {
        this._checkMouseInside(e);
        this.emit("mouse-move", {
            eventSource: e,
            enter: false,
            leave: false,
            mouseOver: this.mouseOver,
            region: this,
            mouseX: this.mouseX,
            mouseY: this.mouseY,
            mouseDownTracking: this.mouseDownTracking,
            trackDiffX: this.mouseX - this.lastMouseDownX,
            trackDiffY: this.mouseY - this.lastMouseDownY,
            diffX: this.mouseX - this.lastMouseX,
            diffY: this.mouseY - this.lastMouseY
        });
    }
    _mouseLeaveHandler(e) {
        this._checkMouseInside(e);
        if (this.mouseDownTracking) {
            this.mouseDownTracking = false;
        }
        this.emit("mouse-leave", {
            eventSource: e,
            enter: false,
            leave: true,
            mouseOver: this.mouseOver,
            mouseX: this.mouseX,
            mouseY: this.mouseY,
            region: this,
            diffX: this.mouseX - this.lastMouseX,
            diffY: this.mouseY - this.lastMouseY
        });
    }
    _mouseEnterHandler(e) {
        this._checkMouseInside(e);
        this.emit("mouse-enter", {
            eventSource: e,
            enter: true,
            leave: false,
            mouseOver: this.mouseOver,
            mouseX: this.mouseX,
            mouseY: this.mouseY,
            region: this,
            diffX: this.mouseX - this.lastMouseX,
            diffY: this.mouseY - this.lastMouseY
        });
    }
    _mouseDownHandler(e) {
        this._checkMouseInside(e);
        if (this.mouseOver) {
            this.mouseDownTracking = true;
            this.lastMouseDownX = this.mouseX;
            this.lastMouseDownY = this.mouseY;
        }
        this.emit("mouse-down", {
            enter: false,
            leave: false,
            mouseOver: this.mouseOver,
            mouseX: this.mouseX,
            mouseY: this.mouseY,
            region: this,
            diffX: this.mouseX - this.lastMouseX,
            diffY: this.mouseY - this.lastMouseY
        });
    }
    _mouseUpHandler(e) {
        this._checkMouseInside(e);
        if (this.mouseDownTracking) {
            this.mouseDownTracking = false;
        }
        this.emit("mouse-up", {
            enter: false,
            leave: false,
            mouseOver: this.mouseOver,
            mouseX: this.mouseX,
            mouseY: this.mouseY,
            region: this,
            mouseDownTracking: this.mouseDownTracking,
            trackDiffX: this.mouseX - this.lastMouseDownX,
            trackDiffY: this.mouseY - this.lastMouseDownY,
            diffX: this.mouseX - this.lastMouseX,
            diffY: this.mouseY - this.lastMouseY
        });
    }
}
export default CanvasRegion;
