import NamedValue from "../../../../Base/NamedValue";
import ExtensionResolverBase from "./ExtensionResolverBase";
class FloatTextureExtensionResolver extends ExtensionResolverBase {

  public request(gl: WebGLRenderingContext): NamedValue<any> {
    return this.__requestExtensionWithWarning(gl, "OES_texture_float");
  }
}

export default FloatTextureExtensionResolver;
