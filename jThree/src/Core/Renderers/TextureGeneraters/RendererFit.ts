import GeneraterInfoChunk from "./GeneraterInfoChunk";
import BasicRenderer from "../BasicRenderer";
import GeneraterBase from "./GeneraterBase";
import Rectangle from "../../../Math/Rectangle";
import BufferTexture from "../../Resources/Texture/BufferTexture";
import ContextComponents from "../../../ContextComponents";
import ResourceManager from "../../ResourceManager";
import JThreeContext from "../../../JThreeContext";
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
    let internalFormat: number;
    texInfo["internalFormat"] = texInfo["internalFormat"] || "RGBA";
    switch ((<string>texInfo["internalFormat"]).toUpperCase()) {
      case "ALPHA":
        internalFormat = WebGLRenderingContext.ALPHA;
        break;
      case "RGB":
        internalFormat = WebGLRenderingContext.RGB;
        break;
      case "DEPTH":
        internalFormat = WebGLRenderingContext.DEPTH_COMPONENT;
        break;
      case "LUMINANCE":
        internalFormat = WebGLRenderingContext.LUMINANCE;
        break;
      case "LUMINANCE_ALPHA":
        internalFormat = WebGLRenderingContext.LUMINANCE_ALPHA;
        break;
      case "DEPTH_STENCIL":
        internalFormat = WebGLRenderingContext.DEPTH_STENCIL;
        break;
      case "RGBA":
        internalFormat = WebGLRenderingContext.RGBA;
        break;
      default:
        console.error("the given parameter was invalid : texture format " + texInfo["internalFormat"]);
    }
    let elementFormat: number;
    texInfo["element"] = texInfo["element"] || "UBYTE";
    switch ((<string>texInfo["element"]).toUpperCase()) {
      case "UBYTE":
        elementFormat = WebGLRenderingContext.UNSIGNED_BYTE;
        break;
      case "FLOAT":
        elementFormat = WebGLRenderingContext.FLOAT;
        break;
      case "USHORT565":
        elementFormat = WebGLRenderingContext.UNSIGNED_SHORT_5_6_5;
        break;
      case "USHORT4444":
        elementFormat = WebGLRenderingContext.UNSIGNED_SHORT_4_4_4_4;
        break;
      case "USHORT5551":
        elementFormat = WebGLRenderingContext.UNSIGNED_SHORT_5_5_5_1;
        break;
      case "UINT":
        elementFormat = WebGLRenderingContext.UNSIGNED_INT;
        break;
      case "USHORT":
        elementFormat = WebGLRenderingContext.UNSIGNED_SHORT;
        break;
      // case "UINT24_8": // TODO Depth texture
      //   elementFormat = WebGLRenderingContext.UNSIGNED;
      // break;
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

export default RendererFit;
