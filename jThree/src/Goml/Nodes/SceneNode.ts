import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import Scene = require("../../Core/Scene");
import JThreeContext = require("../../JThreeContext");
import SceneManager = require("../../Core/SceneManager");
import ContextComponents = require("../../ContextComponents");

class SceneNode extends GomlTreeNodeBase {
  public targetScene: Scene; // TODO pnly: this should be private.

  constructor() {
    super();
    this.attributes.defineAttribute({
      "ambient": {
        value: "#111",
        converter: "color3",
        onchanged: this._onAmbientAttrChanged,
      },
      "name": {
        value: "",
        converter: "string"
      }
    });
  }

  protected onMount(): void {
    super.onMount();
    let sceneName = this.attributes.getValue("name");
    if (sceneName === "") {
      sceneName = null;
    }
    this.targetScene = new Scene(sceneName);
    JThreeContext.getContextComponent<SceneManager>(ContextComponents.SceneManager).addScene(this.targetScene);
  }

  private _onAmbientAttrChanged(attr): void {
    this.targetScene.sceneAmbient = attr.Value;
  }
}

export = SceneNode;
