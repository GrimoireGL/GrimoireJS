import ContextManagerBase = require("./../ContextManagerBase");
import Delegates = require("../../Base/Delegates");
import Exceptions = require("../../Exceptions");
import GLContextWrapperBase = require("../../Wrapper/GLContextWrapperBase");
import jThreeObjectWithID = require("../../Base/JThreeObjectWithID");
import Camera = require("./../Camera/Camera");
import Material = require('./../Materials/Material');
import SceneObject = require('./../SceneObject');
import RenderStageBase = require('./RenderStages/RenderStageBase');
import RenderStageManager = require('./RenderStageManager');
import RB1RenderStage = require('./RenderStages/RB1RenderStage');
import RB2RenderStage = require('./RenderStages/RB2RenderStage');
import LightAccumulationRenderStage = require('./RenderStages/LightAccumulationStage');
import FowardRenderStage = require('./RenderStages/FowardShadingStage');
import GrayScaleStage = require('./RenderStages/GrayScaleStage');
import JThreeContextProxy = require('../JThreeContextProxy');
import JThreeEvent =require('../../Base/JThreeEvent');
/**
 * Provides base class feature for renderer classes.
 */
class RendererBase extends jThreeObjectWithID {

    constructor(contextManager: ContextManagerBase) {
        super();
        this.contextManager = contextManager;
        JThreeContextProxy.getJThreeContext().ResourceManager.createRBO("jthree.rbo.default", 512, 512);
        JThreeContextProxy.getJThreeContext().ResourceManager.createFBO("jthree.fbo.default");
        this.renderStageManager.StageChains.push(
            {
                buffers: {
                    OUT: "deffered.rb1"
                },
                stage: new RB1RenderStage(this)
            }
            ,
            {
                buffers: {
                    DEPTH: "deffered.depth",
                    OUT: "deffered.rb2"
                },
                stage: new RB2RenderStage(this)
            }
            ,
            {
                buffers: {
                    RB1: "deffered.rb1",
                    RB2: "deffered.rb2",
                    DEPTH: "deffered.depth",
                    DIR:"jthree.light.dir1",
                    OUT: "deffered.light"
                },
                stage: new LightAccumulationRenderStage(this)
            },
            {
                buffers: {
                    LIGHT: "deffered.light",
                    OUT: "deffered.rb1",
                },
                stage: new FowardRenderStage(this)
            },
            // },
            {
                buffers: {
                    SOURCE: "deffered.rb1",
                    OUT: "default"
                },
                stage: new GrayScaleStage(this)
            }
            );
        this.renderStageManager.TextureBuffers = {
            "jthree.light.dir1":{
                generater: "rendererfit",
                internalFormat: "DEPTH",
                element: "USHORT"
            },
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
                internalFormat: "DEPTH",
                element: "USHORT"
            }
            , "deffered.light": {
                generater: "rendererfit",
                internalFormat: "RGBA",
                element: "UBYTE"
            }
        };
        this.renderStageManager.generateAllTextures();

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

    public enabled: boolean;

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
        return this.contextManager.Context;
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
}


export =RendererBase;
