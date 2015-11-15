import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlLoader = require("../GomlLoader");
import Scene = require("../../Core/Scene");
import JThreeContext = require('../../NJThreeContext');
import SceneManager = require("../../Core/SceneManager");
import ContextComponents = require("../../ContextComponents");
class SceneNode extends GomlTreeNodeBase
{
    public targetScene:Scene;

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
  }

    public beforeLoad()
  {
    this.attributes.defineAttribute({
        "ambient":{
          value:"#111",
          converter:"color3",
          handler:(v)=>{
            this.targetScene.sceneAmbient = v.Value;
          }
        },
        "name":
        {
          value:"",
          converter:"string"
        }
      });
    var sceneName = this.attributes.getValue("name");
    if(sceneName == "") sceneName =null;
    this.targetScene=new Scene(sceneName);
    JThreeContext.getContextComponent<SceneManager>(ContextComponents.SceneManager).addScene(this.targetScene);
  }

}

export=SceneNode;
