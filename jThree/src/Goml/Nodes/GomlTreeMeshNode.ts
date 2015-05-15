import JThreeObject=require('Base/JThreeObject');
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlLoader = require("../GomlLoader");
import JThreeID = require("../../Base/JThreeID");
import GomlTreeSceneObjectNodeBase = require("./GomlTreeSceneObjectNodeBase");
import GomlTreeSceneNode = require("./GomlTreeSceneNode");
import SceneObject = require("../../Core/SceneObject");
import Triangle = require("../../Shapes/Triangle");
import GomlTreeGeometryNodeBase = require("./GomlTreeGeometryNodeBase");
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
    this.targetTri=new Triangle(geo.TargetGeometry);
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

}

export=GomlTreeMeshNode;
