import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import SceneObjectNodeBase = require("./SceneObjectNodeBase");
import SceneNode = require("../SceneNode");
import SceneObject = require("../../../Core/SceneObject");
import BasicMeshObject = require("../../../Shapes/BasicMeshObject");
import GeometryNodeBase = require("../Geometries/GeometryNodeBase");
import MaterialNode = require("../Materials/MaterialNodeBase");
import Delegate = require('../../../Base/Delegates');

class MeshNode extends SceneObjectNodeBase {
  private targetMesh: BasicMeshObject;

  constructor() {
    super();
    this.attributes.defineAttribute({
      'geo': {
        value: undefined,
        converter: 'string',
        onchanged: (attr) => {
          this.geo = attr.Value;
          this.ConstructTarget(() => {}); // ????
        }
      },
      'mat': {
        value: undefined,
        converter: 'string',
        onchanged: (attr) => {
          this.mat = attr.Value;
          this.ConstructTarget(() => {}); // ????
        }
      }
    });
  }

  protected ConstructTarget(callbackfn: Delegate.Action1<SceneObject>): void {
    this.nodeManager.nodeRegister.getObject("jthree.geometries", this.Geo, (geo: GeometryNodeBase) => {
      this.nodeManager.nodeRegister.getObject("jthree.materials", this.Mat, (mat: MaterialNode) => {
        this.targetMesh = new BasicMeshObject(geo.TargetGeometry, mat.targetMaterial);
        callbackfn(this.targetMesh);
      });
    });
  }

  public onMount(): void {
    super.onMount();
    this.geo = this.attributes.getValue('geo'); // TODO: pnly
    this.mat = this.attributes.getValue('mat'); // TODO: pnly
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

export = MeshNode;
