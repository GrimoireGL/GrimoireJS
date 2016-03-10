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
        if (this._geo_instance && this._mat_instance) {
            this.TargetSceneObject = new BasicMeshObject(this._geo_instance, this._mat_instance);
        }
    }
}
export default MeshNode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdvbWwvTm9kZXMvU2NlbmVPYmplY3RzL01lc2hOb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUNPLG1CQUFtQixNQUFNLHVCQUF1QjtPQUNoRCxlQUFlLE1BQU0sNENBQTRDO09BS2pFLGlCQUFpQixNQUFNLDRCQUE0QjtPQUVuRCxhQUFhLE1BQU0sd0JBQXdCO0FBRWxELHVCQUF1QixtQkFBbUI7SUFDeEM7UUFDRSxPQUFPLENBQUM7UUFlRixTQUFJLEdBQVcsSUFBSSxDQUFDO1FBQ3BCLFNBQUksR0FBVyxJQUFJLENBQUM7UUFFNUI7OztXQUdHO1FBQ0ssa0JBQWEsR0FBYSxJQUFJLENBQUM7UUFFdkM7O1dBRUc7UUFDSyxrQkFBYSxHQUFhLElBQUksQ0FBQztRQTFCckMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUM7WUFDOUIsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRSxTQUFTO2dCQUNoQixTQUFTLEVBQUUsUUFBUTtnQkFDbkIsU0FBUyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQzdDO1lBQ0QsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRSxTQUFTO2dCQUNoQixTQUFTLEVBQUUsUUFBUTtnQkFDbkIsU0FBUyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQzdDO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQWdCUyxTQUFTO1FBQ2pCLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssaUJBQWlCLENBQUMsSUFBbUI7UUFDM0MsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzFCLGdEQUFnRDtRQUNoRCxJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBcUIsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLDRDQUE0QztZQUM1QyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2QsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sZ0RBQWdEO1lBQ2hELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1lBQzFCLElBQUksQ0FBQyxVQUFVLENBQUMsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQStCO2dCQUNyRixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNSLDhDQUE4QztvQkFDOUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO2dCQUNsQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO2dCQUM1QixDQUFDO2dCQUNELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDckIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2QsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNLLGlCQUFpQixDQUFDLElBQW1CO1FBQzNDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN2QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMxQixnREFBZ0Q7UUFDaEQsSUFBSSxDQUFDLFVBQVUsQ0FBQywwQkFBMEIsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBMkI7WUFDakYsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUixJQUFJLENBQUMsYUFBYSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7WUFDbEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1lBQzVCLENBQUM7WUFDRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sYUFBYTtRQUNuQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQzdDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN2RixDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFFRCxlQUFlLFFBQVEsQ0FBQyIsImZpbGUiOiJHb21sL05vZGVzL1NjZW5lT2JqZWN0cy9NZXNoTm9kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBHb21sQXR0cmlidXRlIGZyb20gXCIuLi8uLi9Hb21sQXR0cmlidXRlXCI7XG5pbXBvcnQgU2NlbmVPYmplY3ROb2RlQmFzZSBmcm9tIFwiLi9TY2VuZU9iamVjdE5vZGVCYXNlXCI7XG5pbXBvcnQgQmFzaWNNZXNoT2JqZWN0IGZyb20gXCIuLi8uLi8uLi9Db3JlL1NjZW5lT2JqZWN0cy9CYXNpY01lc2hPYmplY3RcIjtcbmltcG9ydCBHZW9tZXRyeU5vZGVCYXNlIGZyb20gXCIuLi9HZW9tZXRyaWVzL0dlb21ldHJ5Tm9kZUJhc2VcIjtcbmltcG9ydCBNYXRlcmlhbE5vZGUgZnJvbSBcIi4uL01hdGVyaWFscy9NYXRlcmlhbE5vZGVCYXNlXCI7XG5pbXBvcnQgTWF0ZXJpYWwgZnJvbSBcIi4uLy4uLy4uL0NvcmUvTWF0ZXJpYWxzL01hdGVyaWFsXCI7XG5pbXBvcnQgR2VvbWV0cnkgZnJvbSBcIi4uLy4uLy4uL0NvcmUvR2VvbWV0cmllcy9CYXNlL0dlb21ldHJ5XCI7XG5pbXBvcnQgQ29udGV4dENvbXBvbmVudHMgZnJvbSBcIi4uLy4uLy4uL0NvbnRleHRDb21wb25lbnRzXCI7XG5pbXBvcnQgUHJpbWl0aXZlUmVnaXN0b3J5IGZyb20gXCIuLi8uLi8uLi9Db3JlL0dlb21ldHJpZXMvQmFzZS9QcmltaXRpdmVSZWdpc3RvcnlcIjtcbmltcG9ydCBKVGhyZWVDb250ZXh0IGZyb20gXCIuLi8uLi8uLi9KVGhyZWVDb250ZXh0XCI7XG5cbmNsYXNzIE1lc2hOb2RlIGV4dGVuZHMgU2NlbmVPYmplY3ROb2RlQmFzZTxCYXNpY01lc2hPYmplY3Q+IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmF0dHJpYnV0ZXMuZGVmaW5lQXR0cmlidXRlKHtcbiAgICAgIFwiZ2VvXCI6IHtcbiAgICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgICAgY29udmVydGVyOiBcInN0cmluZ1wiLFxuICAgICAgICBvbmNoYW5nZWQ6IHRoaXMuX29uR2VvQXR0ckNoYW5nZWQuYmluZCh0aGlzKSxcbiAgICAgIH0sXG4gICAgICBcIm1hdFwiOiB7XG4gICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgIGNvbnZlcnRlcjogXCJzdHJpbmdcIixcbiAgICAgICAgb25jaGFuZ2VkOiB0aGlzLl9vbk1hdEF0dHJDaGFuZ2VkLmJpbmQodGhpcyksXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9nZW86IHN0cmluZyA9IG51bGw7XG4gIHByaXZhdGUgX21hdDogc3RyaW5nID0gbnVsbDtcblxuICAvKipcbiAgICogR2VvbWF0cnkgaW5zdGFuY2VcbiAgICogQHR5cGUge0dlb21ldHJ5fVxuICAgKi9cbiAgcHJpdmF0ZSBfZ2VvX2luc3RhbmNlOiBHZW9tZXRyeSA9IG51bGw7XG5cbiAgLyoqXG4gICAqIE1hdGVyaWFsIGluc3RhbmNlXG4gICAqL1xuICBwcml2YXRlIF9tYXRfaW5zdGFuY2U6IE1hdGVyaWFsID0gbnVsbDtcblxuICBwcm90ZWN0ZWQgX19vbk1vdW50KCk6IHZvaWQge1xuICAgIHN1cGVyLl9fb25Nb3VudCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIGdlbyBhdHRyaWJ1dGUgaXMgY2hhbmdlZFxuICAgKiBAcGFyYW0ge0dvbWxBdHRyaWJ1dGV9IGF0dHIgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgcHJpdmF0ZSBfb25HZW9BdHRyQ2hhbmdlZChhdHRyOiBHb21sQXR0cmlidXRlKTogdm9pZCB7XG4gICAgdGhpcy5fZ2VvID0gYXR0ci5WYWx1ZTtcbiAgICB0aGlzLl9nZW9faW5zdGFuY2UgPSBudWxsO1xuICAgIC8vIGNvbnNvbGUud2FybihcIm9uR2VvQXR0ckNoYW5nZWRcIiwgYXR0ci5WYWx1ZSk7XG4gICAgdGhpcy5fZ2VvX2luc3RhbmNlID0gSlRocmVlQ29udGV4dC5nZXRDb250ZXh0Q29tcG9uZW50PFByaW1pdGl2ZVJlZ2lzdG9yeT4oQ29udGV4dENvbXBvbmVudHMuUHJpbWl0aXZlUmVnaXN0b3J5KS5nZXRQcmltaXRpdmUodGhpcy5fZ2VvKTtcbiAgICBpZiAodGhpcy5fZ2VvX2luc3RhbmNlKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcInByaW1pdGl2ZSBleGlzdFwiLCB0aGlzLmdlbyk7XG4gICAgICB0aGlzLl91cGRhdGVUYXJnZXQoKTtcbiAgICAgIGF0dHIuZG9uZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcInByaW1pdGl2ZSBub3QgZXhpc3RcIiwgdGhpcy5nZW8pO1xuICAgICAgdGhpcy5fZ2VvX2luc3RhbmNlID0gbnVsbDtcbiAgICAgIHRoaXMubm9kZUltcG9ydChcImp0aHJlZS5yZXNvdXJjZS5nZW9tZXRyeVwiLCB0aGlzLl9nZW8sIChnZW86IEdlb21ldHJ5Tm9kZUJhc2U8R2VvbWV0cnk+KSA9PiB7XG4gICAgICAgIGlmIChnZW8pIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImdlb21ldHJ5IHJlc2VpdmVkXCIsIHRoaXMuZ2VvKTtcbiAgICAgICAgICB0aGlzLl9nZW9faW5zdGFuY2UgPSBnZW8udGFyZ2V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2dlb19pbnN0YW5jZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdXBkYXRlVGFyZ2V0KCk7XG4gICAgICAgIGF0dHIuZG9uZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIG1hdCBhdHRyaWJ1dGUgaXMgY2hhbmdlZFxuICAgKiBAcGFyYW0ge0dvbWxBdHRyaWJ1dGV9IGF0dHIgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgcHJpdmF0ZSBfb25NYXRBdHRyQ2hhbmdlZChhdHRyOiBHb21sQXR0cmlidXRlKTogdm9pZCB7XG4gICAgdGhpcy5fbWF0ID0gYXR0ci5WYWx1ZTtcbiAgICB0aGlzLl9tYXRfaW5zdGFuY2UgPSBudWxsO1xuICAgIC8vIGNvbnNvbGUud2FybihcIm9uTWF0QXR0ckNoYW5nZWRcIiwgYXR0ci5WYWx1ZSk7XG4gICAgdGhpcy5ub2RlSW1wb3J0KFwianRocmVlLnJlc291cmNlLm1hdGVyaWFsXCIsIHRoaXMuX21hdCwgKG1hdDogTWF0ZXJpYWxOb2RlPE1hdGVyaWFsPikgPT4ge1xuICAgICAgaWYgKG1hdCkge1xuICAgICAgICB0aGlzLl9tYXRfaW5zdGFuY2UgPSBtYXQudGFyZ2V0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbWF0X2luc3RhbmNlID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3VwZGF0ZVRhcmdldCgpO1xuICAgICAgYXR0ci5kb25lKCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVUYXJnZXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2dlb19pbnN0YW5jZSAmJiB0aGlzLl9tYXRfaW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuVGFyZ2V0U2NlbmVPYmplY3QgPSBuZXcgQmFzaWNNZXNoT2JqZWN0KHRoaXMuX2dlb19pbnN0YW5jZSwgdGhpcy5fbWF0X2luc3RhbmNlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWVzaE5vZGU7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
