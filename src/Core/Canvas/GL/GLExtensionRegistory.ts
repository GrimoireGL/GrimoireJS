import ColorBufferFloatExtensionResolver from "./ExtensionResolver/ColorBufferFloatExtensionResolver";
import DepthTextureExtensionResolver from "./ExtensionResolver/DepthTextureExtensionResolver";
import UintIndexExtensionResolver from "./ExtensionResolver/UintIndexExtensionResolver";
import FloatTextureExtensionResolver from "./ExtensionResolver/FloatTextureExtensionResolver";
import ExtensionResolverBase from "./ExtensionResolver/ExtensionResolverBase";
import JThreeObject from "../../../Base/JThreeObject";

/**
 * Provides the feature to require gl extension.
 */
class GLExtensionRegistory extends JThreeObject {
  public static requiredExtensions: { [key: string]: ExtensionResolverBase } = {
    "OES_texture_float": new FloatTextureExtensionResolver(),
    "OES_element_index_uint": new UintIndexExtensionResolver(),
    "WEBGL_depth_texture": new DepthTextureExtensionResolver(),
    "WEBGL_color_buffer_float": new ColorBufferFloatExtensionResolver()
  };

  public extensions: { [key: string]: any } = {};

  public checkExtensions(gl: WebGLRenderingContext): void {
    for (let extName in GLExtensionRegistory.requiredExtensions) {
      this.extensions[extName] = GLExtensionRegistory.requiredExtensions[extName].request(gl);
    }
  }
}
export default GLExtensionRegistory;
