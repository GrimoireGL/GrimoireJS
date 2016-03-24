import GeometryNodeBase from "./GeometryNodeBase";
import CylinderGeometry from "../../../Core/Geometries/CylinderGeometry";
class CylinderGeometryNode extends GeometryNodeBase {
    constructor() {
        super();
        this.attributes.defineAttribute({
            "divide": {
                value: 30,
                converter: "int",
                onchanged: this._onDivideAttrChanged,
            }
        });
    }
    __onMount() {
        super.__onMount();
    }
    __constructGeometry(name) {
        return new CylinderGeometry(name);
    }
    _onDivideAttrChanged(attr) {
        this.target.DivideCount = attr.Value;
        attr.done();
    }
}
export default CylinderGeometryNode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdvbWwvTm9kZXMvR2VvbWV0cmllcy9DeWxpbmRlckdlb21ldHJ5Tm9kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxnQkFBZ0IsTUFBTSxvQkFBb0I7T0FDMUMsZ0JBQWdCLE1BQU0sMkNBQTJDO0FBRXhFLG1DQUFtQyxnQkFBZ0I7SUFFakQ7UUFDRSxPQUFPLENBQUM7UUFDUixJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQztZQUM5QixRQUFRLEVBQUU7Z0JBQ1IsS0FBSyxFQUFFLEVBQUU7Z0JBQ1QsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLFNBQVMsRUFBRSxJQUFJLENBQUMsb0JBQW9CO2FBQ3JDO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVTLFNBQVM7UUFDakIsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFUyxtQkFBbUIsQ0FBQyxJQUFZO1FBQ3hDLE1BQU0sQ0FBRSxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFTyxvQkFBb0IsQ0FBQyxJQUFJO1FBQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDckMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQztBQUNILENBQUM7QUFFRCxlQUFlLG9CQUFvQixDQUFDIiwiZmlsZSI6IkdvbWwvTm9kZXMvR2VvbWV0cmllcy9DeWxpbmRlckdlb21ldHJ5Tm9kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBHZW9tZXRyeU5vZGVCYXNlIGZyb20gXCIuL0dlb21ldHJ5Tm9kZUJhc2VcIjtcbmltcG9ydCBDeWxpbmRlckdlb21ldHJ5IGZyb20gXCIuLi8uLi8uLi9Db3JlL0dlb21ldHJpZXMvQ3lsaW5kZXJHZW9tZXRyeVwiO1xuXG5jbGFzcyBDeWxpbmRlckdlb21ldHJ5Tm9kZSBleHRlbmRzIEdlb21ldHJ5Tm9kZUJhc2U8Q3lsaW5kZXJHZW9tZXRyeT4ge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5hdHRyaWJ1dGVzLmRlZmluZUF0dHJpYnV0ZSh7XG4gICAgICBcImRpdmlkZVwiOiB7XG4gICAgICAgIHZhbHVlOiAzMCxcbiAgICAgICAgY29udmVydGVyOiBcImludFwiLFxuICAgICAgICBvbmNoYW5nZWQ6IHRoaXMuX29uRGl2aWRlQXR0ckNoYW5nZWQsXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX19vbk1vdW50KCk6IHZvaWQge1xuICAgIHN1cGVyLl9fb25Nb3VudCgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9fY29uc3RydWN0R2VvbWV0cnkobmFtZTogc3RyaW5nKTogQ3lsaW5kZXJHZW9tZXRyeSB7XG4gICAgcmV0dXJuICBuZXcgQ3lsaW5kZXJHZW9tZXRyeShuYW1lKTtcbiAgfVxuXG4gIHByaXZhdGUgX29uRGl2aWRlQXR0ckNoYW5nZWQoYXR0cik6IHZvaWQge1xuICAgIHRoaXMudGFyZ2V0LkRpdmlkZUNvdW50ID0gYXR0ci5WYWx1ZTtcbiAgICBhdHRyLmRvbmUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDeWxpbmRlckdlb21ldHJ5Tm9kZTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
