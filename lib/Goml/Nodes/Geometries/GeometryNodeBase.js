import CoreRelatedNodeBase from "../../CoreRelatedNodeBase";
import ContextComponents from "../../../ContextComponents";
import JThreeContext from "../../../JThreeContext";
/**
* Base class for managing geometry node.
*/
class GeometryNodeBase extends CoreRelatedNodeBase {
    constructor() {
        super();
        this.__groupPrefix = "geometry";
        this._primitiveRegistory = JThreeContext.getContextComponent(ContextComponents.PrimitiveRegistory);
        this.attributes.defineAttribute({
            "name": {
                value: undefined,
                converter: "string",
                onchanged: this._onNameAttrChanged.bind(this),
            }
        });
    }
    __onMount() {
        super.__onMount();
    }
    _onNameAttrChanged(attr) {
        const name = attr.Value;
        if (typeof name !== "string") {
            throw Error(`${this.getTypeName()}: name attribute must be required.`);
        }
        if (this._name !== name) {
            if (typeof this._name !== "undefined" && this._primitiveRegistory.getPrimitive(this._name)) {
                this._primitiveRegistory.deregisterPrimitive(this._name);
            }
            this._name = name;
            this.target = this.__constructGeometry(this._name);
            if (this.target) {
                this._primitiveRegistory.registerPrimitive(this._name, this.target);
                console.log("registered", this._name);
                this.nodeExport(this._name);
            }
        }
        attr.done();
    }
}
export default GeometryNodeBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdvbWwvTm9kZXMvR2VvbWV0cmllcy9HZW9tZXRyeU5vZGVCYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLG1CQUFtQixNQUFNLDJCQUEyQjtPQUdwRCxpQkFBaUIsTUFBTSw0QkFBNEI7T0FFbkQsYUFBYSxNQUFNLHdCQUF3QjtBQUNsRDs7RUFFRTtBQUNGLCtCQUE0RCxtQkFBbUI7SUFPN0U7UUFDRSxPQUFPLENBQUM7UUFQQSxrQkFBYSxHQUFXLFVBQVUsQ0FBQztRQUlyQyx3QkFBbUIsR0FBdUIsYUFBYSxDQUFDLG1CQUFtQixDQUFxQixpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBSTVJLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO1lBQzlCLE1BQU0sRUFBRTtnQkFDTixLQUFLLEVBQUUsU0FBUztnQkFDaEIsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLFNBQVMsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUM5QztTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFUyxTQUFTO1FBQ2pCLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBSU8sa0JBQWtCLENBQUMsSUFBbUI7UUFDNUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN4QixFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzdCLE1BQU0sS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxvQ0FBb0MsQ0FBQyxDQUFDO1FBQ3pFLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDeEIsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLFdBQVcsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNGLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0QsQ0FBQztZQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDaEIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNwRSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlCLENBQUM7UUFDSCxDQUFDO1FBQ0QsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQztBQUNILENBQUM7QUFDRCxlQUFlLGdCQUFnQixDQUFDIiwiZmlsZSI6IkdvbWwvTm9kZXMvR2VvbWV0cmllcy9HZW9tZXRyeU5vZGVCYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvcmVSZWxhdGVkTm9kZUJhc2UgZnJvbSBcIi4uLy4uL0NvcmVSZWxhdGVkTm9kZUJhc2VcIjtcbmltcG9ydCBHZW9tZXRyeSBmcm9tIFwiLi4vLi4vLi4vQ29yZS9HZW9tZXRyaWVzL0Jhc2UvR2VvbWV0cnlcIjtcbmltcG9ydCBHb21sQXR0cmlidXRlIGZyb20gXCIuLi8uLi9Hb21sQXR0cmlidXRlXCI7XG5pbXBvcnQgQ29udGV4dENvbXBvbmVudHMgZnJvbSBcIi4uLy4uLy4uL0NvbnRleHRDb21wb25lbnRzXCI7XG5pbXBvcnQgUHJpbWl0aXZlUmVnaXN0b3J5IGZyb20gXCIuLi8uLi8uLi9Db3JlL0dlb21ldHJpZXMvQmFzZS9QcmltaXRpdmVSZWdpc3RvcnlcIjtcbmltcG9ydCBKVGhyZWVDb250ZXh0IGZyb20gXCIuLi8uLi8uLi9KVGhyZWVDb250ZXh0XCI7XG4vKipcbiogQmFzZSBjbGFzcyBmb3IgbWFuYWdpbmcgZ2VvbWV0cnkgbm9kZS5cbiovXG5hYnN0cmFjdCBjbGFzcyBHZW9tZXRyeU5vZGVCYXNlPFQgZXh0ZW5kcyBHZW9tZXRyeT4gZXh0ZW5kcyBDb3JlUmVsYXRlZE5vZGVCYXNlPFQ+IHtcbiAgcHJvdGVjdGVkIF9fZ3JvdXBQcmVmaXg6IHN0cmluZyA9IFwiZ2VvbWV0cnlcIjtcblxuICBwcml2YXRlIF9uYW1lOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBfcHJpbWl0aXZlUmVnaXN0b3J5OiBQcmltaXRpdmVSZWdpc3RvcnkgPSBKVGhyZWVDb250ZXh0LmdldENvbnRleHRDb21wb25lbnQ8UHJpbWl0aXZlUmVnaXN0b3J5PihDb250ZXh0Q29tcG9uZW50cy5QcmltaXRpdmVSZWdpc3RvcnkpO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5hdHRyaWJ1dGVzLmRlZmluZUF0dHJpYnV0ZSh7XG4gICAgICBcIm5hbWVcIjoge1xuICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICBjb252ZXJ0ZXI6IFwic3RyaW5nXCIsXG4gICAgICAgIG9uY2hhbmdlZDogdGhpcy5fb25OYW1lQXR0ckNoYW5nZWQuYmluZCh0aGlzKSxcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfX29uTW91bnQoKTogdm9pZCB7XG4gICAgc3VwZXIuX19vbk1vdW50KCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX19jb25zdHJ1Y3RHZW9tZXRyeShuYW1lOiBzdHJpbmcpOiBhbnk7XG5cbiAgcHJpdmF0ZSBfb25OYW1lQXR0ckNoYW5nZWQoYXR0cjogR29tbEF0dHJpYnV0ZSk6IHZvaWQge1xuICAgIGNvbnN0IG5hbWUgPSBhdHRyLlZhbHVlO1xuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgdGhyb3cgRXJyb3IoYCR7dGhpcy5nZXRUeXBlTmFtZSgpfTogbmFtZSBhdHRyaWJ1dGUgbXVzdCBiZSByZXF1aXJlZC5gKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX25hbWUgIT09IG5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5fbmFtZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0aGlzLl9wcmltaXRpdmVSZWdpc3RvcnkuZ2V0UHJpbWl0aXZlKHRoaXMuX25hbWUpKSB7XG4gICAgICAgIHRoaXMuX3ByaW1pdGl2ZVJlZ2lzdG9yeS5kZXJlZ2lzdGVyUHJpbWl0aXZlKHRoaXMuX25hbWUpO1xuICAgICAgfVxuICAgICAgdGhpcy5fbmFtZSA9IG5hbWU7XG4gICAgICB0aGlzLnRhcmdldCA9IHRoaXMuX19jb25zdHJ1Y3RHZW9tZXRyeSh0aGlzLl9uYW1lKTtcbiAgICAgIGlmICh0aGlzLnRhcmdldCkge1xuICAgICAgICB0aGlzLl9wcmltaXRpdmVSZWdpc3RvcnkucmVnaXN0ZXJQcmltaXRpdmUodGhpcy5fbmFtZSwgdGhpcy50YXJnZXQpO1xuICAgICAgICBjb25zb2xlLmxvZyhcInJlZ2lzdGVyZWRcIiwgdGhpcy5fbmFtZSk7XG4gICAgICAgIHRoaXMubm9kZUV4cG9ydCh0aGlzLl9uYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgYXR0ci5kb25lKCk7XG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IEdlb21ldHJ5Tm9kZUJhc2U7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
