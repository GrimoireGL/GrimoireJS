import XModel from "../Core/XModel";
import SceneObjectNodeBase from "./../../Goml/Nodes/SceneObjects/SceneObjectNodeBase";

class XNode extends SceneObjectNodeBase<XModel> {

  constructor() {
    super();
    this.attributes.defineAttribute({
      "src": {
        converter: "string",
        value: undefined,
        constant: true
      }
    });
  }

  public onMount(): void {
    super.__onMount();
    XModel.fromUrl(this.attributes.getValue("src"))
      .then((m) => {
      this.TargetSceneObject = m;
    });
  }
}

export default XNode;
