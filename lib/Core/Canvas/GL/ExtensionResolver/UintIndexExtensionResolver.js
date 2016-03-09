import ExtensionResolverBase from "./ExtensionResolverBase";
class UintIndexExtensionResolver extends ExtensionResolverBase {
    request(gl) {
        return this.__requestExtensionWithWarning(gl, "OES_element_index_uint");
    }
}
export default UintIndexExtensionResolver;
