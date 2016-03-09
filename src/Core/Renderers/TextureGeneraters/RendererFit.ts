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
    return this.__parentRenderer.region;
  }

  public generate(texInfo: GeneraterInfoChunk): BufferTexture {
    const rect = this.ParentRenderRectangle;
    const width = rect.Width, height = rect.Height;
    let elementLayout: number;
    texInfo["layout"] = texInfo["layout"] || "RGBA";
    elementLayout = GLEnumParser.parseTextureLayout(texInfo["layout"]);
    let elementFormat: number;
    texInfo["format"] = texInfo["format"] || "UBYTE";
    elementFormat = GLEnumParser.parseTextureFormat(texInfo["format"]);
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
