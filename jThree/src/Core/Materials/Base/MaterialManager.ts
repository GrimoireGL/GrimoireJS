import ShaderProgramParser = require("./ShaderProgramParser");
import IContextComponent = require("../../../IContextComponent");
import ContextComponents = require("../../../ContextComponents");
/**
 * A ContextComponent provides the feature to manage materials.
 * @type {[type]}
 */
class MaterialManager implements IContextComponent
{
  constructor()
  {
    this.addShaderChunk("jthree.builtin.vertex",require("../BuiltIn/Vertex/_BasicVertexTransform.glsl"));
  }

  public getContextComponentIndex():number
  {
    return ContextComponents.MaterialManager;
  }

  /**
   * Registered shader chunk storage
   */
  private _shaderChunks:{[key:string]:string} = {};

  /**
   * Add shader chunk code to be stored.
   * @param {string} key shader chunk key
   * @param {string} val shader chunk code
   */
  public addShaderChunk(key:string,val:string):void
  {
    this._shaderChunks[key] = ShaderProgramParser.parseImport(val,this);
  }

  /**
   * Get shader chunk code from storage
   * @param  {string} key shader chunk key
   * @return {string}     stored shader chunk code
   */
  public getShaderChunk(key:string):string
  {
    return this._shaderChunks[key];
  }

}

export = MaterialManager;
