import Environment from "./Core/Environment";
import GomlLoader from "./Core/GomlLoader";
import GrimoireInterface from "./Core/GrimoireInterface";

interface IGrimoireWindow extends Window {
  GrimoireJS: typeof GrimoireInterface;
  gr?: typeof GrimoireInterface;
}

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
      GrimoireInitializer._notifyLibraryLoadingToWindow();
      GrimoireInitializer._copyGLConstants();
      GrimoireInitializer._injectEnvironment();
      GrimoireInterface.initialize();
      await GrimoireInitializer._waitForDOMLoading();
      await GrimoireInitializer._waitForPluginLoadingSuspendPromise();
      GrimoireInitializer._logVersions();
      await GrimoireInterface.resolvePlugins();
      if (GrimoireInterface.autoLoading) {
        GrimoireInterface.startObservation();
        await GomlLoader.loadForPage();
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * inject browser environment
   */
  private static _injectEnvironment(): void {
    Environment.DomParser = new DOMParser();
    Environment.document = document;
    Environment.Node = Node;
    Environment.XMLSerializer = new XMLSerializer();
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
  private static _waitForDOMLoading(): Promise<void> {
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

  private static _logVersions(): void {
    const gr = GrimoireInterface;
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
    console.log(log, "color:#44F;font-weight:bold;");
  }

  private static _notifyLibraryLoadingToWindow(): void {
    window.postMessage({
      $source: "grimoirejs",
      $messageType: "library-loading",
    }, "*");
  }

  private static async _waitForPluginLoadingSuspendPromise(): Promise<void> {
    if (!GrimoireInterface.libraryPreference) {
      return;
    }
    await (GrimoireInterface.libraryPreference["postponeLoading"] as Promise<void>);
  }
}

/**
 * Just start the process.
 */
export default function(): typeof GrimoireInterface {
  const gwin = window as IGrimoireWindow;
  if (gwin.GrimoireJS) {
    GrimoireInterface.libraryPreference = gwin.GrimoireJS;
  }
  GrimoireInterface.noConflictPreserve = gwin.gr;
  gwin.gr = gwin.GrimoireJS = GrimoireInterface;
  GrimoireInitializer.initialize();
  return GrimoireInterface;
}
