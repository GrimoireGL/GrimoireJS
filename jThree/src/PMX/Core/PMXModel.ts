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

  public static LoadFromUrl(url: string): Q.Promise<PMXModel> {
    var d = Q.defer<PMXModel>();
    var targetUrl = url;
    var targetDirectory = targetUrl.substr(0, targetUrl.lastIndexOf("/") + 1);
    var oReq = new XMLHttpRequest();
    oReq.open("GET", targetUrl, true);
    oReq.setRequestHeader("Accept", "*/*");
    oReq.responseType = "arraybuffer";
    oReq.onload = () => {
      var pmx = new PMXModelData(oReq.response);
      var model = new PMXModel(pmx, targetDirectory);
      if (model.loaded) d.resolve(model);
      else {
        model.onload.addListener(() => {
          d.resolve(model);
        })
      }
    };
    oReq.send(null);
    return d.promise;
  }

    private modelData: PMXModelData;

    public skeleton: PMXSkeleton;

    private morphManager: PMXMorphManager;

    private materialDictionary: {[materialName:string]:PMXMaterial}= {};

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

    public onload: JThreeEvent<PMXModel> = new JThreeEvent<PMXModel>();

    public loaded: boolean = false;

    constructor(pmx: PMXModelData, resourceDirectory: string) {
        super();
        PMXCoreInitializer.init();
        this.onload.addListener(() => { this.loaded = true });
        this.modelData = pmx;
        this.modelDirectory = resourceDirectory;
        this.pmxTextureManager = new PMXTextureManager(this);
        this.geometry = new PMXGeometry(pmx);
        this.skeleton = new PMXSkeleton(this);
        this.pmxMaterials = new Array(pmx.Materials.length);
        this.name = pmx.Header.modelName;
        var offset = 0;
        for (var materialCount = 0; materialCount < pmx.Materials.length; materialCount++) {
            var currentMat = pmx.Materials[materialCount];
            var mat = new PMXMaterial(this, materialCount, offset);
            this.addMaterial(mat);
            this.addMaterial(new PMXPrimaryBufferMaterial(mat));
            this.addMaterial(new PMXShadowMapMaterial(mat));
            this.addMaterial(new PMXHitAreaMaterial(mat));
            this.pmxMaterials[materialCount] = mat;
            this.materialDictionary[currentMat.materialName] =  mat;
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
