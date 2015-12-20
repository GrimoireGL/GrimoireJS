class XMMLRenderConfigUtility {
    public static applyCullConfigure(gl: WebGLRenderingContext, elem: Element, defEnabled: boolean, defDirection: string): void {
        const cullNode = elem.querySelector("cull");
        if (!cullNode) XMMLRenderConfigUtility._applyCullConfigureToGL(gl, defEnabled, defDirection);
        const modeStr = cullNode.getAttribute("mode");
        if (!modeStr) {
            XMMLRenderConfigUtility._applyCullConfigureToGL(gl, defEnabled, defDirection);
        } else {
            if (modeStr == "none")
                XMMLRenderConfigUtility._applyCullConfigureToGL(gl, false, "");
            else
                XMMLRenderConfigUtility._applyCullConfigureToGL(gl, true, modeStr);
        }
    }

    private static _applyCullConfigureToGL(gl: WebGLRenderingContext, enabled: boolean, direction: string): void {
        if (enabled) {
            gl.enable(gl.CULL_FACE);
            switch (direction) {
                case "ccw":
                    gl.cullFace(gl.CCW);
                    return;
                case "cw":
                default:
                    gl.cullFace(gl.CW);
            }
        } else {
            gl.disable(gl.CULL_FACE);
        }
    }

    public static applyDepthTestConfigure(gl: WebGLRenderingContext, elem: Element, defEnabled: boolean, defMode: string, defMask: boolean): void {
        const depthNode = elem.querySelector("depth");
        if (!depthNode) XMMLRenderConfigUtility._applyDepthTestConfigureToGL(gl, defEnabled, defMode, defMask);
        const enabledStr = depthNode.getAttribute("enabled");
        const modeStr = depthNode.getAttribute("mode");
        const maskStr = depthNode.getAttribute("mask");
        let mode = modeStr || defMode;
        let mask;
        if (typeof mask == "undefined") {
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
            switch (mode) {
                case "never":
                    gl.depthFunc(gl.NEVER);
                    return;
                case "lequal":
                    gl.depthFunc(gl.LEQUAL);
                    return;
                case "equal":
                    gl.depthFunc(gl.EQUAL);
                    return;
                case "gequal":
                    gl.depthFunc(gl.GEQUAL);
                    return;
                case "greater":
                    gl.depthFunc(gl.GREATER);
                    return;
                case "notequal":
                    gl.depthFunc(gl.NOTEQUAL);
                    return;
                case "always":
                    gl.depthFunc(gl.ALWAYS);
                    return;
                case "less":
                default:
                    gl.depthFunc(gl.LESS);
                    return;
            }
        }
        else
            gl.disable(gl.DEPTH_TEST);
    }

    public static applyBlendFuncConfigure(gl: WebGLRenderingContext, elem: Element, defEnabled: boolean, defSrcColor: string, defDestColor: string, defSrcAlpha: string, defDestAlpha: string): void {
        const blendNode = elem.querySelector("blend");
        if (!blendNode) XMMLRenderConfigUtility._applyBlendFunConfigureToGL(gl, defEnabled, defSrcColor, defDestColor, defSrcAlpha, defDestAlpha);
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
        this._applyBlendFunConfigureToGL(gl,enabled,srcColor,dstColor,srcAlpha,dstAlpha);
    }

    private static _getBlendConstant(gl: WebGLRenderingContext, constant: string): number {
        constant = constant.toLowerCase();
        switch (constant) {
            case "1":
            case "one":
                return gl.ONE;
            case "0":
            case "zero":
                return gl.ZERO;
            case "srccolor":
                return gl.SRC_COLOR;
            case "dstcolor":
                return gl.DST_COLOR;
            case "oneminussrccolor":
                return gl.ONE_MINUS_SRC_COLOR;
            case "oneminusdstcolor":
                return gl.ONE_MINUS_SRC_COLOR;
            case "srcalpha":
                return gl.SRC_ALPHA;
            case "dstalpha":
                return gl.DST_ALPHA;
            case "oneminussrcalpha":
                return gl.ONE_MINUS_SRC_ALPHA;
            case "oneminusdstalpha":
                return gl.ONE_MINUS_DST_ALPHA;
            case "srcalphasaturate":
                return gl.SRC_ALPHA_SATURATE;
            default:
                console.error(`Unknown blend costant ${constant}`);
                return gl.ONE;
        }
    }

    private static _applyBlendFunConfigureToGL(gl: WebGLRenderingContext, enabled: boolean, srcColor: string, destColor: string, srcAlpha: string, destAlpha: string): void {
        if (enabled) {
            gl.enable(gl.BLEND);
            gl.blendFuncSeparate(XMMLRenderConfigUtility._getBlendConstant(gl, srcColor), XMMLRenderConfigUtility._getBlendConstant(gl, destColor), XMMLRenderConfigUtility._getBlendConstant(gl, srcAlpha), XMMLRenderConfigUtility._getBlendConstant(gl, destAlpha));
        } else {
            gl.disable(gl.BLEND);
        }
    }
}

export = XMMLRenderConfigUtility;
