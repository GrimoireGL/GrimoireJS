/**
 * Provides argument definition of declaration to single generate texture.
 */
interface GeneraterInfoChunk {
	/**
	 * Name that is used for texture generation.
	 */
	generater: string;
	[others:string]:any;
}

export = GeneraterInfoChunk;
