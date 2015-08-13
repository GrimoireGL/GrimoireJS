import ContextManagerBase = require("./../ContextManagerBase");
import Delegates = require("../../Base/Delegates");
import Exceptions = require("../../Exceptions");
import GLContextWrapperBase = require("../../Wrapper/GLContextWrapperBase");
import jThreeObjectWithID = require("../../Base/JThreeObjectWithID");
import Camera = require("./../Camera/Camera");
import RenderStageManager = require('./RenderStageManager');
import JThreeEvent = require('../../Base/JThreeEvent');
import Rectangle = require('../../Math/Rectangle'); 
import JThreeContextProxy = require('../JThreeContextProxy');
import RB1RenderStage = require('./RenderStages/RB1RenderStage');
import LightAccumulationRenderStage = require('./RenderStages/LightAccumulationStage');
import FowardRenderStage = require('./RenderStages/FowardShadingStage');
import RBDepthStage = require('./RenderStages/RBDepthStage');
/**
 * Provides base class feature for renderer classes.
 */
class RendererBase extends jThreeObjectWithID {

    constructor(contextManager: ContextManagerBase, viewportArea: Rectangle) {
        super();
        this.contextManager = contextManager;
        this.viewportArea = viewportArea;
        if (this.viewportArea) JThreeContextProxy.getJThreeContext().ResourceManager.createRBO(this.ID + ".rbo.default", this.viewportArea.Width, this.viewportArea.Height);
        JThreeContextProxy.getJThreeContext().ResourceManager.createFBO(this.ID + ".fbo.default");
        this.RenderStageManager.StageChains.push(
            {
                buffers: {
                    OUT: "deffered.rb1"
                },
                stage: new RB1RenderStage(this)
            }
            ,
            {
                buffers: {
                    OUT: "deffered.depth"
                },
                stage: new RBDepthStage(this)
            },
            {
                buffers: {
                    RB1: "deffered.rb1",
                    RB2: "deffered.rb2",
                    DEPTH: "deffered.depth",
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
            );
        this.RenderStageManager.TextureBuffers = {
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


    /**
     * The camera reference this renderer using for draw.
     */
    private camera: Camera;
    /**
     * The camera reference this renderer using for draw.
     */
    public get Camera(): Camera {
        return this.camera;
    }
    /**
     * The camera reference this renderer using for draw.
     */
    public set Camera(camera: Camera) {
        this.camera = camera;
    }

    public render(drawAct: Delegates.Action0): void {
        throw new Exceptions.AbstractClassMethodCalledException();
    }

    /**
     * ContextManager managing this renderer.
     */
    private contextManager: ContextManagerBase;
    
    /**
     * ContextManager managing this renderer.
     */
    public get ContextManager(): ContextManagerBase {
        return this.contextManager;
    }
    
    /**
     * Obtain the reference for wrapper of WebGLRenderingContext
     */
    public get GLContext(): GLContextWrapperBase {
        return this.contextManager.GLContext;
    }
    
    /**
     * It will be called before processing renderer.
     * If you need to override this method, you need to call same method of super class first. 
     */
    public beforeRender() {
        this.ContextManager.beforeRender(this);
    }

    /**
     * It will be called after processing renderer.
     * If you need to override this method, you need to call same method of super class first. 
     */
    public afterRender() {
        this.GLContext.Flush();
        this.ContextManager.afterRender(this);
    }

    /**
    * Provides render stage abstraction
    */
    private renderStageManager: RenderStageManager = new RenderStageManager(this);
    
    /**
     * Provides render stage abstraction
     */
    public get RenderStageManager(): RenderStageManager {
        return this.renderStageManager;
    }

    private onViewportChangedHandler: JThreeEvent<Rectangle> = new JThreeEvent<Rectangle>();//TODO argument should be optimized.
    
    public onViewPortChanged(act: Delegates.Action2<RendererBase, Rectangle>) {
        this.onViewportChangedHandler.addListerner(act);
    }

    private viewportArea: Rectangle = new Rectangle(0, 0, 256, 256);

    public get ViewPortArea(): Rectangle
    {
        return this.viewportArea;
    }

    public set ViewPortArea(area: Rectangle)
    {
        if (!Rectangle.Equals(area, this.viewportArea) && (typeof area.Width !== 'undefined') && (typeof area.Height !== 'undefined'))
        {
            this.viewportArea = area;
            JThreeContextProxy.getJThreeContext().ResourceManager.getRBO(this.ID + ".rbo.default").resize(area.Width, area.Height);
            this.onViewportChangedHandler.fire(this, area);
        }

    }

    public applyViewportConfigure(): void
    {
        this.ContextManager.GLContext.ViewPort(this.viewportArea.Left, this.viewportArea.Top, this.viewportArea.Width, this.viewportArea.Height);
    }
}


export =RendererBase;
