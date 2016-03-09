import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
/**
 * Provide initializing methods for PMX.
 * @type {[type]}
 */
class PMXCoreInitializer {
    static init() {
        if (PMXCoreInitializer._initialized) {
            return;
        }
        PMXCoreInitializer._registerShaderChunk();
        PMXCoreInitializer._initialized = true;
    }
    static _registerShaderChunk() {
        const mm = JThreeContext.getContextComponent(ContextComponents.MaterialManager);
        mm.addShaderChunk("jthree.pmx.vertex", require("../ShaderChunk/_PMXVertexShader.glsl"));
    }
}
PMXCoreInitializer._initialized = false;
export default PMXCoreInitializer;
