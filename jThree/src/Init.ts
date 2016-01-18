import PrimitiveRegistory = require("./Core/Geometries/Base/PrimitiveRegistory");
import BasicMaterial = require("./Core/Materials/Base/BasicMaterial");
import MaterialManager = require("./Core/Materials/Base/MaterialManager");
import Timer = require("./Core/Timer");
import Delegates = require("./Base/Delegates");
import JThreeInterface = require("./Interface/JThreeInterface");
import BehaviorDeclaration = require("./Goml/Behaviors/BehaviorDeclaration");
import BehaviorDeclarationBody = require("./Goml/Behaviors/BehaviorDeclarationBody");
import agent = require("superagent");
import JThreeLogger = require("./Base/JThreeLogger");
import JThreeContext = require("./JThreeContext");
import SceneManager = require("./Core/SceneManager");
import CanvasManager = require("./Core/CanvasManager");
import LoopManager = require("./Core/LoopManager");
import ContextComponents = require("./ContextComponents");
import ResourceManager = require("./Core/ResourceManager");
import NodeManager = require("./Goml/NodeManager");
import Debugger = require("./Debug/Debugger");
import GomlLoader = require("./Goml/GomlLoader");
import ResourceLoader = require("./Core/ResourceLoader");

/**
* the methods having the syntax like j3.SOMETHING() should be contained in this class.
* These methods declared inside of this class will be subscribed in JThreeInit.Init(),it means the first time.
*/
class JThreeStatic {
  public defineBehavior(behaviorName: string, decl: BehaviorDeclarationBody | Delegates.Action0);
  public defineBehavior(declarations: BehaviorDeclaration);
  public defineBehavior(nameOrDeclarations: string | BehaviorDeclaration, declaration?: BehaviorDeclarationBody | Delegates.Action0) {
    JThreeContext.getContextComponent<NodeManager>(ContextComponents.NodeManager).behaviorRegistry.defineBehavior(<string>nameOrDeclarations, declaration); // This is not string but it is for conviniesnce.
  }

  public get Math() {
    return {
      Quaternion: require("./Math/Quaternion"),
      Vector2:
      require("./Math/Vector2"),
      Vector3:
      require("./Math/Vector3"),
      Vector4:
      require("./Math/Vector4")
    };
  }
}

/**
* Provides initialization of jThree.js
* You don't need to call this class directly, jThreeInit will be called automatically when jThree.js is loaded.
*/
class JThreeInit {

  public static SelfTag: HTMLScriptElement;

  /**
  * Actual definition of j3("selector") syntax.
  * This method have two roles.
  * 1, to use for select elements like jQuery in GOML.
  * 2, to use for subscribing eventhandler to be called when j3 is loaded.
  */
  public static j3(query: string | Delegates.Action0): JThreeInterface {
    // var nodeManager = JThreeContext.getContextComponent<NodeManager>(ContextComponents.NodeManager);//This is not string but it is for conviniesnce.
    // if (typeof query === 'function') {//check whether this is function or not.
    //     nodeManager.loadedHandler.addListener(query);
    //     return undefined;//when function was subscribed, it is no need to return JThreeInterface.
    // }
    // var targetObject: NodeList = nodeManager.htmlRoot.querySelectorAll(<string>query); //call as query
    // return new JThreeInterface(targetObject);
    return;
  }

  /**
  * This method should be called when Jthree loaded.
  */
  public static Init(): void {
    const scripts = document.getElementsByTagName("script");
    JThreeInit.SelfTag = scripts[scripts.length - 1];
    // register interfaces
    window["j3"] = JThreeInit.j3; // $(~~~)
    const pro = Object.getPrototypeOf(window["j3"]);
    for (let key in JThreeStatic.prototype) {
      pro[key] = JThreeStatic.prototype[key];
    }
    window["j3"]["lateStart"] = JThreeInit.startInitialize;
    JThreeContext.init();
    JThreeContext.registerContextComponent(new Timer());
    JThreeContext.registerContextComponent(new LoopManager());
    JThreeContext.registerContextComponent(new ResourceLoader());
    JThreeContext.registerContextComponent(new SceneManager());
    JThreeContext.registerContextComponent(new CanvasManager());
    JThreeContext.registerContextComponent(new ResourceManager());
    JThreeContext.registerContextComponent(new NodeManager());
    JThreeContext.registerContextComponent(new Debugger());
    JThreeContext.registerContextComponent(new MaterialManager());
    JThreeContext.registerContextComponent(new PrimitiveRegistory());
    const canvasManager = JThreeContext.getContextComponent<CanvasManager>(ContextComponents.CanvasManager);
    const loopManager = JThreeContext.getContextComponent<LoopManager>(ContextComponents.LoopManager);
    const timer = JThreeContext.getContextComponent<Timer>(ContextComponents.Timer);
    const sceneManager = JThreeContext.getContextComponent<SceneManager>(ContextComponents.SceneManager);
    loopManager.addAction(1000, () => timer.updateTimer());
    // loopManager.addAction(2000,()=>this.updateAnimation());
    // loopManager.addAction(3000,()=>this.gomlLoader.update());
    loopManager.addAction(4000, () => canvasManager.beforeRenderAll());
    loopManager.addAction(5000, () => sceneManager.renderAll());
    loopManager.addAction(6000, () => canvasManager.afterRenderAll());
    if (JThreeInit.SelfTag.getAttribute("x-lateLoad") !== "true") {
      window.addEventListener("DOMContentLoaded", () => {
      JThreeInit.startInitialize();
    });
    }
  }

  private static startInitialize() {
    const nodeManager = JThreeContext.getContextComponent<NodeManager>(ContextComponents.NodeManager); // This is not string but it is for conviniesnce.
    const loader = new GomlLoader(nodeManager, JThreeInit.SelfTag);
    loader.initForPage();
    JThreeContext.getContextComponent<PrimitiveRegistory>(ContextComponents.PrimitiveRegistory).registerDefaultPrimitives();
    JThreeContext.getContextComponent<Debugger>(ContextComponents.Debugger).attach();
    const resourceLoader = JThreeContext.getContextComponent<ResourceLoader>(ContextComponents.ResourceLoader);
    resourceLoader.promise.then(() => {
      JThreeContext.getContextComponent<LoopManager>(ContextComponents.LoopManager).begin();
    });
  }
}
export = JThreeInit;
