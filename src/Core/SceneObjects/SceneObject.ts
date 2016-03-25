import IShaderArgumentContainer from "../Materials/IShaderArgumentContainer";
import JThreeObjectEEWithID from "../../Base/JThreeObjectEEWithID";
import IParentSceneChangedEventArgs from "../IParentSceneChangedEventArgs";
import Material from "../Materials/Material";
import {Action1, Action2} from "../../Base/Delegates";
import Geometry from "../Geometries/Base/Geometry";
import Scene from "../Scene";
import Transformer from "../Transform/Transformer";
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

  private _materialChanagedHandler: Action2<Material, SceneObject>[] = [];

  private _materials: {
    [materialGroup: string]: {
      [matID: string]: Material
    }
  } = {};

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
    this.name = this.id;
  }

  /**
  * Getter for children
  */
  public get Children(): SceneObject[] {
    return this._children;
  }

  /**
   * Add SceneObject to child of SceneObject.
   * @param {SceneObject} obj   [description]
   * @param {number}      index [description]
   */
  public addChild(obj: SceneObject, index?: number): void {
    if (index == null) {
      index = this._children.length;
    }
    this._children.splice(index, 0, obj);
    obj._parent = this;
    obj.Transformer.updateTransform();
    const eventArg: ISceneObjectStructureChangedEventArgs = {
      owner: this,
      scene: this.ParentScene,
      isAdditionalChange: true,
      changedSceneObject: obj,
      changedSceneObjectID: obj.id
    };
    this.emit("structure-changed", eventArg);
    this.onChildrenChanged();
    obj.onParentChanged();
    if (this.ParentScene) {
      this.ParentScene.notifySceneObjectChanged(eventArg);
    }
  }

  /**
   * Remove SceneObject from children of SceneObject.
   * @param {SceneObject} obj [description]
   */
  public removeChild(obj: SceneObject): void {
    const childIndex = this._children.indexOf(obj);
    if (childIndex !== -1) {
      this._children.splice(childIndex, 1);
      const eventArg: ISceneObjectStructureChangedEventArgs = {
        owner: this,
        scene: this.ParentScene,
        isAdditionalChange: false,
        changedSceneObject: obj,
        changedSceneObjectID: obj.id
      };
      this.emit("structure-changed", eventArg);
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
      for (let matID in this._materials[material]) {
        func(this._materials[material][matID]);
      }
    }
  }

  public addMaterial(mat: Material): void {
    if (!this._materials[mat.MaterialGroup]) {
      this._materials[mat.MaterialGroup] = {};
    }
    this._materials[mat.MaterialGroup][mat.id] = mat;
  }

  public getMaterial(matGroup: string): Material {
    if (this._materials[matGroup]) {
      const a = this._materials[matGroup];
      for (let e in a) {
        return a[e];
      }
    }
    return null;
  }

  public getMaterials(matGroup: string): Material[] {
    if (this._materials[matGroup]) {
      const ret = [];
      for (let matID in this._materials[matGroup]) {
        ret.push(this._materials[matGroup][matID]);
      }
      return ret;
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
