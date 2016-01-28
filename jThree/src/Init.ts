import RenderStageRegistory from "./Core/Renderers/RenderStageRegistory";
import PrimitiveRegistory from "./Core/Geometries/Base/PrimitiveRegistory";
import MaterialManager from "./Core/Materials/Base/MaterialManager";
import Timer from "./Core/Timer";
import J3Object from "./Interface/J3Object"; // This must be the first time of import J3Object
import J3ObjectMixins from "./Interface/J3ObjectMixins"; // Apply mixins
J3ObjectMixins();
import {Action0} from "./Base/Delegates";
import BehaviorDeclaration from "./Goml/Behaviors/BehaviorDeclaration";
import BehaviorDeclarationBody from "./Goml/Behaviors/BehaviorDeclarationBody";
import JThreeContext from "./JThreeContext";
import SceneManager from "./Core/SceneManager";
import CanvasManager from "./Core/CanvasManager";
import LoopManager from "./Core/LoopManager";
import ContextComponents from "./ContextComponents";
import ResourceManager from "./Core/ResourceManager";
import NodeManager from "./Goml/NodeManager";
import Debugger from "./Debug/Debugger";
import GomlLoader from "./Goml/GomlLoader";
import ResourceLoader from "./Core/ResourceLoader";

import Quaternion from "./Math/Quaternion";
import Vector2 from "./Math/Vector2";
import Vector3 from "./Math/Vector3";
import Vector4 from "./Math/Vector4";

/**
* the methods having the syntax like j3.SOMETHING() should be contained in this class.
* These methods declared inside of this class will be subscribed in JThreeInit.Init(),it means the first time.
*/
class JThreeStatic {
  public defineBehavior(behaviorName: string, decl: BehaviorDeclarationBody | Action0);
  public defineBehavior(declarations: BehaviorDeclaration);
  public defineBehavior(nameOrDeclarations: string | BehaviorDeclaration, declaration?: BehaviorDeclarationBody | Action0) {
    JThreeContext.getContextComponent<NodeManager>(ContextComponents.NodeManager).behaviorRegistry.defineBehavior(<string>nameOrDeclarations, declaration); // This is not string but it is for conviniesnce.
  }

  public get Math() {
    return {
      Quaternion: Quaternion,
      Vector2: Vector2,
      Vector3: Vector3,
      Vector4: Vector4,
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
  public static j3(argu: string | Action0): J3Object {
    if (typeof argu === "string") {
      return new J3Object(argu);
    } else if (typeof argu === "function") {
      const loader = JThreeContext.getContextComponent<ResourceLoader>(ContextComponents.ResourceLoader);
      loader.promise.then(argu).catch((e) => {
        console.error(e);
      });
      return;
    } else {
      throw new Error("Selector query must be string.");
    }
  }

  /**
  * This method should be called when Jthree loaded.
  */
  public static Init(): void {
    const scripts = document.getElementsByTagName("script");
    JThreeInit.SelfTag = scripts[scripts.length - 1];
    // register interfaces
    window["j3"] = JThreeInit.j3; // $(~~~)

    const baseCtor = JThreeStatic;
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      if (name !== "constructor") {
        const org_descriptor = Object.getOwnPropertyDescriptor(baseCtor, name);
        const descriptor = {
          value: baseCtor.prototype[name],
          enumerable: false,
          configurable: true,
          writable: true,
        };
        Object.defineProperty(Object.getPrototypeOf(window["j3"]), name, org_descriptor || descriptor);
      }
    });

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
    JThreeContext.registerContextComponent(new RenderStageRegistory());
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
export default JThreeInit;
