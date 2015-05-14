import JThreeObject=require('Base/JThreeObject');
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlLoader = require("../GomlLoader");
import JThreeID = require("../../Base/JThreeID");
import GomlTreeSceneObjectNodeBase = require("./GomlTreeSceneObjectNodeBase");
import GomlTreeSceneNode = require("./GomlTreeSceneNode");
import SceneObject = require("../../Core/SceneObject");
import Triangle = require("../../Shapes/Triangle");
class GomlTreeMeshNode extends GomlTreeSceneObjectNodeBase
{
  private targetTri:Triangle;
  constructor(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase,parentSceneNode:GomlTreeSceneNode,parentObject:GomlTreeSceneObjectNodeBase)
  {
      super(elem,loader,parent,parentSceneNode,parentObject);
  }

  protected ConstructTarget():SceneObject
  {
    this.targetTri=new Triangle();
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

}

export=GomlTreeMeshNode;
