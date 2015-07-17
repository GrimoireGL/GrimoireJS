import Transformer = require('../../Core/Transform/Transformer');
class PMXBoneTransformer extends Transformer
{
	public transformUpdated = false;

	public updateTransform(): void {
		super.updateTransform();
		this.transformUpdated = true;
	}
}

export = PMXBoneTransformer;