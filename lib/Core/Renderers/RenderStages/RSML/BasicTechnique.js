import RSMLRenderConfigUtility from "./RSMLRenderConfigUtility";
import XMLRenderConfigUtility from "../../../Materials/Base/XMLRenderConfigUtility";
import BasicMaterial from "../../../Materials/Base/BasicMaterial";
import JThreeObjectWithID from "../../../../Base/JThreeObjectWithID";
import ContextComponents from "../../../../ContextComponents";
import JThreeContext from "../../../../JThreeContext";
class BasicTechnique extends JThreeObjectWithID {
    constructor(renderStage, technique, techniqueIndex) {
        super();
        this.__fboInitialized = false;
        this._wireFramed = false;
        this.__renderStage = renderStage;
        this._techniqueDocument = technique;
        this._techniqueIndex = techniqueIndex;
        this.defaultRenderConfigure = XMLRenderConfigUtility.parseRenderConfig(technique, this.__renderStage.getSuperRendererConfigure());
        this._target = this._techniqueDocument.getAttribute("target");
        this._wireFramed = this._techniqueDocument.getAttribute("wireframe") === "true";
        if (!this._target) {
            this._target = "scene";
        }
        this._fboBindingInfo = RSMLRenderConfigUtility.parseFBOConfiguration(this._techniqueDocument.getElementsByTagName("fbo").item(0), renderStage.Renderer.Canvas);
        if (this._target !== "scene") {
            this.defaultMaterial = this._getMaterial();
        }
    }
    get _gl() {
        return this.__renderStage.GL;
    }
    get Target() {
        return this._target;
    }
    preTechnique(scene, texs) {
        this._applyBufferConfiguration(scene, texs);
    }
    render(scene, object, techniqueCount, techniqueIndex, texs) {
        switch (this.Target) {
            case "scene":
                const materialGroup = this._techniqueDocument.getAttribute("materialGroup");
                this.__renderStage.drawForMaterials(scene, object, techniqueCount, techniqueIndex, texs, materialGroup, this._wireFramed);
                break;
            default:
                this.defaultMaterial.materialVariables = this.__renderStage.stageVariables;
                XMLRenderConfigUtility.applyAll(this._gl, this.defaultRenderConfigure);
                this.__renderStage.drawForMaterial(scene, object, techniqueCount, techniqueIndex, texs, this.defaultMaterial, this._wireFramed);
        }
    }
    __initializeFBO(texs) {
        this.__fboInitialized = true;
        const rm = JThreeContext.getContextComponent(ContextComponents.ResourceManager);
        this.__fbo = rm.createFBO("jthree.technique." + this.ID);
        const fboWrapper = this.__fbo.getForContext(this.__renderStage.Renderer.Canvas);
        this._attachRBOConfigure(fboWrapper, texs);
        this._attachTextureConfigure(fboWrapper, texs);
    }
    _getMaterial() {
        const rawMaterials = this._techniqueDocument.getElementsByTagName("material");
        if (rawMaterials.length > 0) {
            const materialDocument = rawMaterials.item(0);
            return new BasicMaterial(materialDocument.outerHTML, this.__renderStage.stageName + this._techniqueIndex);
        }
        const mm = JThreeContext.getContextComponent(ContextComponents.MaterialManager);
        const matName = this._techniqueDocument.getAttribute("material");
        if (!matName) {
            console.error("material name was not specified.");
        }
        return mm.constructMaterial(matName);
    }
    _attachTextureConfigure(fboWrapper, texs) {
        // TODO support for multiple rendering buffer
        const colorConfigure = this._fboBindingInfo[0];
        fboWrapper.attachTexture(WebGLRenderingContext.COLOR_ATTACHMENT0, texs[colorConfigure.name]);
    }
    _attachRBOConfigure(fboWrapper, texs) {
        if (!this._fboBindingInfo.rbo) {
            fboWrapper.attachRBO(WebGLRenderingContext.DEPTH_ATTACHMENT, null); // Unbind render buffer
        }
        else {
            const rboConfigure = this._fboBindingInfo.rbo;
            let targetBuffer;
            let isRBO = true;
            if (rboConfigure.name === "default") {
                targetBuffer = this.__renderStage.DefaultRBO;
            }
            else {
                if (!texs[rboConfigure.name]) {
                    throw new Error("Specified render buffer was not found");
                }
                else {
                    targetBuffer = texs[rboConfigure.name];
                    isRBO = false;
                }
            }
            if (isRBO) {
                switch (rboConfigure.type) {
                    case "stencil":
                        fboWrapper.attachRBO(WebGLRenderingContext.STENCIL_ATTACHMENT, targetBuffer);
                        break;
                    case "depthstencil":
                        fboWrapper.attachRBO(WebGLRenderingContext.DEPTH_STENCIL_ATTACHMENT, targetBuffer);
                        break;
                    default:
                    case "depth":
                        fboWrapper.attachRBO(WebGLRenderingContext.DEPTH_ATTACHMENT, targetBuffer);
                        break;
                }
            }
            else {
                switch (rboConfigure.type) {
                    case "stencil":
                        fboWrapper.attachTexture(WebGLRenderingContext.STENCIL_ATTACHMENT, targetBuffer);
                        break;
                    case "depthstencil":
                        fboWrapper.attachTexture(WebGLRenderingContext.DEPTH_STENCIL_ATTACHMENT, targetBuffer);
                        break;
                    default:
                    case "depth":
                        fboWrapper.attachTexture(WebGLRenderingContext.DEPTH_ATTACHMENT, targetBuffer);
                        break;
                }
            }
        }
    }
    _applyBufferConfiguration(scene, texs) {
        if (!this._fboBindingInfo || !this._fboBindingInfo[0]) {
            // if there was no fbo configuration, use screen buffer as default
            this._applyViewport(true);
            this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
            return;
        }
        else {
            // Check primary buffer was specified
            if (this._fboBindingInfo.primaryName && !texs[this._fboBindingInfo.primaryName]) {
                this._onPrimaryBufferFail();
                return;
            }
            this._applyViewport(false);
            if (!this.__fboInitialized) {
                this.__initializeFBO(texs);
            }
            this.__fbo.getForContext(this.__renderStage.Renderer.Canvas).bind();
            this._clearBuffers();
        }
    }
    /**
     * When primary buffer was failed to bind, this method bind default buffer as drawing target.
     */
    _onPrimaryBufferFail() {
        this._applyViewport(true);
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
        if (this._fboBindingInfo.rbo && this._fboBindingInfo.rbo.needClear) {
            this._gl.depthMask(true);
            this._gl.clearDepth(this._fboBindingInfo.rbo.clearDepth);
            this._gl.clear(this._gl.DEPTH_BUFFER_BIT);
        }
    }
    _clearBuffers() {
        // Clear color buffer
        // TODO: support for multiple buffers
        if (this._fboBindingInfo[0] && this._fboBindingInfo[0].needClear) {
            const buffer = this._fboBindingInfo[0];
            const col = buffer.clearColor;
            this._gl.colorMask(true, true, true, true);
            this._gl.clearColor(col.X, col.Y, col.Z, col.W);
            this._gl.clear(this._gl.COLOR_BUFFER_BIT);
        }
        if (this._fboBindingInfo.rbo && this._fboBindingInfo.rbo.needClear) {
            this._gl.depthMask(true);
            this._gl.clearDepth(this._fboBindingInfo.rbo.clearDepth);
            this._gl.clear(this._gl.DEPTH_BUFFER_BIT);
        }
    }
    _applyViewport(isDefault) {
        if (isDefault) {
            this.__renderStage.Renderer.applyDefaultBufferViewport();
        }
        else {
            this.__renderStage.Renderer.applyRendererBufferViewport();
        }
    }
}
export default BasicTechnique;
