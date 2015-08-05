import Rectangle = require("../../Math/Rectangle");
import RendererBase = require("./RendererBase");
import ContextManagerBase = require("./../ContextManagerBase");
import RB1RenderStage = require("./RenderStages/RB1RenderStage");
import LightAccumulationRenderStage = require("./RenderStages/LightAccumulationStage");
import FowardRenderStage = require("./RenderStages/FowardShadingStage");
import JThreeContextProxy = require("../JThreeContextProxy");
import RBDepthStage = require("./RenderStages/RBDepthStage");
class ViewPortRenderer extends RendererBase {
    constructor(contextManager: ContextManagerBase, viewportArea: Rectangle) {
        super(contextManager);
        this.viewportArea = viewportArea;
        if(this.viewportArea)JThreeContextProxy.getJThreeContext().ResourceManager.createRBO(this.ID+".rbo.default",this.viewportArea.Width,this.viewportArea.Height);
        JThreeContextProxy.getJThreeContext().ResourceManager.createFBO(this.ID+".fbo.default");
        this.RenderStageManager.StageChains.push(
            {
                buffers: {
                    OUT: "deffered.rb1"
                },
                stage: new RB1RenderStage(this)
            }
            // ,
            // {
            //     buffers: {
            //         DEPTH: "deffered.depth",
            //         OUT: "deffered.rb2"
            //     },
            //     stage: new RB2RenderStage(this)
            // }
            ,
            {
                buffers:{
                    OUT:"deffered.depth"
                },
                stage: new RBDepthStage(this)
            },
            {
                buffers: {
                    RB1: "deffered.rb1",
                    RB2: "deffered.rb2",
                    DEPTH:"deffered.depth",
                    DIR: "jthree.light.dir1",
                    OUT: "deffered.light"
                },
                stage: new LightAccumulationRenderStage(this)
            },
            {
                buffers: {
                    LIGHT: "deffered.light",
                    OUT: "default",
                },
                stage: new FowardRenderStage(this)
            }
            // },
            );
        this.RenderStageManager.TextureBuffers = {
            // "jthree.light.dir1": {
            //     generater: "rendererfit",
            //     internalFormat: "ALPHA",
            //     element: "FLOAT"
            // },
            "deffered.rb1": {
                generater: "rendererfit",
                internalFormat: "RGBA",
                element: "UBYTE"
            },
            "deffered.rb2": {
                generater: "rendererfit",
                internalFormat: "RGBA",
                element: "UBYTE"
            }, "deffered.depth": {
                generater: "rendererfit",
                internalFormat: "RGBA",
                element: "UBYTE"
            }
            , "deffered.light": {
                generater: "rendererfit",
                internalFormat: "RGBA",
                element: "UBYTE"
            }
        };
        this.RenderStageManager.generateAllTextures();

    }

    private viewportArea: Rectangle;

    public get ViewPortArea(): Rectangle {
        return this.viewportArea;
    }

    public set ViewPortArea(area: Rectangle) {
        if (!Rectangle.Equals(area, this.viewportArea)) {
            this.viewportArea = area;
            JThreeContextProxy.getJThreeContext().ResourceManager.getRBO(this.ID+".rbo.default").resize(area.Width,area.Height);
            this.onResizeHandler.fire(this,area);
        }

    }

    applyViewportConfigure(): void {
        this.ContextManager.GLContext.ViewPort(this.viewportArea.Left, this.viewportArea.Top, this.viewportArea.Width, this.viewportArea.Height);
    }

    beforeRender() {
        super.beforeRender();
        this.applyViewportConfigure();
    }

    afterRender() {
        this.ContextManager.GLContext.Flush();
        super.afterRender();
    }

    public configureRenderer() {
        this.applyViewportConfigure();
    }
}

export =ViewPortRenderer;
