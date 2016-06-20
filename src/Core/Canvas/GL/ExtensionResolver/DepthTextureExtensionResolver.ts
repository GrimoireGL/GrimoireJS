import NamedValue from "../../../../Base/NamedValue";
import ExtensionResolverBase from "./ExtensionResolverBase";

class DepthTextureExtensionResolver extends ExtensionResolverBase {
  public request(gl: WebGLRenderingContext): NamedValue<any> {
    return this.__requestExtensionWithWarning(gl, "WEBGL_depth_texture");
  }
}

export default DepthTextureExtensionResolver;
