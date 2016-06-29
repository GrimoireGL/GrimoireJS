import MaterialManager from "../../Core/Materials/MaterialManager";
/**
 * Provide initializing methods for PMX.
 * @type {[type]}
 */
class PMXCoreInitializer {
  private static _initialized: boolean = false;

  public static init(): void {
    if (PMXCoreInitializer._initialized) {
      return;
    }

    PMXCoreInitializer._registerShaderChunk();
    PMXCoreInitializer._initialized = true;
  }

  private static _registerShaderChunk(): void {
    MaterialManager.addShaderChunk("jthree.pmx.vertex", require("../ShaderChunk/_PMXVertexShader.glsl"));
  }
}
export default PMXCoreInitializer;
