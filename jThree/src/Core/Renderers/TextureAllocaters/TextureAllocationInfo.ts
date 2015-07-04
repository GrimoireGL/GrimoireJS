import TextureAllocationInfoChunk = require('./TextureAllocationInfoChunk');
interface TextureAlocationInfo
{
	[name:string]:TextureAllocationInfoChunk;
}

export = TextureAlocationInfo;