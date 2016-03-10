import GeometryNodeBase from "./GeometryNodeBase";
import CircleGeometry from "../../../Core/Geometries/CircleGeometry";
class CircleGeometryNode extends GeometryNodeBase {
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
        return new CircleGeometry(name);
    }
    _onDivideAttrChanged(attr) {
        this.target.DiviceCount = attr.Value;
        attr.done();
    }
}
export default CircleGeometryNode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdvbWwvTm9kZXMvR2VvbWV0cmllcy9DaXJjbGVHZW9tZXRyeU5vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sZ0JBQWdCLE1BQU0sb0JBQW9CO09BQzFDLGNBQWMsTUFBTSx5Q0FBeUM7QUFHcEUsaUNBQWlDLGdCQUFnQjtJQUMvQztRQUNFLE9BQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO1lBQzlCLFFBQVEsRUFBRTtnQkFDUixLQUFLLEVBQUUsRUFBRTtnQkFDVCxTQUFTLEVBQUUsS0FBSztnQkFDaEIsU0FBUyxFQUFFLElBQUksQ0FBQyxvQkFBb0I7YUFDckM7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRVMsU0FBUztRQUNqQixLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVTLG1CQUFtQixDQUFDLElBQVk7UUFDeEMsTUFBTSxDQUFDLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFTyxvQkFBb0IsQ0FBQyxJQUFtQjtRQUM5QyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNkLENBQUM7QUFDSCxDQUFDO0FBRUQsZUFBZSxrQkFBa0IsQ0FBQyIsImZpbGUiOiJHb21sL05vZGVzL0dlb21ldHJpZXMvQ2lyY2xlR2VvbWV0cnlOb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEdlb21ldHJ5Tm9kZUJhc2UgZnJvbSBcIi4vR2VvbWV0cnlOb2RlQmFzZVwiO1xuaW1wb3J0IENpcmNsZUdlb21ldHJ5IGZyb20gXCIuLi8uLi8uLi9Db3JlL0dlb21ldHJpZXMvQ2lyY2xlR2VvbWV0cnlcIjtcbmltcG9ydCBHb21sQXR0cmlidXRlIGZyb20gXCIuLi8uLi9Hb21sQXR0cmlidXRlXCI7XG5cbmNsYXNzIENpcmNsZUdlb21ldHJ5Tm9kZSBleHRlbmRzIEdlb21ldHJ5Tm9kZUJhc2U8Q2lyY2xlR2VvbWV0cnk+IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmF0dHJpYnV0ZXMuZGVmaW5lQXR0cmlidXRlKHtcbiAgICAgIFwiZGl2aWRlXCI6IHtcbiAgICAgICAgdmFsdWU6IDMwLFxuICAgICAgICBjb252ZXJ0ZXI6IFwiaW50XCIsXG4gICAgICAgIG9uY2hhbmdlZDogdGhpcy5fb25EaXZpZGVBdHRyQ2hhbmdlZCxcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfX29uTW91bnQoKTogdm9pZCB7XG4gICAgc3VwZXIuX19vbk1vdW50KCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX19jb25zdHJ1Y3RHZW9tZXRyeShuYW1lOiBzdHJpbmcpOiBDaXJjbGVHZW9tZXRyeSB7XG4gICAgcmV0dXJuIG5ldyBDaXJjbGVHZW9tZXRyeShuYW1lKTtcbiAgfVxuXG4gIHByaXZhdGUgX29uRGl2aWRlQXR0ckNoYW5nZWQoYXR0cjogR29tbEF0dHJpYnV0ZSk6IHZvaWQge1xuICAgIHRoaXMudGFyZ2V0LkRpdmljZUNvdW50ID0gYXR0ci5WYWx1ZTtcbiAgICBhdHRyLmRvbmUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaXJjbGVHZW9tZXRyeU5vZGU7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
