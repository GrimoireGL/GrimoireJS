import DefaultValuePreProcessor from "./DefaultValuePreProcessor";
import JThreeObjectWithID from "../../../Base/JThreeObjectWithID";
import XMLRenderConfigUtility from "./XMLRenderConfigUtility";
import ContextComponents from "../../../ContextComponents";
import JThreeContext from "../../../JThreeContext";
import ShaderParser from "./ShaderParser";
import Q from "q";
class MaterialPass extends JThreeObjectWithID {
    constructor(material, passDocument, materialName, index) {
        super();
        this.ready = false;
        this._renderConfigureCache = {};
        this.passIndex = index;
        this._material = material;
        this._passDocument = passDocument;
        this.materialName = materialName;
    }
    initialize(uniformRegisters) {
        const shaderCode = this._passDocument.getElementsByTagName("glsl").item(0).textContent;
        return ShaderParser.parseCombined(shaderCode).then((result) => {
            this.programDescription = result;
            DefaultValuePreProcessor.preprocess(this.programDescription.uniforms);
            this._constructProgram(this.materialName + this.passIndex);
            return Q.all(uniformRegisters.map(m => m.preprocess(this, this.programDescription.uniforms)));
        }).then(() => {
            this.ready = true;
        });
    }
    apply(matArg, uniformRegisters, material) {
        if (!this.ready) {
            throw new Error("initialization was not completed yet!");
        }
        const gl = matArg.renderStage.GL;
        const pWrapper = this.program.getForContext(matArg.renderStage.Renderer.Canvas);
        const renderConfig = this._fetchRenderConfigure(matArg);
        XMLRenderConfigUtility.applyAll(gl, renderConfig);
        // Declare using program before assigning material variables
        pWrapper.useProgram();
        // Apply attribute variables by geometries
        matArg.object.Geometry.applyAttributeVariables(pWrapper, this.programDescription.attributes);
        // Apply uniform variables
        uniformRegisters.forEach((r) => {
            r.register(gl, pWrapper, matArg, this.programDescription.uniforms);
        });
        material.registerMaterialVariables(matArg.renderStage.Renderer, pWrapper, this.programDescription.uniforms);
    }
    __preprocessUniformVariables() {
        // Preprocess default value for uniforms
    }
    _fetchRenderConfigure(matArg) {
        const id = matArg.renderStage.ID;
        let result;
        if (this._renderConfigureCache[id]) {
            result = this._renderConfigureCache[id];
        }
        else {
            const configure = XMLRenderConfigUtility.parseRenderConfig(this._passDocument, matArg.renderStage.getDefaultRendererConfigure(matArg.techniqueIndex));
            this._renderConfigureCache[id] = configure;
            result = configure;
        }
        this._material.emit("configure", {
            pass: this,
            passIndex: this.passIndex,
            material: this._material,
            configure: result
        });
        return result;
    }
    _constructProgram(idPrefix) {
        this._passId = idPrefix;
        this.fragmentShader = MaterialPass._resourceManager.createShader(idPrefix + "-fs", this.programDescription.fragment, WebGLRenderingContext.FRAGMENT_SHADER);
        this.vertexShader = MaterialPass._resourceManager.createShader(idPrefix + "-vs", this.programDescription.vertex, WebGLRenderingContext.VERTEX_SHADER);
        this.fragmentShader.loadAll();
        this.vertexShader.loadAll();
        this.program = MaterialPass._resourceManager.createProgram(idPrefix + "-program", [this.vertexShader, this.fragmentShader]);
    }
    static get _resourceManager() {
        return JThreeContext.getContextComponent(ContextComponents.ResourceManager);
    }
}
export default MaterialPass;
