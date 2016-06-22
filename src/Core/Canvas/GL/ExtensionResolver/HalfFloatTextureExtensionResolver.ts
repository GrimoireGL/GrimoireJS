import NamedValue from "../../../../Base/NamedValue";
import ExtensionResolverBase from "./ExtensionResolverBase";
class HalfFloatTextureExtensionResolver extends ExtensionResolverBase {
   public request(gl: WebGLRenderingContext): NamedValue<any> {
     const extension = this.__requestExtensionWithWarning(gl, "OES_texture_half_float");
     return extension;
   }
}

export default HalfFloatTextureExtensionResolver;
