class GLEnumParser {
  public static parseBlendFunc(val: string): number {
    val = val.toUpperCase();
    switch (val) {
      case "ZERO":
      case "0":
        return WebGLRenderingContext.ZERO;
      case "ONE":
      case "1":
        return WebGLRenderingContext.ONE;
      case "SRC_COLOR":
        return WebGLRenderingContext.SRC_COLOR;
      case "ONE_MINUS_SRC_COLOR":
        return WebGLRenderingContext.ONE_MINUS_SRC_COLOR;
      case "SRC_ALPHA":
        return WebGLRenderingContext.SRC_ALPHA;
      case "ONE_MINUS_SRC_ALPHA":
        return WebGLRenderingContext.ONE_MINUS_SRC_ALPHA;
      case "DST_ALPHA":
        return WebGLRenderingContext.DST_ALPHA;
      case "ONE_MINUS_DST_ALPHA":
        return WebGLRenderingContext.ONE_MINUS_DST_ALPHA;
      case "DST_COLOR":
        return WebGLRenderingContext.DST_COLOR;
      case "ONE_MINUS_DST_COLOR":
        return WebGLRenderingContext.ONE_MINUS_DST_COLOR;
      case "SRC_ALPHA_SATURATE":
        return WebGLRenderingContext.SRC_ALPHA_SATURATE;
      default:
        console.error("Unknown blend func constant!");
        return WebGLRenderingContext.ONE;
    }
  }

  public static parseDepthFunc(val: string): number {
    val = val.toUpperCase();
    switch (val) {
      case "NEVER":
        return WebGLRenderingContext.NEVER;
      case "LESS":
        return WebGLRenderingContext.LESS;
      case "LEQUAL":
        return WebGLRenderingContext.LEQUAL;
      case "GREATER":
        return WebGLRenderingContext.GREATER;
      case "NOTEQUAL":
        return WebGLRenderingContext.NOTEQUAL;
      case "GEQUAL":
        return WebGLRenderingContext.GEQUAL;
      case "ALWAYS":
        return WebGLRenderingContext.ALWAYS;
      default:
        console.error("Unknown depth func constant!");
        return WebGLRenderingContext.LESS;
    }
  }

  public static parseCullMode(val: string): number {
    val = val.toUpperCase();
    switch (val) {
      case "BACK":
        return WebGLRenderingContext.BACK;
      case "FRONT":
        return WebGLRenderingContext.FRONT;
      case "FRONT_AND_BACK":
        return WebGLRenderingContext.FRONT_AND_BACK;
      default:
        console.error("Unknown cull mode constant!");
        return WebGLRenderingContext.BACK;
    }
  }

  public static parseTextureWrapMode(val: string): number {
    val = val.toUpperCase();
    switch (val) {
      case "REPEAT":
        return WebGLRenderingContext.REPEAT;
      case "CLAMP_TO_EDGE":
        return WebGLRenderingContext.CLAMP_TO_EDGE;
      case "MIRRORED_REPEAT":
        return WebGLRenderingContext.MIRRORED_REPEAT;
      default:
        console.error("Unknown texture wrapping mode!");
        return WebGLRenderingContext.REPEAT;
    }
  }

  public static parseTextureMagFilter(val: string): number {
    val = val.toUpperCase();
    switch (val) {
      case "NEAREST":
        return WebGLRenderingContext.NEAREST;
      case "LINEAR":
        return WebGLRenderingContext.LINEAR;
      default:
        console.error("Unknown mag filter mode!");
        return WebGLRenderingContext.LINEAR;
    }
  }

  public static parseTextureMinFilter(val: string): number {
    val = val.toUpperCase();
    switch (val) {
      case "NEAREST_MIPMAP_LINEAR":
        return WebGLRenderingContext.NEAREST_MIPMAP_LINEAR;
      case "NEAREST_MIPMAP_NEAREST":
        return WebGLRenderingContext.NEAREST_MIPMAP_NEAREST;
      case "LINEAR_MIPMAP_LINEAR":
        return WebGLRenderingContext.LINEAR_MIPMAP_LINEAR;
      case "LINEAR_MIPMAP_NEAREST":
        return WebGLRenderingContext.LINEAR_MIPMAP_NEAREST;
      case "NEAREST":
        return WebGLRenderingContext.NEAREST;
      case "LINEAR":
        return WebGLRenderingContext.LINEAR;
      default:
        return WebGLRenderingContext.LINEAR;
    }
  }

  public static parseTextureElementLayout(val: string): number {
    switch (val.toUpperCase()) {
      case "ALPHA":
        return WebGLRenderingContext.ALPHA;
      case "RGB":
        return WebGLRenderingContext.RGB;
      case "DEPTH":
        return WebGLRenderingContext.DEPTH_COMPONENT;
      case "LUMINANCE":
        return WebGLRenderingContext.LUMINANCE;
      case "LUMINANCE_ALPHA":
        return WebGLRenderingContext.LUMINANCE_ALPHA;
      case "DEPTH_STENCIL":
        return WebGLRenderingContext.DEPTH_STENCIL;
      case "RGBA":
        return WebGLRenderingContext.RGBA;
      default:
        console.error("the given parameter was invalid : texture format " + val);
    }
  }

  public static parseTextureElementFormat(val: string): number {
    switch (val.toUpperCase()) {
      case "UBYTE":
        return WebGLRenderingContext.UNSIGNED_BYTE;
      case "FLOAT":
        return WebGLRenderingContext.FLOAT;
      case "USHORT565":
        return WebGLRenderingContext.UNSIGNED_SHORT_5_6_5;
      case "USHORT4444":
        return WebGLRenderingContext.UNSIGNED_SHORT_4_4_4_4;
      case "USHORT5551":
        return WebGLRenderingContext.UNSIGNED_SHORT_5_5_5_1;
      case "UINT":
        return WebGLRenderingContext.UNSIGNED_INT;
      case "USHORT":
        return WebGLRenderingContext.UNSIGNED_SHORT;
      // case "UINT24_8":
      //   return WebGLRenderingContext.UINT;
      default:
        console.error("the given parameter was invalid : element format " + val);
    }
  }
}
export default GLEnumParser;
