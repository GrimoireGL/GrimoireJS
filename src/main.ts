import GrimoireInterface from "./Interface/GrimoireInterface";
import GomlLoader from "./Node/GomlLoader";

/**
 * Provides procedures for initializing.
 */
class GrimoireInitializer {

  /**
   * Start initializing
   * @return {Promise<void>} The promise which will be resolved when all of the Goml script was loaded.
   */
  public static async initialize(): Promise<void> {
    try {
      GrimoireInitializer._copyGLConstants();
      GrimoireInterface.initialize();
      await GrimoireInitializer._waitForDOMLoading();
      GrimoireInitializer._logVersions();
      await GrimoireInterface.resolvePlugins();
      await GomlLoader.loadForPage();
    } catch (e) {
      console.error(e);
    }
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
        const property = (<any>WebGLRenderingContext.prototype)[propName];
        (<any>WebGLRenderingContext)[propName] = property;
      }
    }
  }

  /**
   * Obtain the promise object which will be resolved when DOMContentLoaded event was rised.
   * @return {Promise<void>} the promise
   */
  private static _waitForDOMLoading(): Promise<void> {
    return new Promise<void>((resolve) => {
      window.addEventListener("DOMContentLoaded", () => {
        resolve();
      });
    });
  }

  private static _logVersions(): void {
    const gr = GrimoireInterface;
    if (!gr.debug) {
      return;
    }
    let log = `%cGrimoire.js v${(gr as any)["__VERSION__"]}\nplugins:\n\n`;
    let i = 1;
    for (let key in gr.lib) {
      const plugin = gr.lib[key];
      log += `  ${i} : ${plugin.__NAME__ || key}@${plugin.__VERSION__}\n`;
      i++;
    }
    log += `\nTo suppress this message,please inject a line "gr.debug = false;" on the initializing timing.`;
    console.log(log, "color:#44F;font-weight:bold;");
  }
}

/**
 * Just start the process.
 */
export default function(): typeof GrimoireInterface {
  GrimoireInitializer.initialize();
  GrimoireInterface.noConflictPreserve = (window as any)["gr"];
  return (window as any)["gr"] = (window as any)["GrimoireJS"] = GrimoireInterface;
}
