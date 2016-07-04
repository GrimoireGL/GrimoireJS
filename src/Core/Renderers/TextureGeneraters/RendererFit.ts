import ITextureRecipe from "../Recipe/ITextureRecipe";
import GLEnumParser from "../../Canvas/GL/GLEnumParser";
import PathRenderer from "../PathRenderer";
import GeneraterBase from "./GeneraterBase";
import Rectangle from "../../../Math/Rectangle";
import BufferTexture from "../../Resources/Texture/BufferTexture";
import ResourceManager from "../../ResourceManager";
class RendererFit extends GeneraterBase {
  constructor(parent: PathRenderer) {
    super(parent);
  }

  private get ParentRenderRectangle(): Rectangle {
    return this.__parentRenderer.region;
  }

  public generate(recipe: ITextureRecipe): BufferTexture {
    const rect = this.ParentRenderRectangle;
    const width = rect.Width, height = rect.Height;
    let elementLayout: number;
    recipe.params["layout"] = recipe.params["layout"] || "RGBA";
    elementLayout = GLEnumParser.parseTextureLayout(recipe.params["layout"]);
    let elementFormat: number;
    recipe.params["format"] = recipe.params["format"] || "UBYTE";
    elementFormat = GLEnumParser.parseTextureFormat(recipe.params["format"]);
    const resource = ResourceManager.createTexture(this.__parentRenderer.id + "." + recipe.name, width, height, elementLayout, elementFormat);
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
