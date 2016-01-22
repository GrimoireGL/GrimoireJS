import ContextSafeResourceContainer = require("./../ContextSafeResourceContainer");
import VAOWrapper = require("./VAOWrapper");
import RBOInternalFormatType = require("../../../Wrapper/RBO/RBOInternalFormat");
import Canvas = require("../../../Core/Canvas");
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

export = VAO;
