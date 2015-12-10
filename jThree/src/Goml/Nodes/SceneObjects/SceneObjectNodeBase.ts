import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import SceneNode = require("../SceneNode");
import SceneObject = require("../../../Core/SceneObject");
import Vector3 = require("../../../Math/Vector3");
import Quaternion = require("../../../Math/Quaternion");
import AttributeParser = require("../../AttributeParser");
class SceneObjectNodeBase extends GomlTreeNodeBase {
  constructor() {
    super();
    this.attributes.defineAttribute({
      "position": {
        value: new Vector3(0, 0, 0),
        converter: "vector3",
        onchanged: (attr) => {
          if (this.targetSceneObject != null) {
            this.targetSceneObject.Transformer.Position = <Vector3>attr.Value;
          }
        }
      },
      "scale": {
        value: new Vector3(1, 1, 1),
        converter: "vector3",
        onchanged: (attr) => {
          if (this.targetSceneObject != null) {
            this.targetSceneObject.Transformer.Scale = <Vector3>attr.Value;
          }
        }
      },
      "rotation": {
        value: Quaternion.Identity,
        converter: "rotation",
        onchanged: (attr) => {
          if (this.targetSceneObject != null) {
            this.targetSceneObject.Transformer.Rotation = attr.Value;
          }
        }
      },
      "name": {
        value: undefined,
        converter: "string",
        onchanged: (attr) => {
          if (this.targetSceneObject && attr.Value) {
            this.targetSceneObject.name = attr.Value;
          }
        }
      }
    });
  }

  protected nodeWillMount(parent): void {
    super.nodeWillMount(parent);
    let sceneNode: SceneNode = null;
    let sceneObjectNode: SceneObjectNodeBase = null;
    if (parent.getTypeName() == "SceneNode")//This parent node is scene node. TODO: I wonder there is better way
    {
      sceneNode = <SceneNode>parent;
      sceneObjectNode = null;
    } else {
      if (typeof parent["ContainedSceneNode"] === "undefined") {//check parent extends SceneObjectNodeBase or not.
        console.error(`${parent.toString()} is not extends SceneObjectNodeBase. Is this really ok to be contained in Scene tag?`);
        return null;
      } else {
        sceneObjectNode = <SceneObjectNodeBase>parent;
        sceneNode = sceneObjectNode.ContainedSceneNode;
      }
    }
    this.containedSceneNode = sceneNode;
    this.parentSceneObjectNode = sceneObjectNode;

    this.targetSceneObject = this.ConstructTarget();
    if (this.targetSceneObject == null) return;
    if (!this.targetSceneObject.name || this.targetSceneObject.ID == this.targetSceneObject.name)
      this.targetSceneObject.name = `${this.targetSceneObject.getTypeName()}(${this.targetSceneObject.ID})`;
    //append targetObject to parent
    this.applyHierarchy();
  }

  protected ConstructTarget(): SceneObject {
    return null;
  }

  protected targetUpdated() {

  }

  private applyHierarchy() {
    if (!this.targetSceneObject) {
      console.error("SceneObject node must override ConstructTarget and return the object extending SceneObjnect");
    } else {
      if (this.parentSceneObjectNode == null)//this is root object of scene
        this.containedSceneNode.targetScene.addObject(this.targetSceneObject);
      else {
        if (this.parentSceneObjectNode.targetSceneObject == null) return;
        this.parentSceneObjectNode.targetSceneObject.addChild(this.targetSceneObject);
      }
    }

  }

  public parentChanged() {
    this.applyHierarchy();
  }

  protected targetSceneObject: SceneObject;

  public get TargetObject() {
    return this.targetSceneObject;
  }

  /**
  * SceneNode containing this node
  */
  private containedSceneNode: SceneNode = null;

  public get ContainedSceneNode(): SceneNode {
    return this.containedSceneNode;
  }

  /**
  * SceneObjectNode directly containing this node
  */
  private parentSceneObjectNode: SceneObjectNodeBase = null;

  public get ParentSceneObjectNode(): SceneObjectNodeBase {
    return this.parentSceneObjectNode;
  }

  public get Position(): Vector3 {
    return this.attributes.getValue('position');
  }

  public get Rotation(): Quaternion {
    return this.attributes.getValue('rotation');
  }

  public get Scale(): Vector3 {
    return this.attributes.getValue('scale');
  }

}

export = SceneObjectNodeBase;
