import ExtensionResolverBase from "./ExtensionResolverBase";
class FloatTextureExtensionResolver extends ExtensionResolverBase {
    request(gl) {
        return this.__requestExtensionWithWarning(gl, "OES_texture_float");
    }
}
export default FloatTextureExtensionResolver;
