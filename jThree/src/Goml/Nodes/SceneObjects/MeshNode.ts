import JThreeObject=require('Base/JThreeObject');
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import JThreeID = require("../../../Base/JThreeID");
import SceneObjectNodeBase = require("./SceneObjectNodeBase");
import SceneNode = require("../SceneNode");
import SceneObject = require("../../../Core/SceneObject");
import Mesh = require("../../../Shapes/Mesh");
import GeometryNodeBase = require("../Geometries/GeometryNodeBase");
import MaterialNode = require("../Materials/MaterialNodeBase");
import SolidColor = require("../../../Core/Materials/SolidColorMaterial");
class GomlTreeMeshNode extends SceneObjectNodeBase
{
  private targetMesh:Mesh;

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase,parentSceneNode:SceneNode,parentObject:SceneObjectNodeBase)
  {
      super(elem,loader,parent,parentSceneNode,parentObject);
  }

  protected ConstructTarget():SceneObject
  {
    var geo=<GeometryNodeBase>this.loader.nodeRegister.getObject("jthree.geometries",this.Geo);
    var mat=<MaterialNode>this.loader.nodeRegister.getObject("jthree.materials",this.Mat);
    this.targetMesh=new Mesh(geo.TargetGeometry,mat?mat.targetMaterial:new SolidColor());
    return this.targetMesh;
  }

  beforeLoad()
  {
    super.beforeLoad();
  }

  Load()
  {
    super.Load();
  }

  private geo:string;
  public get Geo():string
  {
    this.geo=this.geo||this.element.getAttribute("geo");
    return this.geo;
  }

  private mat:string;JThreeObject
  public get Mat():string
  {
    this.mat=this.mat||this.element.getAttribute("mat");
    return this.mat;
  }

}

export=GomlTreeMeshNode;
