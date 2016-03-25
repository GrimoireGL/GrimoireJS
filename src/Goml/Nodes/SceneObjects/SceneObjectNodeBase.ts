import CoreRelatedNodeBase from "../../CoreRelatedNodeBase";
import SceneNode from "../SceneNode";
import SceneObject from "../../../Core/SceneObjects/SceneObject";
import Vector3 from "../../../Math/Vector3";
import Quaternion from "../../../Math/Quaternion";
import GomlAttribute from "../../GomlAttribute";

class SceneObjectNodeBase<T extends SceneObject> extends CoreRelatedNodeBase<T> {
  /**
  * SceneObjectNode directly containing this node
  */
  private _parentSceneObjectNode: SceneObjectNodeBase<SceneObject> = null;

  /**
  * SceneNode containing this node
  */
  private _containedSceneNode: SceneNode = null;

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
    return this._parentSceneObjectNode;
  }

  public get ContainedSceneNode(): SceneNode {
    return this._containedSceneNode;
  }

  protected __onMount(): void {
    super.__onMount();
    let containedSceneNode: SceneNode = null;
    let parentSceneObjectNode: SceneObjectNodeBase<SceneObject> = null;
    // This parent node is scene node.
    if (this.__parent.getTypeName() === "SceneNode") {
      containedSceneNode = <SceneNode>this.__parent;
      parentSceneObjectNode = null;
    } else {
      // check parent extends SceneObjectNodeBase or not.
      if (typeof (<SceneObjectNodeBase<SceneObject>>this.__parent).ContainedSceneNode === "undefined") {
        console.error(`${this.__parent.toString() } is not extends SceneObjectNodeBase. Is this really ok to be contained in Scene tag?`);
        return;
      } else {
        parentSceneObjectNode = <SceneObjectNodeBase<SceneObject>>this.__parent;
        containedSceneNode = parentSceneObjectNode.ContainedSceneNode;
      }
    }
    this._containedSceneNode = containedSceneNode;
    this._parentSceneObjectNode = parentSceneObjectNode;
  }

  protected __onUnmount(): void {
    super.__onUnmount();
    this.TargetSceneObject = null;
  }

  private _onPositionAttrChanged__SceneObjectNodeBase(attr: GomlAttribute): void {
    if (this.target) {
      this.target.Transformer.Position = <Vector3>attr.Value;
      attr.done();
    }
  }

  private _onScaleAttrChanged__SceneObjectNodeBase(attr: GomlAttribute): void {
    if (this.target) {
      this.target.Transformer.Scale = <Vector3>attr.Value;
      attr.done();
    }
  }

  private _onRotationAttrChanged__SceneObjectNodeBase(attr: GomlAttribute): void {
    if (this.target) {
      this.target.Transformer.Rotation = <Quaternion>attr.Value;
      attr.done();
    }
  }

  private _onNameAttrChanged__SceneObjectNodeBase(attr: GomlAttribute): void {
    if (this.target) {
      this.target.name = attr.Value;
      attr.done();
    }
  }

  /**
   * update SceneObject child. using this.target to access previous object, so do not change it before call this method.
   * @param {SceneObject} obj [description]
   */
  private _updateSceneObjectChild(obj: SceneObject): void {
    if (typeof obj === "undefined") {
      console.error(`${this.getTypeName() }: sceneObject is undefined. It must be null or instance.`);
      obj = null;
    }
    // previous object is exist in child, remove child
    if (this.target !== null) {
      if (this._parentSceneObjectNode === null) { // this is root object of scene
        this._containedSceneNode.target.removeObject(this.target);
      } else {
        if (this._parentSceneObjectNode.TargetSceneObject === null) {
          throw new Error("Something fatal occured. Parent scene object is lost.");
        }
        this._parentSceneObjectNode.TargetSceneObject.removeChild(this.target);
      }
    }
    // if obj is not null, insert obj. if null, do nothing.
    if (obj !== null) {
      if (this._parentSceneObjectNode === null) { // this is root object of scene
        this._containedSceneNode.target.addObject(obj, this.index);
      } else {
        if (this._parentSceneObjectNode.TargetSceneObject === null) {
          throw new Error("Something fatal occured. Parent scene object is lost.");
        }
        this._parentSceneObjectNode.TargetSceneObject.addChild(obj, this.index);
      }
    }
  }

  /**
   * Change the SceneObject that is applied to Scene Hierarchy.
   * @param {SceneObject} obj [description]
   */
  protected set TargetSceneObject(obj: T) {
    this._updateSceneObjectChild(obj);
    this.target = obj;
    this.target.relatedNode = this; // TODO: pnly consider GC.
    this.emit("update-scene-object", this.target);
  }

  /**
   * Get the SceneObject that is applied to Scene Hierarchy.
   * @return {SceneObject} [description]
   */
  protected get TargetSceneObject(): T {
    return this.target;
  }
}

export default SceneObjectNodeBase;
