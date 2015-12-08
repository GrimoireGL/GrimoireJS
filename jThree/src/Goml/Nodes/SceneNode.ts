import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import Scene = require("../../Core/Scene");
import JThreeContext = require('../../JThreeContext');
import SceneManager = require("../../Core/SceneManager");
import ContextComponents = require("../../ContextComponents");

class SceneNode extends GomlTreeNodeBase {
  public targetScene: Scene;

  constructor() {
    super();
    this.attributes.defineAttribute({
      "ambient": {
        value: "#111",
        converter: "color3",
      },
      "name": {
        value: "",
        converter: "string"
      }
    });
    this.attributes.getAttribute('ambient').on('attr_change', this._onAmbientAttrChanged.bind(this));
  }

  private _onAmbientAttrChanged(attr): void {
    this.targetScene.sceneAmbient = attr.Value;
  }

  public beforeLoad() {
    var sceneName = this.attributes.getValue("name");
    if (sceneName == "") sceneName = null;
    this.targetScene = new Scene(sceneName);
    JThreeContext.getContextComponent<SceneManager>(ContextComponents.SceneManager).addScene(this.targetScene);
  }

}

export =SceneNode;
