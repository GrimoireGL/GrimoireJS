import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import SceneObjectNodeBase = require("./SceneObjectNodeBase");
import SceneNode = require("../SceneNode");
import SceneObject = require("../../../Core/SceneObject");
import BasicMeshObject = require("../../../Shapes/BasicMeshObject");
import GeometryNodeBase = require("../Geometries/GeometryNodeBase");
import MaterialNode = require("../Materials/MaterialNodeBase");
import SolidColor = require("../../../Core/Materials/SolidColorMaterial");
class GomlTreeMeshNode extends SceneObjectNodeBase
{
  private targetMesh:BasicMeshObject;

  constructor(elem: HTMLElement,parent:GomlTreeNodeBase,parentSceneNode:SceneNode,parentObject:SceneObjectNodeBase)
  {
      super(elem,parent,parentSceneNode,parentObject);
  }

  protected ConstructTarget():SceneObject
  {
    var geo=<GeometryNodeBase>this.nodeManager.nodeRegister.getObject("jthree.geometries",this.Geo);
    var mat=<MaterialNode>this.nodeManager.nodeRegister.getObject("jthree.materials",this.Mat);
    this.targetMesh=new BasicMeshObject(geo.TargetGeometry,mat?mat.targetMaterial:new SolidColor());
    return this.targetMesh;
  }

    public beforeLoad()
  {
    super.beforeLoad();
  }

    public Load()
  {
    super.Load();
  }

  private geo:string;
  public get Geo():string
  {
    this.geo=this.geo||this.element.getAttribute("geo");
    return this.geo;
  }

  private mat:string;
    public JThreeObject
  public get Mat():string
  {
    this.mat=this.mat||this.element.getAttribute("mat");
    return this.mat;
  }

}

export=GomlTreeMeshNode;
