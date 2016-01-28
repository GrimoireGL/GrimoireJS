import JThreeObject from "../Base/JThreeObject";
import JThreeLogger from "../Base/JThreeLogger";
import GLExtensionList from "./GLExtensionList";
/**
 * Provides the feature to require gl extension.
 */
class GLExtensionResolver extends JThreeObject {
  private requiredExtensions =
  [
    GLExtensionList.ElementIndexUint,
    GLExtensionList.TextureFloat,
    GLExtensionList.TextureFilterAnisotropic,
    GLExtensionList.VertexArrayObject];

  private extensions: { [key: string]: any } = {};

  constructor() {
    super();
  }

  public checkExtensions(context: WebGLRenderingContext) {
    for (let i = 0; i < this.requiredExtensions.length; i++) {
      const element = this.requiredExtensions[i];
      let ext;
      if (typeof element === "string") {
        ext = context.getExtension(element);
      } else {
        // Assume type of element is array
        for (let j = 0; j < element.length; j++) {
          ext = context.getExtension(element[j]);
          if (ext) {
            break;
          }
        }
      }
      if (!ext) {
        JThreeLogger.sectionError("GL Extension", `WebGL Extension:${element} was requested,but your browser is not supporting this feature.`);
      } else {
        JThreeLogger.sectionLog("GL Extension", `${element} was instanciated successfully`);
        this.extensions[element] = ext;
      }
    }
  }

  public getExtension(extName: string): any {
    return this.extensions[extName];
  }

  public hasExtension(extName: string): boolean {
    return this.extensions[extName];
  }

}
export default GLExtensionResolver;
