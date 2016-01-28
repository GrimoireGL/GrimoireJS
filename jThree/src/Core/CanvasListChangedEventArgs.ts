import JThreeObject = require("../Base/JThreeObject");
import RendererStateChangedType = require("./ListStateChangedType");
import Canvas = require("./Canvas");

class CanvasListChangedEventArgs extends JThreeObject
{
  constructor(private changeType: RendererStateChangedType, private affectedRenderer: Canvas) {
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
    public get AffectedRenderer(): Canvas {
      return this.affectedRenderer;
  }
}

export=CanvasListChangedEventArgs;
