import VmdMotion = require("./VMDMotion");

interface VMDMotions
{
	[boneName:string]:VmdMotion[];
}

export=VMDMotions;
