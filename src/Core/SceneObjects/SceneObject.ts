import IShaderArgumentContainer from "../Materials/IShaderArgumentContainer";
import JThreeObjectEEWithID from "../../Base/JThreeObjectEEWithID";
import IParentSceneChangedEventArgs from "../IParentSceneChangedEventArgs";
import Material from "../Materials/Material";
import {Action1, Action2} from "../../Base/Delegates";
import Geometry from "../Geometries/Base/Geometry";
import Scene from "../Scene";
import JThreeCollection from "../../Base/JThreeCollection";
import Transformer from "../Transform/Transformer";
import JThreeEvent from "../../Base/JThreeEvent";
import ISceneObjectStructureChangedEventArgs from "../ISceneObjectChangedEventArgs";
/**
 * This is most base class for SceneObject.
 * SceneObject is same as GameObject in Unity.
 */
class SceneObject extends JThreeObjectEEWithID implements IShaderArgumentContainer {

  public shaderVariables: { [name: string]: any } = {};

  public name: string;

  public isVisible: boolean = true;

  protected __geometry: Geometry;

  protected __transformer: Transformer;

  private _onStructureChangedEvent: JThreeEvent<ISceneObjectStructureChangedEventArgs> = new JThreeEvent<ISceneObjectStructureChangedEventArgs>();

  private _materialChanagedHandler: Action2<Material, SceneObject>[] = [];

  private _materials: { [materialGroup: string]: JThreeCollection<Material> } = {};

  /**
   * Contains the parent scene containing this SceneObject.
   */
  private _parentScene: Scene;

  /**
   * Contains the children.
   */
  private _children: SceneObject[] = [];

  /**
   * Parent of this SceneObject.
   */
  private _parent: SceneObject;

  constructor(transformer?: Transformer) {
    super();
    this.__transformer = transformer || new Transformer(this);
    this.name = this.ID;
  }

  /**
  * Getter for children
  */
  public get Children(): SceneObject[] {
    return this._children;
  }

  public addChild(obj: SceneObject): void {
    this._children.push(obj);
    obj._parent = this;
    obj.Transformer.updateTransform();
    const eventArg = {
      owner: this,
      scene: this.ParentScene,
      isAdditionalChange: true,
      changedSceneObject: obj,
      changedSceneObjectID: obj.ID
    };
    this._onStructureChangedEvent.fire(this, eventArg);
    this.onChildrenChanged();
    obj.onParentChanged();
    if (this.ParentScene) {
      this.ParentScene.notifySceneObjectChanged(eventArg);
    }
  }

  /**
   * remove SceneObject from children.
   * @param {SceneObject} obj [description]
   */
  public removeChild(obj: SceneObject): void {
    const childIndex = this._children.indexOf(obj);
    if (childIndex !== -1) {
      this._children.splice(childIndex, 1);
      const eventArg = {
        owner: this,
        scene: this.ParentScene,
        isAdditionalChange: false,
        changedSceneObject: obj,
        changedSceneObjectID: obj.ID
      };
      this._onStructureChangedEvent.fire(this, eventArg);
      obj.onParentChanged();
      if (this.ParentScene) {
        this.ParentScene.notifySceneObjectChanged(eventArg);
      }
    }
  }

  /**
   * remove this SceneObject from parent.
   */
  public remove(): void {
    this._parent.removeChild(this);
  }

  public get Parent(): SceneObject {
    return this._parent;
  }

  /**
  * The Getter for the parent scene containing this SceneObject.
  */
  public get ParentScene(): Scene {
    if (!this._parentScene) {
      if (!this._parent) {
        return null;
      } else {
        this.ParentScene = this._parent.ParentScene; // Retrieve and cache parent scene
        return this._parentScene;
      }
    } else {
      // The parent scene was already cached.
      return this._parentScene;
    }
  }

  /**
  * The Getter for the parent scene containing this SceneObject.
  */

  public set ParentScene(scene: Scene) {
    if (scene === this._parentScene) {
      return;
    }
    const lastScene = this._parentScene;
    this._parentScene = scene;
    // if(!this.parent||this.parent.ParentScene.ID!=scene.ID)
    //     console.error("There is something wrong in Scene structure.");
    // insert recursively to the children this SceneObject contains.
    this._children.forEach((v) => {
      v.ParentScene = scene;
    });
    this.onParentSceneChanged({
      lastParentScene: lastScene,
      currentParentScene: this._parentScene
    });
  }

  public onMaterialChanged(func: Action2<Material, SceneObject>): void {
    this._materialChanagedHandler.push(func);
  }
  /**
   * すべてのマテリアルに対して処理を実行します。
   */
  public eachMaterial(func: Action1<Material>): void {
    for (let material in this._materials) {
      this._materials[material].each((e) => func(e));
    }
  }

  public addMaterial(mat: Material): void {
    if (!this._materials[mat.MaterialGroup]) {
      this._materials[mat.MaterialGroup] = new JThreeCollection<Material>();
    }
    this._materials[mat.MaterialGroup].insert(mat);
  }

  public getMaterial(matGroup: string): Material {
    if (this._materials[matGroup]) {
      const a = this._materials[matGroup];
      let ret = null;
      a.each((e) => {
        ret = e;
        return;
      });
      return ret;
    }
    return null;
  }

  public getMaterials(matGroup: string): Material[] {
    if (this._materials[matGroup]) {
      return this._materials[matGroup].asArray();
    }
    return [];
  }

  public get Geometry(): Geometry {
    return this.__geometry;
  }

  public set Geometry(geo: Geometry) {
    this.__geometry = geo;
  }

  public get Transformer(): Transformer {
    return this.__transformer;
  }

  public callRecursive(action: Action1<SceneObject>): void {
    if (this._children) {
      this._children.forEach(t => t.callRecursive(action));
    }
    action(this);
  }

  public onChildrenChanged(): void {
    return;
  }

  public onParentChanged(): void {
    return;
  }

  public onParentSceneChanged(sceneInfo: IParentSceneChangedEventArgs): void {
    return;
  }

  public update(): void {
    return;
  }
}

export default SceneObject;
