import JThreeObject=require('Base/JThreeObject');
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlLoader = require("../GomlLoader");
import Scene = require("../../Core/Scene");
class GomlTreeSceneNode extends GomlTreeNodeBase
{
  targetScene:Scene;

  constructor(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
  }

  beforeLoad()
  {
    this.targetScene=new Scene();
  }

}

export=GomlTreeSceneNode;
