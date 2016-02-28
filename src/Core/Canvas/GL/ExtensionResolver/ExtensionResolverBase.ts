/**
 * The class provides features to request extension of WebGL context.
 */
abstract class ExtensionResolverBase {
  /**
   * Request an extension related to this class.
   * @return {{[key:string]:any}} the extension
   */
  public abstract request(gl: WebGLRenderingContext): { [key: string]: any };

  protected requestExtensionWithWarning(gl: WebGLRenderingContext, extKey: string): { [key: string]: any; } {
  const requestResult = gl.getExtension(extKey);
  if (requestResult == null) {
    console.warn(`The WebGL extension ${extKey} was requested. But, this browser seems not supporting the feature.`);
  }
  return requestResult;
  }

}

export default ExtensionResolverBase;
