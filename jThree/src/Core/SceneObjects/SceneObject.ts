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
class SceneObject extends JThreeObjectEEWithID {
  public name: string;

  protected geometry: Geometry;

  protected transformer: Transformer;

  private onStructureChangedEvent: JThreeEvent<ISceneObjectStructureChangedEventArgs> = new JThreeEvent<ISceneObjectStructureChangedEventArgs>();

  private materialChanagedHandler: Action2<Material, SceneObject>[] = [];

  private materials: { [materialGroup: string]: JThreeCollection<Material> } = {};

  /**
   * Contains the parent scene containing this SceneObject.
   */
  private parentScene: Scene;

  /**
   * Contains the children.
   */
  private children: SceneObject[] = [];

  /**
   * Parent of this SceneObject.
   */
  private parent: SceneObject;

  constructor(transformer?: Transformer) {
    super();
    this.transformer = transformer || new Transformer(this);
    this.name = this.ID;
  }

  /**
  * Getter for children
  */
  public get Children(): SceneObject[] {
    return this.children;
  }

  public addChild(obj: SceneObject): void {
    this.children.push(obj);
    obj.parent = this;
    obj.Transformer.updateTransform();
    const eventArg = {
      owner: this,
      scene: this.ParentScene,
      isAdditionalChange: true,
      changedSceneObject: obj,
      changedSceneObjectID: obj.ID
    };
    this.onStructureChangedEvent.fire(this, eventArg);
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
    const childIndex = this.children.indexOf(obj);
    if (childIndex !== -1) {
      this.children.splice(childIndex, 1);
      const eventArg = {
        owner: this,
        scene: this.ParentScene,
        isAdditionalChange: false,
        changedSceneObject: obj,
        changedSceneObjectID: obj.ID
      };
      this.onStructureChangedEvent.fire(this, eventArg);
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
    this.parent.removeChild(this);
  }

  public get Parent(): SceneObject {
    return this.parent;
  }

  /**
  * The Getter for the parent scene containing this SceneObject.
  */
  public get ParentScene(): Scene {
    if (!this.parentScene) {
      if (!this.parent) {
        return null;
      } else {
        this.ParentScene = this.parent.ParentScene; // Retrieve and cache parent scene
        return this.parentScene;
      }
    } else {
      // The parent scene was already cached.
      return this.parentScene;
    }
  }

  /**
  * The Getter for the parent scene containing this SceneObject.
  */

  public set ParentScene(scene: Scene) {
    if (scene === this.parentScene) return;
    const lastScene = this.parentScene;
    this.parentScene = scene;
    // if(!this.parent||this.parent.ParentScene.ID!=scene.ID)
    //     console.error("There is something wrong in Scene structure.");
    // insert recursively to the children this SceneObject contains.
    this.children.forEach((v) => {
      v.ParentScene = scene;
    });
    this.onParentSceneChanged({
      lastParentScene: lastScene,
      currentParentScene: this.parentScene
    });
  }

  public onMaterialChanged(func: Action2<Material, SceneObject>): void {
    this.materialChanagedHandler.push(func);
  }
  /**
   * すべてのマテリアルに対して処理を実行します。
   */
  public eachMaterial(func: Action1<Material>): void {
    for (let material in this.materials) {
      this.materials[material].each((e) => func(e));
    }
  }

  public addMaterial(mat: Material): void {
    if (!this.materials[mat.MaterialGroup]) {
      this.materials[mat.MaterialGroup] = new JThreeCollection<Material>();
    }
    this.materials[mat.MaterialGroup].insert(mat);
  }

  public getMaterial(matGroup: string): Material {
    if (this.materials[matGroup]) {
      const a = this.materials[matGroup];
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
    if (this.materials[matGroup]) {
      return this.materials[matGroup].asArray();
    }
    return [];
  }

  public get Geometry(): Geometry {
    return this.geometry;
  }

  public set Geometry(geo: Geometry) {
    this.geometry = geo;
  }

  public get Transformer(): Transformer {
    return this.transformer;
  }

  public callRecursive(action: Action1<SceneObject>) {
    if (this.children) {
      this.children.forEach(t => t.callRecursive(action));
    }
    action(this);
  }

  public onChildrenChanged() {
    return;
  }

  public onParentChanged() {
    return;
  }

  public onParentSceneChanged(sceneInfo: IParentSceneChangedEventArgs) {
    return;
  }

  public update() {
    return;
  }
}

export default SceneObject;
