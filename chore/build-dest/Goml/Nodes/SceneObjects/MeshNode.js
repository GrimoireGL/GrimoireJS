import SceneObjectNodeBase from "./SceneObjectNodeBase";
import BasicMeshObject from "../../../Core/SceneObjects/BasicMeshObject";
import ContextComponents from "../../../ContextComponents";
import JThreeContext from "../../../JThreeContext";
class MeshNode extends SceneObjectNodeBase {
    constructor() {
        super();
        this._geo = null;
        this._mat = null;
        /**
         * Geomatry instance
         * @type {Geometry}
         */
        this._geo_instance = null;
        /**
         * Material instance
         */
        this._mat_instance = null;
        this.attributes.defineAttribute({
            "geo": {
                value: undefined,
                converter: "string",
                onchanged: this._onGeoAttrChanged.bind(this),
            },
            "mat": {
                value: undefined,
                converter: "string",
                onchanged: this._onMatAttrChanged.bind(this),
            }
        });
    }
    __onMount() {
        super.__onMount();
    }
    /**
     * Called when geo attribute is changed
     * @param {GomlAttribute} attr [description]
     */
    _onGeoAttrChanged(attr) {
        this._geo = attr.Value;
        this._geo_instance = null;
        // console.warn("onGeoAttrChanged", attr.Value);
        this._geo_instance = JThreeContext.getContextComponent(ContextComponents.PrimitiveRegistory).getPrimitive(this._geo);
        if (this._geo_instance) {
            // console.log("primitive exist", this.geo);
            this._updateTarget();
            attr.done();
        }
        else {
            // console.log("primitive not exist", this.geo);
            this._geo_instance = null;
            this.nodeImport("jthree.resource.geometry", this._geo, (geo) => {
                if (geo) {
                    // console.log("geometry reseived", this.geo);
                    this._geo_instance = geo.target;
                }
                else {
                    this._geo_instance = null;
                }
                this._updateTarget();
                attr.done();
            });
        }
    }
    /**
     * Called when mat attribute is changed
     * @param {GomlAttribute} attr [description]
     */
    _onMatAttrChanged(attr) {
        this._mat = attr.Value;
        this._mat_instance = null;
        // console.warn("onMatAttrChanged", attr.Value);
        this.nodeImport("jthree.resource.material", this._mat, (mat) => {
            console.info("material was updated");
            if (mat) {
                this._mat_instance = mat.target;
            }
            else {
                this._mat_instance = null;
            }
            this._updateTarget();
            attr.done();
        });
    }
    _updateTarget() {
        console.info(this._geo_instance, this._mat_instance);
        if (this._geo_instance && this._mat_instance) {
            console.info("target was updated");
            this.TargetSceneObject = new BasicMeshObject(this._geo_instance, this._mat_instance);
        }
    }
}
export default MeshNode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdvbWwvTm9kZXMvU2NlbmVPYmplY3RzL01lc2hOb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUNPLG1CQUFtQixNQUFNLHVCQUF1QjtPQUNoRCxlQUFlLE1BQU0sNENBQTRDO09BS2pFLGlCQUFpQixNQUFNLDRCQUE0QjtPQUVuRCxhQUFhLE1BQU0sd0JBQXdCO0FBRWxELHVCQUF1QixtQkFBbUI7SUFDeEM7UUFDRSxPQUFPLENBQUM7UUFlRixTQUFJLEdBQVcsSUFBSSxDQUFDO1FBQ3BCLFNBQUksR0FBVyxJQUFJLENBQUM7UUFFNUI7OztXQUdHO1FBQ0ssa0JBQWEsR0FBYSxJQUFJLENBQUM7UUFFdkM7O1dBRUc7UUFDSyxrQkFBYSxHQUFhLElBQUksQ0FBQztRQTFCckMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUM7WUFDOUIsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRSxTQUFTO2dCQUNoQixTQUFTLEVBQUUsUUFBUTtnQkFDbkIsU0FBUyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQzdDO1lBQ0QsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRSxTQUFTO2dCQUNoQixTQUFTLEVBQUUsUUFBUTtnQkFDbkIsU0FBUyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQzdDO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQWdCUyxTQUFTO1FBQ2pCLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssaUJBQWlCLENBQUMsSUFBbUI7UUFDM0MsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzFCLGdEQUFnRDtRQUNoRCxJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBcUIsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLDRDQUE0QztZQUM1QyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2QsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sZ0RBQWdEO1lBQ2hELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1lBQzFCLElBQUksQ0FBQyxVQUFVLENBQUMsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQStCO2dCQUNyRixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNSLDhDQUE4QztvQkFDOUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO2dCQUNsQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO2dCQUM1QixDQUFDO2dCQUNELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDckIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2QsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNLLGlCQUFpQixDQUFDLElBQW1CO1FBQzNDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN2QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMxQixnREFBZ0Q7UUFDaEQsSUFBSSxDQUFDLFVBQVUsQ0FBQywwQkFBMEIsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBMkI7WUFDakYsT0FBTyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ3JDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsSUFBSSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1lBQ2xDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztZQUM1QixDQUFDO1lBQ0QsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLGFBQWE7UUFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNyRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQzdDLE9BQU8sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdkYsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBRUQsZUFBZSxRQUFRLENBQUMiLCJmaWxlIjoiR29tbC9Ob2Rlcy9TY2VuZU9iamVjdHMvTWVzaE5vZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR29tbEF0dHJpYnV0ZSBmcm9tIFwiLi4vLi4vR29tbEF0dHJpYnV0ZVwiO1xuaW1wb3J0IFNjZW5lT2JqZWN0Tm9kZUJhc2UgZnJvbSBcIi4vU2NlbmVPYmplY3ROb2RlQmFzZVwiO1xuaW1wb3J0IEJhc2ljTWVzaE9iamVjdCBmcm9tIFwiLi4vLi4vLi4vQ29yZS9TY2VuZU9iamVjdHMvQmFzaWNNZXNoT2JqZWN0XCI7XG5pbXBvcnQgR2VvbWV0cnlOb2RlQmFzZSBmcm9tIFwiLi4vR2VvbWV0cmllcy9HZW9tZXRyeU5vZGVCYXNlXCI7XG5pbXBvcnQgTWF0ZXJpYWxOb2RlIGZyb20gXCIuLi9NYXRlcmlhbHMvTWF0ZXJpYWxOb2RlQmFzZVwiO1xuaW1wb3J0IE1hdGVyaWFsIGZyb20gXCIuLi8uLi8uLi9Db3JlL01hdGVyaWFscy9NYXRlcmlhbFwiO1xuaW1wb3J0IEdlb21ldHJ5IGZyb20gXCIuLi8uLi8uLi9Db3JlL0dlb21ldHJpZXMvQmFzZS9HZW9tZXRyeVwiO1xuaW1wb3J0IENvbnRleHRDb21wb25lbnRzIGZyb20gXCIuLi8uLi8uLi9Db250ZXh0Q29tcG9uZW50c1wiO1xuaW1wb3J0IFByaW1pdGl2ZVJlZ2lzdG9yeSBmcm9tIFwiLi4vLi4vLi4vQ29yZS9HZW9tZXRyaWVzL0Jhc2UvUHJpbWl0aXZlUmVnaXN0b3J5XCI7XG5pbXBvcnQgSlRocmVlQ29udGV4dCBmcm9tIFwiLi4vLi4vLi4vSlRocmVlQ29udGV4dFwiO1xuXG5jbGFzcyBNZXNoTm9kZSBleHRlbmRzIFNjZW5lT2JqZWN0Tm9kZUJhc2U8QmFzaWNNZXNoT2JqZWN0PiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5hdHRyaWJ1dGVzLmRlZmluZUF0dHJpYnV0ZSh7XG4gICAgICBcImdlb1wiOiB7XG4gICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgIGNvbnZlcnRlcjogXCJzdHJpbmdcIixcbiAgICAgICAgb25jaGFuZ2VkOiB0aGlzLl9vbkdlb0F0dHJDaGFuZ2VkLmJpbmQodGhpcyksXG4gICAgICB9LFxuICAgICAgXCJtYXRcIjoge1xuICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICBjb252ZXJ0ZXI6IFwic3RyaW5nXCIsXG4gICAgICAgIG9uY2hhbmdlZDogdGhpcy5fb25NYXRBdHRyQ2hhbmdlZC5iaW5kKHRoaXMpLFxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2VvOiBzdHJpbmcgPSBudWxsO1xuICBwcml2YXRlIF9tYXQ6IHN0cmluZyA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEdlb21hdHJ5IGluc3RhbmNlXG4gICAqIEB0eXBlIHtHZW9tZXRyeX1cbiAgICovXG4gIHByaXZhdGUgX2dlb19pbnN0YW5jZTogR2VvbWV0cnkgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBNYXRlcmlhbCBpbnN0YW5jZVxuICAgKi9cbiAgcHJpdmF0ZSBfbWF0X2luc3RhbmNlOiBNYXRlcmlhbCA9IG51bGw7XG5cbiAgcHJvdGVjdGVkIF9fb25Nb3VudCgpOiB2b2lkIHtcbiAgICBzdXBlci5fX29uTW91bnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiBnZW8gYXR0cmlidXRlIGlzIGNoYW5nZWRcbiAgICogQHBhcmFtIHtHb21sQXR0cmlidXRlfSBhdHRyIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHByaXZhdGUgX29uR2VvQXR0ckNoYW5nZWQoYXR0cjogR29tbEF0dHJpYnV0ZSk6IHZvaWQge1xuICAgIHRoaXMuX2dlbyA9IGF0dHIuVmFsdWU7XG4gICAgdGhpcy5fZ2VvX2luc3RhbmNlID0gbnVsbDtcbiAgICAvLyBjb25zb2xlLndhcm4oXCJvbkdlb0F0dHJDaGFuZ2VkXCIsIGF0dHIuVmFsdWUpO1xuICAgIHRoaXMuX2dlb19pbnN0YW5jZSA9IEpUaHJlZUNvbnRleHQuZ2V0Q29udGV4dENvbXBvbmVudDxQcmltaXRpdmVSZWdpc3Rvcnk+KENvbnRleHRDb21wb25lbnRzLlByaW1pdGl2ZVJlZ2lzdG9yeSkuZ2V0UHJpbWl0aXZlKHRoaXMuX2dlbyk7XG4gICAgaWYgKHRoaXMuX2dlb19pbnN0YW5jZSkge1xuICAgICAgLy8gY29uc29sZS5sb2coXCJwcmltaXRpdmUgZXhpc3RcIiwgdGhpcy5nZW8pO1xuICAgICAgdGhpcy5fdXBkYXRlVGFyZ2V0KCk7XG4gICAgICBhdHRyLmRvbmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY29uc29sZS5sb2coXCJwcmltaXRpdmUgbm90IGV4aXN0XCIsIHRoaXMuZ2VvKTtcbiAgICAgIHRoaXMuX2dlb19pbnN0YW5jZSA9IG51bGw7XG4gICAgICB0aGlzLm5vZGVJbXBvcnQoXCJqdGhyZWUucmVzb3VyY2UuZ2VvbWV0cnlcIiwgdGhpcy5fZ2VvLCAoZ2VvOiBHZW9tZXRyeU5vZGVCYXNlPEdlb21ldHJ5PikgPT4ge1xuICAgICAgICBpZiAoZ2VvKSB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJnZW9tZXRyeSByZXNlaXZlZFwiLCB0aGlzLmdlbyk7XG4gICAgICAgICAgdGhpcy5fZ2VvX2luc3RhbmNlID0gZ2VvLnRhcmdldDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9nZW9faW5zdGFuY2UgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VwZGF0ZVRhcmdldCgpO1xuICAgICAgICBhdHRyLmRvbmUoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiBtYXQgYXR0cmlidXRlIGlzIGNoYW5nZWRcbiAgICogQHBhcmFtIHtHb21sQXR0cmlidXRlfSBhdHRyIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHByaXZhdGUgX29uTWF0QXR0ckNoYW5nZWQoYXR0cjogR29tbEF0dHJpYnV0ZSk6IHZvaWQge1xuICAgIHRoaXMuX21hdCA9IGF0dHIuVmFsdWU7XG4gICAgdGhpcy5fbWF0X2luc3RhbmNlID0gbnVsbDtcbiAgICAvLyBjb25zb2xlLndhcm4oXCJvbk1hdEF0dHJDaGFuZ2VkXCIsIGF0dHIuVmFsdWUpO1xuICAgIHRoaXMubm9kZUltcG9ydChcImp0aHJlZS5yZXNvdXJjZS5tYXRlcmlhbFwiLCB0aGlzLl9tYXQsIChtYXQ6IE1hdGVyaWFsTm9kZTxNYXRlcmlhbD4pID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbyhcIm1hdGVyaWFsIHdhcyB1cGRhdGVkXCIpO1xuICAgICAgaWYgKG1hdCkge1xuICAgICAgICB0aGlzLl9tYXRfaW5zdGFuY2UgPSBtYXQudGFyZ2V0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbWF0X2luc3RhbmNlID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3VwZGF0ZVRhcmdldCgpO1xuICAgICAgYXR0ci5kb25lKCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVUYXJnZXQoKTogdm9pZCB7XG4gICAgY29uc29sZS5pbmZvKHRoaXMuX2dlb19pbnN0YW5jZSwgdGhpcy5fbWF0X2luc3RhbmNlKTtcbiAgICBpZiAodGhpcy5fZ2VvX2luc3RhbmNlICYmIHRoaXMuX21hdF9pbnN0YW5jZSkge1xuICAgICAgY29uc29sZS5pbmZvKFwidGFyZ2V0IHdhcyB1cGRhdGVkXCIpO1xuICAgICAgdGhpcy5UYXJnZXRTY2VuZU9iamVjdCA9IG5ldyBCYXNpY01lc2hPYmplY3QodGhpcy5fZ2VvX2luc3RhbmNlLCB0aGlzLl9tYXRfaW5zdGFuY2UpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNZXNoTm9kZTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
