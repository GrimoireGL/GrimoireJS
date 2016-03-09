import RenderStageRegistory from "./Core/Renderers/RenderStageRegistory";
import PrimitiveRegistory from "./Core/Geometries/Base/PrimitiveRegistory";
import MaterialManager from "./Core/Materials/Base/MaterialManager";
import Timer from "./Core/Timer";
import J3Object from "./Interface/J3Object";
import J3ObjectMixins from "./Interface/J3ObjectMixins";
J3ObjectMixins();
import JThreeContext from "./JThreeContext";
import SceneManager from "./Core/SceneManager";
import CanvasManager from "./Core/Canvas/CanvasManager";
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
    get Math() {
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
    static j3(argu) {
        if (typeof argu === "string") {
            return new J3Object(argu);
        }
        else if (typeof argu === "function") {
            const loader = JThreeContext.getContextComponent(ContextComponents.ResourceLoader);
            loader.promise.then(argu).catch((e) => {
                console.error(e);
            });
            return;
        }
        else {
            throw new Error("Selector query must be string.");
        }
    }
    /**
    * This method should be called when Jthree loaded.
    */
    static init() {
        JThreeInit._copyGLConstants();
        const scripts = document.getElementsByTagName("script");
        JThreeInit.selfTag = scripts[scripts.length - 1];
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
        window["j3"]["lateStart"] = JThreeInit._startInitialize;
        JThreeContext.init();
        JThreeContext.registerContextComponent(new LoopManager());
        JThreeContext.registerContextComponent(new Timer());
        JThreeContext.registerContextComponent(new ResourceLoader());
        JThreeContext.registerContextComponent(new SceneManager());
        JThreeContext.registerContextComponent(new CanvasManager());
        JThreeContext.registerContextComponent(new ResourceManager());
        JThreeContext.registerContextComponent(new NodeManager());
        JThreeContext.registerContextComponent(new Debugger());
        JThreeContext.registerContextComponent(new MaterialManager());
        JThreeContext.registerContextComponent(new PrimitiveRegistory());
        JThreeContext.registerContextComponent(new RenderStageRegistory());
        if (JThreeInit.selfTag.getAttribute("x-lateLoad") !== "true") {
            window.addEventListener("DOMContentLoaded", () => {
                JThreeInit._startInitialize();
            });
        }
    }
    static _copyGLConstants() {
        if (WebGLRenderingContext.ONE) {
            return;
        }
        for (let propName in WebGLRenderingContext.prototype) {
            if (/^[A-Z]/.test(propName)) {
                const property = WebGLRenderingContext.prototype[propName];
                WebGLRenderingContext[propName] = property;
            }
        }
    }
    static _startInitialize() {
        const nodeManager = JThreeContext.getContextComponent(ContextComponents.NodeManager); // This is not string but it is for conviniesnce.
        const loader = new GomlLoader(nodeManager, JThreeInit.selfTag);
        loader.initForPage();
        JThreeContext.getContextComponent(ContextComponents.PrimitiveRegistory).registerDefaultPrimitives();
        JThreeContext.getContextComponent(ContextComponents.Debugger).attach();
        const resourceLoader = JThreeContext.getContextComponent(ContextComponents.ResourceLoader);
        resourceLoader.promise.then(() => {
            JThreeContext.getContextComponent(ContextComponents.LoopManager).begin();
        });
    }
}
export default JThreeInit;
