
interface PMXIKLink
{
	ikLinkBoneIndex:number;
	isLimitedRotation:number;
	limitedRotation?:number[];//[minX,minY,minZ,maxX,maxY,maxZ]
}

export = PMXIKLink;