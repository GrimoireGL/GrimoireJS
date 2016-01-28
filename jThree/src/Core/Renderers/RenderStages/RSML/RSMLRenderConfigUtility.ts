import IRenderBufferBindingConfig from "./IRenderBufferBindingConfig";
import IColorBufferBindingConfig from "./IColorBufferBindingConfig";
import Vector4 from "../../../../Math/Vector4";
import IFBOBindingConfig from "./IFBOBindingConfig";
class RSMLRenderConfigUtility {
  public static parseFBOConfiguration(fboElement: Element): IFBOBindingConfig {
    if (!fboElement) {
      return undefined;
    }
    const result = <IFBOBindingConfig>{};
    const primary = fboElement.getAttribute("primary");
    const colorNodes = fboElement.getElementsByTagName("color");
    const rboNode = fboElement.getElementsByTagName("rbo").item(0);
    result.primaryName = primary;
    for (let i = 0; i < colorNodes.length; i++) {
      const colorBuffer = RSMLRenderConfigUtility._parseColorBuffer(colorNodes.item(i));
      result[colorBuffer.registerIndex] = colorBuffer;
      if (colorBuffer.name === primary) {
        result.primaryIndex = colorBuffer.registerIndex;
      }
    }
    result.rbo = RSMLRenderConfigUtility._parseRenderBuffer(rboNode);
    return result;
  }

  private static _parseColorBuffer(colorElement: Element): IColorBufferBindingConfig {
    // Retrive buffer name to be bound
    const name = colorElement.getAttribute("name");
    if (!name) {
      console.error("The name attribute in color node must be specified!");
      return null;
    }
    // Retrive register index
    const registerStr = colorElement.getAttribute("register");
    let registerIndex = 0;
    if (registerStr) {
      registerIndex = parseInt(registerStr, 10);
    }

    // Retrive clear flag
    const clearStr = colorElement.getAttribute("clear");
    const clearFlag = clearStr !== "false";

    // Retrive clear color
    let clearColor: Vector4;
    if (clearFlag) {
      const colorStr = colorElement.getAttribute("clearColor");
      clearColor = new Vector4(0, 0, 0, 0);
      if (colorStr) {
        clearColor = Vector4.parse(colorStr);
      }
    }
    return {
      name: name,
      registerIndex: registerIndex,
      clearColor: clearColor,
      needClear: clearFlag
    };
  }

  private static _parseRenderBuffer(rboElement: Element): IRenderBufferBindingConfig {
    if (!rboElement) {
      return undefined;
    }
    // Retrive buffer name to be bound
    let name = rboElement.getAttribute("name");
    if (!name) {
      name = "default";
    }
    let type = rboElement.getAttribute("type");
    if (!type) {
      type = "depth";
    }
    let clearStr = rboElement.getAttribute("clear");
    const clearFlag = clearStr !== "false";

    let clearDepth: number;
    if (clearFlag) {
      const depthStr = rboElement.getAttribute("clearDepth");
      clearDepth = 1.0;
      if (depthStr) {
        clearDepth = parseFloat(depthStr);
      }
    }
    return {
      name: name,
      type: type,
      needClear: clearFlag,
      clearDepth: clearDepth
    };
  }
}

export default RSMLRenderConfigUtility;
