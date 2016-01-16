import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlAttribute = require("../../GomlAttribute");
import SceneObjectNodeBase = require("./SceneObjectNodeBase");
import SceneNode = require("../SceneNode");
import SceneObject = require("../../../Core/SceneObject");
import BasicMeshObject = require("../../../Shapes/BasicMeshObject");
import GeometryNodeBase = require("../Geometries/GeometryNodeBase");
import MaterialNode = require("../Materials/MaterialNodeBase");
import SolidColor = require("../../../Core/Materials/Forward/SolidColorMaterial");
import Material = require('../../../Core/Materials/Material');
import Geometry = require('../../../Core/Geometries/Geometry');
import Delegate = require('../../../Base/Delegates');

class MeshNode extends SceneObjectNodeBase {
  constructor() {
    super();
    this.attributes.defineAttribute({
      'geo': {
        value: undefined,
        converter: 'string',
        onchanged: this._onGeoAttrChanged.bind(this),
      },
      'mat': {
        value: undefined,
        converter: 'string',
        onchanged: this._onMatAttrChanged.bind(this),
      }
    });
  }

  private geo: string;
  private mat: string;

  /**
   * Geomatry instance
   * @type {Geometry}
   */
  private geo_instance: Geometry;

  /**
   * Material instance
   * If this has not defined yet, initialize with SolidColor
   */
  private mat_instance: Material = new SolidColor();

  /**
   * Called when geo attribute is changed
   * @param {GomlAttribute} attr [description]
   */
  private _onGeoAttrChanged(attr: GomlAttribute): void {
    this.geo = attr.Value;
    this.geo_instance = null;
    this.nodeImport("jthree.geometries", this.geo, (geo: GeometryNodeBase) => {
      this.geo_instance = geo.TargetGeometry;
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
    this.nodeImport("jthree.materials", this.mat, (mat: MaterialNode) => {
      this.mat_instance = mat.targetMaterial;
      this._updateTarget();
    });
  }

  private _updateTarget(): void {
    if (this.geo_instance) {
      this.targetSceneObject = new BasicMeshObject(this.geo_instance, this.mat_instance ? this.mat_instance : new SolidColor());
    }
  }

  /**
   * Construct target mesh on mount
   * @param {Delegate.Action1<SceneObject>} callbackfn called when target scene object is constructed
   */
  protected ConstructTarget(callbackfn: Delegate.Action1<SceneObject>): void {

  }

  public onMount(): void {
    super.onMount();
    this.geo = this.attributes.getValue('geo'); // TODO: pnly
    this.mat = this.attributes.getValue('mat'); // TODO: pnly
  }
}

export = MeshNode;
