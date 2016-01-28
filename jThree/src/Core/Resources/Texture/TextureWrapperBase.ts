import ResourceWrapper = require("../ResourceWrapper");
import TextureParameterType = require("../../../Wrapper/Texture/TextureParameterType");
import TextureBase = require("./TextureBase");
import Canvas = require("../../Canvas");
import TextureRegister = require("../../../Wrapper/Texture/TextureRegister");
import PixelStoreParamType = require("../../../Wrapper/Texture/PixelStoreParamType");
import Delegates = require("../../../Base/Delegates");
import TextureFormat = require("../../../Wrapper/TextureInternalFormatType");
import ElementType = require("../../../Wrapper/TextureType");
class TextureWrapperBase extends ResourceWrapper {

  protected static altTextureBuffer: Float32Array = new Uint8Array([255, 0, 255, 255]);

  constructor(owner: Canvas, parent: TextureBase) {
    super(owner);
    this.parent = parent;
    this.parent.onFilterParameterChanged(this.applyTextureParameter.bind(this));
  }
  private parent: TextureBase;

  public get Parent(): TextureBase {
    return this.parent;
  }

  private targetTexture: WebGLTexture = null;

  protected setTargetTexture(texture: WebGLTexture) {
    this.targetTexture = texture;
  }

  public get TargetTexture(): WebGLTexture {
    return this.targetTexture;
  }

  /**
   * apply texture parameters
   */
  private applyTextureParameter() {
    if (this.targetTexture == null) {
      return;
    }
    this.bind();
    this.GL.texParameteri(this.Parent.TargetTextureType, TextureParameterType.MinFilter, this.parent.MinFilter);
    this.GL.texParameteri(this.Parent.TargetTextureType, TextureParameterType.MagFilter, this.parent.MagFilter);
    this.GL.texParameteri(this.Parent.TargetTextureType, TextureParameterType.WrapS, this.parent.SWrap);
    this.GL.texParameteri(this.Parent.TargetTextureType, TextureParameterType.WrapT, this.parent.TWrap);
  }

  public bind() {
    if (this.targetTexture != null) {
      this.GL.bindTexture(this.Parent.TargetTextureType, this.targetTexture);
    } else {
      this.GL.bindTexture(this.Parent.TargetTextureType, null);
    }
  }

  public registerTexture(registerIndex: number): boolean {
    if (this.TargetTexture == null) {
      this.GL.activeTexture(TextureRegister.Texture0 + registerIndex);
      this.GL.bindTexture(this.parent.TargetTextureType, null);
      return false;
    }
    this.GL.activeTexture(TextureRegister.Texture0 + registerIndex);
    this.applyTextureParameter();
    return true;
  }

  public init() {
    return;
  }

  public preTextureUpload() {
    if (this.parent.FlipY) {
      this.GL.pixelStorei(PixelStoreParamType.UnpackFlipYWebGL, 1);
    } else {
      this.GL.pixelStorei(PixelStoreParamType.UnpackFlipYWebGL, 0);
    }
  }

  public generateHtmlImage(encoder?: Delegates.Func3<number, number, ArrayBufferView, Uint8Array>): HTMLImageElement {
    return null;
  }

  protected encodeHtmlImage(width: number, height: number, encode?: Delegates.Func3<number, number, ArrayBufferView, Uint8Array>) {
    const lastFBO = this.GL.getParameter(this.GL.FRAMEBUFFER_BINDING);
    // Create framebuffer to transfer texture data
    const framebuffer = this.GL.createFramebuffer();
    this.GL.bindFramebuffer(this.GL.FRAMEBUFFER, framebuffer);
    this.GL.framebufferTexture2D(this.GL.FRAMEBUFFER, this.GL.COLOR_ATTACHMENT0, this.GL.TEXTURE_2D, this.targetTexture, 0);
    let data: ArrayBufferView;
    let dataArrayConstructor: any;
    let transformFunc;
    switch (this.Parent.ElementFormat) {
      case ElementType.Float:
        dataArrayConstructor = Float32Array;
        break;

      case ElementType.UnsignedByte:
        dataArrayConstructor = Uint8Array;
        break;

      case ElementType.UnsignedShort:
      case ElementType.UnsignedShort565:
      case ElementType.UnsignedShort4444:
      case ElementType.UnsignedShort5551:
        dataArrayConstructor = Uint16Array;
        break;
      default:
        console.error("Element format is not supported!");
        return;
    }
    switch (this.Parent.TextureFormat) {
      case TextureFormat.RGB:
        data = new dataArrayConstructor(width * height * 4);
        transformFunc = (w, h, arr) => {
          const ret = new Uint8Array(w * h * 4);
          for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
              ret[4 * (y * w + x) + 0] = arr[4 * ((h - y) * w + x) + 0];
              ret[4 * (y * w + x) + 1] = arr[4 * ((h - y) * w + x) + 1];
              ret[4 * (y * w + x) + 2] = arr[4 * ((h - y) * w + x) + 2];
              ret[4 * (y * w + x) + 3] = 255;
            }
          }
          return ret;
        };
        break;
      case TextureFormat.RGBA:
        data = new dataArrayConstructor(width * height * 4);
        transformFunc = (w, h, arr) => {
          const ret = new Uint8Array(w * h * 4);
          for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
              ret[4 * (y * w + x) + 0] = arr[4 * ((h - y) * w + x) + 0];
              ret[4 * (y * w + x) + 1] = arr[4 * ((h - y) * w + x) + 1];
              ret[4 * (y * w + x) + 2] = arr[4 * ((h - y) * w + x) + 2];
              ret[4 * (y * w + x) + 3] = arr[4 * ((h - y) * w + x) + 3];
            }
          }
          return ret;
        };
        break;
      case TextureFormat.Alpha:
        data = new dataArrayConstructor(width * height * 4);
        transformFunc = (w, h, arr) => {
          const ret = new Uint8Array(w * h * 4);
          for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
              ret[4 * (y * w + x) + 0] = arr[4 * (y * w + x)];
              ret[4 * (y * w + x) + 1] = 0;
              ret[4 * (y * w + x) + 2] = 0;
              ret[4 * (y * w + x) + 3] = 255;
            }
          }
          return ret;
        };

        break;
      default:
        console.error("TextureFormat is unsupported!");
        return;
    }
    transformFunc = encode || transformFunc;
    // read pixels from framebuffer
    this.GL.readPixels(0, 0, width, height, TextureFormat.RGBA, this.Parent.ElementFormat, data);
    this.GL.deleteFramebuffer(framebuffer);
    this.GL.bindFramebuffer(this.GL.FRAMEBUFFER, lastFBO);
    // generate canvas for result
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    // Copy the pixels to a 2D canvas
    const imageData = context.createImageData(width, height);
    (<any>imageData.data).set(<any>transformFunc(width, height, data));
    context.putImageData(imageData, 0, 0);
    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }

  public dispose(): void {
    if (this.targetTexture) {
      this.GL.deleteTexture(this.targetTexture);
      this.setInitialized(false);
      this.targetTexture = null;
    }
  }
}
export = TextureWrapperBase;
