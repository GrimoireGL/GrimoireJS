import UniformRegisterBase = require("../Registers/UniformRegisterBase");
import XMMLParser = require("./XMMLParser");
import IContextComponent = require("../../../IContextComponent");
import ContextComponents = require("../../../ContextComponents");
import Delegates = require("../../../Base/Delegates");
import BasicMaterixRegister = require("../Registers/BasicMatrixRegister");
/**
 * A ContextComponent provides the feature to manage materials.
 * @type {[type]}
 */
class MaterialManager implements IContextComponent
{
  constructor()
  {
    this.addShaderChunk("jthree.builtin.vertex",require("../BuiltIn/Vertex/_BasicVertexTransform.glsl"));
    this.addUniformRegister("jthree.basic.matrix",BasicMaterixRegister);
  }

  public getContextComponentIndex():number
  {
    return ContextComponents.MaterialManager;
  }

  /**
   * Registered shader chunk storage
   */
  private _shaderChunks:{[key:string]:string} = {};

  private _uniformRegisters:{[key:string]:any} ={};

  /**
   * Add shader chunk code to be stored.
   * @param {string} key shader chunk key
   * @param {string} val shader chunk code
   */
  public addShaderChunk(key:string,val:string):void
  {
    this._shaderChunks[key] = XMMLParser.parseImport(val,this);
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

  public addUniformRegister(key:string,register:any)
  {
    this._uniformRegisters[key] = register;
  }

  public getUniformRegister(key:string):any
  {
    return this._uniformRegisters[key];
  }

}

export = MaterialManager;
