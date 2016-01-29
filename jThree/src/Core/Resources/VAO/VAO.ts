import ContextSafeResourceContainer from "./../ContextSafeResourceContainer";
import VAOWrapper from "./VAOWrapper";
import RBOInternalFormatType from "../../../Wrapper/RBO/RBOInternalFormat";
import Canvas from "../../../Core/Canvas/Canvas";
class VAO extends ContextSafeResourceContainer<VAOWrapper>
{
  constructor() {
    super();
    this.initializeForFirst();
  }

  protected getInstanceForRenderer(renderer: Canvas): VAOWrapper {
    return new VAOWrapper(renderer, this);
  }

  protected disposeResource(resource: VAOWrapper): void {
			return;
  }
}

export default VAO;
