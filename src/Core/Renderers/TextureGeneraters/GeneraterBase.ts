import IRenderer from "../IRenderer";
import GeneraterInfoChunk from "./GeneraterInfoChunk";
/**
 * Provides abstraction for texture generation.
 * By overriding, it is able to manage texture buffer in your way.
 */
abstract class GeneraterBase {
  protected __parentRenderer: IRenderer;

  constructor(parent: IRenderer) {
    this.__parentRenderer = parent;
  }

	/**
	 * Generate texture with provided arguments.
	 * This method is intended for being overriden.
	 */
  public abstract generate(texInfo: GeneraterInfoChunk): void;
}

export default GeneraterBase;
