interface PMXVerticies
{
	positions:number[];
	normals:number[];
	uvs:number[];
	additionalUV?:number[][];
	edgeScaling:number[];
	verticies:PMXVertex[];
}

interface PMXVertex
{
	weightTransform:number;
	bdef1?:BDEF1;
	bdef2?:BDEF2;
	bdef4?:BDEF4;
	sdef?:SDEF;
}

interface BDEF1
{
	boneIndex:number;
}

interface BDEF2
{
	boneIndex1:number;
	boneIndex2:number;
	boneWeight:number;
}

interface BDEF4
{
	boneIndex1:number;
	boneIndex2:number;
	boneIndex3:number;
	boneIndex4:number;
	boneWeight1:number;
	boneWeight2:number;
	boneWeight3:number;
	boneWeight4:number;
}

interface SDEF
{
	boneIndex1:number;
	boneIndex2:number;
	boneWeight:number;
	boneParams:number[];//0-2:C,3-5:R0,6-8:R1
}


export = PMXVerticies;