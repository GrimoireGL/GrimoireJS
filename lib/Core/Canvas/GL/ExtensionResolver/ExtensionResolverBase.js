/**
 * The class provides features to request extension of WebGL context.
 */
class ExtensionResolverBase {
    __requestExtensionWithWarning(gl, extKey) {
        const requestResult = gl.getExtension(extKey);
        if (requestResult == null) {
            console.warn(`The WebGL extension ${extKey} was requested. But, this browser seems not supporting the feature.`);
        }
        return requestResult;
    }
}
export default ExtensionResolverBase;
