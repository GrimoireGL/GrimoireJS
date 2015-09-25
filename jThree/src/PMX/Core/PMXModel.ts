import SceneObject = require("../../Core/SceneObject");
import PMXModelData = require("../PMXLoader");
import PMXGeometry = require("./PMXGeometry");
import PMXMaterial = require("./PMXMaterial");
import Delegates = require("../../Base/Delegates");
import PMXSkeleton = require("./PMXSkeleton");
import PMXMorphManager = require("./PMXMorphManager");
import AssociativeArray = require("../../Base/Collections/AssociativeArray");
import PMXGBufferMaterial = require("./PMXGBufferMaterial");
import PMXShadowMapMaterial = require("./PMXShadowMapMaterial");
import JThreeEvent = require("../../Base/JThreeEvent");
class PMXModel extends SceneObject {
        public static LoadFromUrl(url: string, onComplete: Delegates.Action1<PMXModel>) {
                var targetUrl = url;
                var targetDirectory = targetUrl.substr(0, targetUrl.lastIndexOf("/") + 1);
                var oReq = new XMLHttpRequest();
                oReq.open("GET", targetUrl, true);
                oReq.setRequestHeader("Accept", "*/*");
                oReq.responseType = "arraybuffer";
                oReq.onload = () => {
                        var pmx = new PMXModelData(oReq.response);
                        var model = new PMXModel(pmx, targetDirectory,onComplete);
                };
                oReq.send(null);
        }

        private modelData: PMXModelData;

        private skeleton: PMXSkeleton;

        private morphManager: PMXMorphManager;

        private materialDictionary: AssociativeArray<PMXMaterial> = new AssociativeArray<PMXMaterial>();

        private pmxMaterials: PMXMaterial[];

        public loadingTextureCount:number=0;

        public loadedTextureCount:number =0;

        public getPMXMaterialByName(name: string) {
                return this.materialDictionary.get(name);
        }

        public getPMXMaterialByIndex(index: number) {
                return this.pmxMaterials[index];
        }

        public get ModelData(): PMXModelData {
                return this.modelData;
        }

        public get Skeleton(): PMXSkeleton {
                return this.skeleton;
        }

        public get Materials(): PMXMaterial[] {
                return this.pmxMaterials;
        }

        public get MorphManager(): PMXMorphManager {
                return this.morphManager;
        }

        public onload:JThreeEvent<PMXModel> = new JThreeEvent<PMXModel>();

        constructor(pmx: PMXModelData, resourceDirectory: string,onComplete?:Delegates.Action1<PMXModel>) {
                super();
                this.modelData = pmx;
                this.geometry = new PMXGeometry(pmx);
                this.skeleton = new PMXSkeleton(this);
                this.pmxMaterials = new Array(pmx.Materials.length);
                this.onload.addListener(onComplete);
                var offset = 0;
                for (var materialCount = 0; materialCount < pmx.Materials.length; materialCount++) {
                        var currentMat = pmx.Materials[materialCount];
                        var mat = new PMXMaterial(this, materialCount, offset, resourceDirectory);
                        this.addMaterial(mat);
                        this.addMaterial(new PMXGBufferMaterial(mat));
                        this.addMaterial(new PMXShadowMapMaterial(mat));
                        this.pmxMaterials[materialCount] = mat;
                        this.materialDictionary.set(currentMat.materialName, mat);
                        offset += currentMat.vertexCount;
                }
                this.morphManager = new PMXMorphManager(this);
        }

        public update() {
                this.morphManager.applyMorph();
                this.skeleton.updateMatricies();
        }
}

export =PMXModel;
