import JThreeObject=require('Base/JThreeObject');
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlLoader = require("../GomlLoader");
import Scene = require("../../Core/Scene");
import JThreeContextProxy=require('../../Core/JThreeContextProxy');
import JThreeContext=require('../../Core/JThreeContext');
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
    var context:JThreeContext=JThreeContextProxy.getJThreeContext();
    context.SceneManager.addScene(this.targetScene);
  }

}

export=GomlTreeSceneNode;
