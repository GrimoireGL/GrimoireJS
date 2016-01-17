import JThreeContext = require("../../JThreeContext");
import MaterialManager = require("../../Core/Materials/Base/MaterialManager");
import ContextComponents = require("../../ContextComponents");
/**
 * Provide initializing methods for PMX.
 * @type {[type]}
 */
class PMXCoreInitializer
{
  private static _initialized = false;

  public static init()
  {
    if(PMXCoreInitializer._initialized)return;

    PMXCoreInitializer._registerShaderChunk();
    PMXCoreInitializer._initialized = true;
  }

  private static _registerShaderChunk()
  {
    const mm = JThreeContext.getContextComponent<MaterialManager>(ContextComponents.MaterialManager);
    mm.addShaderChunk("jthree.pmx.vertex",require("../ShaderChunk/_PMXVertexShader.glsl"));
  }
}
export = PMXCoreInitializer;
