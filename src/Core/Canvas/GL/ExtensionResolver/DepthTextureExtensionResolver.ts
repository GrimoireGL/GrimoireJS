import ExtensionResolverBase from "./ExtensionResolverBase";
class DepthTextureExtensionResolver extends ExtensionResolverBase {
  public request(gl: WebGLRenderingContext): { [key: string]: any; } {
    return this.requestExtensionWithWarning(gl, "WEBGL_depth_texture");
  }
}

export default DepthTextureExtensionResolver;
