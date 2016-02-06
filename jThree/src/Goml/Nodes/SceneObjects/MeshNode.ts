import GomlAttribute from "../../GomlAttribute";
import SceneObjectNodeBase from "./SceneObjectNodeBase";
import BasicMeshObject from "../../../Core/SceneObjects/BasicMeshObject";
import GeometryNodeBase from "../Geometries/GeometryNodeBase";
import MaterialNode from "../Materials/MaterialNodeBase";
import Material from "../../../Core/Materials/Material";
import Geometry from "../../../Core/Geometries/Base/Geometry";

class MeshNode extends SceneObjectNodeBase<BasicMeshObject> {
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
    this.nodeImport("jthree.resource.geometry", this.geo, (geo: GeometryNodeBase<Geometry>) => {
      if (geo) {
        this.geo_instance = geo.target;
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
    this.nodeImport("jthree.resource.material", this.mat, (mat: MaterialNode<Material>) => {
      if (mat) {
        this.mat_instance = mat.target;
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

export default MeshNode;
