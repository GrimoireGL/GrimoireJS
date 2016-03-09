import GLEnumParser from "../../Canvas/GL/GLEnumParser";
class XMLRenderConfigureUtility {
    /**
     * Construct renderer configuration preferences from element containing render configuration tags as children.
     * @param  {WebGLRenderingContext}       gl        [description]
     * @param  {Element}                     parent    [description]
     * @param  {IRenderStageRenderConfigure} defConfig [description]
     * @return {IRenderStageRenderConfigure}           [description]
     */
    static parseRenderConfig(parent, defConfig) {
        const target = {};
        XMLRenderConfigureUtility._parseCullConfigure(parent, defConfig, target);
        XMLRenderConfigureUtility._parseBlendConfigure(parent, defConfig, target);
        XMLRenderConfigureUtility._parseDepthConfigure(parent, defConfig, target);
        XMLRenderConfigureUtility._parseMaskConfigure(parent, defConfig, target);
        return target;
    }
    static applyAll(gl, config) {
        XMLRenderConfigureUtility._applyCullConfigureToGL(gl, config.cullOrientation !== "NONE", config.cullOrientation);
        XMLRenderConfigureUtility._applyBlendFunConfigureToGL(gl, config.blendEnabled, config.blendSrcFactor, config.blendDstFactor);
        XMLRenderConfigureUtility._applyDepthTestConfigureToGL(gl, config.depthEnabled, config.depthMode);
        XMLRenderConfigureUtility._applyMaskConfigureToGL(gl, config.redMask, config.greenMask, config.blueMask, config.alphaMask, config.depthMask);
    }
    static _parseBoolean(val, def) {
        if (!val) {
            return def;
        }
        if (val === "true") {
            return true;
        }
        return false;
    }
    static _parseMaskConfigure(elem, defConfig, target) {
        const maskNode = elem.getElementsByTagName("mask").item(0);
        if (!maskNode) {
            target.redMask = defConfig.redMask;
            target.greenMask = defConfig.greenMask;
            target.blueMask = defConfig.blueMask;
            target.alphaMask = defConfig.alphaMask;
            target.depthMask = defConfig.depthMask;
        }
        else {
            const redMaskStr = maskNode.getAttribute("red");
            const greenMaskStr = maskNode.getAttribute("green");
            const blueMaskStr = maskNode.getAttribute("blue");
            const alphaMaskStr = maskNode.getAttribute("alpha");
            const depthMaskStr = maskNode.getAttribute("depth");
            target.redMask = XMLRenderConfigureUtility._parseBoolean(redMaskStr, defConfig.redMask);
            target.greenMask = XMLRenderConfigureUtility._parseBoolean(greenMaskStr, defConfig.greenMask);
            target.blueMask = XMLRenderConfigureUtility._parseBoolean(blueMaskStr, defConfig.blueMask);
            target.alphaMask = XMLRenderConfigureUtility._parseBoolean(alphaMaskStr, defConfig.alphaMask);
            target.depthMask = XMLRenderConfigureUtility._parseBoolean(depthMaskStr, defConfig.depthMask);
        }
    }
    static _parseCullConfigure(elem, defConfig, target) {
        const cullNode = elem.getElementsByTagName("cull").item(0);
        if (!cullNode) {
            target.cullOrientation = defConfig.cullOrientation;
        }
        else {
            const mode = cullNode.getAttribute("mode");
            if (!mode) {
                target.cullOrientation = defConfig.cullOrientation;
            }
            else {
                target.cullOrientation = mode;
            }
        }
    }
    static _parseBlendConfigure(elem, defConfig, target) {
        const blendNode = elem.getElementsByTagName("blend").item(0);
        if (!blendNode) {
            target.blendEnabled = defConfig.blendEnabled;
            target.blendSrcFactor = defConfig.blendSrcFactor;
            target.blendDstFactor = defConfig.blendDstFactor;
        }
        else {
            const enabledStr = blendNode.getAttribute("enabled");
            const srcFactorStr = blendNode.getAttribute("src");
            const dstFactorStr = blendNode.getAttribute("dst");
            target.blendEnabled = XMLRenderConfigureUtility._parseBoolean(enabledStr, defConfig.blendEnabled);
            target.blendSrcFactor = srcFactorStr || defConfig.blendSrcFactor;
            target.blendDstFactor = dstFactorStr || defConfig.blendDstFactor;
        }
    }
    static _parseDepthConfigure(elem, defConfig, target) {
        const depthNode = elem.getElementsByTagName("depth").item(0);
        if (!depthNode) {
            target.depthMode = defConfig.depthMode;
            target.depthEnabled = defConfig.depthEnabled;
        }
        else {
            const enabledStr = depthNode.getAttribute("enabled");
            const modeStr = depthNode.getAttribute("mode");
            target.depthEnabled = XMLRenderConfigureUtility._parseBoolean(enabledStr, defConfig.depthEnabled);
            target.depthMode = modeStr || defConfig.depthMode;
        }
    }
    static _applyCullConfigureToGL(gl, enabled, mode) {
        if (enabled) {
            gl.enable(gl.CULL_FACE);
            gl.cullFace(GLEnumParser.parseCullMode(mode));
        }
        else {
            gl.disable(gl.CULL_FACE);
        }
    }
    static _applyDepthTestConfigureToGL(gl, enabled, mode) {
        if (enabled) {
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(GLEnumParser.parseDepthFunc(mode));
        }
        else {
            gl.disable(gl.DEPTH_TEST);
        }
    }
    static _applyBlendFunConfigureToGL(gl, enabled, src, dst) {
        if (enabled) {
            gl.enable(gl.BLEND);
            gl.blendFunc(GLEnumParser.parseBlendFunc(src), GLEnumParser.parseBlendFunc(dst));
        }
        else {
            gl.disable(gl.BLEND);
        }
    }
    static _applyMaskConfigureToGL(gl, red, green, blue, alpha, depth) {
        gl.colorMask(red, green, blue, alpha);
        gl.depthMask(depth);
    }
}
export default XMLRenderConfigureUtility;
