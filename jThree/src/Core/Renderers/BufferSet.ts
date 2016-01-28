import BasicRenderer = require("./BasicRenderer");
import GeneraterInfoChunk = require("./TextureGeneraters/GeneraterInfoChunk");
import TextureBase = require("../Resources/Texture/TextureBase");
import TextureGenerater = require("./TextureGenerater");
/**
 * The class managing all buffer textures used for rendering in a BasicRenderer.
 */
class BufferSet {

  private _renderer: BasicRenderer;
  /**
   * The color buffers managed by this class.
   */
  private _colorBuffers: { [key: string]: TextureBase } = {};

  constructor(renderer: BasicRenderer) {
    this._renderer = renderer;
  }

  /**
   * Generate new buffer and append list.
   * @param {GeneraterInfoChunk} argument [description]
   */
  public appendBuffer(argument: GeneraterInfoChunk): void {
    if (this._colorBuffers[argument.name]) {
      console.error(`The color buffer ${argument.name} is already exist.`);
      return;
    } else {
      this._colorBuffers[argument.name] = TextureGenerater.generateTexture(this._renderer, argument);
    }
  }

  public appendBuffers(args: GeneraterInfoChunk[]): void {
    for (let i = 0; i < args.length; i++) {
      this.appendBuffer(args[i]);
    }
  }

  /**
   * Remove buffer and dispose.
   * @param {string} name [description]
   */
  public removeBuffer(name: string): void {
    if (this._colorBuffers[name]) {
      this._colorBuffers[name].dispose();
      delete this._colorBuffers[name];
    }
  }

  public getColorBuffer(name: string): TextureBase {
    return this._colorBuffers[name];
  }
}

export = BufferSet;
