import ContextSafeResourceContainer from "./../ContextSafeResourceContainer";
import VAOWrapper from "./VAOWrapper";
import Canvas from "../../../Core/Canvas/Canvas";
class VAO extends ContextSafeResourceContainer<VAOWrapper> {

  constructor() {
    super();
    this.initializeForFirst();
  }

  protected __createWrapperForCanvas(canvas: Canvas): VAOWrapper {
    return new VAOWrapper(canvas, this);
  }


}

export default VAO;
