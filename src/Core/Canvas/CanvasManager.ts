import EEObject from "../../Base/EEObject";
import LoopManager from "../LoopManager";
import Canvas from "./Canvas";
import ICanvasListChangedEventArgs from "./ICanvasListChangedEventArgs";
/**
 * A context component provides the feature to manage all of canvas.
 *
 *すべてのCanvasを管理する機能を提供するコンテキストコンポーネント
 * @type {[type]}
 */
class CanvasManager extends EEObject {

    public static instance: CanvasManager;

    /**
     * All canvas managed by jThree
     * @type {Canvas[]}
     */
    public canvases: Canvas[] = [];

    constructor() {
        super();
        this.setMaxListeners(10000);
        LoopManager.addAction(4000, () => this.beforeRenderAll());
        LoopManager.addAction(6000, () => this.afterRenderAll());
    }
    /**
     * Add canvas to be managed.
     * @param {Canvas} canvas [description]
     */
    public addCanvas(canvas: Canvas): void {
        if (this.canvases.indexOf(canvas) === -1) {
            this.canvases.push(canvas);
            this.emit("canvas-list-changed", <ICanvasListChangedEventArgs>{
                isAdditionalChange: true,
                canvas: canvas
            });
        }
    }

    /**
     * Remove canvas from managed canvas list.
     */
    public removeCanvas(canvas: Canvas): void {
        if (this.canvases.indexOf(canvas) !== -1) {
            for (let i = 0; i < this.canvases.length; i++) {
                if (this.canvases[i] === canvas) {
                    this.canvases.splice(i, 1);
                    break;
                }
            }
            this.emit("canvas-list-changed", <ICanvasListChangedEventArgs>{
                isAdditionalChange: true,
                canvas: canvas
            });
        }
    }

    public beforeRenderAll(): void {
        this.canvases.forEach((c) => c.beforeRenderAll());
        return;
    }

    public afterRenderAll(): void {
        this.canvases.forEach((c) => c.afterRenderAll());
        return;
    }
}

CanvasManager.instance = new CanvasManager();

export default CanvasManager.instance;
