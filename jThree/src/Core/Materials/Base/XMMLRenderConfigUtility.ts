import GLEnumParser = require("../../../Wrapper/GLEnumParser");
class XMMLRenderConfigUtility {
    public static applyCullConfigure(gl: WebGLRenderingContext, elem: Element, defDirection: string): void {
        const cullNode = elem.querySelector("cull");
        if (!cullNode) {
            XMMLRenderConfigUtility._applyCullConfigureToGL(gl, defDirection != "none", defDirection);
            return;
        }
        const modeStr = cullNode.getAttribute("mode");
        if (!modeStr) {
            XMMLRenderConfigUtility._applyCullConfigureToGL(gl, defDirection != "none", defDirection);
        } else {
            if (modeStr == "none")
                XMMLRenderConfigUtility._applyCullConfigureToGL(gl, false, "");
            else
                XMMLRenderConfigUtility._applyCullConfigureToGL(gl, true, modeStr);
        }
    }

    private static _applyCullConfigureToGL(gl: WebGLRenderingContext, enabled: boolean, mode: string): void {
        if (enabled) {
            gl.enable(gl.CULL_FACE);
            gl.cullFace(GLEnumParser.parseCullMode(gl,mode));
        } else {
            gl.disable(gl.CULL_FACE);
        }
    }

    public static applyDepthTestConfigure(gl: WebGLRenderingContext, elem: Element, defEnabled: boolean, defMode: string, defMask: boolean): void {
        const depthNode = elem.querySelector("depth");
        if (!depthNode) {
            XMMLRenderConfigUtility._applyDepthTestConfigureToGL(gl, defEnabled, defMode, defMask);
            return;
        }
        const enabledStr = depthNode.getAttribute("enabled");
        const modeStr = depthNode.getAttribute("mode");
        const maskStr = depthNode.getAttribute("mask");
        let mode = modeStr || defMode;
        let mask;
        if (typeof maskStr == "undefined") {
            mask = defMask;
        } else {
            mask = maskStr == "true";
        }
        if (enabledStr == "true") {
            XMMLRenderConfigUtility._applyDepthTestConfigureToGL(gl, true, mode, mask);
        } else {
            XMMLRenderConfigUtility._applyDepthTestConfigureToGL(gl, false, mode, mask);
        }
    }

    private static _applyDepthTestConfigureToGL(gl: WebGLRenderingContext, enabled: boolean, mode: string, mask: boolean): void {
        if (enabled) {
            gl.enable(gl.DEPTH_TEST);
            gl.depthMask(mask);
            gl.depthFunc(GLEnumParser.parseDepthFunc(gl,mode))
        }
        else {
            gl.depthMask(mask);
            gl.disable(gl.DEPTH_TEST);
        }
    }

    public static applyBlendFuncConfigure(gl: WebGLRenderingContext, elem: Element, defEnabled: boolean, defSrcColor: string, defDestColor: string, defSrcAlpha: string, defDestAlpha: string): void {
        const blendNode = elem.querySelector("blend");
        if (!blendNode) {
            XMMLRenderConfigUtility._applyBlendFunConfigureToGL(gl, defEnabled, defSrcColor, defDestColor, defSrcAlpha, defDestAlpha);
            return;
        }
        const enabledStr = blendNode.getAttribute("enabled");
        const srcColorStr = blendNode.getAttribute("srcColor");
        const destColorStr = blendNode.getAttribute("dstColor");
        const srcAlphaStr = blendNode.getAttribute("srcAlpha");
        const destAlphaStr = blendNode.getAttribute("dstAlpha");
        let enabled;
        enabled = enabledStr == "true" ? true : defEnabled;
        let srcColor = srcColorStr || defSrcColor;
        let dstColor = destColorStr || defDestColor;
        let srcAlpha = srcAlphaStr || defSrcAlpha;
        let dstAlpha = destAlphaStr || defDestAlpha;
        this._applyBlendFunConfigureToGL(gl, enabled, srcColor, dstColor, srcAlpha, dstAlpha);
    }

    private static _applyBlendFunConfigureToGL(gl: WebGLRenderingContext, enabled: boolean, srcColor: string, destColor: string, srcAlpha: string, destAlpha: string): void {
        if (enabled) {
            gl.enable(gl.BLEND);
            gl.blendFuncSeparate(GLEnumParser.parseBlendFunc(gl, srcColor), GLEnumParser.parseBlendFunc(gl, destColor), GLEnumParser.parseBlendFunc(gl, srcAlpha), GLEnumParser.parseBlendFunc(gl, destAlpha));
        } else {
            gl.disable(gl.BLEND);
        }
    }
}

export = XMMLRenderConfigUtility;
