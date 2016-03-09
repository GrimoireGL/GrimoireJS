import ColorBufferFloatExtensionResolver from "./ExtensionResolver/ColorBufferFloatExtensionResolver";
import DepthTextureExtensionResolver from "./ExtensionResolver/DepthTextureExtensionResolver";
import UintIndexExtensionResolver from "./ExtensionResolver/UintIndexExtensionResolver";
import FloatTextureExtensionResolver from "./ExtensionResolver/FloatTextureExtensionResolver";
import JThreeObject from "../../../Base/JThreeObject";
/**
 * Provides the feature to require gl extension.
 */
class GLExtensionRegistory extends JThreeObject {
    constructor(...args) {
        super(...args);
        this.extensions = {};
    }
    checkExtensions(gl) {
        for (let extName in GLExtensionRegistory.requiredExtensions) {
            this.extensions[extName] = GLExtensionRegistory.requiredExtensions[extName].request(gl);
        }
    }
}
GLExtensionRegistory.requiredExtensions = {
    "OES_texture_float": new FloatTextureExtensionResolver(),
    "OES_element_index_uint": new UintIndexExtensionResolver(),
    "WEBGL_depth_texture": new DepthTextureExtensionResolver(),
    "WEBGL_color_buffer_float": new ColorBufferFloatExtensionResolver()
};
export default GLExtensionRegistory;
