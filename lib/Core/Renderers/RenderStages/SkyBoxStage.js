import RSMLRenderStage from "./RSML/RSMLRenderStage";
class SkyBoxStage extends RSMLRenderStage {
    constructor(renderer) {
        super(renderer, require("./BuiltIn/Skybox.html"));
    }
}
export default SkyBoxStage;
