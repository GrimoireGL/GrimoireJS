import GomlAttribute from "../../GomlAttribute";
import SceneObjectNodeBase from "./SceneObjectNodeBase";
import BasicMeshObject from "../../../Core/SceneObjects/BasicMeshObject";
import GeometryNodeBase from "../Geometries/GeometryNodeBase";
import MaterialNode from "../Materials/MaterialNodeBase";
import Material from "../../../Core/Materials/Material";
import Geometry from "../../../Core/Geometries/Base/Geometry";
import ContextComponents from "../../../ContextComponents";
import PrimitiveRegistory from "../../../Core/Geometries/Base/PrimitiveRegistory";
import JThreeContext from "../../../JThreeContext";

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
    this.geo_instance = JThreeContext.getContextComponent<PrimitiveRegistory>(ContextComponents.PrimitiveRegistory).getPrimitive(this.geo);
    if (this.geo_instance) {
      console.log("primitive exist", this.geo);
      this._updateTarget();
    } else {
      console.log("primitive not exist", this.geo);
      this.geo_instance = null;
      this.nodeImport("jthree.resource.geometry", this.geo, (geo: GeometryNodeBase<Geometry>) => {
        if (geo) {
          console.log("geometry reseived", this.geo);
          this.geo_instance = geo.target;
        } else {
          this.geo_instance = null;
        }
        this._updateTarget();
      });
    }
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
