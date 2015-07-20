import VMDFrameData = require('./VMDFrameData');
interface VMDMotions
{
	[boneName:string]:VMDMotion[];
}

interface VMDMotion extends VMDFrameData
{
	frameNumber:number;
	position:number[];
	rotation:number[];
	interpolation:Uint8Array;
}
export=VMDMotions;
