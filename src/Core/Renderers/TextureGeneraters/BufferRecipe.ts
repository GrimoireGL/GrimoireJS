/**
 * Provides argument definition of declaration to single generate texture.
 */
interface BufferRecipe {
	/**
	 * Name that is used for texture generation.
	 */
  generater: string;
  name: string;
  [others: string]: any;
}

export default BufferRecipe;
