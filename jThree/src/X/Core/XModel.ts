import XPrimaryMaterial from "./XPrimaryBufferMaterial";
import XMaterial from "./XMaterial";
import XGeometry from "./XGeometry";
import XFileData from "../XFileData";
import SceneObject from "../../Core/SceneObjects/SceneObject";
import Q from "q";
class XModel extends SceneObject {

  public static fromUrl(src: string): Q.IPromise<XModel> {
    return XFileData.loadFile(src).then(data => {
      return new XModel(data);
    });
  }

  private _modelData: XFileData;

  constructor(modelData: XFileData) {
    super();
    this._modelData = modelData;
    this.Geometry = new XGeometry(modelData);
    this._modelData.materials.forEach((material) => {
      this.addMaterial(new XMaterial(material));
      this.addMaterial(new XPrimaryMaterial(material));
    });
  }
}

export default XModel;
