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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvU2NlbmVPYmplY3RzL1NjZW5lT2JqZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLG9CQUFvQixNQUFNLGlDQUFpQztPQU0zRCxnQkFBZ0IsTUFBTSw2QkFBNkI7T0FDbkQsV0FBVyxNQUFNLDBCQUEwQjtPQUMzQyxXQUFXLE1BQU0sd0JBQXdCO0FBRWhEOzs7R0FHRztBQUNILDBCQUEwQixvQkFBb0I7SUE4QjVDLFlBQVksV0FBeUI7UUFDbkMsT0FBTyxDQUFDO1FBNUJILGNBQVMsR0FBWSxJQUFJLENBQUM7UUFNekIsNkJBQXdCLEdBQXVELElBQUksV0FBVyxFQUF5QyxDQUFDO1FBRXhJLDZCQUF3QixHQUFxQyxFQUFFLENBQUM7UUFFaEUsZUFBVSxHQUE0RCxFQUFFLENBQUM7UUFPakY7O1dBRUc7UUFDSyxjQUFTLEdBQWtCLEVBQUUsQ0FBQztRQVNwQyxJQUFJLENBQUMsYUFBYSxHQUFHLFdBQVcsSUFBSSxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVEOztNQUVFO0lBQ0YsSUFBVyxRQUFRO1FBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFTSxRQUFRLENBQUMsR0FBZ0I7UUFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekIsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDbkIsR0FBRyxDQUFDLFdBQVcsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUNsQyxNQUFNLFFBQVEsR0FBRztZQUNmLEtBQUssRUFBRSxJQUFJO1lBQ1gsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQ3ZCLGtCQUFrQixFQUFFLElBQUk7WUFDeEIsa0JBQWtCLEVBQUUsR0FBRztZQUN2QixvQkFBb0IsRUFBRSxHQUFHLENBQUMsRUFBRTtT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amVjdHMvU2NlbmVPYmplY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSlRocmVlT2JqZWN0RUVXaXRoSUQgZnJvbSBcIi4uLy4uL0Jhc2UvSlRocmVlT2JqZWN0RUVXaXRoSURcIjtcbmltcG9ydCBJUGFyZW50U2NlbmVDaGFuZ2VkRXZlbnRBcmdzIGZyb20gXCIuLi9JUGFyZW50U2NlbmVDaGFuZ2VkRXZlbnRBcmdzXCI7XG5pbXBvcnQgTWF0ZXJpYWwgZnJvbSBcIi4uL01hdGVyaWFscy9NYXRlcmlhbFwiO1xuaW1wb3J0IHtBY3Rpb24xLCBBY3Rpb24yfSBmcm9tIFwiLi4vLi4vQmFzZS9EZWxlZ2F0ZXNcIjtcbmltcG9ydCBHZW9tZXRyeSBmcm9tIFwiLi4vR2VvbWV0cmllcy9CYXNlL0dlb21ldHJ5XCI7XG5pbXBvcnQgU2NlbmUgZnJvbSBcIi4uL1NjZW5lXCI7XG5pbXBvcnQgSlRocmVlQ29sbGVjdGlvbiBmcm9tIFwiLi4vLi4vQmFzZS9KVGhyZWVDb2xsZWN0aW9uXCI7XG5pbXBvcnQgVHJhbnNmb3JtZXIgZnJvbSBcIi4uL1RyYW5zZm9ybS9UcmFuc2Zvcm1lclwiO1xuaW1wb3J0IEpUaHJlZUV2ZW50IGZyb20gXCIuLi8uLi9CYXNlL0pUaHJlZUV2ZW50XCI7XG5pbXBvcnQgSVNjZW5lT2JqZWN0U3RydWN0dXJlQ2hhbmdlZEV2ZW50QXJncyBmcm9tIFwiLi4vSVNjZW5lT2JqZWN0Q2hhbmdlZEV2ZW50QXJnc1wiO1xuLyoqXG4gKiBUaGlzIGlzIG1vc3QgYmFzZSBjbGFzcyBmb3IgU2NlbmVPYmplY3QuXG4gKiBTY2VuZU9iamVjdCBpcyBzYW1lIGFzIEdhbWVPYmplY3QgaW4gVW5pdHkuXG4gKi9cbmNsYXNzIFNjZW5lT2JqZWN0IGV4dGVuZHMgSlRocmVlT2JqZWN0RUVXaXRoSUQge1xuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuXG4gIHB1YmxpYyBpc1Zpc2libGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIHByb3RlY3RlZCBfX2dlb21ldHJ5OiBHZW9tZXRyeTtcblxuICBwcm90ZWN0ZWQgX190cmFuc2Zvcm1lcjogVHJhbnNmb3JtZXI7XG5cbiAgcHJpdmF0ZSBfb25TdHJ1Y3R1cmVDaGFuZ2VkRXZlbnQ6IEpUaHJlZUV2ZW50PElTY2VuZU9iamVjdFN0cnVjdHVyZUNoYW5nZWRFdmVudEFyZ3M+ID0gbmV3IEpUaHJlZUV2ZW50PElTY2VuZU9iamVjdFN0cnVjdHVyZUNoYW5nZWRFdmVudEFyZ3M+KCk7XG5cbiAgcHJpdmF0ZSBfbWF0ZXJpYWxDaGFuYWdlZEhhbmRsZXI6IEFjdGlvbjI8TWF0ZXJpYWwsIFNjZW5lT2JqZWN0PltdID0gW107XG5cbiAgcHJpdmF0ZSBfbWF0ZXJpYWxzOiB7IFttYXRlcmlhbEdyb3VwOiBzdHJpbmddOiBKVGhyZWVDb2xsZWN0aW9uPE1hdGVyaWFsPiB9ID0ge307XG5cbiAgLyoqXG4gICAqIENvbnRhaW5zIHRoZSBwYXJlbnQgc2NlbmUgY29udGFpbmluZyB0aGlzIFNjZW5lT2JqZWN0LlxuICAgKi9cbiAgcHJpdmF0ZSBfcGFyZW50U2NlbmU6IFNjZW5lO1xuXG4gIC8qKlxuICAgKiBDb250YWlucyB0aGUgY2hpbGRyZW4uXG4gICAqL1xuICBwcml2YXRlIF9jaGlsZHJlbjogU2NlbmVPYmplY3RbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBQYXJlbnQgb2YgdGhpcyBTY2VuZU9iamVjdC5cbiAgICovXG4gIHByaXZhdGUgX3BhcmVudDogU2NlbmVPYmplY3Q7XG5cbiAgY29uc3RydWN0b3IodHJhbnNmb3JtZXI/OiBUcmFuc2Zvcm1lcikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fX3RyYW5zZm9ybWVyID0gdHJhbnNmb3JtZXIgfHwgbmV3IFRyYW5zZm9ybWVyKHRoaXMpO1xuICAgIHRoaXMubmFtZSA9IHRoaXMuSUQ7XG4gIH1cblxuICAvKipcbiAgKiBHZXR0ZXIgZm9yIGNoaWxkcmVuXG4gICovXG4gIHB1YmxpYyBnZXQgQ2hpbGRyZW4oKTogU2NlbmVPYmplY3RbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuO1xuICB9XG5cbiAgcHVibGljIGFkZENoaWxkKG9iajogU2NlbmVPYmplY3QpOiB2b2lkIHtcbiAgICB0aGlzLl9jaGlsZHJlbi5wdXNoKG9iaik7XG4gICAgb2JqLl9wYXJlbnQgPSB0aGlzO1xuICAgIG9iai5UcmFuc2Zvcm1lci51cGRhdGVUcmFuc2Zvcm0oKTtcbiAgICBjb25zdCBldmVudEFyZyA9IHtcbiAgICAgIG93bmVyOiB0aGlzLFxuICAgICAgc2NlbmU6IHRoaXMuUGFyZW50U2NlbmUsXG4gICAgICBpc0FkZGl0aW9uYWxDaGFuZ2U6IHRydWUsXG4gICAgICBjaGFuZ2VkU2NlbmVPYmplY3Q6IG9iaixcbiAgICAgIGNoYW5nZWRTY2VuZU9iamVjdElEOiBvYmouSURcbiAgICB9O1xuICAgIHRoaXMuX29uU3RydWN0dXJlQ2hhbmdlZEV2ZW50LmZpcmUodGhpcywgZXZlbnRBcmcpO1xuICAgIHRoaXMub25DaGlsZHJlbkNoYW5nZWQoKTtcbiAgICBvYmoub25QYXJlbnRDaGFuZ2VkKCk7XG4gICAgaWYgKHRoaXMuUGFyZW50U2NlbmUpIHtcbiAgICAgIHRoaXMuUGFyZW50U2NlbmUubm90aWZ5U2NlbmVPYmplY3RDaGFuZ2VkKGV2ZW50QXJnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogcmVtb3ZlIFNjZW5lT2JqZWN0IGZyb20gY2hpbGRyZW4uXG4gICAqIEBwYXJhbSB7U2NlbmVPYmplY3R9IG9iaiBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBwdWJsaWMgcmVtb3ZlQ2hpbGQob2JqOiBTY2VuZU9iamVjdCk6IHZvaWQge1xuICAgIGNvbnN0IGNoaWxkSW5kZXggPSB0aGlzLl9jaGlsZHJlbi5pbmRleE9mKG9iaik7XG4gICAgaWYgKGNoaWxkSW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLl9jaGlsZHJlbi5zcGxpY2UoY2hpbGRJbmRleCwgMSk7XG4gICAgICBjb25zdCBldmVudEFyZyA9IHtcbiAgICAgICAgb3duZXI6IHRoaXMsXG4gICAgICAgIHNjZW5lOiB0aGlzLlBhcmVudFNjZW5lLFxuICAgICAgICBpc0FkZGl0aW9uYWxDaGFuZ2U6IGZhbHNlLFxuICAgICAgICBjaGFuZ2VkU2NlbmVPYmplY3Q6IG9iaixcbiAgICAgICAgY2hhbmdlZFNjZW5lT2JqZWN0SUQ6IG9iai5JRFxuICAgICAgfTtcbiAgICAgIHRoaXMuX29uU3RydWN0dXJlQ2hhbmdlZEV2ZW50LmZpcmUodGhpcywgZXZlbnRBcmcpO1xuICAgICAgb2JqLm9uUGFyZW50Q2hhbmdlZCgpO1xuICAgICAgaWYgKHRoaXMuUGFyZW50U2NlbmUpIHtcbiAgICAgICAgdGhpcy5QYXJlbnRTY2VuZS5ub3RpZnlTY2VuZU9iamVjdENoYW5nZWQoZXZlbnRBcmcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiByZW1vdmUgdGhpcyBTY2VuZU9iamVjdCBmcm9tIHBhcmVudC5cbiAgICovXG4gIHB1YmxpYyByZW1vdmUoKTogdm9pZCB7XG4gICAgdGhpcy5fcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGdldCBQYXJlbnQoKTogU2NlbmVPYmplY3Qge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG4gIH1cblxuICAvKipcbiAgKiBUaGUgR2V0dGVyIGZvciB0aGUgcGFyZW50IHNjZW5lIGNvbnRhaW5pbmcgdGhpcyBTY2VuZU9iamVjdC5cbiAgKi9cbiAgcHVibGljIGdldCBQYXJlbnRTY2VuZSgpOiBTY2VuZSB7XG4gICAgaWYgKCF0aGlzLl9wYXJlbnRTY2VuZSkge1xuICAgICAgaWYgKCF0aGlzLl9wYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLlBhcmVudFNjZW5lID0gdGhpcy5fcGFyZW50LlBhcmVudFNjZW5lOyAvLyBSZXRyaWV2ZSBhbmQgY2FjaGUgcGFyZW50IHNjZW5lXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnRTY2VuZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIHBhcmVudCBzY2VuZSB3YXMgYWxyZWFkeSBjYWNoZWQuXG4gICAgICByZXR1cm4gdGhpcy5fcGFyZW50U2NlbmU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogVGhlIEdldHRlciBmb3IgdGhlIHBhcmVudCBzY2VuZSBjb250YWluaW5nIHRoaXMgU2NlbmVPYmplY3QuXG4gICovXG5cbiAgcHVibGljIHNldCBQYXJlbnRTY2VuZShzY2VuZTogU2NlbmUpIHtcbiAgICBpZiAoc2NlbmUgPT09IHRoaXMuX3BhcmVudFNjZW5lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGxhc3RTY2VuZSA9IHRoaXMuX3BhcmVudFNjZW5lO1xuICAgIHRoaXMuX3BhcmVudFNjZW5lID0gc2NlbmU7XG4gICAgLy8gaWYoIXRoaXMucGFyZW50fHx0aGlzLnBhcmVudC5QYXJlbnRTY2VuZS5JRCE9c2NlbmUuSUQpXG4gICAgLy8gICAgIGNvbnNvbGUuZXJyb3IoXCJUaGVyZSBpcyBzb21ldGhpbmcgd3JvbmcgaW4gU2NlbmUgc3RydWN0dXJlLlwiKTtcbiAgICAvLyBpbnNlcnQgcmVjdXJzaXZlbHkgdG8gdGhlIGNoaWxkcmVuIHRoaXMgU2NlbmVPYmplY3QgY29udGFpbnMuXG4gICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaCgodikgPT4ge1xuICAgICAgdi5QYXJlbnRTY2VuZSA9IHNjZW5lO1xuICAgIH0pO1xuICAgIHRoaXMub25QYXJlbnRTY2VuZUNoYW5nZWQoe1xuICAgICAgbGFzdFBhcmVudFNjZW5lOiBsYXN0U2NlbmUsXG4gICAgICBjdXJyZW50UGFyZW50U2NlbmU6IHRoaXMuX3BhcmVudFNjZW5lXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25NYXRlcmlhbENoYW5nZWQoZnVuYzogQWN0aW9uMjxNYXRlcmlhbCwgU2NlbmVPYmplY3Q+KTogdm9pZCB7XG4gICAgdGhpcy5fbWF0ZXJpYWxDaGFuYWdlZEhhbmRsZXIucHVzaChmdW5jKTtcbiAgfVxuICAvKipcbiAgICog44GZ44G544Gm44Gu44Oe44OG44Oq44Ki44Or44Gr5a++44GX44Gm5Yem55CG44KS5a6f6KGM44GX44G+44GZ44CCXG4gICAqL1xuICBwdWJsaWMgZWFjaE1hdGVyaWFsKGZ1bmM6IEFjdGlvbjE8TWF0ZXJpYWw+KTogdm9pZCB7XG4gICAgZm9yIChsZXQgbWF0ZXJpYWwgaW4gdGhpcy5fbWF0ZXJpYWxzKSB7XG4gICAgICB0aGlzLl9tYXRlcmlhbHNbbWF0ZXJpYWxdLmVhY2goKGUpID0+IGZ1bmMoZSkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhZGRNYXRlcmlhbChtYXQ6IE1hdGVyaWFsKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9tYXRlcmlhbHNbbWF0Lk1hdGVyaWFsR3JvdXBdKSB7XG4gICAgICB0aGlzLl9tYXRlcmlhbHNbbWF0Lk1hdGVyaWFsR3JvdXBdID0gbmV3IEpUaHJlZUNvbGxlY3Rpb248TWF0ZXJpYWw+KCk7XG4gICAgfVxuICAgIHRoaXMuX21hdGVyaWFsc1ttYXQuTWF0ZXJpYWxHcm91cF0uaW5zZXJ0KG1hdCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0TWF0ZXJpYWwobWF0R3JvdXA6IHN0cmluZyk6IE1hdGVyaWFsIHtcbiAgICBpZiAodGhpcy5fbWF0ZXJpYWxzW21hdEdyb3VwXSkge1xuICAgICAgY29uc3QgYSA9IHRoaXMuX21hdGVyaWFsc1ttYXRHcm91cF07XG4gICAgICBsZXQgcmV0ID0gbnVsbDtcbiAgICAgIGEuZWFjaCgoZSkgPT4ge1xuICAgICAgICByZXQgPSBlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHVibGljIGdldE1hdGVyaWFscyhtYXRHcm91cDogc3RyaW5nKTogTWF0ZXJpYWxbXSB7XG4gICAgaWYgKHRoaXMuX21hdGVyaWFsc1ttYXRHcm91cF0pIHtcbiAgICAgIHJldHVybiB0aGlzLl9tYXRlcmlhbHNbbWF0R3JvdXBdLmFzQXJyYXkoKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgcHVibGljIGdldCBHZW9tZXRyeSgpOiBHZW9tZXRyeSB7XG4gICAgcmV0dXJuIHRoaXMuX19nZW9tZXRyeTtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgR2VvbWV0cnkoZ2VvOiBHZW9tZXRyeSkge1xuICAgIHRoaXMuX19nZW9tZXRyeSA9IGdlbztcbiAgfVxuXG4gIHB1YmxpYyBnZXQgVHJhbnNmb3JtZXIoKTogVHJhbnNmb3JtZXIge1xuICAgIHJldHVybiB0aGlzLl9fdHJhbnNmb3JtZXI7XG4gIH1cblxuICBwdWJsaWMgY2FsbFJlY3Vyc2l2ZShhY3Rpb246IEFjdGlvbjE8U2NlbmVPYmplY3Q+KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2NoaWxkcmVuKSB7XG4gICAgICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKHQgPT4gdC5jYWxsUmVjdXJzaXZlKGFjdGlvbikpO1xuICAgIH1cbiAgICBhY3Rpb24odGhpcyk7XG4gIH1cblxuICBwdWJsaWMgb25DaGlsZHJlbkNoYW5nZWQoKTogdm9pZCB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHVibGljIG9uUGFyZW50Q2hhbmdlZCgpOiB2b2lkIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBwdWJsaWMgb25QYXJlbnRTY2VuZUNoYW5nZWQoc2NlbmVJbmZvOiBJUGFyZW50U2NlbmVDaGFuZ2VkRXZlbnRBcmdzKTogdm9pZCB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcbiAgICByZXR1cm47XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2NlbmVPYmplY3Q7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=