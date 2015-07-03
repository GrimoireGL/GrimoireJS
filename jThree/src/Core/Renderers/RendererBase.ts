import ContextManagerBase = require("./../ContextManagerBase");
import Delegates = require("../../Delegates");
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
/**
 * Provides base class feature for renderer classes.
 */
class RendererBase extends jThreeObjectWithID {

    private camera: Camera;

    public get Camera(): Camera {
        return this.camera;
    }

    public set Camera(camera: Camera) {
        this.camera = camera;
    }

    public get RenderStages(): RenderStageBase[] {
        return [];
    }

    constructor(contextManager: ContextManagerBase) {
        super();
        this.contextManager = contextManager;
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
            , {
                buffers: {
                    RB1: "deffered.rb1",
                    RB2: "deffered.rb2",
                    DEPTH: "deffered.depth",
                    OUT: "deffered.light"
                },
                stage: new LightAccumulationRenderStage(this)
            },
         {
            buffers:{
                LIGHT:"deffered.light",
                OUT:"default"
            },
            stage:new FowardRenderStage(this)
        }
            );
    }

    public enabled: boolean;

    render(drawAct: Delegates.Action0): void {
        throw new Exceptions.AbstractClassMethodCalledException();
    }

    private contextManager: ContextManagerBase;
    public get ContextManager(): ContextManagerBase {
        return this.contextManager;
    }

    public get GLContext(): GLContextWrapperBase {
        return this.contextManager.Context;
    }

    public beforeRender() {
        this.ContextManager.beforeRender(this);
    }

    public afterRender() {
        this.ContextManager.afterRender(this);
    }

    public configureRenderer() {

    }

    private renderStageManager: RenderStageManager = new RenderStageManager(this);
    /**
     * Provides render stage abstraction
     */
    public get RenderStageManager(): RenderStageManager {
        return this.renderStageManager;
    }
}


export =RendererBase;
