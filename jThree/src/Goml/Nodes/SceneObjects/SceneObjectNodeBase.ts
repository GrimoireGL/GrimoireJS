import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import SceneNode = require("../SceneNode");
import SceneObject = require("../../../Core/SceneObject");
import Vector3 = require("../../../Math/Vector3");
import Quaternion = require("../../../Math/Quaternion");

class SceneObjectNodeBase extends GomlTreeNodeBase {
  /**
   * Scene Object that will be applied to Scene.
   * @type {SceneObject}
   */
  private targetSceneObject: SceneObject = null;

  /**
  * SceneObjectNode directly containing this node
  */
  private parentSceneObjectNode: SceneObjectNodeBase = null;

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
        onchanged: (attr) => {
          if (this.targetSceneObject) {
            this.targetSceneObject.Transformer.Position = <Vector3>attr.Value;
          }
        }
      },
      "scale": {
        value: new Vector3(1, 1, 1),
        converter: "vec3",
        onchanged: (attr) => {
          if (this.targetSceneObject) {
            this.targetSceneObject.Transformer.Scale = <Vector3>attr.Value;
          }
        }
      },
      "rotation": {
        value: Quaternion.Identity,
        converter: "rotation",
        onchanged: (attr) => {
          if (this.targetSceneObject) {
            this.targetSceneObject.Transformer.Rotation = <Quaternion>attr.Value;
          }
        }
      },
      "name": {
        value: void 0,
        converter: "string",
        onchanged: (attr) => {
          if (this.targetSceneObject) {
            this.targetSceneObject.name = attr.Value;
          }
        }
      }
    });
  }

  public get ParentSceneObjectNode(): SceneObjectNodeBase {
    return this.parentSceneObjectNode;
  }

  public get ContainedSceneNode(): SceneNode {
    return this.containedSceneNode;
  }

  protected onMount(): void {
    super.onMount();
    let containedSceneNode: SceneNode = null;
    let parentSceneObjectNode: SceneObjectNodeBase = null;
    // This parent node is scene node.
    if (this.parent.getTypeName() === "SceneNode") {
      containedSceneNode = <SceneNode>this.parent;
      parentSceneObjectNode = null;
    } else {
      // check parent extends SceneObjectNodeBase or not.
      if (typeof (<SceneObjectNodeBase>this.parent).ContainedSceneNode === "undefined") {
        console.error(`${this.parent.toString()} is not extends SceneObjectNodeBase. Is this really ok to be contained in Scene tag?`);
        return;
      } else {
        parentSceneObjectNode = <SceneObjectNodeBase>this.parent;
        containedSceneNode = parentSceneObjectNode.ContainedSceneNode;
      }
    }
    this.containedSceneNode = containedSceneNode;
    this.parentSceneObjectNode = parentSceneObjectNode;
  }

  protected onUnmount(): void {
    super.onUnmount();
  }

  /**
   * update SceneObject child. using this.targetSceneObject to previus object, so do not change it before call this method.
   * @param {SceneObject} obj [description]
   */
  private _updateSceneObjectChild(obj: SceneObject): void {
    if (typeof obj === 'undefined') {
      console.error(`${this.getTypeName()}: targetSceneObject is undefined. It must be null or instance.`);
      obj = null;
    }
    // previus object is exist in child, remove child
    if (this.targetSceneObject !== null) {
      if (this.ParentSceneObjectNode === null) { // this is root object of scene
        this.containedSceneNode.targetScene.removeObject(this.targetSceneObject);
      } else {
        if (this.parentSceneObjectNode.TargetSceneObject === null) {
          return;
        }
        this.parentSceneObjectNode.TargetSceneObject.removeChild(this.targetSceneObject);
      }
    }
    if (obj !== null) {
      if (this.ParentSceneObjectNode === null) { // this is root object of scene
        this.containedSceneNode.targetScene.addObject(obj);
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
  protected set TargetSceneObject(obj: SceneObject) {
    this._updateSceneObjectChild(obj);
    this.targetSceneObject = obj;
    this.attributes.emitChangeAll();
  }

  /**
   * Get the SceneObject that is applied to Scene Hierarchy.
   * @return {SceneObject} [description]
   */
  protected get TargetSceneObject(): SceneObject {
    return this.targetSceneObject;
  }
}

export = SceneObjectNodeBase;
