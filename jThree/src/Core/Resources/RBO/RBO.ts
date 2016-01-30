import ContextSafeResourceContainer from "./../ContextSafeResourceContainer";
import RBOWrapper from "./RBOWrapper";
import Canvas from "../../../Core/Canvas/Canvas";
class RBO extends ContextSafeResourceContainer<RBOWrapper> {
  constructor(width: number, height: number, format: number = WebGLRenderingContext.DEPTH_COMPONENT16) {
    super();
    this.width = width;
    this.height = height;
    this.format = format;
    this.initializeForFirst();
  }

  private width: number;
  private height: number;
  private format: number;
  public get Width(): number {
    return this.width;
  }

  public get Height(): number {
    return this.height;
  }

  public get Format(): number {
    return this.format;
  }

  protected createWrapperForCanvas(canvas: Canvas): RBOWrapper {
    return new RBOWrapper(canvas, this);
  }

  public resize(width: number, height: number) {
    if (this.width !== width || this.height !== height) {
      this.width = width;
      this.height = height;
      this.each(v => (<RBOWrapper>v).resize(width, height));
    }
  }
}

export default RBO;
