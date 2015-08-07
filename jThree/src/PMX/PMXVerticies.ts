import PmxVertex = require("PMXVertex");

interface PMXVerticies
{
	positions:number[];
	normals:Float32Array;
	uvs:number[];
	additionalUV?:number[][];
	edgeScaling:Float32Array;
	boneIndicies:Float32Array;
	boneWeights:Float32Array;
	verticies:PmxVertex[];
}

export = PMXVerticies;