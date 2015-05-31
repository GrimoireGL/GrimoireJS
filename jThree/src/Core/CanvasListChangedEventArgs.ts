import JThreeObject = require('../Base/JThreeObject');
import RendererStateChangedType = require("./ListStateChangedType");
import ContextManagerBase = require("./ContextManagerBase");

class CanvasListChangedEventArgs extends JThreeObject
{
  constructor(private changeType: RendererStateChangedType, private affectedRenderer: ContextManagerBase) {
      super();
  }


  /**
   * レンダラへの変更の種類
   */
  get ChangeType(): RendererStateChangedType {
      return this.changeType;
  }

  /**
   * 影響を受けたレンダラ
   */
  get AffectedRenderer(): ContextManagerBase {
      return this.affectedRenderer;
  }
}

export=CanvasListChangedEventArgs;
