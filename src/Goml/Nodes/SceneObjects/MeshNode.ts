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

  private _geo: string = null;
  private _mat: string = null;

  /**
   * Geomatry instance
   * @type {Geometry}
   */
  private _geo_instance: Geometry = null;

  /**
   * Material instance
   */
  private _mat_instance: Material = null;

  protected __onMount(): void {
    super.__onMount();
  }

  /**
   * Called when geo attribute is changed
   * @param {GomlAttribute} attr [description]
   */
  private _onGeoAttrChanged(attr: GomlAttribute): void {
    this._geo = attr.Value;
    this._geo_instance = null;
    // console.warn("onGeoAttrChanged", attr.Value);
    this._geo_instance = JThreeContext.getContextComponent<PrimitiveRegistory>(ContextComponents.PrimitiveRegistory).getPrimitive(this._geo);
    if (this._geo_instance) {
      // console.log("primitive exist", this._geo);
      this._updateTarget();
      attr.done();
    } else {
      // console.log("primitive not exist", this._geo);
      this._geo_instance = null;
      this.nodeImport("jthree.resource.geometry", this._geo, (geo: GeometryNodeBase<Geometry>) => {
        if (geo) {
          // console.log("geometry reseived", this._geo);
          this._geo_instance = geo.target;
        } else {
          this._geo_instance = null;
        }
        this._updateTarget();
        attr.done();
      });
    }
  }

  /**
   * Called when mat attribute is changed
   * @param {GomlAttribute} attr [description]
   */
  private _onMatAttrChanged(attr: GomlAttribute): void {
    this._mat = attr.Value;
    this._mat_instance = null;
    // console.warn("onMatAttrChanged", attr.Value);
    this.nodeImport("jthree.resource.material", this._mat, (mat: MaterialNode<Material>) => {
      // console.info("material was updated");
      if (mat) {
        this._mat_instance = mat.target;
      } else {
        this._mat_instance = null;
      }
      this._updateTarget();
      attr.done();
    });
  }

  private _updateTarget(): void {
    // console.info(this._geo_instance, this._mat_instance);
    if (this._geo_instance && this._mat_instance) {
      // console.info("target was updated");
      this.TargetSceneObject = new BasicMeshObject(this._geo_instance, this._mat_instance);
    }
  }
}

export default MeshNode;
