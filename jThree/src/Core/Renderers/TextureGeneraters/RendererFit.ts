import GeneraterInfoChunk = require("./GeneraterInfoChunk");
import BasicRenderer = require("../BasicRenderer");
import GeneraterBase = require("./GeneraterBase");
import TextureInternalFormatType = require("../../../Wrapper/TextureInternalFormatType");
import TextureType = require("../../../Wrapper/TextureType");
import Rectangle = require("../../../Math/Rectangle");
import BufferTexture = require("../../Resources/Texture/BufferTexture");
import ContextComponents = require("../../../ContextComponents");
import ResourceManager = require("../../ResourceManager");
import JThreeContext = require("../../../JThreeContext");
class RendererFit extends GeneraterBase {
  constructor(parent: BasicRenderer) {
    super(parent);
  }

  private get ParentRenderRectangle(): Rectangle {
    if (this.parentRenderer["ViewPortArea"]) {
      return this.parentRenderer["ViewPortArea"];
    } else {
      return new Rectangle(0, 0, 512, 512);
    }
  }

  public generate(texInfo: GeneraterInfoChunk) {
    const rect = this.ParentRenderRectangle;
    const width = rect.Width, height = rect.Height;
    let internalFormat: TextureInternalFormatType;
    texInfo["internalFormat"] = texInfo["internalFormat"] || "RGBA";
    switch ((<string>texInfo["internalFormat"]).toUpperCase()) {
      case "ALPHA":
        internalFormat = TextureInternalFormatType.Alpha;
        break;
      case "RGB":
        internalFormat = TextureInternalFormatType.RGB;
        break;
      case "DEPTH":
        internalFormat = TextureInternalFormatType.DEPTH_COMPONENT;
        break;
      case "LUMINANCE":
        internalFormat = TextureInternalFormatType.Luminance;
        break;
      case "LUMINANCE_ALPHA":
        internalFormat = TextureInternalFormatType.LuminanceAlpha;
        break;
      case "DEPTH_STENCIL":
        internalFormat = TextureInternalFormatType.DEPTH_STENCIL;
        break;
      case "RGBA":
        internalFormat = TextureInternalFormatType.RGBA;
        break;
      default:
        console.error("the given parameter was invalid : texture format " + texInfo["internalFormat"]);
    }
    let elementFormat: TextureType;
    texInfo["element"] = texInfo["element"] || "UBYTE";
    switch ((<string>texInfo["element"]).toUpperCase()) {
      case "UBYTE":
        elementFormat = TextureType.UnsignedByte;
        break;
      case "FLOAT":
        elementFormat = TextureType.Float;
        break;
      case "USHORT565":
        elementFormat = TextureType.UnsignedShort565;
        break;
      case "USHORT4444":
        elementFormat = TextureType.UnsignedShort4444;
        break;
      case "USHORT5551":
        elementFormat = TextureType.UnsignedShort5551;
        break;
      case "UINT":
        elementFormat = TextureType.UnsignedInt;
        break;
      case "USHORT":
        elementFormat = TextureType.UnsignedShort;
        break;
      case "UINT24_8":
        elementFormat = TextureType.UnsignedInt24_8WebGL;
        break;
      default:
        console.error("the given parameter was invalid : element format " + texInfo["element"]);
    }
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    const resource = rm.createTexture(this.parentRenderer.ID + "." + texInfo.name, width, height, internalFormat, elementFormat);
    this.parentRenderer.on("resize", (s: Rectangle) => {
      const bufTex = <BufferTexture>resource;
      if (s.Width !== bufTex.Width || s.Height !== bufTex.Height) {
        (<BufferTexture>resource).resize(s.Width, s.Height);
      }
    });
    return resource;
  }
}

export = RendererFit;
