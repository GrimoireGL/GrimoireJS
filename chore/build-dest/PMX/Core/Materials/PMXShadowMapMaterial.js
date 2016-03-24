import BasicMaterial from "../../../Core/Materials/Base/BasicMaterial";
/**
 * the materials for PMX.
 */
class PMXShadowMapMaterial extends BasicMaterial {
    constructor(material) {
        super(require("../../Materials/ShadowMap.html"));
        this.__associatedMaterial = material;
        this.__setLoaded();
    }
    /**
     * Count of verticies
     */
    get VerticiesCount() {
        return this.__associatedMaterial.VerticiesCount;
    }
    /**
     * Offset of verticies in index buffer
     */
    get VerticiesOffset() {
        return this.__associatedMaterial.VerticiesOffset;
    }
    apply(matArg) {
        if (this.__associatedMaterial.Diffuse.A < 1.0E-3) {
            return;
        }
        // var light = matArg.scene.LightRegister.shadowDroppableLights[matArg.techniqueIndex];
        // const skeleton = this.associatedMaterial.ParentModel.skeleton;
        // this.materialVariables = {
        //    matL:light.matLightViewProjection,
        //    boneMatriciesTexture:skeleton.MatrixTexture,
        //    boneCount:skeleton.BoneCount
        // };
        super.apply(matArg);
    }
    get Priorty() {
        return 100;
    }
    getDrawGeometryLength(geo) {
        return this.__associatedMaterial.Diffuse.A > 0 ? this.VerticiesCount : 0;
    }
    getDrawGeometryOffset(geo) {
        return this.VerticiesOffset * 4;
    }
}
export default PMXShadowMapMaterial;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBNWC9Db3JlL01hdGVyaWFscy9QTVhTaGFkb3dNYXBNYXRlcmlhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxhQUFhLE1BQU0sNENBQTRDO0FBSXRFOztHQUVHO0FBQ0gsbUNBQW1DLGFBQWE7SUFHOUMsWUFBWSxRQUFxQjtRQUMvQixNQUFNLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLG9CQUFvQixHQUFHLFFBQVEsQ0FBQztRQUNyQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBVyxjQUFjO1FBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsY0FBYyxDQUFDO0lBQ2xELENBQUM7SUFFRDs7T0FFRztJQUNILElBQVcsZUFBZTtRQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGVBQWUsQ0FBQztJQUNuRCxDQUFDO0lBRU0sS0FBSyxDQUFDLE1BQThCO1FBQ3pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUNELHVGQUF1RjtRQUN2RixpRUFBaUU7UUFDakUsNkJBQTZCO1FBQzdCLHdDQUF3QztRQUN4QyxrREFBa0Q7UUFDbEQsa0NBQWtDO1FBQ2xDLEtBQUs7UUFDTCxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFHRCxJQUFXLE9BQU87UUFDaEIsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFTSxxQkFBcUIsQ0FBQyxHQUFhO1FBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVNLHFCQUFxQixDQUFDLEdBQWE7UUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7QUFDSCxDQUFDO0FBRUQsZUFBZSxvQkFBb0IsQ0FBQyIsImZpbGUiOiJQTVgvQ29yZS9NYXRlcmlhbHMvUE1YU2hhZG93TWFwTWF0ZXJpYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzaWNNYXRlcmlhbCBmcm9tIFwiLi4vLi4vLi4vQ29yZS9NYXRlcmlhbHMvQmFzZS9CYXNpY01hdGVyaWFsXCI7XG5pbXBvcnQgSUFwcGx5TWF0ZXJpYWxBcmd1bWVudCBmcm9tIFwiLi4vLi4vLi4vQ29yZS9NYXRlcmlhbHMvQmFzZS9JQXBwbHlNYXRlcmlhbEFyZ3VtZW50XCI7XG5pbXBvcnQgR2VvbWV0cnkgZnJvbSBcIi4uLy4uLy4uL0NvcmUvR2VvbWV0cmllcy9CYXNlL0dlb21ldHJ5XCI7XG5pbXBvcnQgUE1YTWF0ZXJpYWwgZnJvbSBcIi4vUE1YTWF0ZXJpYWxcIjtcbi8qKlxuICogdGhlIG1hdGVyaWFscyBmb3IgUE1YLlxuICovXG5jbGFzcyBQTVhTaGFkb3dNYXBNYXRlcmlhbCBleHRlbmRzIEJhc2ljTWF0ZXJpYWwge1xuICBwcm90ZWN0ZWQgX19hc3NvY2lhdGVkTWF0ZXJpYWw6IFBNWE1hdGVyaWFsO1xuXG4gIGNvbnN0cnVjdG9yKG1hdGVyaWFsOiBQTVhNYXRlcmlhbCkge1xuICAgIHN1cGVyKHJlcXVpcmUoXCIuLi8uLi9NYXRlcmlhbHMvU2hhZG93TWFwLmh0bWxcIikpO1xuICAgIHRoaXMuX19hc3NvY2lhdGVkTWF0ZXJpYWwgPSBtYXRlcmlhbDtcbiAgICB0aGlzLl9fc2V0TG9hZGVkKCk7XG4gIH1cblxuICAvKipcbiAgICogQ291bnQgb2YgdmVydGljaWVzXG4gICAqL1xuICBwdWJsaWMgZ2V0IFZlcnRpY2llc0NvdW50KCkge1xuICAgIHJldHVybiB0aGlzLl9fYXNzb2NpYXRlZE1hdGVyaWFsLlZlcnRpY2llc0NvdW50O1xuICB9XG5cbiAgLyoqXG4gICAqIE9mZnNldCBvZiB2ZXJ0aWNpZXMgaW4gaW5kZXggYnVmZmVyXG4gICAqL1xuICBwdWJsaWMgZ2V0IFZlcnRpY2llc09mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fX2Fzc29jaWF0ZWRNYXRlcmlhbC5WZXJ0aWNpZXNPZmZzZXQ7XG4gIH1cblxuICBwdWJsaWMgYXBwbHkobWF0QXJnOiBJQXBwbHlNYXRlcmlhbEFyZ3VtZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX19hc3NvY2lhdGVkTWF0ZXJpYWwuRGlmZnVzZS5BIDwgMS4wRS0zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIHZhciBsaWdodCA9IG1hdEFyZy5zY2VuZS5MaWdodFJlZ2lzdGVyLnNoYWRvd0Ryb3BwYWJsZUxpZ2h0c1ttYXRBcmcudGVjaG5pcXVlSW5kZXhdO1xuICAgIC8vIGNvbnN0IHNrZWxldG9uID0gdGhpcy5hc3NvY2lhdGVkTWF0ZXJpYWwuUGFyZW50TW9kZWwuc2tlbGV0b247XG4gICAgLy8gdGhpcy5tYXRlcmlhbFZhcmlhYmxlcyA9IHtcbiAgICAvLyAgICBtYXRMOmxpZ2h0Lm1hdExpZ2h0Vmlld1Byb2plY3Rpb24sXG4gICAgLy8gICAgYm9uZU1hdHJpY2llc1RleHR1cmU6c2tlbGV0b24uTWF0cml4VGV4dHVyZSxcbiAgICAvLyAgICBib25lQ291bnQ6c2tlbGV0b24uQm9uZUNvdW50XG4gICAgLy8gfTtcbiAgICBzdXBlci5hcHBseShtYXRBcmcpO1xuICB9XG5cblxuICBwdWJsaWMgZ2V0IFByaW9ydHkoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gMTAwO1xuICB9XG5cbiAgcHVibGljIGdldERyYXdHZW9tZXRyeUxlbmd0aChnZW86IEdlb21ldHJ5KTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fX2Fzc29jaWF0ZWRNYXRlcmlhbC5EaWZmdXNlLkEgPiAwID8gdGhpcy5WZXJ0aWNpZXNDb3VudCA6IDA7XG4gIH1cblxuICBwdWJsaWMgZ2V0RHJhd0dlb21ldHJ5T2Zmc2V0KGdlbzogR2VvbWV0cnkpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLlZlcnRpY2llc09mZnNldCAqIDQ7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUE1YU2hhZG93TWFwTWF0ZXJpYWw7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
