import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import SceneNode = require("../SceneNode");
import SceneObject = require("../../../Core/SceneObject");
import Vector3 = require("../../../Math/Vector3");
import Quaternion = require("../../../Math/Quaternion");
import AttributeParser = require("../../AttributeParser");
class SceneObjectNodeBase extends GomlTreeNodeBase {
  constructor(parent: GomlTreeNodeBase, parentSceneNode: SceneNode, parentObject: SceneObjectNodeBase) {
    super(parent);
    this.containedSceneNode = parentSceneNode;
    this.parentSceneObjectNode = parentObject;
    this.attributes.defineAttribute({
      "position": {
        value: new Vector3(0, 0, 0),
        converter: "vector3",
        handler: (v) => {
          if (this.targetSceneObject != null) this.targetSceneObject.Transformer.Position = <Vector3>v.Value; }
      },
      "scale": {
        value: new Vector3(1, 1, 1),
        converter: "vector3",
        handler: (v) => { if (this.targetSceneObject != null) this.targetSceneObject.Transformer.Scale = <Vector3>v.Value; }
      },
      "rotation":
      {
        value: Quaternion.Identity,
        converter: "rotation",
        handler: (v) => {
          if (this.targetSceneObject != null)
            this.targetSceneObject.Transformer.Rotation = v.Value;
        }
      },
      "name":
      {
        value:undefined,
        converter:"string",
        handler:(v)=>
        {
          if(this.targetSceneObject&&v.Value)this.targetSceneObject.name = v.Value;
        }
      }
    });
  }

  protected ConstructTarget(): SceneObject {
    return null;
  }

  protected targetUpdated() {

  }


  public beforeLoad(): void {
    super.beforeLoad();
    this.targetSceneObject = this.ConstructTarget();
    if (this.targetSceneObject == null) return;
    if(!this.targetSceneObject.name||this.targetSceneObject.ID == this.targetSceneObject.name)
      this.targetSceneObject.name = `${this.targetSceneObject.getTypeName()}(${this.targetSceneObject.ID})`;
    //append targetObject to parent
    this.applyHierarchy();
    this.attributes.applyDefaultValue();
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

  public get Position(): Vector3
  {
    return this.attributes.getValue('position');
  }

  public get Rotation(): Quaternion
  {
    return this.attributes.getValue('rotation');
  }

  public get Scale(): Vector3
  {
    return this.attributes.getValue('scale');
  }

}

export =SceneObjectNodeBase;