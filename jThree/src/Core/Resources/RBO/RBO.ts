import ContextSafeResourceContainer from "./../ContextSafeResourceContainer";
import RBOWrapper from "./RBOWrapper";
import RBOInternalFormatType from "../../../Wrapper/RBO/RBOInternalFormat";
import Canvas from "../../../Core/Canvas";
class RBO extends ContextSafeResourceContainer<RBOWrapper> {
  constructor(width: number, height: number, format: RBOInternalFormatType = RBOInternalFormatType.DepthComponent16) {
    super();
    this.width = width;
    this.height = height;
    this.format = format;
    this.initializeForFirst();
  }

  private width: number;
  private height: number;
  private format: RBOInternalFormatType;
  public get Width(): number {
    return this.width;
  }

  public get Height(): number {
    return this.height;
  }

  public get Format(): RBOInternalFormatType {
    return this.format;
  }

  protected getInstanceForRenderer(renderer: Canvas): RBOWrapper {
    return new RBOWrapper(renderer, this);
  }

  protected disposeResource(resource: RBOWrapper): void {
    return;
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
