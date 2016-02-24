import ExtensionResolverBase from "./ExtensionResolverBase";
class ColorBufferFloatExtensionResolver extends ExtensionResolverBase {
  request(gl: WebGLRenderingContext): { [key: string]: any; } {
    const isSupported = this._checkWebglColorBufferFloat(gl);
    if (isSupported) {
      return {};
    } else {
      return null;
    }
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

export default ColorBufferFloatExtensionResolver;
