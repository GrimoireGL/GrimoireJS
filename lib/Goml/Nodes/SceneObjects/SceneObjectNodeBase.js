import CoreRelatedNodeBase from "../../CoreRelatedNodeBase";
import Vector3 from "../../../Math/Vector3";
import Quaternion from "../../../Math/Quaternion";
class SceneObjectNodeBase extends CoreRelatedNodeBase {
    constructor() {
        super();
        /**
         * Scene Object that will be applied to Scene.
         * @type {SceneObject}
         */
        this._sceneObject = null;
        /**
        * SceneObjectNode directly containing this node
        */
        this._parentSceneObjectNode = null;
        /**
        * SceneNode containing this node
        */
        this._containedSceneNode = null;
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
        this.on("update-scene-object", (obj) => {
            this._onPositionAttrChanged__SceneObjectNodeBase.call(this, this.attributes.getAttribute("position"));
            this._onScaleAttrChanged__SceneObjectNodeBase.call(this, this.attributes.getAttribute("scale"));
            this._onRotationAttrChanged__SceneObjectNodeBase.call(this, this.attributes.getAttribute("rotation"));
            this._onNameAttrChanged__SceneObjectNodeBase.call(this, this.attributes.getAttribute("name"));
        });
    }
    get ParentSceneObjectNode() {
        return this._parentSceneObjectNode;
    }
    get ContainedSceneNode() {
        return this._containedSceneNode;
    }
    __onMount() {
        super.__onMount();
        let containedSceneNode = null;
        let parentSceneObjectNode = null;
        // This parent node is scene node.
        if (this.__parent.getTypeName() === "SceneNode") {
            containedSceneNode = this.__parent;
            parentSceneObjectNode = null;
        }
        else {
            // check parent extends SceneObjectNodeBase or not.
            if (typeof this.__parent.ContainedSceneNode === "undefined") {
                console.error(`${this.__parent.toString()} is not extends SceneObjectNodeBase. Is this really ok to be contained in Scene tag?`);
                return;
            }
            else {
                parentSceneObjectNode = this.__parent;
                containedSceneNode = parentSceneObjectNode.ContainedSceneNode;
            }
        }
        this._containedSceneNode = containedSceneNode;
        this._parentSceneObjectNode = parentSceneObjectNode;
    }
    __onUnmount() {
        super.__onUnmount();
    }
    _onPositionAttrChanged__SceneObjectNodeBase(attr) {
        if (this._sceneObject) {
            this._sceneObject.Transformer.Position = attr.Value;
            attr.done();
        }
    }
    _onScaleAttrChanged__SceneObjectNodeBase(attr) {
        if (this._sceneObject) {
            this._sceneObject.Transformer.Scale = attr.Value;
            attr.done();
        }
    }
    _onRotationAttrChanged__SceneObjectNodeBase(attr) {
        if (this._sceneObject) {
            this._sceneObject.Transformer.Rotation = attr.Value;
            attr.done();
        }
    }
    _onNameAttrChanged__SceneObjectNodeBase(attr) {
        if (this._sceneObject) {
            this._sceneObject.name = attr.Value;
            attr.done();
        }
    }
    /**
     * update SceneObject child. using this.sceneObject to previus object, so do not change it before call this method.
     * @param {SceneObject} obj [description]
     */
    _updateSceneObjectChild(obj) {
        if (typeof obj === "undefined") {
            console.error(`${this.getTypeName()}: sceneObject is undefined. It must be null or instance.`);
            obj = null;
        }
        // previus object is exist in child, remove child
        if (this._sceneObject !== null) {
            if (this.ParentSceneObjectNode === null) {
                this._containedSceneNode.target.removeObject(this._sceneObject);
            }
            else {
                if (this._parentSceneObjectNode.TargetSceneObject === null) {
                    return;
                }
                this._parentSceneObjectNode.TargetSceneObject.removeChild(this._sceneObject);
            }
        }
        if (obj !== null) {
            if (this.ParentSceneObjectNode === null) {
                this._containedSceneNode.target.addObject(obj);
            }
            else {
                if (this._parentSceneObjectNode.TargetSceneObject === null) {
                    return;
                }
                this._parentSceneObjectNode.TargetSceneObject.addChild(obj);
            }
        }
    }
    /**
     * Change the SceneObject that is applied to Scene Hierarchy.
     * @param {SceneObject} obj [description]
     */
    set TargetSceneObject(obj) {
        this._updateSceneObjectChild(obj);
        this._sceneObject = obj;
        this.target = obj;
        this.emit("update-scene-object", this.target);
    }
    /**
     * Get the SceneObject that is applied to Scene Hierarchy.
     * @return {SceneObject} [description]
     */
    get TargetSceneObject() {
        return this._sceneObject;
    }
}
export default SceneObjectNodeBase;
