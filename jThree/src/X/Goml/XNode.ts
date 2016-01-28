import XModel from "../Core/XModel";
import SceneObjectNodeBase from "./../../Goml/Nodes/SceneObjects/SceneObjectNodeBase";

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

export default XNode;
