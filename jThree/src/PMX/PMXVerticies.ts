interface PMXVerticies
{
	positions:number[];
	normals:Float32Array;
	uvs:number[];
	additionalUV?:number[][];
	edgeScaling:Float32Array;
	boneIndicies:Float32Array;
	boneWeights:Float32Array;
	verticies:PMXVertex[];
}

interface PMXVertex
{
	weightTransform:number;
	sdef?:SDEF;
}

interface SDEF
{
	boneParams:number[];//0-2:C,3-5:R0,6-8:R1
}


export = PMXVerticies;