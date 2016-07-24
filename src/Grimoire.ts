import DefaultPluginRegister from "./Core/Node/DefaultPluginRegister";
import GrimoireInterface from "./Core/GrimoireInterface";
import GOMLLoader from "./Core/Node/GOMLLoader";
/**
 * Provides procedures for initializing.
 */
class GrimoireInitializer {

    /**
     * Start initializing
     * @return {Promise<void>} The promise which will be resolved when all of the GOML script was loaded.
     */
    public static async initialize(): Promise<void> {
        GrimoireInitializer._copyGLConstants();
        await GrimoireInitializer._waitForDOMLoading();
        await GrimoireInitializer._resolvePlugins();
        await GOMLLoader.loadForPage();
    }

    /**
     * Ensure WebGLRenderingContext.[CONSTANTS] is exisiting.
     * Some of the browsers contains them in prototype.
     */
    private static _copyGLConstants(): void {
        if (WebGLRenderingContext.ONE) {
            // Assume the CONSTANTS are already in WebGLRenderingContext
            // Chrome,Firefox,IE,Edge...
            return;
        }
        // Otherwise like ""Safari""
        for (let propName in WebGLRenderingContext.prototype) {
            if (/^[A-Z]/.test(propName)) {
                const property = WebGLRenderingContext.prototype[propName];
                WebGLRenderingContext[propName] = property;
            }
        }
    }

    private static async _resolvePlugins(): Promise<void> {
     for (let i = 0; i < GrimoireInterface.loadTasks.length; i++) {
         const task = GrimoireInterface.loadTasks[i];
         await task();
     }
    }
    /**
     * Obtain the promise object which will be resolved when DOMContentLoaded event was rised.
     * @return {Promise<void>} the promise
     */
    private static async _waitForDOMLoading(): Promise<void> {
        return new Promise<void>((resolve) => {
            window.addEventListener("DOMContentLoaded", () => {
                resolve();
            });
        });
    }
}

/**
 * Just start the process.
 */
GrimoireInitializer.initialize();
DefaultPluginRegister.register();
