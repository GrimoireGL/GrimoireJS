import SceneObject = require('../../Core/SceneObject');
import PMXModelData = require('../PMXLoader');
import PMXGeometry = require('./PMXGeometry');
import PMXMaterial = require('./PMXMaterial');
import Delegates = require('../../Base/Delegates');
import PMXSkeleton = require('./PMXSkeleton');
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
                        var model = new PMXModel(pmx, targetDirectory);
                        onComplete(model);
                };
                oReq.send(null);
        }

        private modelData: PMXModelData;

        private skeleton: PMXSkeleton;

        public get ModelData(): PMXModelData {
                return this.modelData;
        }

        public get Skeleton(): PMXSkeleton {
                return this.skeleton;
        }

        constructor(pmx: PMXModelData, resourceDirectory: string) {
                super();
                this.modelData = pmx;
                this.geometry = new PMXGeometry(pmx);
                this.skeleton = new PMXSkeleton(this);
                var offset = 0;
                for (var materialCount = 0; materialCount < pmx.Materials.length; materialCount++) {
                        var currentMat = pmx.Materials[materialCount];
                        this.addMaterial(new PMXMaterial(pmx, materialCount, offset, resourceDirectory));
                        offset += currentMat.vertexCount;
                }
        }
}

export =PMXModel;