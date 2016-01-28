import IContextComponent from "./IContextComponent";

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
   * Registered context component references
   */
  private contextComponents: { [index: number]: any } = {};

  /**
   * Initialize jThreeContext to be used.
   */
  public static init() {
    if (window) { // for head-less test
      if (!window.j3.context) {
        window.j3.context = new JThreeContext();
      }
    }
  }

  /**
   * Register context component
   * @param  {IContextComponent} contextComponent context component you want to register
   */
  public static registerContextComponent(contextComponent: IContextComponent): void {
    if (JThreeContext.context.contextComponents[contextComponent.getContextComponentIndex()]) console.warn("Reregisteration of context component");
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

  private static get context(): JThreeContext {
    if (window) { // for head-less test
      return window.j3.context;
    } else {
      return undefined;
    }
  }
}

export default JThreeContext;
