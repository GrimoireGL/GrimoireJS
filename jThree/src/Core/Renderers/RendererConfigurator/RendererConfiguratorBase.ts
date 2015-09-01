import GeneraterInfo = require("../TextureGeneraters/GeneraterInfo");
import RenderStageChain = require("../RenderStageChain");
import RendererBase = require("../RendererBase");

class RendererConfiguratorBase
{
    public get TextureBuffers():GeneraterInfo {
        return null;
    }

    public getStageChain(target:RendererBase):RenderStageChain[] {
        return null;
    }
}

export = RendererConfiguratorBase;