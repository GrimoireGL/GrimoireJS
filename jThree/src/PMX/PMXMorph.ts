interface PMXMorph
{
	morphName:string,
	morphNameEn:string,
	editPanel:number,
	morphKind:number,
	morphOffsetCount:number,
	vertexMorph?:VertexMorph[],
	uvMorph?:UVMorph[],
	boneMorph?:BoneMorph[],
	materialMorph?:MaterialMorph[],
	groupMorph?:GroupMorph[]
}

interface VertexMorph
{
	vertexIndex:number,
	vertexOffset:number[]
}

interface UVMorph
{
	vertexIndex:number,
	uvOffset:number[],
}

interface BoneMorph
{
	boneIndex:number,
	translationOffset:number[],
	rotationOffset:number[]
}

interface MaterialMorph
{
	materialIndex:number,
	operationType:number,
	diffuse:number[],
	specular:number[],
	ambient:number[],
	edgeColor:number[],
	edgeSize:number,
	textureCoefficient:number[],
	sphereTextureCoefficient:number[],
	toonTextureCoefficient:number[]
}

interface GroupMorph
{
	morphIndex:number,
	morphRate:number
}

export =PMXMorph;