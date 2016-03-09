import BasicTechnique from "./BasicTechnique";
import RenderStageBase from "../RenderStageBase";
class RSMLRenderStage extends RenderStageBase {
    constructor(renderer, rsmlSource) {
        super(renderer);
        this._parseRSML(rsmlSource);
    }
    get stageName() {
        return this._stageName;
    }
    getDefaultRendererConfigure(techniqueIndex) {
        return this.techniques[techniqueIndex].defaultRenderConfigure;
    }
    getSuperRendererConfigure() {
        return super.getDefaultRendererConfigure(0);
    }
    preTechnique(scene, techniqueIndex, texs) {
        this.techniques[techniqueIndex].preTechnique(scene, texs);
    }
    render(scene, object, techniqueCount, techniqueIndex, texs) {
        this.techniques[techniqueIndex].render(scene, object, techniqueCount, techniqueIndex, texs);
    }
    needRender(scene, object, techniqueIndex) {
        return typeof object.Geometry !== "undefined" && object.Geometry != null;
    }
    getTechniqueCount(scene) {
        return this._techniqueCount;
    }
    getTarget(techniqueIndex) {
        return this.techniques[techniqueIndex].Target;
    }
    _parseRSML(source) {
        this._parsedRSML = (new DOMParser()).parseFromString(source, "text/xml");
        const stageTag = this._parsedRSML.querySelector("rsml > stage");
        if (!stageTag) {
            console.error("Stage tag was not found in RSML");
            return;
        }
        this._stageName = stageTag.getAttribute("name");
        const techniqueTags = stageTag.querySelectorAll("technique");
        this._techniqueCount = techniqueTags.length;
        this.techniques = new Array(this._techniqueCount);
        for (let techniqueIndex = 0; techniqueIndex < this._techniqueCount; techniqueIndex++) {
            this.techniques[techniqueIndex] = new BasicTechnique(this, techniqueTags.item(techniqueIndex), techniqueIndex);
        }
    }
}
export default RSMLRenderStage;
