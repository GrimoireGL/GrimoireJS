import GeneraterInfoChunk = require("./GeneraterInfoChunk");
import BasicRenderer = require("../BasicRenderer");
/**
 * Provides abstraction for texture generation.
 * By overriding, it is able to manage texture buffer in your way.
 */
abstract class GeneraterBase {
  protected parentRenderer: BasicRenderer;

  constructor(parent: BasicRenderer) {
    this.parentRenderer = parent;
  }

	/**
	 * Generate texture with provided arguments.
	 * This method is intended for being overriden.
	 */
  public abstract generate(name: string, texInfo: GeneraterInfoChunk);
}

export = GeneraterBase;
