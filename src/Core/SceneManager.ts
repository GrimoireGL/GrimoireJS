import jThreeObjectEE from "../Base/JThreeObjectEE";
import Scene from "./Scene";
import IContextComponent from "../IContextComponent";
import ContextComponents from "../ContextComponents";
import LoopManager from "./LoopManager";
import JThreeContext from "../JThreeContext";


/**
* The class for managing entire _scenes.
*/
class SceneManager extends jThreeObjectEE implements IContextComponent {

  constructor() {
    super();
    const loopManager = JThreeContext.getContextComponent<LoopManager>(ContextComponents.LoopManager);
    loopManager.addAction(5000, () => this.renderAll());
  }
  /**
   * All scene map. Hold by Scene.ID.
   */
  private _scenes: { [sceneID: string]: Scene } = {};

  public getContextComponentIndex(): number {
    return ContextComponents.SceneManager;
  }

  /**
  * Add new scene to be managed.
  */
  public addScene(scene: Scene): void {
    if (!this._scenes[scene.id]) {
      this._scenes[scene.id] = scene;
      this.emit("change", {
        owner: this,
        isAdditionalChange: true,
        changedScene: scene
      });
    }
  }


  /**
   * All scene list this class is managing.
   */
  public get Scenes(): Scene[] {
    const array = [];
    for (let scene in this._scenes) {
      array.push(this._scenes[scene]);
    }
    return array;
  }

  /**
  * Remove exisiting scene from managed.
  */
  public removeScene(scene: Scene): void {
    if (this._scenes[scene.id]) {
      delete this._scenes[scene.id];
      this.emit("change", {
        owner: this,
        isAdditionalChange: false,
        changedScene: scene
      });
    }
  }

  /**
   * Process render for all _scenes
   * This method is intended to be called by jThree system.
   * You don't need to call this method maually in most case.
   */
  public renderAll(): void {
    for (let sceneId in this._scenes) {
      const scene = this._scenes[sceneId];
      scene.update();
      scene.render();
    }
  }

}

export default SceneManager;
