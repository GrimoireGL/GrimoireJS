import GLEnumParser from "../../Canvas/GL/GLEnumParser";
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
    if (this.__parentRenderer["ViewPortArea"]) {
      return this.__parentRenderer["ViewPortArea"];
    } else {
      return new Rectangle(0, 0, 512, 512);
    }
  }

  public generate(texInfo: GeneraterInfoChunk): BufferTexture {
    const rect = this.ParentRenderRectangle;
    const width = rect.Width, height = rect.Height;
    let elementLayout: number;
    texInfo["elementLayout"] = texInfo["elementLayout"] || "RGBA";
    elementLayout = GLEnumParser.parseTextureElementLayout(texInfo["elementLayout"]);
    let elementFormat: number;
    texInfo["elementFormat"] = texInfo["elementFormat"] || "UBYTE";
    elementFormat = GLEnumParser.parseTextureElementFormat(texInfo["elementFormat"]);
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    const resource = rm.createTexture(this.__parentRenderer.ID + "." + texInfo.name, width, height, elementLayout, elementFormat);
    this.__parentRenderer.on("resize", (s: Rectangle) => {
      const bufTex = <BufferTexture>resource;
      if (s.Width !== bufTex.Width || s.Height !== bufTex.Height) {
        (<BufferTexture>resource).resize(s.Width, s.Height);
      }
    });
    return resource;
  }
}

export default RendererFit;
