import JThreeObject from "../../Base/JThreeObject";
import JThreeLogger from "../../Base/JThreeLogger";
import GLExtensionList from "./GLExtensionList";
/**
 * Provides the feature to require gl extension.
 */
class GLExtensionResolver extends JThreeObject {
  private requiredExtensions =
  [
    GLExtensionList.ElementIndexUint,
    GLExtensionList.TextureFloat,
    GLExtensionList.VertexArrayObject,
    "WEBGL_color_buffer_float"
   ];

  private extensions: { [key: string]: any } = {};

  public checkExtensions(gl: WebGLRenderingContext) {
    for (let i = 0; i < this.requiredExtensions.length; i++) {
      const element = this.requiredExtensions[i];
      let ext;
      switch (element) {
        case "WEBGL_color_buffer_float":
          ext = this._checkWebglColorBufferFloat(gl);
          break;
        default:
          ext = gl.getExtension(element);
      }
      if (!ext) {
        JThreeLogger.sectionError("GL Extension", `WebGL Extension:${element} was requested,but your browser is not supporting this feature.`);
      } else {
        JThreeLogger.sectionLog("GL Extension", `${element} was instanciated successfully`);
        this.extensions[element] = ext;
      }
    }
  }

  public getExtension(extName: string): any {
    return this.extensions[extName];
  }

  public hasExtension(extName: string): boolean {
    return !!this.extensions[extName];
  }

  /**
   * To check being able to use float value texture as rendering target, just calling getExtension is not sufficient.
   */
  private _checkWebglColorBufferFloat(gl: WebGLRenderingContext): boolean {
    let isSupported: boolean;
    if (gl.getExtension("WEBGL_color_buffer_float") === null) {
      const fbo = gl.createFramebuffer();
      const tex = gl.createTexture();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.FLOAT, null);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        isSupported = false;
      } else {
        isSupported = true;
      }
      gl.deleteTexture(tex);
      gl.deleteFramebuffer(fbo);
    } else {
      isSupported = true;
    }
    return isSupported;
  }

}
export default GLExtensionResolver;
