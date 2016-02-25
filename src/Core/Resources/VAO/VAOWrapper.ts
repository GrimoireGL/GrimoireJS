import ResourceWrapper from "../ResourceWrapper";
import Canvas from "../../Canvas/Canvas";
import VAO from "./VAO";
import GLExtensionList from "../../Canvas/GLExtensionList";
/**
 * Provides wrapper class for Render Buffer Object depending on particular WebGLRenderingContext.
 * Most of user may have no reason to modify by themselves.
 */
class VAOWrapper extends ResourceWrapper {
	/**
	 *	Reference to the WebGLRenderbuffer this class managing.
	  */
  private _targetVAO: WebGLVertexArrayObject;

  public get Target(): WebGLVertexArrayObject {
    return this._targetVAO;
  }

  private _vaoInterface: WebGLVertexArrayObjectExtension;
	/**
	 * The parent VAOWrapper container class.
	 */
  private _parent: VAO;

  constructor(canvas: Canvas, parentVAO: VAO) {
    super(canvas);
    this._parent = parentVAO;
    this._vaoInterface = canvas.glExtensionResolver.getExtension(GLExtensionList.vertexArrayObject);
  }

  public init(): void {
    if (this.Initialized) {
      return;
    }
    this._targetVAO = this._vaoInterface.createVertexArrayOES();
    this.setInitialized();
  }

  public bind(): void {
    // this.GL.bindRenderbuffer(this.targetVAO);
    this._vaoInterface.bindVertexArrayOES(this._targetVAO);
  }

  public dispose(): void {
    if (this._targetVAO) {
      this._vaoInterface.deleteVertexArrayOES(this._targetVAO);
      this.setInitialized(false);
      this._targetVAO = null;
    }
  }
}
export default VAOWrapper;
