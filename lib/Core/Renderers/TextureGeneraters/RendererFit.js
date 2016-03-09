import GLEnumParser from "../../Canvas/GL/GLEnumParser";
import GeneraterBase from "./GeneraterBase";
import ContextComponents from "../../../ContextComponents";
import JThreeContext from "../../../JThreeContext";
class RendererFit extends GeneraterBase {
    constructor(parent) {
        super(parent);
    }
    get ParentRenderRectangle() {
        return this.__parentRenderer.region;
    }
    generate(texInfo) {
        const rect = this.ParentRenderRectangle;
        const width = rect.Width, height = rect.Height;
        let elementLayout;
        texInfo["layout"] = texInfo["layout"] || "RGBA";
        elementLayout = GLEnumParser.parseTextureLayout(texInfo["layout"]);
        let elementFormat;
        texInfo["format"] = texInfo["format"] || "UBYTE";
        elementFormat = GLEnumParser.parseTextureFormat(texInfo["format"]);
        const rm = JThreeContext.getContextComponent(ContextComponents.ResourceManager);
        const resource = rm.createTexture(this.__parentRenderer.ID + "." + texInfo.name, width, height, elementLayout, elementFormat);
        this.__parentRenderer.on("resize", (s) => {
            const bufTex = resource;
            if (s.Width !== bufTex.Width || s.Height !== bufTex.Height) {
                resource.resize(s.Width, s.Height);
            }
        });
        return resource;
    }
}
export default RendererFit;
