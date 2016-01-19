import PMXPrimaryBufferMaterial = require("./Materials/PMXPrimaryBufferMaterial");
import PMXCoreInitializer = require("./PMXCoreInitializer");
import PMXHitAreaMaterial = require("./Materials/PMXHitAreaMaterial");
import SceneObject = require("../../Core/SceneObject");
import PMXModelData = require("../PMXLoader");
import PMXGeometry = require("./PMXGeometry");
import PMXMaterial = require("./Materials/PMXMaterial");
import PMXSkeleton = require("./PMXSkeleton");
import PMXMorphManager = require("./PMXMorphManager");
import PMXShadowMapMaterial = require("./Materials/PMXShadowMapMaterial");
import JThreeEvent = require("../../Base/JThreeEvent");
import PMXTextureManager = require("./PMXTextureManager");
import Q = require("q");
class PMXModel extends SceneObject {

  private static _modelDataCache: { [absUrl: string]: PMXModelData|Q.IPromise<PMXModelData> } = {};

  public static LoadFromUrl(url: string): Q.IPromise<PMXModel> {
    const targetDirectory = url.substr(0, url.lastIndexOf("/") + 1);
    return PMXModel._loadDataFromUrl(url).then<PMXModel>((modelData) => {
      const deferred = Q.defer<PMXModel>();
      const model = new PMXModel(modelData, targetDirectory);
      if (model.loaded) {
        process.nextTick(() => {
          deferred.resolve(model);
        });
      } else {
        model.on("load", () => {
          deferred.resolve(model);
        });
      }
      return deferred.promise;
    }, (err) => {
        return err;
      });
  }
  /**
   * Request model data to specified url.
   * @param  {string}                   url the url pmx model being placed.
   * @return {Q.IPromise<PMXModelData>}     the promise object for loading.
   */
  private static _loadDataFromUrl(url: string): Q.IPromise<PMXModelData> {
    const absUrl = PMXModel._getAbsolutePath(url); // transform the path for absolute path to be unique string
    const deferred = Q.defer<PMXModelData>();
    if (PMXModel._modelDataCache[absUrl]) { // When something is stored in the cache
      if (typeof PMXModel._modelDataCache[absUrl]["then"] === "undefined") { // assume there was completely loaded model data in the cache
        process.nextTick(() => {
          deferred.resolve(<PMXModelData>PMXModel._modelDataCache[absUrl]);
        });
      } else { // assume the model data is now under loading
        return <Q.IPromise<PMXModelData>>PMXModel._modelDataCache[absUrl];
      }
    } else { // When new request is needed to populate
      const oReq = new XMLHttpRequest(); // use xhr since superagent is not supporting responseType property
      oReq.open("GET", absUrl, true);
      oReq.setRequestHeader("Accept", "*/*");
      oReq.responseType = "arraybuffer";
      oReq.onload = () => {
        const pmx = new PMXModelData(oReq.response);
        PMXModel._modelDataCache[absUrl] = pmx;
        deferred.resolve(pmx);
      };
      oReq.send(null);
      PMXModel._modelDataCache[absUrl] = deferred.promise;
    }
    return deferred.promise;
  }

  /**
   * Convert relative path to absolute path
   * @param  {string} relative relative path to be converted
   * @return {string}          converted absolute path
   */
  private static _getAbsolutePath(relative: string): string {
    const aElem = document.createElement("a");
    aElem.href = relative;
    return aElem.href;
  }

  private modelData: PMXModelData;

  public skeleton: PMXSkeleton;

  private morphManager: PMXMorphManager;

  private materialDictionary: { [materialName: string]: PMXMaterial } = {};

  private pmxMaterials: PMXMaterial[];

  public loadingTextureCount: number = 0;

  public loadedTextureCount: number = 0;

  public pmxTextureManager: PMXTextureManager;

  public modelDirectory: string;

  public getPMXMaterialByName(name: string) {
    return this.materialDictionary[name];
  }

  public getPMXMaterialByIndex(index: number) {
    return this.pmxMaterials[index];
  }

  public get ModelData(): PMXModelData {
    return this.modelData;
  }


  public get Materials(): PMXMaterial[] {
    return this.pmxMaterials;
  }

  public get MorphManager(): PMXMorphManager {
    return this.morphManager;
  }

  public loaded: boolean = false;

  constructor(pmx: PMXModelData, resourceDirectory: string) {
    super();
    PMXCoreInitializer.init();
    this.on("load", () => { this.loaded = true });
    this.modelData = pmx;
    this.modelDirectory = resourceDirectory;
    this.pmxTextureManager = new PMXTextureManager(this);
    this.geometry = new PMXGeometry(pmx);
    this.skeleton = new PMXSkeleton(this);
    this.pmxMaterials = new Array(pmx.Materials.length);
    this.name = pmx.Header.modelName;
    let offset = 0;
    for (let materialCount = 0; materialCount < pmx.Materials.length; materialCount++) {
      const currentMat = pmx.Materials[materialCount];
      const mat = new PMXMaterial(this, materialCount, offset);
      this.addMaterial(mat);
      this.addMaterial(new PMXPrimaryBufferMaterial(mat));
      this.addMaterial(new PMXShadowMapMaterial(mat));
      this.addMaterial(new PMXHitAreaMaterial(mat));
      this.pmxMaterials[materialCount] = mat;
      this.materialDictionary[currentMat.materialName] = mat;
      offset += currentMat.vertexCount;
    }
    this.morphManager = new PMXMorphManager(this);
  }

  public update() {
    this.morphManager.applyMorph();
    this.skeleton.updateMatricies();
  }
}

export = PMXModel;
