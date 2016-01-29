import FBOWrapper from "./FBOWrapper";
import ContextSafeResourceContainer from "./../ContextSafeResourceContainer";
import Canvas from "../../Canvas/Canvas";
class FBO extends ContextSafeResourceContainer<FBOWrapper> {
  constructor() {
    super();
    this.initializeForFirst();
  }

  protected getInstanceForRenderer(renderer: Canvas): FBOWrapper {
    return new FBOWrapper(renderer);
  }
}

export default FBO;
