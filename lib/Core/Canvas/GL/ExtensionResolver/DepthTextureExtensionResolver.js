import ExtensionResolverBase from "./ExtensionResolverBase";
class DepthTextureExtensionResolver extends ExtensionResolverBase {
    request(gl) {
        return this.__requestExtensionWithWarning(gl, "WEBGL_depth_texture");
    }
}
export default DepthTextureExtensionResolver;
