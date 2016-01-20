import jThreeObjectWithID = require("../Base/JThreeObjectWithID");
import JThreeEvent = require("../Base/JThreeEvent");
import BasicRenderer = require("./Renderers/BasicRenderer");
import SceneObject = require("./SceneObject");
import Camera = require("./Camera/Camera");
import Color3 = require("../Math/Color3");
import ISceneObjectChangedEventArgs = require("./ISceneObjectChangedEventArgs");
import RendererListChangedEventArgs = require("./RendererListChangedEventArgs");

/**
 * Provides scene feature.
 */
class Scene extends jThreeObjectWithID {
  constructor(id?: string) {
    super(id);
    this.enabled = true;
  }

  public sceneObjectStructureChanged: JThreeEvent<ISceneObjectChangedEventArgs> = new JThreeEvent<ISceneObjectChangedEventArgs>();

  /**
   * Whether this scene needs update or not.
   * @type {boolean}
   */
  public enabled: boolean;

  /**
   * Scene will be updated by this method.
   * This method is intended to be called by jThree system.
   * You don't need to call this method manually in most of use case.
   */
  public update(): void {
    if (!this.enabled) return;
    this.children.forEach(v => v.update());
  }

  /**
   * Scene will be rendererd by this method.
   * This method is intended to be called by jThree system.
   * You don't need to call this method manually in most of use case.
   */
  public render(): void {
    this.renderers.forEach((r) => {
      r.beforeRender();
      r.render(this);
      r.afterRender();
    });
  }

  public rendererListChanged: JThreeEvent<RendererListChangedEventArgs> = new JThreeEvent<RendererListChangedEventArgs>();

  private renderers: BasicRenderer[] = [];

  public addRenderer(renderer: BasicRenderer): void {
    this.renderers.push(renderer);
    this.rendererListChanged.fire(this, {
      owner: this,
      renderer: renderer,
      isAdditionalChange: true
    });
  }

  public get Renderers(): BasicRenderer[] {
    return this.renderers;
  }

  public children: SceneObject[] = [];


  public addObject(targetObject: SceneObject): void {
    this.children.push(targetObject);
    targetObject.ParentScene = this;
    this.notifySceneObjectChanged({
      owner: null,
      scene: this,
      isAdditionalChange: true,
      changedSceneObject: targetObject,
      changedSceneObjectID: targetObject.ID
    });
  }

  public removeObject(removeTarget: SceneObject): void {
    const index = this.children.indexOf(removeTarget);
    if (index >= 0) {
      this.children.splice(index, 1);
      removeTarget.ParentScene = null;
      this.notifySceneObjectChanged({
        owner: null,
        scene: this,
        isAdditionalChange: false,
        changedSceneObject: removeTarget,
        changedSceneObjectID: removeTarget.ID
      });
    }
  }

  private cameras: { [id: string]: Camera } = {};

  /**
   * Append the camera to this scene as managed
   */
  public addCamera(camera: Camera) {
    this.cameras[camera.ID] = camera;
  }

  /**
   * Get the camera managed in this scene.
   */
  public getCamera(id: string): Camera {
    return this.cameras[id];
  }

  /**
   * Scene ambient coefficients
   */
  public sceneAmbient: Color3 = new Color3(1.0, 1.0, 1.0);

  public notifySceneObjectChanged(eventArg: ISceneObjectChangedEventArgs) {
    this.sceneObjectStructureChanged.fire(this, eventArg);
  }
}

export =Scene;
