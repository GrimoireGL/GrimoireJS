import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import SceneObjectNodeBase = require("./SceneObjectNodeBase");
import SceneNode = require("../SceneNode");
import SceneObject = require("../../../Core/SceneObject");
import BasicMeshObject = require("../../../Shapes/BasicMeshObject");
import GeometryNodeBase = require("../Geometries/GeometryNodeBase");
import MaterialNode = require("../Materials/MaterialNodeBase");
import SolidColor = require("../../../Core/Materials/Forward/SolidColorMaterial");
class GomlTreeMeshNode extends SceneObjectNodeBase {
  private targetMesh: BasicMeshObject;

  constructor() {
    super();
    this.attributes.defineAttribute({
      'geo': {
        value: undefined,
        converter: 'string',
        onchanged: (attr) => {
          this.geo = attr.Value;
          this.ConstructTarget();
        }
      },
      'mat': {
        value: undefined,
        converter: 'string',
        onchanged: (attr) => {
          this.mat = attr.Value;
          this.ConstructTarget();
        }
      }
    });
  }

  protected ConstructTarget(): SceneObject {
    var geo = <GeometryNodeBase>this.nodeManager.nodeRegister.getObject("jthree.geometries", this.Geo);
    var mat = <MaterialNode>this.nodeManager.nodeRegister.getObject("jthree.materials", this.Mat);
    this.targetMesh = new BasicMeshObject(geo.TargetGeometry, mat ? mat.targetMaterial : new SolidColor());
    return this.targetMesh;
  }

  public nodeWillMount(parent) {
    super.nodeWillMount(parent);
  }

  private geo: string;
  public get Geo(): string {
    return this.geo;
  }

  private mat: string;
  public get Mat(): string {
    return this.mat;
  }

}

export =GomlTreeMeshNode;
