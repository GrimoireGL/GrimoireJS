import NamedValue from "../../Base/NamedValue";
import IDisposable from "../../Base/IDisposable";
import EEObject from "../../Base/EEObject";
import Canvas from "../Canvas/Canvas";
import {AbstractClassMethodCalledException} from "../../Exceptions";
import CanvasListChangedEventArgs from "../Canvas/ICanvasListChangedEventArgs";
import ResourceWrapper from "./ResourceWrapper";
import CanvasManager from "../Canvas/CanvasManager";
/**
 * Provides context difference abstraction.
 */
class ContextSafeResourceContainer<T extends ResourceWrapper> extends EEObject implements IDisposable {

  public name: string;

  private _childWrapper: NamedValue<T> = {};

  private _wrapperLength: number = 0;

  constructor() {
    super();
    // Initialize resources for the renderers already subscribed.
    CanvasManager.on("canvas-list-changed", this._rendererChanged.bind(this));
  }

  public dispose(): void {
    this.each((e) => {
      e.dispose();
    });
  }

  public get wrappers(): T[] {
    const array = new Array(this._wrapperLength);
    let index = 0;
    this.each((elem) => {
      array[index] = elem;
      index++;
    });
    return array;
  }

  public getForGL(gl: WebGLRenderingContext): T {
    return this._getForContextID(gl.id);
  }

  public each(act: (r: T) => void): void {
    for (let key in this._childWrapper) {
      act(this._childWrapper[key]);
    }
  }

  protected __createWrapperForCanvas(canvas: Canvas): T {
    throw new AbstractClassMethodCalledException();
  }

  protected __initializeForFirst(): void {
    CanvasManager.canvases.forEach((v) => {
      this._childWrapper[v.id] = this.__createWrapperForCanvas(v);
      this._wrapperLength++;
    });
  }

  private _getForContextID(id: string): T {
    if (!this._childWrapper[id]) {
      console.log("There is no matching object with the ID:" + id);
    }
    return this._childWrapper[id];
  }

  private _rendererChanged(arg: CanvasListChangedEventArgs): void {
    if (arg.isAdditionalChange) {
      this._childWrapper[arg.canvas.id] = this.__createWrapperForCanvas(arg.canvas);
      this._wrapperLength++;
    } else {
      const delTarget: T = this._childWrapper[arg.canvas.id];
      delete this._childWrapper[arg.canvas.id];
      delTarget.dispose();
      this._wrapperLength--;
    }
  }

}

export default ContextSafeResourceContainer;
