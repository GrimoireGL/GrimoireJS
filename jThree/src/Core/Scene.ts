import jThreeObjectEEWithID from "../Base/JThreeObjectEEWithID";
import JThreeEvent from "../Base/JThreeEvent";
import BasicRenderer from "./Renderers/BasicRenderer";
import SceneObject from "./SceneObjects/SceneObject";
import Camera from "./Camera/Camera";
import Color3 from "../Math/Color3";
import ISceneObjectChangedEventArgs from "./ISceneObjectChangedEventArgs";
import RendererListChangedEventArgs from "./RendererListChangedEventArgs";

/**
 * Provides scene feature.
 */
class Scene extends jThreeObjectEEWithID {
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
    this._renderers.forEach((r) => {
      r.beforeRender();
      r.render(this);
      r.afterRender();
    });
  }

  private _renderers: BasicRenderer[] = [];

  public addRenderer(renderer: BasicRenderer): void {
    this._renderers.push(renderer);
    this.emit("changed-renderer", <RendererListChangedEventArgs>{
      owner: this,
      renderer: renderer,
      isAdditionalChange: true
    });
  }

  public removeRenderer(renderer: BasicRenderer): void {
    const index = this._renderers.indexOf(renderer);
    if (index < 0) {
      return;
    }
    this._renderers.splice(index, 1);
    this.emit("changed-renderer", <RendererListChangedEventArgs>{
      owner: this,
      renderer: renderer,
      isAdditionalChange: false
    });
  }

  public get Renderers(): BasicRenderer[] {
    return this._renderers;
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

export default Scene;
