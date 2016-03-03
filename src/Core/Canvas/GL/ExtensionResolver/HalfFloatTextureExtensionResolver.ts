import ExtensionResolverBase from "./ExtensionResolverBase";
class HalfFloatTextureExtensionResolver extends ExtensionResolverBase {
   public request(gl: WebGLRenderingContext): { [key: string]: any; } {
     const extension = this.__requestExtensionWithWarning(gl, "OES_texture_half_float");
     return extension;
   }
}

export default HalfFloatTextureExtensionResolver;
