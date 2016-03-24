import Vector3 from "../../../../Math/Vector3";
import BasicMaterial from "../../../Materials/Base/BasicMaterial";
import ContextComponents from "../../../../ContextComponents";
import JThreeContext from "../../../../JThreeContext";
import LightBase from "./../LightBase";
import Matrix from "../../../../Math/Matrix";
/**
 * Point Light
 */
class PointLight extends LightBase {
    constructor() {
        super();
        this.distance = 0.0;
        this.intensity = 1.0;
        this.decay = 1;
        this.Geometry = JThreeContext.getContextComponent(ContextComponents.PrimitiveRegistory).getPrimitive("sphere");
        const diffuseMaterial = new BasicMaterial(require("../../../Materials/BuiltIn/Light/Diffuse/PointLight.html"));
        diffuseMaterial.on("apply", (matArg) => {
            this.Transformer.Scale = new Vector3(this.distance, this.distance, this.distance);
            diffuseMaterial.materialVariables = {
                lightColor: this.Color.toVector().multiplyWith(this.intensity),
                decay: this.decay,
                dist: this.distance,
                lightPosition: Matrix.transformPoint(matArg.camera.viewMatrix, this.Position)
            };
        });
        const specularMaterial = new BasicMaterial(require("../../../Materials/BuiltIn/Light/Specular/PointLight.html"));
        specularMaterial.on("apply", (matArg) => {
            this.Transformer.Scale = new Vector3(this.distance, this.distance, this.distance);
            specularMaterial.materialVariables = {
                lightColor: this.Color.toVector().multiplyWith(this.intensity),
                decay: this.decay,
                dist: this.distance,
                lightPosition: Matrix.transformPoint(matArg.camera.viewMatrix, this.Position)
            };
        });
        this.addMaterial(diffuseMaterial);
        this.addMaterial(specularMaterial);
    }
}
export default PointLight;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvU2NlbmVPYmplY3RzL0xpZ2h0L0ltcGwvUG9pbnRMaWdodC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxPQUFPLE1BQU0sMEJBQTBCO09BRXZDLGFBQWEsTUFBTSx1Q0FBdUM7T0FFMUQsaUJBQWlCLE1BQU0sK0JBQStCO09BQ3RELGFBQWEsTUFBTSwyQkFBMkI7T0FDOUMsU0FBUyxNQUFNLGdCQUFnQjtPQUMvQixNQUFNLE1BQU0seUJBQXlCO0FBRTVDOztHQUVHO0FBQ0gseUJBQXlCLFNBQVM7SUFDaEM7UUFDRSxPQUFPLENBQUM7UUEwQkgsYUFBUSxHQUFXLEdBQUcsQ0FBQztRQUV2QixjQUFTLEdBQVcsR0FBRyxDQUFDO1FBRXhCLFVBQUssR0FBVyxDQUFDLENBQUM7UUE3QnZCLElBQUksQ0FBQyxRQUFRLEdBQUcsYUFBYSxDQUFDLG1CQUFtQixDQUFxQixpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuSSxNQUFNLGVBQWUsR0FBRyxJQUFJLGFBQWEsQ0FBQyxPQUFPLENBQUMsMERBQTBELENBQUMsQ0FBQyxDQUFDO1FBQy9HLGVBQWUsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBOEI7WUFDekQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsRixlQUFlLENBQUMsaUJBQWlCLEdBQUc7Z0JBQ2xDLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUM5RCxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2pCLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDbkIsYUFBYSxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQzthQUM3RSxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLGdCQUFnQixHQUFHLElBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQywyREFBMkQsQ0FBQyxDQUFDLENBQUM7UUFDakgsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQThCO1lBQzFELElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEYsZ0JBQWdCLENBQUMsaUJBQWlCLEdBQUc7Z0JBQ25DLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUM5RCxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2pCLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDbkIsYUFBYSxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQzthQUM5RSxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUNyQyxDQUFDO0FBT0gsQ0FBQztBQUVELGVBQWUsVUFBVSxDQUFDIiwiZmlsZSI6IkNvcmUvU2NlbmVPYmplY3RzL0xpZ2h0L0ltcGwvUG9pbnRMaWdodC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWZWN0b3IzIGZyb20gXCIuLi8uLi8uLi8uLi9NYXRoL1ZlY3RvcjNcIjtcbmltcG9ydCBJQXBwbHlNYXRlcmlhbEFyZ3VtZW50IGZyb20gXCIuLi8uLi8uLi9NYXRlcmlhbHMvQmFzZS9JQXBwbHlNYXRlcmlhbEFyZ3VtZW50XCI7XG5pbXBvcnQgQmFzaWNNYXRlcmlhbCBmcm9tIFwiLi4vLi4vLi4vTWF0ZXJpYWxzL0Jhc2UvQmFzaWNNYXRlcmlhbFwiO1xuaW1wb3J0IFByaW1pdGl2ZVJlZ2lzdG9yeSBmcm9tIFwiLi4vLi4vLi4vR2VvbWV0cmllcy9CYXNlL1ByaW1pdGl2ZVJlZ2lzdG9yeVwiO1xuaW1wb3J0IENvbnRleHRDb21wb25lbnRzIGZyb20gXCIuLi8uLi8uLi8uLi9Db250ZXh0Q29tcG9uZW50c1wiO1xuaW1wb3J0IEpUaHJlZUNvbnRleHQgZnJvbSBcIi4uLy4uLy4uLy4uL0pUaHJlZUNvbnRleHRcIjtcbmltcG9ydCBMaWdodEJhc2UgZnJvbSBcIi4vLi4vTGlnaHRCYXNlXCI7XG5pbXBvcnQgTWF0cml4IGZyb20gXCIuLi8uLi8uLi8uLi9NYXRoL01hdHJpeFwiO1xuXG4vKipcbiAqIFBvaW50IExpZ2h0XG4gKi9cbmNsYXNzIFBvaW50TGlnaHQgZXh0ZW5kcyBMaWdodEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuR2VvbWV0cnkgPSBKVGhyZWVDb250ZXh0LmdldENvbnRleHRDb21wb25lbnQ8UHJpbWl0aXZlUmVnaXN0b3J5PihDb250ZXh0Q29tcG9uZW50cy5QcmltaXRpdmVSZWdpc3RvcnkpLmdldFByaW1pdGl2ZShcInNwaGVyZVwiKTtcbiAgICBjb25zdCBkaWZmdXNlTWF0ZXJpYWwgPSBuZXcgQmFzaWNNYXRlcmlhbChyZXF1aXJlKFwiLi4vLi4vLi4vTWF0ZXJpYWxzL0J1aWx0SW4vTGlnaHQvRGlmZnVzZS9Qb2ludExpZ2h0Lmh0bWxcIikpO1xuICAgIGRpZmZ1c2VNYXRlcmlhbC5vbihcImFwcGx5XCIsIChtYXRBcmc6IElBcHBseU1hdGVyaWFsQXJndW1lbnQpID0+IHtcbiAgICAgIHRoaXMuVHJhbnNmb3JtZXIuU2NhbGUgPSBuZXcgVmVjdG9yMyh0aGlzLmRpc3RhbmNlLCB0aGlzLmRpc3RhbmNlLCB0aGlzLmRpc3RhbmNlKTtcbiAgICAgIGRpZmZ1c2VNYXRlcmlhbC5tYXRlcmlhbFZhcmlhYmxlcyA9IHtcbiAgICAgICAgbGlnaHRDb2xvcjogdGhpcy5Db2xvci50b1ZlY3RvcigpLm11bHRpcGx5V2l0aCh0aGlzLmludGVuc2l0eSksXG4gICAgICAgIGRlY2F5OiB0aGlzLmRlY2F5LFxuICAgICAgICBkaXN0OiB0aGlzLmRpc3RhbmNlLFxuICAgICAgICBsaWdodFBvc2l0aW9uOiBNYXRyaXgudHJhbnNmb3JtUG9pbnQobWF0QXJnLmNhbWVyYS52aWV3TWF0cml4LCB0aGlzLlBvc2l0aW9uKVxuICAgICAgIH07XG4gICAgfSk7XG4gICAgY29uc3Qgc3BlY3VsYXJNYXRlcmlhbCA9IG5ldyBCYXNpY01hdGVyaWFsKHJlcXVpcmUoXCIuLi8uLi8uLi9NYXRlcmlhbHMvQnVpbHRJbi9MaWdodC9TcGVjdWxhci9Qb2ludExpZ2h0Lmh0bWxcIikpO1xuICAgIHNwZWN1bGFyTWF0ZXJpYWwub24oXCJhcHBseVwiLCAobWF0QXJnOiBJQXBwbHlNYXRlcmlhbEFyZ3VtZW50KSA9PiB7XG4gICAgICB0aGlzLlRyYW5zZm9ybWVyLlNjYWxlID0gbmV3IFZlY3RvcjModGhpcy5kaXN0YW5jZSwgdGhpcy5kaXN0YW5jZSwgdGhpcy5kaXN0YW5jZSk7XG4gICAgICBzcGVjdWxhck1hdGVyaWFsLm1hdGVyaWFsVmFyaWFibGVzID0ge1xuICAgICAgICBsaWdodENvbG9yOiB0aGlzLkNvbG9yLnRvVmVjdG9yKCkubXVsdGlwbHlXaXRoKHRoaXMuaW50ZW5zaXR5KSxcbiAgICAgICAgZGVjYXk6IHRoaXMuZGVjYXksXG4gICAgICAgIGRpc3Q6IHRoaXMuZGlzdGFuY2UsXG4gICAgICAgIGxpZ2h0UG9zaXRpb246IE1hdHJpeC50cmFuc2Zvcm1Qb2ludChtYXRBcmcuY2FtZXJhLnZpZXdNYXRyaXgsIHRoaXMuUG9zaXRpb24pXG4gICAgICB9O1xuICAgIH0pO1xuICAgIHRoaXMuYWRkTWF0ZXJpYWwoZGlmZnVzZU1hdGVyaWFsKTtcbiAgICB0aGlzLmFkZE1hdGVyaWFsKHNwZWN1bGFyTWF0ZXJpYWwpO1xuICB9XG5cbiAgcHVibGljIGRpc3RhbmNlOiBudW1iZXIgPSAwLjA7XG5cbiAgcHVibGljIGludGVuc2l0eTogbnVtYmVyID0gMS4wO1xuXG4gIHB1YmxpYyBkZWNheTogbnVtYmVyID0gMTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUG9pbnRMaWdodDtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
