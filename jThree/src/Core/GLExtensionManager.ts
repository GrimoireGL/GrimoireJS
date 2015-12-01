import JThreeObject = require("../Base/JThreeObject");
import AssociativeArray = require("../Base/Collections/AssociativeArray");
import JThreeLogger = require("../Base/JThreeLogger");
import GLExtensionList = require("./GLExtensionList");
/**
 * Provides the feature to require gl extension.
 */
class GLExtensionManager extends JThreeObject {
    private requiredExtensions =
    [
        GLExtensionList.ElementIndexUint,
        GLExtensionList.TextureFloat,
        GLExtensionList.TextureFilterAnisotropic,
        GLExtensionList.VertexArrayObject];

    private extensions: AssociativeArray<any> = new AssociativeArray<any>();

    constructor() {
        super();
    }

    public checkExtensions(context: WebGLRenderingContext) {
        for (var i = 0; i < this.requiredExtensions.length; i++) {
            var element = this.requiredExtensions[i];
            var ext;
            if (typeof element === "string") {
                ext = context.getExtension(element);
            } else {
                //Assume type of element is array
                for (var j = 0; j < element.length; j++) {
                    ext = context.getExtension(element[j]);
                    if (ext) break;
                }
            }
            if (!ext) {
                JThreeLogger.sectionError('GL Extension', `WebGL Extension:${element} was requested,but your browser is not supporting this feature.`);
            } else {
                JThreeLogger.sectionLog("GL Extension", `${element} was instanciated successfully`);
                this.extensions.set(element, ext);
            }
        }
    }

    public getExtension(extName: string): any {
        return this.extensions.get(extName);
    }

    public hasExtension(extName: string): boolean {
        return this.extensions.has(extName);
    }

}
export = GLExtensionManager;
