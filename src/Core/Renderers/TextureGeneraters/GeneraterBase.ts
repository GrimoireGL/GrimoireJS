import GeneraterInfoChunk from "./GeneraterInfoChunk";
import BasicRenderer from "../BasicRenderer";
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
  public abstract generate(texInfo: GeneraterInfoChunk);
}

export default GeneraterBase;
