import GeneraterInfo = require("../TextureGeneraters/GeneraterInfo");
import RenderStageChain = require("../RenderStageChain");
class RendererConfiguratorBase
{
    public get TextureBuffers():GeneraterInfo {
        return null;
    }

    public get StageChain():RenderStageChain {
        return null;
    }
}

export = RendererConfiguratorBase;