import CoreRelatedNodeBase from "../CoreRelatedNodeBase";
import Scene from "../../Core/Scene";
import JThreeContext from "../../JThreeContext";
import SceneManager from "../../Core/SceneManager";
import ContextComponents from "../../ContextComponents";

class SceneNode extends CoreRelatedNodeBase<Scene> {
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
        converter: "string",
        onchanged: this._onNameAttrChanged,
      }
    });
  }

  protected __onMount(): void {
    super.__onMount();
    let sceneName = this.attributes.getValue("name");
    if (sceneName === "") {
      sceneName = null;
    }
    this.target = new Scene(sceneName);
    JThreeContext.getContextComponent<SceneManager>(ContextComponents.SceneManager).addScene(this.target);
  }

  protected __onUnmount(): void {
    super.__onUnmount();
    JThreeContext.getContextComponent<SceneManager>(ContextComponents.SceneManager).removeScene(this.target);
    // TODO: pnly GC
  }

  private _onNameAttrChanged(attr): void {
    this.target.id = attr.Value;
    attr.done();
  }

  private _onAmbientAttrChanged(attr): void {
    this.target.sceneAmbient = attr.Value;
    attr.done();
  }
}

export default SceneNode;
