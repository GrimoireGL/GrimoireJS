import GomlAttribute = require("../../GomlAttribute");
import SceneObjectNodeBase = require("./SceneObjectNodeBase");
import BasicMeshObject = require("../../../Core/SceneObjects/BasicMeshObject");
import GeometryNodeBase = require("../Geometries/GeometryNodeBase");
import MaterialNode = require("../Materials/MaterialNodeBase");
import Material = require("../../../Core/Materials/Material");
import Geometry = require("../../../Core/Geometries/Base/Geometry");

class MeshNode extends SceneObjectNodeBase {
  constructor() {
    super();
    this.attributes.defineAttribute({
      "geo": {
        value: undefined,
        converter: "string",
        onchanged: this._onGeoAttrChanged.bind(this),
      },
      "mat": {
        value: undefined,
        converter: "string",
        onchanged: this._onMatAttrChanged.bind(this),
      }
    });
  }

  private geo: string = null;
  private mat: string = null;

  /**
   * Geomatry instance
   * @type {Geometry}
   */
  private geo_instance: Geometry = null;

  /**
   * Material instance
   */
  private mat_instance: Material = null;

  protected onMount(): void {
    super.onMount();
  }

  /**
   * Called when geo attribute is changed
   * @param {GomlAttribute} attr [description]
   */
  private _onGeoAttrChanged(attr: GomlAttribute): void {
    this.geo = attr.Value;
    this.geo_instance = null;
    // console.warn("onGeoAttrChanged", attr.Value);
    this.nodeImport("jthree.resource.geometry", this.geo, (geo: GeometryNodeBase) => {
      if (geo) {
        this.geo_instance = geo.TargetGeometry;
      } else {
        this.geo_instance = null;
      }
      this._updateTarget();
    });
  }

  /**
   * Called when mat attribute is changed
   * @param {GomlAttribute} attr [description]
   */
  private _onMatAttrChanged(attr: GomlAttribute): void {
    this.mat = attr.Value;
    this.mat_instance = null;
    // console.warn("onMatAttrChanged", attr.Value);
    this.nodeImport("jthree.resource.material", this.mat, (mat: MaterialNode) => {
      if (mat) {
        this.mat_instance = mat.TargetMaterial;
      } else {
        this.mat_instance = null;
      }
      this._updateTarget();
    });
  }

  private _updateTarget(): void {
    if (this.geo_instance && this.mat_instance) {
      this.TargetSceneObject = new BasicMeshObject(this.geo_instance, this.mat_instance);
    }
  }
}

export = MeshNode;
