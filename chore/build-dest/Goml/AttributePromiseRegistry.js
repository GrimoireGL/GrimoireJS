import jThreeObject from "../Base/JThreeObject";
class AttributePromiseRegistry extends jThreeObject {
    constructor() {
        super();
        /**
         * promise objects which is registed.
         */
        this._promises = [];
        /**
         * this flag is true when async method is called.
         * @type {boolean}
         */
        this._asyncing = false;
        /**
         * all expected arguments object of all promises.
         * @type {GomlAttribute[]}
         */
        this._asyncObjects = [];
        /**
         * callback function which is called when all promise objects are resolved.
         * @type {[type]}
         */
        this._allOfCallbackfn = null;
    }
    /**
     * register promise object and expected callback arguments object when promise is resolved.
     * @param {Q.Promise<GomlAttribute>} promise        [description]
     * @param {GomlAttribute}            callbackObject [description]
     */
    register(promise, callbackObject) {
        this._promises.push(promise);
        this._asyncObjects.push(callbackObject);
        if (this._asyncing) {
            promise.then((ga) => {
                this._thenCallbacckfn(ga);
            });
        }
    }
    /**
     * sync all registered promises.
     * @param {() => void} callbackfn [description]
     */
    async(callbackfn) {
        this._asyncing = true;
        this._allOfCallbackfn = callbackfn;
        this._promises.forEach((p) => {
            p.then((ga) => {
                this._thenCallbacckfn(ga);
            });
        });
    }
    /**
     * clear all async sequence.
     */
    clear() {
        this._asyncing = false;
        this._promises = [];
        this._asyncObjects = [];
        this._allOfCallbackfn = null;
    }
    /**
     * [_thenCallbacckfn description]
     * @param {GomlAttribute} ga [description]
     */
    _thenCallbacckfn(ga) {
        const index = this._asyncObjects.indexOf(ga);
        if (index !== -1) {
            this._asyncObjects.splice(index, 1);
        }
        else {
            throw Error("registered object does not equal to callback object");
        }
        console.log(this._asyncObjects);
        if (this._asyncObjects.length === 0) {
            this._allOfCallbackfn();
            this.clear();
        }
    }
}
export default AttributePromiseRegistry;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdvbWwvQXR0cmlidXRlUHJvbWlzZVJlZ2lzdHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLFlBQVksTUFBTSxzQkFBc0I7QUFJL0MsdUNBQXVDLFlBQVk7SUFDakQ7UUFDRSxPQUFPLENBQUM7UUFHVjs7V0FFRztRQUNLLGNBQVMsR0FBK0IsRUFBRSxDQUFDO1FBRW5EOzs7V0FHRztRQUNLLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFFbkM7OztXQUdHO1FBQ0ssa0JBQWEsR0FBb0IsRUFBRSxDQUFDO1FBRTVDOzs7V0FHRztRQUNLLHFCQUFnQixHQUFlLElBQUksQ0FBQztJQXZCNUMsQ0FBQztJQXlCRDs7OztPQUlHO0lBQ0ksUUFBUSxDQUFDLE9BQWlDLEVBQUUsY0FBNkI7UUFDOUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDeEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzVCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSSxLQUFLLENBQUMsVUFBc0I7UUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFVBQVUsQ0FBQztRQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDdkIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7Z0JBQ1IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzVCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxLQUFLO1FBQ1YsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztJQUMvQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssZ0JBQWdCLENBQUMsRUFBaUI7UUFDeEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0MsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxLQUFLLENBQUMscURBQXFELENBQUMsQ0FBQztRQUNyRSxDQUFDO1FBQ0EsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZixDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFFRCxlQUFlLHdCQUF3QixDQUFDIiwiZmlsZSI6IkdvbWwvQXR0cmlidXRlUHJvbWlzZVJlZ2lzdHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGpUaHJlZU9iamVjdCBmcm9tIFwiLi4vQmFzZS9KVGhyZWVPYmplY3RcIjtcbmltcG9ydCBHb21sQXR0cmlidXRlIGZyb20gXCIuL0dvbWxBdHRyaWJ1dGVcIjtcbmltcG9ydCBRIGZyb20gXCJxXCI7XG5cbmNsYXNzIEF0dHJpYnV0ZVByb21pc2VSZWdpc3RyeSBleHRlbmRzIGpUaHJlZU9iamVjdCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogcHJvbWlzZSBvYmplY3RzIHdoaWNoIGlzIHJlZ2lzdGVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfcHJvbWlzZXM6IFEuUHJvbWlzZTxHb21sQXR0cmlidXRlPltdID0gW107XG5cbiAgLyoqXG4gICAqIHRoaXMgZmxhZyBpcyB0cnVlIHdoZW4gYXN5bmMgbWV0aG9kIGlzIGNhbGxlZC5cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBwcml2YXRlIF9hc3luY2luZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBhbGwgZXhwZWN0ZWQgYXJndW1lbnRzIG9iamVjdCBvZiBhbGwgcHJvbWlzZXMuXG4gICAqIEB0eXBlIHtHb21sQXR0cmlidXRlW119XG4gICAqL1xuICBwcml2YXRlIF9hc3luY09iamVjdHM6IEdvbWxBdHRyaWJ1dGVbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBjYWxsYmFjayBmdW5jdGlvbiB3aGljaCBpcyBjYWxsZWQgd2hlbiBhbGwgcHJvbWlzZSBvYmplY3RzIGFyZSByZXNvbHZlZC5cbiAgICogQHR5cGUge1t0eXBlXX1cbiAgICovXG4gIHByaXZhdGUgX2FsbE9mQ2FsbGJhY2tmbjogKCkgPT4gdm9pZCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIHJlZ2lzdGVyIHByb21pc2Ugb2JqZWN0IGFuZCBleHBlY3RlZCBjYWxsYmFjayBhcmd1bWVudHMgb2JqZWN0IHdoZW4gcHJvbWlzZSBpcyByZXNvbHZlZC5cbiAgICogQHBhcmFtIHtRLlByb21pc2U8R29tbEF0dHJpYnV0ZT59IHByb21pc2UgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtIHtHb21sQXR0cmlidXRlfSAgICAgICAgICAgIGNhbGxiYWNrT2JqZWN0IFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHB1YmxpYyByZWdpc3Rlcihwcm9taXNlOiBRLlByb21pc2U8R29tbEF0dHJpYnV0ZT4sIGNhbGxiYWNrT2JqZWN0OiBHb21sQXR0cmlidXRlKTogdm9pZCB7XG4gICAgdGhpcy5fcHJvbWlzZXMucHVzaChwcm9taXNlKTtcbiAgICB0aGlzLl9hc3luY09iamVjdHMucHVzaChjYWxsYmFja09iamVjdCk7XG4gICAgaWYgKHRoaXMuX2FzeW5jaW5nKSB7XG4gICAgICBwcm9taXNlLnRoZW4oKGdhKSA9PiB7XG4gICAgICAgIHRoaXMuX3RoZW5DYWxsYmFjY2tmbihnYSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogc3luYyBhbGwgcmVnaXN0ZXJlZCBwcm9taXNlcy5cbiAgICogQHBhcmFtIHsoKSA9PiB2b2lkfSBjYWxsYmFja2ZuIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHB1YmxpYyBhc3luYyhjYWxsYmFja2ZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fYXN5bmNpbmcgPSB0cnVlO1xuICAgIHRoaXMuX2FsbE9mQ2FsbGJhY2tmbiA9IGNhbGxiYWNrZm47XG4gICAgdGhpcy5fcHJvbWlzZXMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgcC50aGVuKChnYSkgPT4ge1xuICAgICAgICB0aGlzLl90aGVuQ2FsbGJhY2NrZm4oZ2EpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogY2xlYXIgYWxsIGFzeW5jIHNlcXVlbmNlLlxuICAgKi9cbiAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuICAgIHRoaXMuX2FzeW5jaW5nID0gZmFsc2U7XG4gICAgdGhpcy5fcHJvbWlzZXMgPSBbXTtcbiAgICB0aGlzLl9hc3luY09iamVjdHMgPSBbXTtcbiAgICB0aGlzLl9hbGxPZkNhbGxiYWNrZm4gPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFtfdGhlbkNhbGxiYWNja2ZuIGRlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0ge0dvbWxBdHRyaWJ1dGV9IGdhIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHByaXZhdGUgX3RoZW5DYWxsYmFjY2tmbihnYTogR29tbEF0dHJpYnV0ZSk6IHZvaWQge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fYXN5bmNPYmplY3RzLmluZGV4T2YoZ2EpO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIHRoaXMuX2FzeW5jT2JqZWN0cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBFcnJvcihcInJlZ2lzdGVyZWQgb2JqZWN0IGRvZXMgbm90IGVxdWFsIHRvIGNhbGxiYWNrIG9iamVjdFwiKTtcbiAgICB9XG4gICAgIGNvbnNvbGUubG9nKHRoaXMuX2FzeW5jT2JqZWN0cyk7XG4gICAgaWYgKHRoaXMuX2FzeW5jT2JqZWN0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuX2FsbE9mQ2FsbGJhY2tmbigpO1xuICAgICAgdGhpcy5jbGVhcigpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBdHRyaWJ1dGVQcm9taXNlUmVnaXN0cnk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
