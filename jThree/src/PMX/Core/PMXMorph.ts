import PMXModel = require('./PMXModel');
import PMXSkeleton = require('./PMXSkeleton');
import PMXGeometry = require('./PMXGeometry');
import PMXMorphData = require('../PMXMorph');
import PMXMorphManager = require('./PMXMorphManager');
class PMXMorph {
	public static CreateMorph(model: PMXModel, index: number, morphManager: PMXMorphManager): PMXMorph {
		var morphData = model.ModelData.Morphs[index];
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

	public static PostProcess(model: PMXModel, morphType: number) {
		switch (morphType) {
			case 1:
				PMXVertexMorph.PostProcess(model);
				return;
			case 2:
				PMXUVMorph.PostProcess(model);
				return;
		}
	}

	protected morphManager: PMXMorphManager;
	private progress: number = 0;
	private progressCurrentCache: number = 0;

	public get Progress(): number {
		return this.progress;
	}

	public set Progress(val: number) {
		if (this.progressCurrentCache != val) {
			this.progressCurrentCache = val;
		}
	}

	public get MorphName(): string {
		return this.TargetMorphData.morphName;
	}

	protected model: PMXModel;
	protected morphIndex: number;
	protected get TargetMorphData() {
		return this.model.ModelData.Morphs[this.morphIndex];
	}

	constructor(pmxModel: PMXModel, index: number, morphManager: PMXMorphManager) {
		this.model = pmxModel;
		this.morphIndex = index;
		this.morphManager = morphManager;
	}

	public update() {
		if (this.progress != this.progressCurrentCache) {
			this.updateProgress(this.progressCurrentCache, this.progress);
			this.progress = this.progressCurrentCache;
			this.morphManager.postProcessFlag[this.TargetMorphData.morphKind] = true;
		}
	}

	protected updateProgress(current: number, last: number) {

	}
}

class PMXVertexMorph extends PMXMorph {
	public static PostProcess(model: PMXModel) {
		(<PMXGeometry>model.Geometry).updatePositionBuffer();
	}

	protected updateProgress(current: number, last: number) {
		var ratio = current - last;
		for (var i = 0; i < this.TargetMorphData.morphOffsetCount; ++i) {
			var vm = this.TargetMorphData.vertexMorph[i];
			(<PMXGeometry>this.model.Geometry).positionBuferSource[3 * vm.vertexIndex + 0] += vm.vertexOffset[0] * ratio;
			(<PMXGeometry>this.model.Geometry).positionBuferSource[3 * vm.vertexIndex + 1] += vm.vertexOffset[1] * ratio;
			(<PMXGeometry>this.model.Geometry).positionBuferSource[3 * vm.vertexIndex + 2] += vm.vertexOffset[2] * ratio;
		}
	}
}

class PMXUVMorph extends PMXMorph {
	public static PostProcess(model: PMXModel) {
		(<PMXGeometry>model.Geometry).updateUVBuffer();
	}
	protected updateProgress(current: number, last: number) {
		var ratio = current - last;
		for (var i = 0; i < this.TargetMorphData.morphOffsetCount; ++i) {
			var vm = this.TargetMorphData.uvMorph[i];
			(<PMXGeometry>this.model.Geometry).uvBufferSource[3 * vm.vertexIndex + 0] += vm.uvOffset[0] * ratio;
			(<PMXGeometry>this.model.Geometry).uvBufferSource[3 * vm.vertexIndex + 1] += vm.uvOffset[1] * ratio;
			(<PMXGeometry>this.model.Geometry).uvBufferSource[3 * vm.vertexIndex + 2] += vm.uvOffset[2] * ratio;
		}
	}
}

class PMXGroupMorph extends PMXMorph {
	protected updateProgress(current: number, last: number) {
		var ratio = current - last;
		for (var i = 0; i < this.TargetMorphData.morphOffsetCount; ++i) {
			var vm = this.TargetMorphData.groupMorph[i];
			var m=this.morphManager.getMorphByIndex(vm.morphIndex);
			if(m)m.Progress += ratio * vm.morphRate;
		}
	}
}

class PMXMaterialMorph extends PMXMorph {
	protected updateProgress(current: number, last: number) {

		var ratio = current - last;
		for (var i = 0; i < this.TargetMorphData.morphOffsetCount; ++i) {
			var vm = this.TargetMorphData.materialMorph[i];
			if (vm.materialIndex == -1) {
				var targetMaterials = this.model.Materials;
			} else {
				var targetMaterials = [this.model.getPMXMaterialByIndex(vm.materialIndex)];
			}
			for (var j = 0; j < targetMaterials.length; j++) {
				var targetMaterial = targetMaterials[j];
				var target = vm.operationType == 1 ? targetMaterial.addMorphParam : targetMaterial.mulMorphParam;
				target.edgeSize += ratio * (vm.edgeSize + vm.operationType - 1);
				this.assignMorphValues(3, target.ambient, vm.ambient, ratio, vm.operationType);
				this.assignMorphValues(4, target.diffuse, vm.diffuse, ratio, vm.operationType);
				this.assignMorphValues(4, target.specular, vm.specular, ratio, vm.operationType);
				this.assignMorphValues(4, target.edgeColor, vm.edgeColor, ratio, vm.operationType);
				this.assignMorphValues(4, target.textureCoeff, vm.textureCoefficient, ratio, vm.operationType);
				this.assignMorphValues(4, target.sphereCoeff, vm.sphereTextureCoefficient, ratio, vm.operationType);
				this.assignMorphValues(4, target.toonCoeff, vm.toonTextureCoefficient, ratio, vm.operationType);

			}
		}
	}

	private assignMorphValues(vecLength: number, target: number[], morphValues: number[], ratio: number, opType: number) {
		for (var i = 0; i < vecLength; i++) {
			target[i] += ratio * (morphValues[i] + opType - 1);
		}
	}
}

export = PMXMorph;