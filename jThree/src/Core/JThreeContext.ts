import GLSpecManager = require("./GLSpecManager");
﻿import ContextTimer = require("./ContextTimer");
import Timer = require("./Timer");
import GomlLoader = require("../Goml/GomlLoader");
import Delegates = require("../Base/Delegates");
import ResourceManager = require("./ResourceManager");
import Canvas = require("./Canvas");
import JThreeObject = require("../Base/JThreeObject");
import CanvasListChangedEventArgs = require("./CanvasListChangedEventArgs");
import SceneManager = require("./SceneManager");
import ListStateChangedType = require("./ListStateChangedType");
import AnimaterBase = require("../Goml/Animater/AnimaterBase");
import JThreeCollection = require("../Base/JThreeCollection");
import JThreeEvent = require("../Base/JThreeEvent");
import DebugInfo = require("../Debug/DebugInfo");
import ContextComponent = require("../ContextComponents");
import NewJThreeContext = require("../NJThreeContext");
import CanvasManager = require("./CanvasManager");
import ContextComponents = require("../ContextComponents");
import LoopManager = require("./LoopManager");
class JThreeContext extends JThreeObject
{
    private static instance:JThreeContext;

    /**
    * Every user of this library should not call this method.
    * You should use JThreeContextProxy.getInstance() instead of this function.
    *
    * If you want to know more, please see the doc comment of JThreeContextProxy
    */
    public static getInstanceForProxy()
    {
      JThreeContext.instance=JThreeContext.instance||new JThreeContext();
      return JThreeContext.instance;
    }

    private gomlLoader:GomlLoader;

    private animaters:JThreeCollection<AnimaterBase>=new JThreeCollection<AnimaterBase>();

    public addAnimater(animater:AnimaterBase):void
    {
      this.animaters.insert(animater);
    }

    private updateAnimation():void
    {
      var time=NewJThreeContext.getContextComponent<Timer>(ContextComponent.Timer).Time;
      this.animaters.each(v=>{
        if(v.update(time))this.animaters.del(v);
      });
    }
    /**
     * Getter for reference to manage entire scenes.
     */
    public get SceneManager(): SceneManager {
        return ;
    }
    /**
     * Getter for reference to manage gomls.
     */
    public get GomlLoader(): GomlLoader {
        return this.gomlLoader;
    }

    constructor() {
        super();
        this.gomlLoader = new GomlLoader();
        var canvasManager = NewJThreeContext.getContextComponent<CanvasManager>(ContextComponents.CanvasManager);
        var loopManager = NewJThreeContext.getContextComponent<LoopManager>(ContextComponent.LoopManager);
        var timer = NewJThreeContext.getContextComponent<ContextTimer>(ContextComponent.Timer);
        var sceneManager = NewJThreeContext.getContextComponent<SceneManager>(ContextComponent.SceneManager);
        loopManager.addAction(1000,()=>timer.updateTimer());
        loopManager.addAction(2000,()=>this.updateAnimation());
        loopManager.addAction(3000,()=>this.gomlLoader.update());
        loopManager.addAction(4000,()=>canvasManager.beforeRenderAll());
        loopManager.addAction(5000,()=>sceneManager.renderAll());
        loopManager.addAction(6000,()=>canvasManager.afterRenderAll());
    }
}

export=JThreeContext;
