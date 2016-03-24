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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkpUaHJlZUNvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBTUE7OztHQUdHO0FBQ0g7SUFBQTtRQUNFOztXQUVHO1FBQ0ssdUJBQWtCLEdBQTZCLEVBQUUsQ0FBQztJQXdDNUQsQ0FBQztJQXRDQzs7T0FFRztJQUNILE9BQWMsSUFBSTtRQUNoQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1gsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7WUFDMUMsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsT0FBYyx3QkFBd0IsQ0FBQyxnQkFBbUM7UUFDeEUsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFGLE9BQU8sQ0FBQyxJQUFJLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUN2RCxDQUFDO1FBQ0QsYUFBYSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLEdBQUcsZ0JBQWdCLENBQUM7SUFDM0csQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxPQUFjLG1CQUFtQixDQUFJLEtBQWE7UUFDaEQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELFdBQW1CLE9BQU87UUFDeEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNYLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQztRQUMzQixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ25CLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQUVELGVBQWUsYUFBYSxDQUFDIiwiZmlsZSI6IkpUaHJlZUNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSUNvbnRleHRDb21wb25lbnQgZnJvbSBcIi4vSUNvbnRleHRDb21wb25lbnRcIjtcblxuaW50ZXJmYWNlIEpUaHJlZVdpbmRvdyBleHRlbmRzIFdpbmRvdyB7XG4gIGozOiB7IGNvbnRleHQ6IGFueTsgfTtcbn1cbmRlY2xhcmUgdmFyIHdpbmRvdzogYW55O1xuLyoqXG4gKiBNb3N0IHRvcCBsZXZlbCBhcGkgY29udGFpbmVyIGZvciBqVGhyZWUuXG4gKiBAdHlwZSB7W3R5cGVdfVxuICovXG5jbGFzcyBKVGhyZWVDb250ZXh0IHtcbiAgLyoqXG4gICAqIFJlZ2lzdGVyZWQgY29udGV4dCBjb21wb25lbnQgcmVmZXJlbmNlc1xuICAgKi9cbiAgcHJpdmF0ZSBfY29udGV4dENvbXBvbmVudHM6IHsgW2luZGV4OiBudW1iZXJdOiBhbnkgfSA9IHt9O1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGpUaHJlZUNvbnRleHQgdG8gYmUgdXNlZC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaW5pdCgpOiB2b2lkIHtcbiAgICBpZiAod2luZG93KSB7IC8vIGZvciBoZWFkLWxlc3MgdGVzdFxuICAgICAgaWYgKCF3aW5kb3cuajMuY29udGV4dCkge1xuICAgICAgICB3aW5kb3cuajMuY29udGV4dCA9IG5ldyBKVGhyZWVDb250ZXh0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGNvbnRleHQgY29tcG9uZW50XG4gICAqIEBwYXJhbSAge0lDb250ZXh0Q29tcG9uZW50fSBjb250ZXh0Q29tcG9uZW50IGNvbnRleHQgY29tcG9uZW50IHlvdSB3YW50IHRvIHJlZ2lzdGVyXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyQ29udGV4dENvbXBvbmVudChjb250ZXh0Q29tcG9uZW50OiBJQ29udGV4dENvbXBvbmVudCk6IHZvaWQge1xuICAgIGlmIChKVGhyZWVDb250ZXh0LmNvbnRleHQuX2NvbnRleHRDb21wb25lbnRzW2NvbnRleHRDb21wb25lbnQuZ2V0Q29udGV4dENvbXBvbmVudEluZGV4KCldKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJSZXJlZ2lzdGVyYXRpb24gb2YgY29udGV4dCBjb21wb25lbnRcIik7XG4gICAgfVxuICAgIEpUaHJlZUNvbnRleHQuY29udGV4dC5fY29udGV4dENvbXBvbmVudHNbY29udGV4dENvbXBvbmVudC5nZXRDb250ZXh0Q29tcG9uZW50SW5kZXgoKV0gPSBjb250ZXh0Q29tcG9uZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCByZWdpc3RlcmVkIGNvbnRleHQgY29tcG9uZW50XG4gICAqIEBwYXJhbSAge251bWJlcn0gICAgICAgICAgICBpbmRleCBjb250ZXh0IGNvbXBvbmVudCBpbmRleCBvZiBhIGNvbnRleHQgY29tcG9uZW50IHlvdSB3YW50IHRvIG9idGFpbi5cbiAgICogQHJldHVybiB7SUNvbnRleHRDb21wb25lbnR9ICAgICAgY29udGV4dCBjb21wb25lbnQgcmVsYXRlZCB0byB0aGUgYXJndW1lbnRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0Q29udGV4dENvbXBvbmVudDxUPihpbmRleDogbnVtYmVyKTogVCB7XG4gICAgcmV0dXJuIEpUaHJlZUNvbnRleHQuY29udGV4dC5fY29udGV4dENvbXBvbmVudHNbaW5kZXhdO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZ2V0IGNvbnRleHQoKTogSlRocmVlQ29udGV4dCB7XG4gICAgaWYgKHdpbmRvdykgeyAvLyBmb3IgaGVhZC1sZXNzIHRlc3RcbiAgICAgIHJldHVybiB3aW5kb3cuajMuY29udGV4dDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSlRocmVlQ29udGV4dDtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
