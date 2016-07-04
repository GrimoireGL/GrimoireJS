import GomlTreeNodeBase from "./Goml/GomlTreeNodeBase";
import isArray from "lodash.isarray";
import PrimitiveRegistory from "./Core/Geometries/Base/PrimitiveRegistory";
import J3Object from "./Interface/J3Object"; // This must be the first time of import J3Object
import J3ObjectMixins from "./Interface/J3ObjectMixins"; // Apply mixins
J3ObjectMixins();
import LoopManager from "./Core/LoopManager";
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

    public static selfTag: HTMLScriptElement;

    /**
    * Actual definition of j3("selector") syntax.
    * This method have two roles.
    * 1, to use for select elements like jQuery in GOML.
    * 2, to use for subscribing eventhandler to be called when j3 is loaded.
    */
    public static j3(selector: string): J3Object;
    public static j3(callbackfn: () => void): void;
    public static j3(argu: any): any {
        if (typeof argu === "string"
            || argu instanceof GomlTreeNodeBase
            || (isArray(argu) && (<any[]>argu).every((v) => v instanceof GomlTreeNodeBase))) {
            return new J3Object(argu);
        } else if (typeof argu === "function") {
            ResourceLoader.promise.then(argu).catch((e) => {
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
    public static async init(): Promise<void> {
        JThreeInit._copyGLConstants();
        const scripts = document.getElementsByTagName("script");
        JThreeInit.selfTag = scripts[scripts.length - 1];
        JThreeInit._includeInnerModules();
        window["gr"]["lateStart"] = JThreeInit._startInitialize;

        if (JThreeInit.selfTag.getAttribute("x-lateLoad") !== "true") {
            await JThreeInit._waitForDOMLoad();
            await JThreeInit._startInitialize();
        }
    }

    private static _includeInnerModules(): void {
        Object.getOwnPropertyNames(JThreeStatic.prototype).forEach((name) => {
            if (name !== "constructor") {
                const org_descriptor = Object.getOwnPropertyDescriptor(JThreeStatic, name);
                const descriptor = {
                    value: JThreeStatic.prototype[name],
                    enumerable: false,
                    configurable: true,
                    writable: true,
                };
                Object.defineProperty(Object.getPrototypeOf(window["gr"]), name, org_descriptor || descriptor);
            }
        });
    }

    private static _copyGLConstants(): void {
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

    private static _waitForDOMLoad(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            window.addEventListener("DOMContentLoaded", () => {
                resolve();
            });
        });
    }

    private static async _startInitialize(): Promise<void> {
        const loader = new GomlLoader(JThreeInit.selfTag);
        PrimitiveRegistory.registerDefaultPrimitives();
        Debugger.attach();
        loader.initForPage();
        await ResourceLoader.promise;
        LoopManager.begin();
    }
}
export default JThreeInit;
