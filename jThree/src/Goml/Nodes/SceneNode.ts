import GomlTreeNodeBase from "../GomlTreeNodeBase";
import Scene from "../../Core/Scene";
import JThreeContext from "../../JThreeContext";
import SceneManager from "../../Core/SceneManager";
import ContextComponents from "../../ContextComponents";

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

export default SceneNode;
