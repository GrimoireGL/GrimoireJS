import PMXIKLink = require("./PMXIKLink");
interface PMXBone
{
	boneName:string;
	boneNameEn:string;
	position:number[];
	parentBoneIndex:number;
	transformLayer:number;
	boneFlag:number;
	positionOffset?:number[];
	connectingBoneIndex?:number;
	providingBoneIndex?:number;
	providingRate?:number;
	fixedAxis?:number[];
	localAxisX?:number[];
	localAxisZ?:number[];
	externalParentTransformKey?:number;
	ikTargetBoneIndex?:number;
	ikLoopCount?:number;
	ikLimitedRotation?:number;
	ikLinkCount?:number;
	ikLinks?:PMXIKLink[];
}


export = PMXBone;
