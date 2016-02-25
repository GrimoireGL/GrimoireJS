import ResourceWrapper from "../ResourceWrapper";
import Canvas from "../../Canvas/Canvas";
import RBO from "./RBO";
/**
 * Provides wrapper class for Render Buffer Object depending on particular WebGLRenderingContext.
 * Most of user may have no reason to modify by themselves.
 */
class RBOWrapper extends ResourceWrapper {
	/**
	 *	Reference to the WebGLRenderbuffer this class managing.
	  */
  private _targetRBO: WebGLRenderbuffer;

  public get Target(): WebGLRenderbuffer {
    return this._targetRBO;
  }
	/**
	 * The parent RBOWrapper container class.
	 */
  private _parent: RBO;

  constructor(canvas: Canvas, parentRBO: RBO) {
    super(canvas);
    this._parent = parentRBO;
  }

  public init(): void {
    if (this.Initialized) { return; }
    this._targetRBO = this.GL.createRenderbuffer();
    this.bind();
    this.GL.renderbufferStorage(this.GL.RENDERBUFFER, this._parent.Format, this._parent.Width, this._parent.Height);
    this.setInitialized();
  }

  public bind(): void {
    this.GL.bindRenderbuffer(this.GL.RENDERBUFFER, this._targetRBO);
  }

  public resize(width: number, height: number): void {
    if (this.Initialized) {
      this.bind();
      this.GL.renderbufferStorage(this.GL.RENDERBUFFER, this._parent.Format, this._parent.Width, this._parent.Height);
    }
  }

  public dispose(): void {
    if (this._targetRBO) {
      this.GL.deleteRenderbuffer(this._targetRBO);
      this._targetRBO = null;
      this.setInitialized(false);
    }
  }
}
export default RBOWrapper;
