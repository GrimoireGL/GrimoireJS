import JThreeObject = require("../Base/JThreeObject");
import RendererStateChangedType = require("./ListStateChangedType");
import ContextManagerBase = require("./ContextManagerBase");

class CanvasListChangedEventArgs extends JThreeObject
{
  constructor(private changeType: RendererStateChangedType, private affectedRenderer: ContextManagerBase) {
      super();
  }


  /**
   * the type of changing to renderer
   */
    public get ChangeType(): RendererStateChangedType {
      return this.changeType;
  }

  /**
   * the renderer affected
   */
    public get AffectedRenderer(): ContextManagerBase {
      return this.affectedRenderer;
  }
}

export=CanvasListChangedEventArgs;
