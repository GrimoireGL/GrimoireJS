import JThreeObject=require('Base/JThreeObject');
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlLoader = require("../GomlLoader");
import JThreeID = require("../../Base/JThreeID");
import GomlTreeSceneObjectNodeBase = require("./GomlTreeSceneObjectNodeBase");
import GomlTreeSceneNode = require("./GomlTreeSceneNode");
import SceneObject = require("../../Core/SceneObject");
import Triangle = require("../../Shapes/Triangle");
import GomlTreeGeometryNodeBase = require("./GomlTreeGeometryNodeBase");
import MaterialNode = require("./Materials/SolidColorNode");
import SolidColor = require("../../Core/Materials/SolidColorMaterial");
class GomlTreeMeshNode extends GomlTreeSceneObjectNodeBase
{
  private targetTri:Triangle;
  constructor(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase,parentSceneNode:GomlTreeSceneNode,parentObject:GomlTreeSceneObjectNodeBase)
  {
      super(elem,loader,parent,parentSceneNode,parentObject);
  }

  protected ConstructTarget():SceneObject
  {
    var geo=<GomlTreeGeometryNodeBase>this.loader.nodeDictionary.getObject("jthree.geometries",this.Geo);
    var mat=<MaterialNode>this.loader.nodeDictionary.getObject("jthree.materials",this.Mat);
    this.targetTri=new Triangle(geo.TargetGeometry,mat?mat.targetMaterial:new SolidColor());
    return this.targetTri;
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
