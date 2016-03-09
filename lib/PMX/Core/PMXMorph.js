class PMXMorph {
    constructor(pmxModel, index, morphManager) {
        this._progress = 0;
        this._progressCurrentCache = 0;
        this.__model = pmxModel;
        this.__morphIndex = index;
        this.__morphManager = morphManager;
    }
    static createMorph(model, index, morphManager) {
        const morphData = model.ModelData.Morphs[index];
        switch (morphData.morphKind) {
            case 0:
                return new PMXGroupMorph(model, index, morphManager);
            case 1:
                return new PMXVertexMorph(model, index, morphManager);
            case 3:
                return new PMXUVMorph(model, index, morphManager);
            case 8:
                return new PMXMaterialMorph(model, index, morphManager);
            default:
                return null;
        }
    }
    static postProcess(model, morphType) {
        switch (morphType) {
            case 1:
                PMXVertexMorph.postProcess(model);
                return;
            case 2:
                PMXUVMorph.postProcess(model);
                return;
        }
    }
    get Progress() {
        return this._progress;
    }
    set Progress(val) {
        if (this._progressCurrentCache !== val) {
            this._progressCurrentCache = val;
        }
    }
    get MorphName() {
        return this.TargetMorphData.morphName;
    }
    get TargetMorphData() {
        return this.__model.ModelData.Morphs[this.__morphIndex];
    }
    update() {
        if (this._progress !== this._progressCurrentCache) {
            this.__updateProgress(this._progressCurrentCache, this._progress);
            this._progress = this._progressCurrentCache;
            this.__morphManager.postProcessFlag[this.TargetMorphData.morphKind] = true;
        }
    }
}
class PMXVertexMorph extends PMXMorph {
    static postProcess(model) {
        model.Geometry.updatePositionBuffer();
    }
    __updateProgress(current, last) {
        const ratio = current - last;
        for (let i = 0; i < this.TargetMorphData.morphOffsetCount; ++i) {
            const vm = this.TargetMorphData.vertexMorph[i];
            this.__model.Geometry.positionBuferSource[3 * vm.vertexIndex + 0] += vm.vertexOffset[0] * ratio;
            this.__model.Geometry.positionBuferSource[3 * vm.vertexIndex + 1] += vm.vertexOffset[1] * ratio;
            this.__model.Geometry.positionBuferSource[3 * vm.vertexIndex + 2] += vm.vertexOffset[2] * ratio;
        }
    }
}
class PMXUVMorph extends PMXMorph {
    static postProcess(model) {
        model.Geometry.updateUVBuffer();
    }
    __updateProgress(current, last) {
        const ratio = current - last;
        for (let i = 0; i < this.TargetMorphData.morphOffsetCount; ++i) {
            const vm = this.TargetMorphData.uvMorph[i];
            this.__model.Geometry.uvBufferSource[3 * vm.vertexIndex + 0] += vm.uvOffset[0] * ratio;
            this.__model.Geometry.uvBufferSource[3 * vm.vertexIndex + 1] += vm.uvOffset[1] * ratio;
            this.__model.Geometry.uvBufferSource[3 * vm.vertexIndex + 2] += vm.uvOffset[2] * ratio;
        }
    }
}
class PMXGroupMorph extends PMXMorph {
    __updateProgress(current, last) {
        const ratio = current - last;
        for (let i = 0; i < this.TargetMorphData.morphOffsetCount; ++i) {
            const vm = this.TargetMorphData.groupMorph[i];
            const m = this.__morphManager.getMorphByIndex(vm.morphIndex);
            if (m) {
                m.Progress += ratio * vm.morphRate;
            }
        }
    }
}
class PMXMaterialMorph extends PMXMorph {
    __updateProgress(current, last) {
        const ratio = current - last;
        for (let i = 0; i < this.TargetMorphData.morphOffsetCount; ++i) {
            const vm = this.TargetMorphData.materialMorph[i];
            let targetMaterials;
            if (vm.materialIndex === -1) {
                targetMaterials = this.__model.Materials;
            }
            else {
                targetMaterials = [this.__model.getPMXMaterialByIndex(vm.materialIndex)];
            }
            for (let j = 0; j < targetMaterials.length; j++) {
                const targetMaterial = targetMaterials[j];
                const target = vm.operationType === 1 ? targetMaterial.addMorphParam : targetMaterial.mulMorphParam;
                target.edgeSize += ratio * (vm.edgeSize + vm.operationType - 1);
                this._assignMorphValues(3, target.ambient, vm.ambient, ratio, vm.operationType);
                this._assignMorphValues(4, target.diffuse, vm.diffuse, ratio, vm.operationType);
                this._assignMorphValues(4, target.specular, vm.specular, ratio, vm.operationType);
                this._assignMorphValues(4, target.edgeColor, vm.edgeColor, ratio, vm.operationType);
                this._assignMorphValues(4, target.textureCoeff, vm.textureCoefficient, ratio, vm.operationType);
                this._assignMorphValues(4, target.sphereCoeff, vm.sphereTextureCoefficient, ratio, vm.operationType);
                this._assignMorphValues(4, target.toonCoeff, vm.toonTextureCoefficient, ratio, vm.operationType);
            }
        }
    }
    _assignMorphValues(vecLength, target, morphValues, ratio, opType) {
        for (let i = 0; i < vecLength; i++) {
            target[i] += ratio * (morphValues[i] + opType - 1);
        }
    }
}
export default PMXMorph;
