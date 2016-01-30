import ResourceWrapper from "../ResourceWrapper";
import TextureParameterType from "../../../Wrapper/Texture/TextureParameterType";
import TextureBase from "./TextureBase";
import Canvas from "../../Canvas/Canvas";
import TextureRegister from "../../../Wrapper/Texture/TextureRegister";
import PixelStoreParamType from "../../../Wrapper/Texture/PixelStoreParamType";
import {Func3} from "../../../Base/Delegates";
class TextureWrapperBase extends ResourceWrapper {

  protected static altTextureBuffer: Uint8Array = new Uint8Array([255, 0, 255, 255]);
  private targetTexture: WebGLTexture = null;
  private parent: TextureBase;

  constructor(owner: Canvas, parent: TextureBase) {
    super(owner);
    this.parent = parent;
    this.parent.onFilterParameterChanged(this.applyTextureParameter.bind(this));
  }

  public get Parent(): TextureBase {
    return this.parent;
  }

  public get TargetTexture(): WebGLTexture {
    return this.targetTexture;
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

  public generateHtmlImage(encoder?: Func3<number, number, ArrayBufferView, Uint8Array>): HTMLImageElement {
    return null;
  }

  public dispose(): void {
    if (this.targetTexture) {
      this.GL.deleteTexture(this.targetTexture);
      this.setInitialized(false);
      this.targetTexture = null;
    }
  }

  protected setTargetTexture(texture: WebGLTexture) {
    this.targetTexture = texture;
  }


  protected encodeHtmlImage(width: number, height: number, encode?: Func3<number, number, ArrayBufferView, Uint8Array>) {
    const lastFBO = this.GL.getParameter(this.GL.FRAMEBUFFER_BINDING);
    // Create framebuffer to transfer texture data
    const framebuffer = this.GL.createFramebuffer();
    this.GL.bindFramebuffer(this.GL.FRAMEBUFFER, framebuffer);
    this.GL.framebufferTexture2D(this.GL.FRAMEBUFFER, this.GL.COLOR_ATTACHMENT0, this.GL.TEXTURE_2D, this.targetTexture, 0);
    let data: ArrayBufferView;
    let dataArrayConstructor: any;
    let transformFunc;
    switch (this.Parent.ElementFormat) {
      case WebGLRenderingContext.FLOAT:
        dataArrayConstructor = Float32Array;
        break;

      case WebGLRenderingContext.UNSIGNED_BYTE:
        dataArrayConstructor = Uint8Array;
        break;

      case WebGLRenderingContext.UNSIGNED_SHORT:
      case WebGLRenderingContext.UNSIGNED_SHORT_5_6_5:
      case WebGLRenderingContext.UNSIGNED_SHORT_4_4_4_4:
      case WebGLRenderingContext.UNSIGNED_SHORT_5_5_5_1:
        dataArrayConstructor = Uint16Array;
        break;
      default:
        console.error("Element format is not supported!");
        return;
    }
    switch (this.Parent.TextureFormat) {
      case WebGLRenderingContext.RGB:
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
      case WebGLRenderingContext.RGBA:
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
      case WebGLRenderingContext.ALPHA:
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
        console.error("Specified texture format is unsupported!");
        return;
    }
    transformFunc = encode || transformFunc;
    // read pixels from framebuffer
    this.GL.readPixels(0, 0, width, height, WebGLRenderingContext.RGBA, this.Parent.ElementFormat, data);
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

}
export default TextureWrapperBase;
