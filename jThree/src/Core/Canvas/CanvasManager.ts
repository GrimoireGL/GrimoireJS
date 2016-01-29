import IContextComponent from "../../IContextComponent";
import ContextComponents from "../../ContextComponents";
import Canvas from "./Canvas";
import JThreeEvent from "../../Base/JThreeEvent";
import CanvasListChangedEventArgs from "./CanvasListChangedEventArgs";
import ListStateChangedType from "../ListStateChangedType";
/**
 * A context component provides the feature to manage all of canvas.
 *
 *すべてのCanvasを管理する機能を提供するコンテキストコンポーネント
 * @type {[type]}
 */
class CanvasManager implements IContextComponent {

  /**
   * All canvas managed by jThree
   * @type {Canvas[]}
   */
  public canvases: Canvas[] = [];

  /**
   * Event object notifying when canvas list is changed
   * @type {JThreeEvent<CanvasListChangedEventArgs>}
   */
  public canvasListChanged: JThreeEvent<CanvasListChangedEventArgs> = new JThreeEvent<CanvasListChangedEventArgs>();

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
      this.canvasListChanged.fire(this, new CanvasListChangedEventArgs(ListStateChangedType.Add, canvas));
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
      this.canvasListChanged.fire(this, new CanvasListChangedEventArgs(ListStateChangedType.Delete, canvas));
    }
  }

  public beforeRenderAll() {
    this.canvases.forEach((c) => c.beforeRenderAll());
  }

  public afterRenderAll() {
    this.canvases.forEach((c) => c.afterRenderAll());
  }
}

export default CanvasManager;
