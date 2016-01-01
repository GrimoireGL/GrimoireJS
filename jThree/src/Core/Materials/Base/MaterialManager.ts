import BasicMaterial = require("./BasicMaterial");
import ProgramWrapper = require("../../Resources/Program/ProgramWrapper");
import IVariableInfo = require("./IVariableInfo");
import IMaterialConfigureArgument = require("./IMaterialConfigureArgument");
import XMMLShaderParser = require("./XMMLShaderParser");
import IContextComponent = require("../../../IContextComponent");
import ContextComponents = require("../../../ContextComponents");
import Delegates = require("../../../Base/Delegates");
import BasicMatrixRegisterer = require("./Registerer/BasicMatrixReisterer");
import LightBufferRegisterer = require("./Registerer/LightBufferRegisterer");
import TimeRegisterer = require("./Registerer/TimeRegisterer");
/**
 * A ContextComponent provides the feature to manage materials.
 * @type {[type]}
 */
class MaterialManager implements IContextComponent {
    constructor() {
        this.addShaderChunk("jthree.builtin.vertex", require("../BuiltIn/Vertex/_BasicVertexTransform.glsl"));
        this.addShaderChunk("jthree.builtin.shadowfragment",require("../BuiltIn/ShadowMap/_ShadowMapFragment.glsl"));
        this.addUniformRegister("jthree.basic.matrix",BasicMatrixRegisterer);
        this.addUniformRegister("jthree.basic.light",LightBufferRegisterer);
        this.addUniformRegister("jthree.basic.time",TimeRegisterer);
        this.registerMaterial(require("../BuiltIn/Materials/Phong.html"));
    }

    public getContextComponentIndex(): number {
        return ContextComponents.MaterialManager;
    }

    /**
     * Registered shader chunk storage
     */
    private _shaderChunks: { [key: string]: string } = {};

    private _uniformRegisters: { [key: string]: Delegates.Action4<WebGLRenderingContext, ProgramWrapper, IMaterialConfigureArgument, {[key:string]:IVariableInfo}> } = {};

    private _materialDocuments:{[key:string]:string} = {};

    /**
     * Add shader chunk code to be stored.
     * @param {string} key shader chunk key
     * @param {string} val shader chunk code
     */
    public addShaderChunk(key: string, val: string): void {
        this._shaderChunks[key] = XMMLShaderParser.parseImport(val, this);
    }

    /**
     * Get shader chunk code from storage
     * @param  {string} key shader chunk key
     * @return {string}     stored shader chunk code
     */
    public getShaderChunk(key: string): string {
        return this._shaderChunks[key];
    }

    public addUniformRegister(key: string, register: Delegates.Action4<WebGLRenderingContext, ProgramWrapper, IMaterialConfigureArgument, {[key:string]:IVariableInfo}>) {
        this._uniformRegisters[key] = register;
    }

    public getUniformRegister(key: string): any {
        return this._uniformRegisters[key];
    }

    /**
     * Register material document(XMML) in material manager
     * @param {string} matDocument Raw xmml parsable string
     */
    public registerMaterial(matDocument:string):void
    {
      const dom = (new DOMParser()).parseFromString(matDocument,"text/xml");
      const matTag = dom.querySelector("material");
      const matName = matTag.getAttribute("name");
      if(!matName)
      {
        console.error("Material name is required attribute,but name was not specified!");
      }else{
        this._materialDocuments[matName] = matDocument;
      }
    }
    /**
     * Construct BasicMaterial instance with registered xmml
     * @param  {string}        matName name of the xmml
     * @return {BasicMaterial}         [description]
     */
    public constructMaterial(matName:string):BasicMaterial
    {
      const matDoc = this._materialDocuments[matName];
      if(!matDoc)
      {
        console.error(`Specified material name '${matName}' was not found!`);
        return undefined;
      }else
      {
        return new BasicMaterial(matDoc);
      }
    }
}

export = MaterialManager;
