import IRenderStageRenderConfigure from "../../Renderers/RenderStages/IRenderStageRendererConfigure";
import GLEnumParser from "../../Canvas/GL/GLEnumParser";
class XMLRenderConfigureUtility {

  /**
   * Construct renderer configuration preferences from element containing render configuration tags as children.
   * @param  {WebGLRenderingContext}       gl        [description]
   * @param  {Element}                     parent    [description]
   * @param  {IRenderStageRenderConfigure} defConfig [description]
   * @return {IRenderStageRenderConfigure}           [description]
   */
  public static parseRenderConfig(parent: Element, defConfig: IRenderStageRenderConfigure): IRenderStageRenderConfigure {
    const target = <IRenderStageRenderConfigure>{};
    XMLRenderConfigureUtility._parseCullConfigure(parent, defConfig, target);
    XMLRenderConfigureUtility._parseBlendConfigure(parent, defConfig, target);
    XMLRenderConfigureUtility._parseDepthConfigure(parent, defConfig, target);
    XMLRenderConfigureUtility._parseMaskConfigure(parent, defConfig, target);
    return target;
  }

  public static applyAll(gl: WebGLRenderingContext, config: IRenderStageRenderConfigure): void {
    XMLRenderConfigureUtility._applyCullConfigureToGL(gl, config.cullOrientation !== "NONE", config.cullOrientation);
    XMLRenderConfigureUtility._applyBlendFunConfigureToGL(gl, config.blendEnabled, config.blendSrcFactor, config.blendDstFactor);
    XMLRenderConfigureUtility._applyDepthTestConfigureToGL(gl, config.depthEnabled, config.depthMode);
    XMLRenderConfigureUtility._applyMaskConfigureToGL(gl, config.redMask, config.greenMask, config.blueMask, config.alphaMask, config.depthMask);
  }


  private static _parseBoolean(val: string, def: boolean): boolean {
    if (!val) { return def; }
    if (val === "true") { return true; }
    return false;
  }

  private static _parseMaskConfigure(elem: Element, defConfig: IRenderStageRenderConfigure, target: IRenderStageRenderConfigure): void {
    const maskNode = elem.getElementsByTagName("mask").item(0);
    if (!maskNode) {
      target.redMask = defConfig.redMask;
      target.greenMask = defConfig.greenMask;
      target.blueMask = defConfig.blueMask;
      target.alphaMask = defConfig.alphaMask;
      target.depthMask = defConfig.depthMask;
    } else {
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

  private static _parseCullConfigure(elem: Element, defConfig: IRenderStageRenderConfigure, target: IRenderStageRenderConfigure): void {
    const cullNode = elem.getElementsByTagName("cull").item(0);
    if (!cullNode) {
      target.cullOrientation = defConfig.cullOrientation;
    } else {
      const mode = cullNode.getAttribute("mode");
      if (!mode) {
        target.cullOrientation = defConfig.cullOrientation;
      } else {
        target.cullOrientation = mode;
      }
    }
  }

  private static _parseBlendConfigure(elem: Element, defConfig: IRenderStageRenderConfigure, target: IRenderStageRenderConfigure): void {
    const blendNode = elem.getElementsByTagName("blend").item(0);
    if (!blendNode) {
      target.blendEnabled = defConfig.blendEnabled;
      target.blendSrcFactor = defConfig.blendSrcFactor;
      target.blendDstFactor = defConfig.blendDstFactor;
    } else {
      const enabledStr = blendNode.getAttribute("enabled");
      const srcFactorStr = blendNode.getAttribute("src");
      const dstFactorStr = blendNode.getAttribute("dst");
      target.blendEnabled = this._parseBoolean(enabledStr, defConfig.blendEnabled);
      target.blendSrcFactor = srcFactorStr || defConfig.blendSrcFactor;
      target.blendDstFactor = dstFactorStr || defConfig.blendDstFactor;
    }
  }

  private static _parseDepthConfigure(elem: Element, defConfig: IRenderStageRenderConfigure, target: IRenderStageRenderConfigure): void {
    const depthNode = elem.getElementsByTagName("depth").item(0);
    if (!depthNode) {
      target.depthMode = defConfig.depthMode;
      target.depthEnabled = defConfig.depthEnabled;
    } else {
      const enabledStr = depthNode.getAttribute("enabled");
      const modeStr = depthNode.getAttribute("mode");
      target.depthEnabled = this._parseBoolean(enabledStr, defConfig.depthEnabled);
      target.depthMode = modeStr || defConfig.depthMode;
    }
  }


  private static _applyCullConfigureToGL(gl: WebGLRenderingContext, enabled: boolean, mode: string): void {
    if (enabled) {
      gl.enable(gl.CULL_FACE);
      gl.cullFace(GLEnumParser.parseCullMode(mode));
    } else {
      gl.disable(gl.CULL_FACE);
    }
  }

  private static _applyDepthTestConfigureToGL(gl: WebGLRenderingContext, enabled: boolean, mode: string): void {
    if (enabled) {
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(GLEnumParser.parseDepthFunc(mode));
    } else {
      gl.disable(gl.DEPTH_TEST);
    }
  }

  private static _applyBlendFunConfigureToGL(gl: WebGLRenderingContext, enabled: boolean, src: string, dst: string): void {
    if (enabled) {
      gl.enable(gl.BLEND);
      gl.blendFunc(GLEnumParser.parseBlendFunc(src), GLEnumParser.parseBlendFunc(dst));
    } else {
      gl.disable(gl.BLEND);
    }
  }

  private static _applyMaskConfigureToGL(gl: WebGLRenderingContext, red: boolean, green: boolean, blue: boolean, alpha: boolean, depth: boolean): void {
    gl.colorMask(red, green, blue, alpha);
    gl.depthMask(depth);
  }
}

export default XMLRenderConfigureUtility;
