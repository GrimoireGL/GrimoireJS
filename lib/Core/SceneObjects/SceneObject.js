import JThreeObjectEEWithID from "../../Base/JThreeObjectEEWithID";
import JThreeCollection from "../../Base/JThreeCollection";
import Transformer from "../Transform/Transformer";
import JThreeEvent from "../../Base/JThreeEvent";
/**
 * This is most base class for SceneObject.
 * SceneObject is same as GameObject in Unity.
 */
class SceneObject extends JThreeObjectEEWithID {
    constructor(transformer) {
        super();
        this.isVisible = true;
        this._onStructureChangedEvent = new JThreeEvent();
        this._materialChanagedHandler = [];
        this._materials = {};
        /**
         * Contains the children.
         */
        this._children = [];
        this.__transformer = transformer || new Transformer(this);
        this.name = this.ID;
    }
    /**
    * Getter for children
    */
    get Children() {
        return this._children;
    }
    addChild(obj) {
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
    removeChild(obj) {
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
    remove() {
        this._parent.removeChild(this);
    }
    get Parent() {
        return this._parent;
    }
    /**
    * The Getter for the parent scene containing this SceneObject.
    */
    get ParentScene() {
        if (!this._parentScene) {
            if (!this._parent) {
                return null;
            }
            else {
                this.ParentScene = this._parent.ParentScene; // Retrieve and cache parent scene
                return this._parentScene;
            }
        }
        else {
            // The parent scene was already cached.
            return this._parentScene;
        }
    }
    /**
    * The Getter for the parent scene containing this SceneObject.
    */
    set ParentScene(scene) {
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
    onMaterialChanged(func) {
        this._materialChanagedHandler.push(func);
    }
    /**
     * すべてのマテリアルに対して処理を実行します。
     */
    eachMaterial(func) {
        for (let material in this._materials) {
            this._materials[material].each((e) => func(e));
        }
    }
    addMaterial(mat) {
        if (!this._materials[mat.MaterialGroup]) {
            this._materials[mat.MaterialGroup] = new JThreeCollection();
        }
        this._materials[mat.MaterialGroup].insert(mat);
    }
    getMaterial(matGroup) {
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
    getMaterials(matGroup) {
        if (this._materials[matGroup]) {
            return this._materials[matGroup].asArray();
        }
        return [];
    }
    get Geometry() {
        return this.__geometry;
    }
    set Geometry(geo) {
        this.__geometry = geo;
    }
    get Transformer() {
        return this.__transformer;
    }
    callRecursive(action) {
        if (this._children) {
            this._children.forEach(t => t.callRecursive(action));
        }
        action(this);
    }
    onChildrenChanged() {
        return;
    }
    onParentChanged() {
        return;
    }
    onParentSceneChanged(sceneInfo) {
        return;
    }
    update() {
        return;
    }
}
export default SceneObject;
