import AnimagterBase from "./AnimaterBase";
import Color3 from "../../Math/Color3";
class Color3Animater extends AnimagterBase {
    __updateAnimation(progress) {
        const b = this.__beginValue;
        const e = this.__endValue;
        const ef = this.__easingFunction.ease;
        this.__targetAttribute.Value = new Color3(ef(b.R, e.R, progress), ef(b.G, e.G, progress), ef(b.B, e.B, progress));
    }
}
export default Color3Animater;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdvbWwvQW5pbWF0ZXIvQ29sb3IzQW5pbWF0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sYUFBYSxNQUFNLGdCQUFnQjtPQUNuQyxNQUFNLE1BQU0sbUJBQW1CO0FBQ3RDLDZCQUE2QixhQUFhO0lBRTlCLGlCQUFpQixDQUFDLFFBQWdCO1FBQzFDLE1BQU0sQ0FBQyxHQUFXLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDcEMsTUFBTSxDQUFDLEdBQVcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNsQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNwSCxDQUFDO0FBQ0gsQ0FBQztBQUVELGVBQWUsY0FBYyxDQUFDIiwiZmlsZSI6IkdvbWwvQW5pbWF0ZXIvQ29sb3IzQW5pbWF0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQW5pbWFndGVyQmFzZSBmcm9tIFwiLi9BbmltYXRlckJhc2VcIjtcbmltcG9ydCBDb2xvcjMgZnJvbSBcIi4uLy4uL01hdGgvQ29sb3IzXCI7XG5jbGFzcyBDb2xvcjNBbmltYXRlciBleHRlbmRzIEFuaW1hZ3RlckJhc2Uge1xuXG4gIHByb3RlY3RlZCBfX3VwZGF0ZUFuaW1hdGlvbihwcm9ncmVzczogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgYiA9IDxDb2xvcjM+dGhpcy5fX2JlZ2luVmFsdWU7XG4gICAgY29uc3QgZSA9IDxDb2xvcjM+dGhpcy5fX2VuZFZhbHVlO1xuICAgIGNvbnN0IGVmID0gdGhpcy5fX2Vhc2luZ0Z1bmN0aW9uLmVhc2U7XG4gICAgdGhpcy5fX3RhcmdldEF0dHJpYnV0ZS5WYWx1ZSA9IG5ldyBDb2xvcjMoZWYoYi5SLCBlLlIsIHByb2dyZXNzKSwgZWYoYi5HLCBlLkcsIHByb2dyZXNzKSwgZWYoYi5CLCBlLkIsIHByb2dyZXNzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29sb3IzQW5pbWF0ZXI7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=