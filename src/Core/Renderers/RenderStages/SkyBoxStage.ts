import BasicRenderer from "../BasicRenderer";
import RSMLRenderStage from "./RSML/RSMLRenderStage";
class SkyBoxStage extends RSMLRenderStage {
    constructor(renderer: BasicRenderer) {
        super(renderer, require("./BuiltIn/Skybox.html"));
    }
}
export default SkyBoxStage;
