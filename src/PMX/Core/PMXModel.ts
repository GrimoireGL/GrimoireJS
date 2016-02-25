import AsyncLoader from "../../Core/Resources/AsyncLoader";
import PMXPrimaryBufferMaterial from "./Materials/PMXPrimaryBufferMaterial";
import PMXCoreInitializer from "./PMXCoreInitializer";
import PMXHitAreaMaterial from "./Materials/PMXHitAreaMaterial";
import SceneObject from "../../Core/SceneObjects/SceneObject";
import PMXModelData from "../PMXData";
import PMXGeometry from "./PMXGeometry";
import PMXMaterial from "./Materials/PMXMaterial";
import PMXSkeleton from "./PMXSkeleton";
import PMXMorphManager from "./PMXMorphManager";
import PMXShadowMapMaterial from "./Materials/PMXShadowMapMaterial";
import PMXTextureManager from "./PMXTextureManager";
import Q from "q";
class PMXModel extends SceneObject {

  private static _asyncLoader: AsyncLoader<PMXModelData> = new AsyncLoader<PMXModelData>();

  public skeleton: PMXSkeleton;

  public loadingTextureCount: number = 0;

  public loadedTextureCount: number = 0;

  public pmxTextureManager: PMXTextureManager;

  public modelDirectory: string;

  public loaded: boolean = false;

  private morphManager: PMXMorphManager;

  private materialDictionary: { [materialName: string]: PMXMaterial } = {};

  private pmxMaterials: PMXMaterial[];

  private modelData: PMXModelData;


  constructor(pmx: PMXModelData, resourceDirectory: string) {
    super();
    PMXCoreInitializer.init();
    this.on("load", () => { this.loaded = true; });
    this.modelData = pmx;
    this.modelDirectory = resourceDirectory;
    this.pmxTextureManager = new PMXTextureManager(this);
    this.__geometry = new PMXGeometry(pmx);
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

  public static LoadFromUrl(url: string): Q.IPromise<PMXModel> {
    const directory = url.substr(0, url.lastIndexOf("/") + 1);
    return PMXModel._loadDataFromUrl(url, directory).then<PMXModel>((modelData) => {
      const deferred = Q.defer<PMXModel>();
      const model = new PMXModel(modelData, directory);
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
  private static _loadDataFromUrl(url: string, directory: string): Q.IPromise<PMXModelData> {
    return PMXModel._asyncLoader.fetch(url, (path) => {
      const deferred = Q.defer<PMXModelData>();
      const xhr = new XMLHttpRequest();
      xhr.open("GET", path, true);
      xhr.setRequestHeader("Accept", "*/*");
      xhr.responseType = "arraybuffer";
      xhr.onload = () => {
        const pmx = new PMXModelData(xhr.response, directory);
        deferred.resolve(pmx);
      };
      xhr.onerror = (err) => {
        deferred.reject(err);
      };
      xhr.send(null);
      return deferred.promise;
    });
  }

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

  public update() {
    this.morphManager.applyMorph();
    this.skeleton.updateMatricies();
  }
}

export default PMXModel;
