import ITextureRecipe from "./Recipe/ITextureRecipe";
import JThreeObjectEE from "../../Base/JThreeObjectEE";
import BasicRenderer from "./BasicRenderer";
import TextureBase from "../Resources/Texture/TextureBase";
import TextureGenerater from "./TextureGenerater";
import IDisposable from "../../Base/IDisposable";
/**
 * The class managing all buffer textures used for rendering in a BasicRenderer.
 */
class BufferSet extends JThreeObjectEE implements IDisposable {
  /**
   * The color buffers managed by this class.
   */
  private _colorBuffers: { [key: string]: TextureBase } = {};

  constructor(private _renderer: BasicRenderer) {
    super();
  }

  public dispose(): void {
    Object.keys(this._colorBuffers).forEach(k => {
      this._colorBuffers[k].dispose();
    });
  }

  /**
   * Generate new buffer and append list.
   * @param {ITextureRecipe} argument [description]
   */
  public appendBuffer(argument: ITextureRecipe): void {
    if (this._colorBuffers[argument.name]) {
      console.error(`The color buffer ${argument.name} is already exist.`);
      return;
    } else {
      this._colorBuffers[argument.name] = TextureGenerater.generateTexture(this._renderer, argument);
      this.emit("changed", {});
    }
  }

  public appendBuffers(args: ITextureRecipe[]): void {
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
      this.emit("changed", {});
    }
  }

  public getColorBuffer(name: string): TextureBase {
    return this._colorBuffers[name];
  }
}

export default BufferSet;
