import VMDFrameData = require("./VMDFrameData");
interface VMDMorphs
{
	[morphName:string]:VMDMorph[];
}

interface VMDMorph extends VMDFrameData
{
	frameNumber:number;
	morphValue:number;
}
export=VMDMorphs;
