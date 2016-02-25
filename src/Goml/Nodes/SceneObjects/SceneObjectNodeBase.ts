import CoreRelatedNodeBase from "../../CoreRelatedNodeBase";
import SceneNode from "../SceneNode";
import SceneObject from "../../../Core/SceneObjects/SceneObject";
import Vector3 from "../../../Math/Vector3";
import Quaternion from "../../../Math/Quaternion";
import GomlAttribute from "../../GomlAttribute";

class SceneObjectNodeBase<T extends SceneObject> extends CoreRelatedNodeBase<T> {
  /**
   * Scene Object that will be applied to Scene.
   * @type {SceneObject}
   */
  private _sceneObject: T = null;

  /**
  * SceneObjectNode directly containing this node
  */
  private parentSceneObjectNode: SceneObjectNodeBase<SceneObject> = null;

  /**
  * SceneNode containing this node
  */
  private containedSceneNode: SceneNode = null;

  constructor() {
    super();
    this.attributes.defineAttribute({
      "position": {
        value: new Vector3(0, 0, 0),
        converter: "vec3",
        onchanged: this._onPositionAttrChanged__SceneObjectNodeBase.bind(this),
      },
      "scale": {
        value: new Vector3(1, 1, 1),
        converter: "vec3",
        onchanged: this._onScaleAttrChanged__SceneObjectNodeBase.bind(this),
      },
      "rotation": {
        value: Quaternion.Identity,
        converter: "rotation",
        onchanged: this._onRotationAttrChanged__SceneObjectNodeBase.bind(this),
      },
      "name": {
        value: void 0,
        converter: "string",
        onchanged: this._onNameAttrChanged__SceneObjectNodeBase.bind(this),
      }
    });
    this.on("update-scene-object", (obj: SceneObject) => {
      this._onPositionAttrChanged__SceneObjectNodeBase.call(this, this.attributes.getAttribute("position"));
      this._onScaleAttrChanged__SceneObjectNodeBase.call(this, this.attributes.getAttribute("scale"));
      this._onRotationAttrChanged__SceneObjectNodeBase.call(this, this.attributes.getAttribute("rotation"));
      this._onNameAttrChanged__SceneObjectNodeBase.call(this, this.attributes.getAttribute("name"));
    });
  }

  public get ParentSceneObjectNode(): SceneObjectNodeBase<SceneObject> {
    return this.parentSceneObjectNode;
  }

  public get ContainedSceneNode(): SceneNode {
    return this.containedSceneNode;
  }

  protected onMount(): void {
    super.onMount();
    let containedSceneNode: SceneNode = null;
    let parentSceneObjectNode: SceneObjectNodeBase<SceneObject> = null;
    // This parent node is scene node.
    if (this.parent.getTypeName() === "SceneNode") {
      containedSceneNode = <SceneNode>this.parent;
      parentSceneObjectNode = null;
    } else {
      // check parent extends SceneObjectNodeBase or not.
      if (typeof (<SceneObjectNodeBase<SceneObject>>this.parent).ContainedSceneNode === "undefined") {
        console.error(`${this.parent.toString() } is not extends SceneObjectNodeBase. Is this really ok to be contained in Scene tag?`);
        return;
      } else {
        parentSceneObjectNode = <SceneObjectNodeBase<SceneObject>>this.parent;
        containedSceneNode = parentSceneObjectNode.ContainedSceneNode;
      }
    }
    this.containedSceneNode = containedSceneNode;
    this.parentSceneObjectNode = parentSceneObjectNode;
  }

  protected onUnmount(): void {
    super.onUnmount();
  }

  private _onPositionAttrChanged__SceneObjectNodeBase(attr: GomlAttribute): void {
    if (this._sceneObject) {
      this._sceneObject.Transformer.Position = <Vector3>attr.Value;
      attr.done();
    }
  }

  private _onScaleAttrChanged__SceneObjectNodeBase(attr: GomlAttribute): void {
    if (this._sceneObject) {
      this._sceneObject.Transformer.Scale = <Vector3>attr.Value;
      attr.done();
    }
  }

  private _onRotationAttrChanged__SceneObjectNodeBase(attr: GomlAttribute): void {
    if (this._sceneObject) {
      this._sceneObject.Transformer.Rotation = <Quaternion>attr.Value;
      attr.done();
    }
  }

  private _onNameAttrChanged__SceneObjectNodeBase(attr: GomlAttribute): void {
    if (this._sceneObject) {
      this._sceneObject.name = attr.Value;
      attr.done();
    }
  }

  /**
   * update SceneObject child. using this.sceneObject to previus object, so do not change it before call this method.
   * @param {SceneObject} obj [description]
   */
  private _updateSceneObjectChild(obj: SceneObject): void {
    if (typeof obj === "undefined") {
      console.error(`${this.getTypeName() }: sceneObject is undefined. It must be null or instance.`);
      obj = null;
    }
    // previus object is exist in child, remove child
    if (this._sceneObject !== null) {
      if (this.ParentSceneObjectNode === null) { // this is root object of scene
        this.containedSceneNode.target.removeObject(this._sceneObject);
      } else {
        if (this.parentSceneObjectNode.TargetSceneObject === null) {
          return;
        }
        this.parentSceneObjectNode.TargetSceneObject.removeChild(this._sceneObject);
      }
    }
    if (obj !== null) {
      if (this.ParentSceneObjectNode === null) { // this is root object of scene
        this.containedSceneNode.target.addObject(obj);
      } else {
        if (this.parentSceneObjectNode.TargetSceneObject === null) {
          return;
        }
        this.parentSceneObjectNode.TargetSceneObject.addChild(obj);
      }
    }
  }

  /**
   * Change the SceneObject that is applied to Scene Hierarchy.
   * @param {SceneObject} obj [description]
   */
  protected set TargetSceneObject(obj: T) {
    this._updateSceneObjectChild(obj);
    this._sceneObject = obj;
    this.target = obj;
    this.emit("update-scene-object", this.target);
  }

  /**
   * Get the SceneObject that is applied to Scene Hierarchy.
   * @return {SceneObject} [description]
   */
  protected get TargetSceneObject(): T {
    return this._sceneObject;
  }
}

export default SceneObjectNodeBase;
