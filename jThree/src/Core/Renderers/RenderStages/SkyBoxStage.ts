import BasicRenderer = require("../BasicRenderer");
import RSMLRenderStage = require("./RSML/RSMLRenderStage");
class SkyBoxStage extends RSMLRenderStage
{
    constructor(renderer: BasicRenderer)
    {
        super(renderer,require("./BuiltIn/Skybox.html"));
    }
}
export = SkyBoxStage;
