import IRenderer from "./Renderers/IRenderer";
import jThreeObjectEEWithID from "../Base/JThreeObjectEEWithID";
import SceneObject from "./SceneObjects/SceneObject";
import Color3 from "../Math/Color3";
import ISceneObjectChangedEventArgs from "./ISceneObjectChangedEventArgs";
import RendererListChangedEventArgs from "./RendererListChangedEventArgs";

/**
 * Provides scene feature.
 */
class Scene extends jThreeObjectEEWithID {

  /**
   * Whether this scene needs update or not.
   * @type {boolean}
   */
  public enabled: boolean;

  public children: SceneObject[] = [];

  /**
   * Scene ambient coefficients
   */
  public sceneAmbient: Color3 = new Color3(1.0, 1.0, 1.0);

  private _renderers: IRenderer[] = [];

  constructor(id?: string) {
    super(id);
    this.enabled = true;
  }

  /**
   * Scene will be updated by this method.
   * This method is intended to be called by jThree system.
   * You don't need to call this method manually in most of use case.
   */
  public update(): void {
    if (!this.enabled) {
      return;
    }
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

  public addRenderer(renderer: IRenderer): void {
    this._renderers.push(renderer);
    this.emit("changed-renderer", <RendererListChangedEventArgs>{
      owner: this,
      renderer: renderer,
      isAdditionalChange: true
    });
  }

  public removeRenderer(renderer: IRenderer): void {
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

  public get Renderers(): IRenderer[] {
    return this._renderers;
  }

  /**
   * Add SceneObject to scene hierarchy top.
   * @param {SceneObject} targetObject target scene object which will be inserted.
   * @param {number}      index        insert index of location in children.
   */
  public addObject(targetObject: SceneObject, index?: number): void {
    if (index == null) {
      index = this.children.length;
    }
    this.children.splice(index, 0, targetObject);
    targetObject.ParentScene = this;
    this.notifySceneObjectChanged({
      owner: null,
      scene: this,
      isAdditionalChange: true,
      changedSceneObject: targetObject,
      changedSceneObjectID: targetObject.id
    });
  }

  /**
   * Remove SceneObject from scene hierarchy top.
   * @param {SceneObject} removeTarget target object which will be removed.
   */
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
        changedSceneObjectID: removeTarget.id
      });
    }
  }

  public notifySceneObjectChanged(eventArg: ISceneObjectChangedEventArgs): void {
    this.emit("structure-changed", eventArg);
  }
}

export default Scene;
