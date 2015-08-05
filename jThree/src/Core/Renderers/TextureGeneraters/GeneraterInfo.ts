import GeneraterInfoChunk = require("./GeneraterInfoChunk");
/**
 * Provides argument definition of declaration to generate textures.
 */
interface GeneraterInfo
{
	[name:string]:GeneraterInfoChunk;
}

export = GeneraterInfo;