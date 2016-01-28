import XModel = require("../Core/XModel");
import SceneObjectNodeBase = require("./../../Goml/Nodes/SceneObjects/SceneObjectNodeBase");

class XNode extends SceneObjectNodeBase {

  private _model: XModel;

  constructor() {
    super();
    this.attributes.defineAttribute({
      "src": {
        converter: "string",
        value: "",
      }
    });
  }

  public onMount(): void {
    super.onMount();
    XModel.fromUrl(this.attributes.getValue("src"))
      .then((m) => {
      this._model = m;
      this.TargetSceneObject = m;
    });
  }
}

export = XNode;
