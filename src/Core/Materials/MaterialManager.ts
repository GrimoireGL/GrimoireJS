import GLExtensionConditionChecker from "../ProgramTransformer/GLExtensionRegistoryConditionChecker";
import ImportTransformer from "../ProgramTransformer/Transformer/ImportTransformer";
import BasicRegisterer from "../Pass/Registerer/BasicRegisterer";
import RegistererBase from "../Pass/Registerer/RegistererBase";
import StageDescriptionRegisterer from "../Pass/Registerer/StageDescriptionRegisterer";
import BasicMaterial from "./BasicMaterial";
import ProgramTranspiler from "../ProgramTransformer/ProgramTranspiler";
import IContextComponent from "../../IContextComponent";
import ContextComponents from "../../ContextComponents";
import BufferRegisterer from "../Pass/Registerer/BufferRegisterer";
import TimeRegisterer from "../Pass/Registerer/TimeRegisterer";
import BasicCacheResolver from "../Resources/BasicCacheResolver";
import IConditionChecker from "../ProgramTransformer/Base/IConditionChecker";
import IConditionRegister from "../ProgramTransformer/Base/IConditionRegister";
import Q from "q";
/**
 * A ContextComponent provides the feature to manage materials.
 * @type {[type]}
 */
class MaterialManager implements IContextComponent, IConditionRegister {

  public conditionRegistered: boolean = false;

  private _uniformRegisters: { [key: string]: new () => RegistererBase } = {};

  private _materialDocuments: { [key: string]: string } = {};

  private _chunkLoader: BasicCacheResolver<string> = new BasicCacheResolver<string>();

  private _conditionCheckers: { [key: string]: IConditionChecker } = {};


  constructor() {
    this.addShaderChunk("builtin.packing", require("./BuiltIn/Chunk/_Packing.glsl"));
    this.addShaderChunk("builtin.gbuffer-packing", require("./BuiltIn/GBuffer/_GBufferPacking.glsl"));
    this.addShaderChunk("jthree.builtin.vertex", require("./BuiltIn/Vertex/_BasicVertexTransform.glsl"));
    this.addShaderChunk("jthree.builtin.shadowfragment", require("./BuiltIn/ShadowMap/_ShadowMapFragment.glsl"));
    this.addShaderChunk("builtin.gbuffer-reader", require("./BuiltIn/Light/Chunk/_LightAccumulation.glsl"));
    this.addUniformRegister(BasicRegisterer);
    this.addUniformRegister(TimeRegisterer);
    // this.addUniformRegister(TextureRegister);
    this.addUniformRegister(BufferRegisterer);
    this.addUniformRegister(StageDescriptionRegisterer);
    this.registerMaterial(require("./BuiltIn/Materials/Phong.xmml"));
    this.registerMaterial(require("./BuiltIn/Materials/SolidColor.xmml"));
    this.registerCondition("gl-extension", new GLExtensionConditionChecker());
  }

  public getContextComponentIndex(): number {
    return ContextComponents.MaterialManager;
  }

  /**
   * Add shader chunk code to be stored.
   * @param {string} key shader chunk key
   * @param {string} val shader chunk code
   */
  public addShaderChunk(key: string, val: string): void {
    this._chunkLoader.pushLoaded(key, ProgramTranspiler.parseInternalImport(val, this));
  }

  public loadChunks(srcs: string[]): Promise<string[]> {
    return Promise.all<string>(srcs.map(src => this._loadChunk(src)));
  }



  /**
   * Get shader chunk code from storage
   * @param  {string} key shader chunk key
   * @return {string}     stored shader chunk code
   */
  public getShaderChunk(key: string): string {
    return this._chunkLoader.fromCache(key);
  }

  public addUniformRegister(registerer: new () => RegistererBase): void {
    this._uniformRegisters[registerer.prototype["getName"]() as string] = registerer;
  }

  public getUniformRegister(key: string): new () => RegistererBase {
    return this._uniformRegisters[key];
  }

  /**
   * Register material document(XMML) in material manager
   * @param {string} matDocument Raw xmml parsable string
   * @return {string}             material tag's name attribute
   */
  public registerMaterial(matDocument: string): string {

    const dom = (new DOMParser()).parseFromString(matDocument, "text/xml");
    const matTag = dom.querySelector("material");
    const matName = matTag.getAttribute("name");
    if (!matName) {
      console.error("Material name is required attribute,but name was not specified!");
    } else {
      this._materialDocuments[matName] = matDocument;
    }
    return matName;
  }

  public registerCondition(type: string, checker: IConditionChecker): void {
    this._conditionCheckers[type] = checker;
  }
  public getConditionChecker(type: string): IConditionChecker {
    return this._conditionCheckers[type];
  }
  /**
   * Construct BasicMaterial instance with registered xmml
   * @param  {string}        matName name of the xmml
   * @return {BasicMaterial}         [description]
   */
  public constructMaterial(matName: string): BasicMaterial {
    const matDoc = this._materialDocuments[matName];
    if (!matDoc) {
      // console.error(`Specified material name '${matName}' was not found!`);
      return undefined;
    } else {
      return new BasicMaterial(matDoc, matName);
    }
  }

  private _loadChunk(src: string): Q.IPromise<string> {
    return this._chunkLoader.fetch(src, (absPath) => {
      const deferred = Q.defer<string>();
      const xhr = new XMLHttpRequest();
      xhr.open("GET", absPath, true);
      xhr.setRequestHeader("Accept", "text");
      xhr.onload = () => {
        this.loadChunks(ImportTransformer.getImports(xhr.responseText));
        ImportTransformer.parseImport(xhr.responseText).then((source) => {
          deferred.resolve(source);
        });
      };
      xhr.onerror = (err) => {
        deferred.reject(err);
      };
      xhr.send(null);
      return deferred.promise;
    });
  }
}

export default MaterialManager;
