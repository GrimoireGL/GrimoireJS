import JThreeObjectEE from "../../Base/JThreeObjectEE";
import LoopManager from "../LoopManager";
import JThreeContext from "../../JThreeContext";
import IContextComponent from "../../IContextComponent";
import ContextComponents from "../../ContextComponents";
import Canvas from "./Canvas";
import ICanvasListChangedEventArgs from "./ICanvasListChangedEventArgs";
/**
 * A context component provides the feature to manage all of canvas.
 *
 *すべてのCanvasを管理する機能を提供するコンテキストコンポーネント
 * @type {[type]}
 */
class CanvasManager extends JThreeObjectEE implements IContextComponent {

  constructor() {
    super();
    this.setMaxListeners(10000);
    const loopManager = JThreeContext.getContextComponent<LoopManager>(ContextComponents.LoopManager);
    loopManager.addAction(4000, () => this.beforeRenderAll());
    loopManager.addAction(6000, () => this.afterRenderAll());
  }

  /**
   * All canvas managed by jThree
   * @type {Canvas[]}
   */
  public canvases: Canvas[] = [];

  /**
   * Implementation for IContextComponent
   */
  public getContextComponentIndex(): number {
    return ContextComponents.CanvasManager;
  }
  /**
   * Add canvas to be managed.
   * @param {Canvas} canvas [description]
   */
  public addCanvas(canvas: Canvas): void {
    if (this.canvases.indexOf(canvas) === -1) {
      this.canvases.push(canvas);
      this.emit("canvas-list-changed", <ICanvasListChangedEventArgs> {
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

export default CanvasManager;
