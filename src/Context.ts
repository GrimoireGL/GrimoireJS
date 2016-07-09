import IContextComponent from "./IContextComponent";

interface WindowWithContext extends Window {
  j3: { context: any; };
}
declare var window: any;
/**
 * Most top level api container for jThree.
 * @type {[type]}
 */
class Context {
  /**
   * Registered context component references
   */
  private _contextComponents: { [index: number]: any } = {};

  /**
   * Initialize Context to be used.
   */
  public static init(): void {
    if (!window.j3.context) {
      window.j3.context = new Context();
    }
  }

  /**
   * Register context component
   * @param  {IContextComponent} contextComponent context component you want to register
   */
  public static registerContextComponent(contextComponent: IContextComponent): void {
    if (Context.context._contextComponents[contextComponent.getContextComponentIndex()]) {
      console.warn("Reregisteration of context component");
    }
    Context.context._contextComponents[contextComponent.getContextComponentIndex()] = contextComponent;
  }

  /**
   * Get registered context component
   * @param  {number}            index context component index of a context component you want to obtain.
   * @return {IContextComponent}      context component related to the argument
   */
  public static getContextComponent<T>(index: number): T {
    return Context.context._contextComponents[index];
  }

  private static get context(): Context {
    return window.j3.context;
  }
}

export default Context;
