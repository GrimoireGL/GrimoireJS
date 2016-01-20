import IContextComponent = require("./IContextComponent");
interface JThreeWindow extends Window {
  j3: { context: any; };
}
declare var window: any;
/**
 * Most top level api container for jThree.
 * @type {[type]}
 */
class JThreeContext {
  /**
   * Initialize jThreeContext to be used.
   */
  public static init() {
    if (!window.j3.context) {
      window.j3.context = new JThreeContext();
    }
  }

  private static get context(): JThreeContext {
    return window.j3.context;
  }

  /**
   * Registered context component references
   */
  private contextComponents: { [index: number]: any } = {};

  /**
   * Register context component
   * @param  {IContextComponent} contextComponent context component you want to register
   */
  public static registerContextComponent(contextComponent: IContextComponent): void {
    if (JThreeContext.context.contextComponents[contextComponent.getContextComponentIndex()]) {
      console.warn("Reregisteration of context component");
    }
    JThreeContext.context.contextComponents[contextComponent.getContextComponentIndex()] = contextComponent;
  }

  /**
   * Get registered context component
   * @param  {number}            index context component index of a context component you want to obtain.
   * @return {IContextComponent}      context component related to the argument
   */
  public static getContextComponent<T>(index: number): T {
    return JThreeContext.context.contextComponents[index];
  }
}

export = JThreeContext;
