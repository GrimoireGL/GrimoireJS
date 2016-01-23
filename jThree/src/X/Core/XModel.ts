import XPrimaryMaterial = require("./XPrimaryBufferMaterial");
import XMaterial = require("./XMaterial");
import XGeometry = require("./XGeometry");
import XFileData = require("../XFileData");
import SceneObject = require("../../Core/SceneObject");
class XModel extends SceneObject {
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

export = XModel;
