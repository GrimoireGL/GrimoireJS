import IRenderStageRenderConfigure from "../Renderers/RenderStages/IRenderStageRendererConfigure";
import GLEnumParser from "../Canvas/GL/GLEnumParser";
class XMLRenderConfigureUtility {

  /**
   * Construct renderer configuration preferences from element containing render configuration tags as children.
   * @param  {Element}                     parent    [description]
   * @return {IRenderStageRenderConfigure}           [description]
   */
  public static parseRenderConfig(parent: Element): IRenderStageRenderConfigure {
    const target = <IRenderStageRenderConfigure>{};
    XMLRenderConfigureUtility._parseCullConfigure(parent, target);
    XMLRenderConfigureUtility._parseBlendConfigure(parent, target);
    XMLRenderConfigureUtility._parseDepthConfigure(parent, target);
    XMLRenderConfigureUtility._parseMaskConfigure(parent, target);
    return target;
  }

  public static applyAll(gl: WebGLRenderingContext, config: IRenderStageRenderConfigure): void {
    XMLRenderConfigureUtility._applyCullConfigureToGL(gl, config.cullOrientation !== "NONE", config.cullOrientation);
    XMLRenderConfigureUtility._applyBlendFunConfigureToGL(gl, config.blendEnabled, config.blendSrcFactor, config.blendDstFactor);
    XMLRenderConfigureUtility._applyDepthTestConfigureToGL(gl, config.depthEnabled, config.depthMode);
    XMLRenderConfigureUtility._applyMaskConfigureToGL(gl, config.redMask, config.greenMask, config.blueMask, config.alphaMask, config.depthMask);
  }

  public static mergeRenderConfigure(config: IRenderStageRenderConfigure, base: IRenderStageRenderConfigure): IRenderStageRenderConfigure {
    const result: IRenderStageRenderConfigure = <IRenderStageRenderConfigure>{};
    for (let paramName in base) {
      if (typeof config[paramName] === "undefined") {
        result[paramName] = base[paramName];
      } else {
        result[paramName] = config[paramName];
      }
    }
    return result;
  }

  private static _parseBoolean(val: string, def: boolean): boolean {
    if (!val) { return def; }
    if (val === "true") { return true; }
    return false;
  }

  private static _parseMaskConfigure(elem: Element, target: IRenderStageRenderConfigure): void {
    const maskNode = elem.getElementsByTagName("mask").item(0);
    if (maskNode) {
      const redMaskStr = maskNode.getAttribute("red");
      const greenMaskStr = maskNode.getAttribute("green");
      const blueMaskStr = maskNode.getAttribute("blue");
      const alphaMaskStr = maskNode.getAttribute("alpha");
      const depthMaskStr = maskNode.getAttribute("depth");
      target.redMask = XMLRenderConfigureUtility._parseBoolean(redMaskStr, undefined);
      target.greenMask = XMLRenderConfigureUtility._parseBoolean(greenMaskStr, undefined);
      target.blueMask = XMLRenderConfigureUtility._parseBoolean(blueMaskStr, undefined);
      target.alphaMask = XMLRenderConfigureUtility._parseBoolean(alphaMaskStr, undefined);
      target.depthMask = XMLRenderConfigureUtility._parseBoolean(depthMaskStr, undefined);
    }
  }

  private static _parseCullConfigure(elem: Element, target: IRenderStageRenderConfigure): void {
    const cullNode = elem.getElementsByTagName("cull").item(0);
    if (cullNode) {
      const mode = cullNode.getAttribute("mode");
      if (!mode) {
        target.cullOrientation = "BACK";
      } else {
        target.cullOrientation = mode;
      }
    }
  }

  private static _parseBlendConfigure(elem: Element, target: IRenderStageRenderConfigure): void {
    const blendNode = elem.getElementsByTagName("blend").item(0);
    if (blendNode) {
      const enabledStr = blendNode.getAttribute("enabled");
      const srcFactorStr = blendNode.getAttribute("src");
      const dstFactorStr = blendNode.getAttribute("dst");
      target.blendEnabled = XMLRenderConfigureUtility._parseBoolean(enabledStr, true);
      target.blendSrcFactor = srcFactorStr || undefined;
      target.blendDstFactor = dstFactorStr || undefined;
    }
  }

  private static _parseDepthConfigure(elem: Element, target: IRenderStageRenderConfigure): void {
    const depthNode = elem.getElementsByTagName("depth").item(0);
    if (depthNode) {
      const enabledStr = depthNode.getAttribute("enabled");
      const modeStr = depthNode.getAttribute("mode");
      target.depthEnabled = XMLRenderConfigureUtility._parseBoolean(enabledStr, true);
      target.depthMode = modeStr || undefined;
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
