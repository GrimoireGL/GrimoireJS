import JThreeObjectWithID from "../../../Base/JThreeObjectWithID";
import ContextComponents from "../../../ContextComponents";
import JThreeContext from "../../../JThreeContext";
class RenderStageBase extends JThreeObjectWithID {
    constructor(renderer) {
        super();
        this.stageVariables = {};
        this._renderer = renderer;
    }
    getDefaultRendererConfigure(techniqueIndex) {
        return {
            cullOrientation: "BACK",
            depthEnabled: true,
            depthMode: "LESS",
            depthMask: true,
            blendEnabled: true,
            blendSrcFactor: "SRC_ALPHA",
            blendDstFactor: "ONE_MINUS_SRC_ALPHA",
            redMask: true,
            greenMask: true,
            blueMask: true,
            alphaMask: true
        };
    }
    /**
     * Getter for renderer having this renderstage
     */
    get Renderer() {
        return this._renderer;
    }
    get GL() {
        return this.Renderer.GL;
    }
    preStage(scene, texs) {
        return;
    }
    postStage(scene, texs) {
        return;
    }
    /**
     * This method will be called before process render in each pass
     */
    preTechnique(scene, techniqueIndex, texs) {
        return;
    }
    /**
     * This method will be called after process render in each pass.
     */
    postTechnique(scene, techniqueIndex, texs) {
        this.Renderer.GL.flush();
    }
    needRender(scene, object, techniqueIndex) {
        return false;
    }
    getTechniqueCount(scene) {
        return 1;
    }
    getTarget(techniqueIndex) {
        return "scene";
    }
    drawForMaterials(scene, object, techniqueCount, techniqueIndex, texs, materialGroup, isWireframed) {
        if (!object.isVisible) {
            return;
        }
        const materials = object.getMaterials(materialGroup);
        for (let i = 0; i < materials.length; i++) {
            this.drawForMaterial(scene, object, techniqueCount, techniqueIndex, texs, materials[i], isWireframed);
        }
    }
    drawForMaterial(scene, object, techniqueCount, techniqueIndex, texs, material, isWireframed) {
        if (!material || !material.Initialized || !material.Enabled || !object.isVisible) {
            return;
        }
        const passCount = material.getPassCount(techniqueIndex);
        for (let pass = 0; pass < passCount; pass++) {
            material.apply({
                scene: scene,
                renderStage: this,
                renderer: this.Renderer,
                object: object,
                textureResource: texs,
                techniqueIndex: techniqueIndex,
                techniqueCount: techniqueCount,
                passIndex: pass,
                passCount: passCount,
                camera: this.Renderer.Camera
            });
            if (isWireframed) {
                object.Geometry.drawWireframe(this.Renderer.Canvas, material);
                return;
            }
            object.Geometry.drawElements(this.Renderer.Canvas, material);
        }
    }
    /**
     * Get default rbo that is allocated for this renderer.
     */
    get DefaultRBO() {
        const rm = JThreeContext.getContextComponent(ContextComponents.ResourceManager);
        return rm.getRBO(this.Renderer.ID + ".rbo.default");
    }
}
export default RenderStageBase;
