import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlLoader = require("../GomlLoader");
import Scene = require("../../Core/Scene");
import JThreeContextProxy=require('../../Core/JThreeContextProxy');
import JThreeContext=require('../../Core/JThreeContext');
class SceneNode extends GomlTreeNodeBase
{
    public targetScene:Scene;

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
  }

    public beforeLoad()
  {
    this.targetScene=new Scene();
    var context:JThreeContext=JThreeContextProxy.getJThreeContext();
    context.SceneManager.addScene(this.targetScene);
    this.attributes.defineAttribute({
      "ambient":{
        value:"#111",
        converter:"color3",
        handler:(v)=>{
          this.targetScene.sceneAmbient = v.Value;
        }
      }
    });
  }

}

export=SceneNode;
