import ExtensionResolverBase from "./ExtensionResolverBase";
class UintIndexExtensionResolver extends ExtensionResolverBase {
  public request(gl: WebGLRenderingContext): { [key: string]: any } {
    return this.__requestExtensionWithWarning(gl, "OES_element_index_uint");
  }
}
export default UintIndexExtensionResolver;
