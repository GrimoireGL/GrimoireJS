import FBOWrapper from "./FBOWrapper";
import ContextSafeResourceContainer from "./../ContextSafeResourceContainer";
import Canvas from "../../Canvas/Canvas";
class FBO extends ContextSafeResourceContainer<FBOWrapper> {
  constructor() {
    super();
    this.initializeForFirst();
  }

  protected __createWrapperForCanvas(canvas: Canvas): FBOWrapper {
    return new FBOWrapper(canvas);
  }
}

export default FBO;
