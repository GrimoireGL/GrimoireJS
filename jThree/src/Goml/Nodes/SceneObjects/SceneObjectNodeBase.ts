import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import SceneNode = require("../SceneNode");
import SceneObject = require("../../../Core/SceneObject");
import Vector3 = require("../../../Math/Vector3");
import Quaternion = require("../../../Math/Quaternion");
import AttributeParser = require("../../AttributeParser");
import Delegate = require("../../../Base/Delegates");

class SceneObjectNodeBase extends GomlTreeNodeBase {
  constructor() {
    super();
    this.attributes.defineAttribute({
      "position": {
        value: new Vector3(0, 0, 0),
        converter: "vec3",
        onchanged: (attr) => {
          if (this.targetSceneObject) {
            this.targetSceneObject.Transformer.Position = <Vector3>attr.Value;
          } else {
            this.once('target-scene-object-added', () => {
              this.targetSceneObject.Transformer.Position = <Vector3>attr.Value;
            });
          }
        }
      },
      "scale": {
        value: new Vector3(1, 1, 1),
        converter: "vec3",
        onchanged: (attr) => {
          if (this.targetSceneObject) {
            this.targetSceneObject.Transformer.Scale = <Vector3>attr.Value;
          } else {
            this.once('target-scene-object-added', () => {
              this.targetSceneObject.Transformer.Scale = <Vector3>attr.Value;
            });
          }
        }
      },
      "rotation": {
        value: Quaternion.Identity,
        converter: "rotation",
        onchanged: (attr) => {
          if (this.targetSceneObject) {
            this.targetSceneObject.Transformer.Rotation = <Quaternion>attr.Value;
          } else {
            this.once('target-scene-object-added', () => {
              this.targetSceneObject.Transformer.Rotation = <Quaternion>attr.Value;
            });
          }
        }
      },
      "name": {
        value: undefined,
        converter: "string",
        onchanged: (attr) => {
          if (this.targetSceneObject) {
            this.targetSceneObject.name = attr.Value;
          } else {
            this.once('target-scene-object-added', () => {
              this.targetSceneObject.name = attr.Value;
            });
          }
        }
      }
    });
  }

  protected onMount(): void {
    super.onMount();
    let sceneNode: SceneNode = null;
    let sceneObjectNode: SceneObjectNodeBase = null;
    if (this.parent.getTypeName() == "SceneNode")//This parent node is scene node. TODO: I wonder there is better way
    {
      sceneNode = <SceneNode>this.parent;
      sceneObjectNode = null;
    } else {
      if (typeof this.parent["ContainedSceneNode"] === "undefined") {//check parent extends SceneObjectNodeBase or not.
        console.error(`${this.parent.toString() } is not extends SceneObjectNodeBase. Is this really ok to be contained in Scene tag?`);
        return null;
      } else {
        sceneObjectNode = <SceneObjectNodeBase>this.parent;
        sceneNode = sceneObjectNode.ContainedSceneNode;
      }
    }
    this.containedSceneNode = sceneNode;
    this.parentSceneObjectNode = sceneObjectNode;

    this.ConstructTarget((sceneObject) => {
      this.targetSceneObject = sceneObject;
      if (!this.targetSceneObject) {
        console.error('sceneObject is invalid.');
        return;
      }
      this.emit('target-scene-object-added');
      if (!this.targetSceneObject.name || this.targetSceneObject.ID == this.targetSceneObject.name)
        this.targetSceneObject.name = `${this.targetSceneObject.getTypeName() }(${this.targetSceneObject.ID})`;
      //append targetObject to parentt
      this.applyHierarchy();
    });
  }

  protected ConstructTarget(callbackfn: Delegate.Action1<SceneObject>): void {
    console.error('This method "ConstructTarget" should be overridden.')
  }

  protected targetUpdated() {

  }

  private applyHierarchy() {
    if (this.parentSceneObjectNode == null) { //this is root object of scene
      this.containedSceneNode.targetScene.addObject(this.targetSceneObject);
    } else {
      if (this.parentSceneObjectNode.targetSceneObject == null) return;
      this.parentSceneObjectNode.targetSceneObject.addChild(this.targetSceneObject);
    }
  }

  protected targetSceneObject: SceneObject;

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
