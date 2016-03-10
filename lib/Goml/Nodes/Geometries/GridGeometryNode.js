import GeometryNodeBase from "./GeometryNodeBase";
import GridGeometry from "../../../Core/Geometries/GridGeometry";
class GridGeometryNode extends GeometryNodeBase {
    constructor() {
        super();
        this.attributes.defineAttribute({
            "hdiv": {
                value: 10,
                converter: "float",
                onchanged: this._onHdivAttrChanged,
            },
            "vdiv": {
                value: 10,
                converter: "float",
                onchanged: this._onVdivAttrChanged,
            }
        });
    }
    __onMount() {
        super.__onMount();
    }
    __constructGeometry(name) {
        return new GridGeometry(name);
    }
    _onHdivAttrChanged(attr) {
        this.target.HolizontalDivide = attr.Value;
        attr.done();
    }
    _onVdivAttrChanged(attr) {
        this.target.VerticalDivide = attr.Value;
        attr.done();
    }
}
export default GridGeometryNode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdvbWwvTm9kZXMvR2VvbWV0cmllcy9HcmlkR2VvbWV0cnlOb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLGdCQUFnQixNQUFNLG9CQUFvQjtPQUMxQyxZQUFZLE1BQU0sdUNBQXVDO0FBRWhFLCtCQUErQixnQkFBZ0I7SUFFN0M7UUFDRSxPQUFPLENBQUM7UUFDUixJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQztZQUM5QixNQUFNLEVBQUU7Z0JBQ04sS0FBSyxFQUFFLEVBQUU7Z0JBQ1QsU0FBUyxFQUFFLE9BQU87Z0JBQ2xCLFNBQVMsRUFBRSxJQUFJLENBQUMsa0JBQWtCO2FBQ25DO1lBQ0QsTUFBTSxFQUFFO2dCQUNOLEtBQUssRUFBRSxFQUFFO2dCQUNULFNBQVMsRUFBRSxPQUFPO2dCQUNsQixTQUFTLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjthQUNuQztTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFUyxTQUFTO1FBQ2pCLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRVMsbUJBQW1CLENBQUMsSUFBWTtRQUN4QyxNQUFNLENBQUMsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVPLGtCQUFrQixDQUFDLElBQUk7UUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFTyxrQkFBa0IsQ0FBQyxJQUFJO1FBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDeEMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQztBQUNILENBQUM7QUFFRCxlQUFlLGdCQUFnQixDQUFDIiwiZmlsZSI6IkdvbWwvTm9kZXMvR2VvbWV0cmllcy9HcmlkR2VvbWV0cnlOb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEdlb21ldHJ5Tm9kZUJhc2UgZnJvbSBcIi4vR2VvbWV0cnlOb2RlQmFzZVwiO1xuaW1wb3J0IEdyaWRHZW9tZXRyeSBmcm9tIFwiLi4vLi4vLi4vQ29yZS9HZW9tZXRyaWVzL0dyaWRHZW9tZXRyeVwiO1xuXG5jbGFzcyBHcmlkR2VvbWV0cnlOb2RlIGV4dGVuZHMgR2VvbWV0cnlOb2RlQmFzZTxHcmlkR2VvbWV0cnk+IHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuYXR0cmlidXRlcy5kZWZpbmVBdHRyaWJ1dGUoe1xuICAgICAgXCJoZGl2XCI6IHtcbiAgICAgICAgdmFsdWU6IDEwLFxuICAgICAgICBjb252ZXJ0ZXI6IFwiZmxvYXRcIixcbiAgICAgICAgb25jaGFuZ2VkOiB0aGlzLl9vbkhkaXZBdHRyQ2hhbmdlZCxcbiAgICAgIH0sXG4gICAgICBcInZkaXZcIjoge1xuICAgICAgICB2YWx1ZTogMTAsXG4gICAgICAgIGNvbnZlcnRlcjogXCJmbG9hdFwiLFxuICAgICAgICBvbmNoYW5nZWQ6IHRoaXMuX29uVmRpdkF0dHJDaGFuZ2VkLFxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9fb25Nb3VudCgpOiB2b2lkIHtcbiAgICBzdXBlci5fX29uTW91bnQoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfX2NvbnN0cnVjdEdlb21ldHJ5KG5hbWU6IHN0cmluZyk6IEdyaWRHZW9tZXRyeSB7XG4gICAgcmV0dXJuIG5ldyBHcmlkR2VvbWV0cnkobmFtZSk7XG4gIH1cblxuICBwcml2YXRlIF9vbkhkaXZBdHRyQ2hhbmdlZChhdHRyKTogdm9pZCB7XG4gICAgdGhpcy50YXJnZXQuSG9saXpvbnRhbERpdmlkZSA9IGF0dHIuVmFsdWU7XG4gICAgYXR0ci5kb25lKCk7XG4gIH1cblxuICBwcml2YXRlIF9vblZkaXZBdHRyQ2hhbmdlZChhdHRyKTogdm9pZCB7XG4gICAgdGhpcy50YXJnZXQuVmVydGljYWxEaXZpZGUgPSBhdHRyLlZhbHVlO1xuICAgIGF0dHIuZG9uZSgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdyaWRHZW9tZXRyeU5vZGU7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
