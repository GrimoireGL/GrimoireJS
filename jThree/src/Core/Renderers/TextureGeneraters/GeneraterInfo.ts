import GeneraterInfoChunk = require('./GeneraterInfoChunk');
interface GeneraterInfo
{
	[name:string]:GeneraterInfoChunk;
}

export = GeneraterInfo;