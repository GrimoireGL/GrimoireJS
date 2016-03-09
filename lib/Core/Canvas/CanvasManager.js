import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import JThreeEvent from "../../Base/JThreeEvent";
/**
 * A context component provides the feature to manage all of canvas.
 *
 *すべてのCanvasを管理する機能を提供するコンテキストコンポーネント
 * @type {[type]}
 */
class CanvasManager {
    constructor() {
        /**
         * All canvas managed by jThree
         * @type {Canvas[]}
         */
        this.canvases = [];
        /**
         * Event object notifying when canvas list is changed
         * @type {JThreeEvent<CanvasListChangedEventArgs>}
         */
        this.canvasListChanged = new JThreeEvent();
        const loopManager = JThreeContext.getContextComponent(ContextComponents.LoopManager);
        loopManager.addAction(4000, () => this.beforeRenderAll());
        loopManager.addAction(6000, () => this.afterRenderAll());
    }
    /**
     * Implementation for IContextComponent
     */
    getContextComponentIndex() {
        return ContextComponents.CanvasManager;
    }
    /**
     * Add canvas to be managed.
     * @param {Canvas} canvas [description]
     */
    addCanvas(canvas) {
        if (this.canvases.indexOf(canvas) === -1) {
            this.canvases.push(canvas);
            this.canvasListChanged.fire(this, {
                isAdditionalChange: true,
                canvas: canvas
            });
        }
    }
    /**
     * Remove canvas from managed canvas list.
     */
    removeCanvas(canvas) {
        if (this.canvases.indexOf(canvas) !== -1) {
            for (let i = 0; i < this.canvases.length; i++) {
                if (this.canvases[i] === canvas) {
                    this.canvases.splice(i, 1);
                    break;
                }
            }
            this.canvasListChanged.fire(this, {
                isAdditionalChange: true,
                canvas: canvas
            });
        }
    }
    beforeRenderAll() {
        this.canvases.forEach((c) => c.beforeRenderAll());
        return;
    }
    afterRenderAll() {
        this.canvases.forEach((c) => c.afterRenderAll());
        return;
    }
}
export default CanvasManager;
