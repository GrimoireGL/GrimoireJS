// import GrimoireInterface from "./GrimoireInterface";
import { GrimoireInterface } from "../Tool/Types";
import Utility from "../Tool/Utility";
import Environment from "./Environment";
import GomlLoader from "./GomlLoader";

interface IGrimoireWindow extends Window {
    GrimoireJS: GrimoireInterface;
    gr?: GrimoireInterface;
}

/**
 * Provides procedures for initializing.
 */
export default class GrimoireInitializer {

    /**
     * Start initializing
     * @return {Promise<void>} The promise which will be resolved when all of the Goml script was loaded.
     */
    public static async initialize(gr: GrimoireInterface): Promise<void> {
        try {
            GrimoireInitializer.setGlobalObject(gr);
            gr.handlePreservedPreference();

            GrimoireInitializer.notifyLibraryLoadingToWindow(window);

            // initialize core modules
            GrimoireInitializer.injectEnvironment();
            GrimoireInitializer.copyGLConstants();
            gr.registerBuiltinModule();

            // waite content and plugin loading
            await GrimoireInitializer.waitForDOMLoading();
            await GrimoireInitializer.waitForPluginLoadingSuspendPromise(gr);

            GrimoireInitializer.logVersions(gr);

            // waiting plugin dependency resolving
            await gr.resolvePlugins();

            // loading goml content.
            if (gr.autoLoading) {
                gr.startObservation();
                await GomlLoader.loadForPage();
                gr.callInitializedAlready = true;
                gr.initializedEventHandlers.forEach(handler => {
                    handler();
                });
            }
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * set GrimoireInterface to `gr` and `GrimoireJS` at window.
     * if exists `window.GrimoireJS`, then it set to `gr.libraryPreference`.
     * preserve `window.gr` to `gr.noConflictPreserve`.
     * @param gr GrimoireInterface
     */
    public static setGlobalObject(gr: GrimoireInterface) {
        const gwin = window as IGrimoireWindow;
        gr.libraryPreference = gwin.GrimoireJS as any;
        gr.noConflictPreserve = gwin.gr;
        gwin.gr = gwin.GrimoireJS = gr;
    }

    public static notifyLibraryLoadingToWindow(window: Window): void {
        window.postMessage({
            $source: "grimoirejs",
            $messageType: "library-loading",
        }, "*");
    }

    /**
     * inject browser environment to `Environment` object.
     */
    public static injectEnvironment(): void {
        Environment.DomParser = new DOMParser();
        Environment.document = document;
        Environment.Node = Node;
        Environment.XMLSerializer = new XMLSerializer();
    }

    /**
     * Ensure WebGLRenderingContext.[CONSTANTS] is exisiting.
     * Some of the browsers contains them in prototype.
     */
    public static copyGLConstants(): void {
        if (WebGLRenderingContext.ONE) {
            // Assume the CONSTANTS are already in WebGLRenderingContext
            // Chrome,Firefox,IE,Edge...
            return;
        }
        // Otherwise like ""Safari""
        for (const propName in WebGLRenderingContext.prototype) {
            if (/^[A-Z]/.test(propName)) {
                const property = (WebGLRenderingContext.prototype as any)[propName];
                (WebGLRenderingContext as any)[propName] = property;
            }
        }
    }

    /**
     * Obtain the promise object which will be resolved when DOMContentLoaded event was rised.
     * @return {Promise<void>} the promise
     */
    public static waitForDOMLoading(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (document.readyState === "loading") {
                window.addEventListener("DOMContentLoaded", () => {
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
    public static async waitForPluginLoadingSuspendPromise(gr: GrimoireInterface): Promise<void> {
        if (!gr.libraryPreference) {
            return;
        }
        await gr.libraryPreference.postponeLoading;
    }

    public static logVersions(gr: GrimoireInterface): void {
        if (!gr.debug) {
            return;
        }
        let log = `%cGrimoire.js v${(gr as any)["__VERSION__"]}\nplugins:\n\n`;
        let i = 1;
        for (const key in gr.lib) {
            const plugin = gr.lib[key];
            log += `  ${i} : ${plugin.__NAME__ || key}@${plugin.__VERSION__}\n`;
            i++;
        }
        log += '\nTo suppress this message,please inject a line "gr.debug = false;" on the initializing timing.';
        Utility.log(log, "color:#44F;font-weight:bold;");
    }

}
