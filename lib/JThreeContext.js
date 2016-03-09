/**
 * Most top level api container for jThree.
 * @type {[type]}
 */
class JThreeContext {
    constructor() {
        /**
         * Registered context component references
         */
        this._contextComponents = {};
    }
    /**
     * Initialize jThreeContext to be used.
     */
    static init() {
        if (window) {
            if (!window.j3.context) {
                window.j3.context = new JThreeContext();
            }
        }
    }
    /**
     * Register context component
     * @param  {IContextComponent} contextComponent context component you want to register
     */
    static registerContextComponent(contextComponent) {
        if (JThreeContext.context._contextComponents[contextComponent.getContextComponentIndex()]) {
            console.warn("Reregisteration of context component");
        }
        JThreeContext.context._contextComponents[contextComponent.getContextComponentIndex()] = contextComponent;
    }
    /**
     * Get registered context component
     * @param  {number}            index context component index of a context component you want to obtain.
     * @return {IContextComponent}      context component related to the argument
     */
    static getContextComponent(index) {
        return JThreeContext.context._contextComponents[index];
    }
    static get context() {
        if (window) {
            return window.j3.context;
        }
        else {
            return undefined;
        }
    }
}
export default JThreeContext;
