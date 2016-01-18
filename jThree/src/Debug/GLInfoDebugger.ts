import ContextComponents = require("../ContextComponents");
import JThreeContext = require("../JThreeContext");
import Debugger = require("./Debugger");
class GLInfoDebugger {
  public static debugCullConfig(gl: WebGLRenderingContext): any {
    const cullFace = gl.getParameter(gl.CULL_FACE);
    const cullMode = gl.getParameter(gl.CULL_FACE_MODE);
    let mode;
    switch (cullMode) {
      case gl.FRONT:
        mode = "FRONT";
        break;
      case gl.BACK:
        mode = "BACK";
        break;
      case gl.FRONT_AND_BACK:
        mode = "FRONT_AND_BACK";
        break;
      default:
        mode = `Unknown(${cullMode})`;
    }
    return { enabled: cullFace, mode: mode };
  }

  public static debugBlendConfig(gl: WebGLRenderingContext): any {
    const blend = gl.getParameter(gl.BLEND);
    const rawSrcAlpha = gl.getParameter(gl.SRC_ALPHA);
    const rawSrcColor = gl.getParameter(gl.SRC_COLOR);
    const rawDstAlpha = gl.getParameter(gl.DST_ALPHA);
    const rawDstColor = gl.getParameter(gl.DST_COLOR);

  }

  private static _blendCoefficientToString(gl: WebGLRenderingContext, val: number): string {
    switch (val) {
      case gl.ZERO:
        return "ZERO";
      case gl.ONE:
        return "ONE";
      case gl.SRC_COLOR:
        return "SRC_COLOR";
    }
  }
}

export = GLInfoDebugger;
