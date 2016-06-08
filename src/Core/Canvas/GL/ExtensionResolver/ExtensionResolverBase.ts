import NamedValue from "../../../../Base/NamedValue";
/**
 * The class provides features to request extension of WebGL context.
 */
abstract class ExtensionResolverBase {
  /**
   * Request an extension related to this class.
   * @return {NamedValue<any>} the extension
   */
  public abstract request(gl: WebGLRenderingContext): NamedValue<any>;

  protected __requestExtensionWithWarning(gl: WebGLRenderingContext, extKey: string): NamedValue<any> {
  const requestResult = gl.getExtension(extKey);
  if (requestResult == null) {
    console.warn(`The WebGL extension ${extKey} was requested. But, this browser seems not supporting the feature.`);
  }
  return requestResult;
  }

}

export default ExtensionResolverBase;
