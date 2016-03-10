import BasicMaterial from "../../../Materials/Base/BasicMaterial";
import ContextComponents from "../../../../ContextComponents";
import JThreeContext from "../../../../JThreeContext";
import LightBase from "./../LightBase";
import Matrix from "../../../../Math/Matrix";
import Vector3 from "../../../../Math/Vector3";
/**
 * Point Light
 */
class SpotLight extends LightBase {
    constructor() {
        super();
        this.intensity = 1;
        this.innerAngle = 0.2;
        this.outerAngle = 0.5;
        this.innerDistance = 4;
        this.outerDistance = 15;
        this.angleDecay = 1.0;
        this.distanceDecay = 1.0;
        this.Geometry = JThreeContext.getContextComponent(ContextComponents.PrimitiveRegistory).getPrimitive("cone");
        const diffuseMaterial = new BasicMaterial(require("../../../Materials/BuiltIn/Light/Diffuse/SpotLight.html"));
        diffuseMaterial.on("apply", (matArg) => {
            const tan = Math.tan(this.outerAngle);
            this.Transformer.Scale = new Vector3(tan * this.outerDistance, this.outerDistance / 2, tan * this.outerDistance);
            diffuseMaterial.materialVariables = {
                lightColor: this.Color.toVector().multiplyWith(this.intensity),
                innerAngle: this.innerAngle,
                outerAngle: this.outerAngle,
                innerDistance: this.innerDistance,
                outerDistance: this.outerDistance,
                angleDecay: this.angleDecay,
                distanceDecay: this.distanceDecay,
                lightPosition: Matrix.transformPoint(matArg.camera.viewMatrix, this.Position),
                lightDirection: Matrix.transformNormal(Matrix.multiply(matArg.camera.viewMatrix, this.Transformer.LocalToGlobal), new Vector3(0, -1, 0)).normalizeThis()
            };
        });
        const specularMaterial = new BasicMaterial(require("../../../Materials/BuiltIn/Light/Specular/SpotLight.html"));
        specularMaterial.on("apply", (matArg) => {
            const tan = Math.tan(this.outerAngle);
            this.Transformer.Scale = new Vector3(tan * this.outerDistance, this.outerDistance / 2, tan * this.outerDistance);
            specularMaterial.materialVariables = {
                lightColor: this.Color.toVector().multiplyWith(this.intensity),
                angle: this.outerAngle,
                dist: this.outerDistance,
                decay: this.distanceDecay,
                lightDirection: Matrix.transformNormal(Matrix.multiply(matArg.camera.viewMatrix, this.Transformer.LocalToGlobal), new Vector3(0, -1, 0)).normalizeThis(),
                lightPosition: Matrix.transformPoint(matArg.camera.viewMatrix, this.Position)
            };
        });
        this.addMaterial(diffuseMaterial);
        this.addMaterial(specularMaterial);
    }
}
export default SpotLight;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvU2NlbmVPYmplY3RzL0xpZ2h0L0ltcGwvU3BvdExpZ2h0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUNPLGFBQWEsTUFBTSx1Q0FBdUM7T0FFMUQsaUJBQWlCLE1BQU0sK0JBQStCO09BQ3RELGFBQWEsTUFBTSwyQkFBMkI7T0FDOUMsU0FBUyxNQUFNLGdCQUFnQjtPQUMvQixNQUFNLE1BQU0seUJBQXlCO09BQ3JDLE9BQU8sTUFBTSwwQkFBMEI7QUFDOUM7O0dBRUc7QUFDSCx3QkFBd0IsU0FBUztJQUMvQjtRQUNFLE9BQU8sQ0FBQztRQXFDSCxjQUFTLEdBQVcsQ0FBQyxDQUFDO1FBQ3RCLGVBQVUsR0FBVyxHQUFHLENBQUM7UUFDekIsZUFBVSxHQUFXLEdBQUcsQ0FBQztRQUN6QixrQkFBYSxHQUFXLENBQUMsQ0FBQztRQUMxQixrQkFBYSxHQUFXLEVBQUUsQ0FBQztRQUMzQixlQUFVLEdBQVcsR0FBRyxDQUFDO1FBQ3pCLGtCQUFhLEdBQVcsR0FBRyxDQUFDO1FBMUNqQyxJQUFJLENBQUMsUUFBUSxHQUFHLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBcUIsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakksTUFBTSxlQUFlLEdBQUcsSUFBSSxhQUFhLENBQUMsT0FBTyxDQUFDLHlEQUF5RCxDQUFDLENBQUMsQ0FBQztRQUM5RyxlQUFlLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQThCO1lBQ3pELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFakgsZUFBZSxDQUFDLGlCQUFpQixHQUFHO2dCQUNsQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDOUQsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUMzQixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7Z0JBQzNCLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtnQkFDakMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhO2dCQUNqQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7Z0JBQzNCLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtnQkFDakMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDN0UsY0FBYyxFQUFFLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRTthQUN6SixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLGdCQUFnQixHQUFHLElBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQywwREFBMEQsQ0FBQyxDQUFDLENBQUM7UUFDaEgsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQThCO1lBQzFELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFakgsZ0JBQWdCLENBQUMsaUJBQWlCLEdBQUc7Z0JBQ25DLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUM5RCxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVU7Z0JBQ3RCLElBQUksRUFBRSxJQUFJLENBQUMsYUFBYTtnQkFDeEIsS0FBSyxFQUFFLElBQUksQ0FBQyxhQUFhO2dCQUN6QixjQUFjLEVBQUUsTUFBTSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFO2dCQUN4SixhQUFhLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQzlFLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7QUFTSCxDQUFDO0FBRUQsZUFBZSxTQUFTLENBQUMiLCJmaWxlIjoiQ29yZS9TY2VuZU9iamVjdHMvTGlnaHQvSW1wbC9TcG90TGlnaHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSUFwcGx5TWF0ZXJpYWxBcmd1bWVudCBmcm9tIFwiLi4vLi4vLi4vTWF0ZXJpYWxzL0Jhc2UvSUFwcGx5TWF0ZXJpYWxBcmd1bWVudFwiO1xuaW1wb3J0IEJhc2ljTWF0ZXJpYWwgZnJvbSBcIi4uLy4uLy4uL01hdGVyaWFscy9CYXNlL0Jhc2ljTWF0ZXJpYWxcIjtcbmltcG9ydCBQcmltaXRpdmVSZWdpc3RvcnkgZnJvbSBcIi4uLy4uLy4uL0dlb21ldHJpZXMvQmFzZS9QcmltaXRpdmVSZWdpc3RvcnlcIjtcbmltcG9ydCBDb250ZXh0Q29tcG9uZW50cyBmcm9tIFwiLi4vLi4vLi4vLi4vQ29udGV4dENvbXBvbmVudHNcIjtcbmltcG9ydCBKVGhyZWVDb250ZXh0IGZyb20gXCIuLi8uLi8uLi8uLi9KVGhyZWVDb250ZXh0XCI7XG5pbXBvcnQgTGlnaHRCYXNlIGZyb20gXCIuLy4uL0xpZ2h0QmFzZVwiO1xuaW1wb3J0IE1hdHJpeCBmcm9tIFwiLi4vLi4vLi4vLi4vTWF0aC9NYXRyaXhcIjtcbmltcG9ydCBWZWN0b3IzIGZyb20gXCIuLi8uLi8uLi8uLi9NYXRoL1ZlY3RvcjNcIjtcbi8qKlxuICogUG9pbnQgTGlnaHRcbiAqL1xuY2xhc3MgU3BvdExpZ2h0IGV4dGVuZHMgTGlnaHRCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLkdlb21ldHJ5ID0gSlRocmVlQ29udGV4dC5nZXRDb250ZXh0Q29tcG9uZW50PFByaW1pdGl2ZVJlZ2lzdG9yeT4oQ29udGV4dENvbXBvbmVudHMuUHJpbWl0aXZlUmVnaXN0b3J5KS5nZXRQcmltaXRpdmUoXCJjb25lXCIpO1xuICAgIGNvbnN0IGRpZmZ1c2VNYXRlcmlhbCA9IG5ldyBCYXNpY01hdGVyaWFsKHJlcXVpcmUoXCIuLi8uLi8uLi9NYXRlcmlhbHMvQnVpbHRJbi9MaWdodC9EaWZmdXNlL1Nwb3RMaWdodC5odG1sXCIpKTtcbiAgICBkaWZmdXNlTWF0ZXJpYWwub24oXCJhcHBseVwiLCAobWF0QXJnOiBJQXBwbHlNYXRlcmlhbEFyZ3VtZW50KSA9PiB7XG4gICAgICBjb25zdCB0YW4gPSBNYXRoLnRhbih0aGlzLm91dGVyQW5nbGUpO1xuICAgICAgdGhpcy5UcmFuc2Zvcm1lci5TY2FsZSA9IG5ldyBWZWN0b3IzKHRhbiAqIHRoaXMub3V0ZXJEaXN0YW5jZSwgdGhpcy5vdXRlckRpc3RhbmNlIC8gMiwgdGFuICogdGhpcy5vdXRlckRpc3RhbmNlKTtcblxuICAgICAgZGlmZnVzZU1hdGVyaWFsLm1hdGVyaWFsVmFyaWFibGVzID0ge1xuICAgICAgICBsaWdodENvbG9yOiB0aGlzLkNvbG9yLnRvVmVjdG9yKCkubXVsdGlwbHlXaXRoKHRoaXMuaW50ZW5zaXR5KSxcbiAgICAgICAgaW5uZXJBbmdsZTogdGhpcy5pbm5lckFuZ2xlLFxuICAgICAgICBvdXRlckFuZ2xlOiB0aGlzLm91dGVyQW5nbGUsXG4gICAgICAgIGlubmVyRGlzdGFuY2U6IHRoaXMuaW5uZXJEaXN0YW5jZSxcbiAgICAgICAgb3V0ZXJEaXN0YW5jZTogdGhpcy5vdXRlckRpc3RhbmNlLFxuICAgICAgICBhbmdsZURlY2F5OiB0aGlzLmFuZ2xlRGVjYXksXG4gICAgICAgIGRpc3RhbmNlRGVjYXk6IHRoaXMuZGlzdGFuY2VEZWNheSxcbiAgICAgICAgbGlnaHRQb3NpdGlvbjogTWF0cml4LnRyYW5zZm9ybVBvaW50KG1hdEFyZy5jYW1lcmEudmlld01hdHJpeCwgdGhpcy5Qb3NpdGlvbiksXG4gICAgICAgIGxpZ2h0RGlyZWN0aW9uOiBNYXRyaXgudHJhbnNmb3JtTm9ybWFsKE1hdHJpeC5tdWx0aXBseShtYXRBcmcuY2FtZXJhLnZpZXdNYXRyaXgsIHRoaXMuVHJhbnNmb3JtZXIuTG9jYWxUb0dsb2JhbCksIG5ldyBWZWN0b3IzKDAsIC0xLCAwKSkubm9ybWFsaXplVGhpcygpXG4gICAgICB9O1xuICAgIH0pO1xuICAgIGNvbnN0IHNwZWN1bGFyTWF0ZXJpYWwgPSBuZXcgQmFzaWNNYXRlcmlhbChyZXF1aXJlKFwiLi4vLi4vLi4vTWF0ZXJpYWxzL0J1aWx0SW4vTGlnaHQvU3BlY3VsYXIvU3BvdExpZ2h0Lmh0bWxcIikpO1xuICAgIHNwZWN1bGFyTWF0ZXJpYWwub24oXCJhcHBseVwiLCAobWF0QXJnOiBJQXBwbHlNYXRlcmlhbEFyZ3VtZW50KSA9PiB7XG4gICAgICBjb25zdCB0YW4gPSBNYXRoLnRhbih0aGlzLm91dGVyQW5nbGUpO1xuICAgICAgdGhpcy5UcmFuc2Zvcm1lci5TY2FsZSA9IG5ldyBWZWN0b3IzKHRhbiAqIHRoaXMub3V0ZXJEaXN0YW5jZSwgdGhpcy5vdXRlckRpc3RhbmNlIC8gMiwgdGFuICogdGhpcy5vdXRlckRpc3RhbmNlKTtcblxuICAgICAgc3BlY3VsYXJNYXRlcmlhbC5tYXRlcmlhbFZhcmlhYmxlcyA9IHtcbiAgICAgICAgbGlnaHRDb2xvcjogdGhpcy5Db2xvci50b1ZlY3RvcigpLm11bHRpcGx5V2l0aCh0aGlzLmludGVuc2l0eSksXG4gICAgICAgIGFuZ2xlOiB0aGlzLm91dGVyQW5nbGUsXG4gICAgICAgIGRpc3Q6IHRoaXMub3V0ZXJEaXN0YW5jZSxcbiAgICAgICAgZGVjYXk6IHRoaXMuZGlzdGFuY2VEZWNheSxcbiAgICAgICAgbGlnaHREaXJlY3Rpb246IE1hdHJpeC50cmFuc2Zvcm1Ob3JtYWwoTWF0cml4Lm11bHRpcGx5KG1hdEFyZy5jYW1lcmEudmlld01hdHJpeCwgdGhpcy5UcmFuc2Zvcm1lci5Mb2NhbFRvR2xvYmFsKSwgbmV3IFZlY3RvcjMoMCwgLTEsIDApKS5ub3JtYWxpemVUaGlzKCksXG4gICAgICAgIGxpZ2h0UG9zaXRpb246IE1hdHJpeC50cmFuc2Zvcm1Qb2ludChtYXRBcmcuY2FtZXJhLnZpZXdNYXRyaXgsIHRoaXMuUG9zaXRpb24pXG4gICAgICB9O1xuICAgIH0pO1xuICAgIHRoaXMuYWRkTWF0ZXJpYWwoZGlmZnVzZU1hdGVyaWFsKTtcbiAgICB0aGlzLmFkZE1hdGVyaWFsKHNwZWN1bGFyTWF0ZXJpYWwpO1xuICB9XG5cbiAgcHVibGljIGludGVuc2l0eTogbnVtYmVyID0gMTtcbiAgcHVibGljIGlubmVyQW5nbGU6IG51bWJlciA9IDAuMjtcbiAgcHVibGljIG91dGVyQW5nbGU6IG51bWJlciA9IDAuNTtcbiAgcHVibGljIGlubmVyRGlzdGFuY2U6IG51bWJlciA9IDQ7XG4gIHB1YmxpYyBvdXRlckRpc3RhbmNlOiBudW1iZXIgPSAxNTtcbiAgcHVibGljIGFuZ2xlRGVjYXk6IG51bWJlciA9IDEuMDtcbiAgcHVibGljIGRpc3RhbmNlRGVjYXk6IG51bWJlciA9IDEuMDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgU3BvdExpZ2h0O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9