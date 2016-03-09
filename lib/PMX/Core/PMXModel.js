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
    constructor(pmx, resourceDirectory) {
        super();
        this.loadingTextureCount = 0;
        this.loadedTextureCount = 0;
        this.loaded = false;
        this._materialDictionary = {};
        PMXCoreInitializer.init();
        this.on("load", () => { this.loaded = true; });
        this._modelData = pmx;
        this.modelDirectory = resourceDirectory;
        this.pmxTextureManager = new PMXTextureManager(this);
        this.__geometry = new PMXGeometry(pmx);
        this.skeleton = new PMXSkeleton(this);
        this._pmxMaterials = new Array(pmx.Materials.length);
        this.name = pmx.Header.modelName;
        let offset = 0;
        for (let materialCount = 0; materialCount < pmx.Materials.length; materialCount++) {
            const currentMat = pmx.Materials[materialCount];
            const mat = new PMXMaterial(this, materialCount, offset);
            this.addMaterial(mat);
            this.addMaterial(new PMXPrimaryBufferMaterial(mat));
            this.addMaterial(new PMXShadowMapMaterial(mat));
            this.addMaterial(new PMXHitAreaMaterial(mat));
            this._pmxMaterials[materialCount] = mat;
            this._materialDictionary[currentMat.materialName] = mat;
            offset += currentMat.vertexCount;
        }
        this._morphManager = new PMXMorphManager(this);
    }
    static loadFromUrl(url) {
        const directory = url.substr(0, url.lastIndexOf("/") + 1);
        return PMXModel._loadDataFromUrl(url, directory).then((modelData) => {
            const deferred = Q.defer();
            const model = new PMXModel(modelData, directory);
            if (model.loaded) {
                process.nextTick(() => {
                    deferred.resolve(model);
                });
            }
            else {
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
    static _loadDataFromUrl(url, directory) {
        return PMXModel._asyncLoader.fetch(url, (path) => {
            const deferred = Q.defer();
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
    getPMXMaterialByName(name) {
        return this._materialDictionary[name];
    }
    getPMXMaterialByIndex(index) {
        return this._pmxMaterials[index];
    }
    get ModelData() {
        return this._modelData;
    }
    get Materials() {
        return this._pmxMaterials;
    }
    get MorphManager() {
        return this._morphManager;
    }
    update() {
        this._morphManager.applyMorph();
        this.skeleton.updateMatricies();
    }
}
PMXModel._asyncLoader = new AsyncLoader();
export default PMXModel;
