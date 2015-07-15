interface PMXVerticies
{
	positions:number[];
	normals:number[];
	uvs:number[];
	additionalUV?:number[][];
	edgeScaling:number[];
	boneIndicies: number[];
	boneWeights: number[];
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