import ContextComponents from "../ContextComponents";
import Q from "q";
class ResourceLoader {
    constructor() {
        this.resourceCount = 0;
        this.loadedResourceCount = 0;
        this.completedResourceCount = 0;
        this.erroredResourceCount = 0;
        this.currentLoadingMessage = "";
        this._resourceLoadingDeferred = Q.defer();
    }
    get isLoading() {
        return !!this._resourceLoadingDeferred;
    }
    get promise() {
        return this._resourceLoadingDeferred.promise;
    }
    getResourceLoadingDeffered() {
        this.resourceCount++;
        const d = Q.defer();
        this._registerForResourceLoaded(d.promise);
        return d;
    }
    getContextComponentIndex() {
        return ContextComponents.ResourceLoader;
    }
    /**
     * INTERNAL USE
     * Register promise to be able to check status when the promise notify state.
     * @param {Q.Promise<void>} promise [description]
     */
    _registerForResourceLoaded(promise) {
        promise.then(() => {
            this.loadedResourceCount++;
            this.completedResourceCount++;
            this._checkResourceLoaded();
        }, () => {
            this.completedResourceCount++;
            this.erroredResourceCount++;
            this._checkResourceLoaded();
        }, (s) => {
            this.currentLoadingMessage = s;
        });
    }
    /**
     * Check whether all resources was loaded after fulfilled or errored subscribed deffereds.
     */
    _checkResourceLoaded() {
        if (this.completedResourceCount === this.resourceCount) {
            this._resourceLoadingDeferred.resolve({
                hasNoError: this.erroredResourceCount > 0,
                erroredResource: this.erroredResourceCount,
                loadedResource: this.loadedResourceCount,
                completedResource: this.completedResourceCount,
                lastLoadMessage: this.currentLoadingMessage,
                resourceCount: this.resourceCount
            });
            this._resourceLoadingDeferred = null;
        }
        else {
            this._resourceLoadingDeferred.notify({
                hasNoError: this.erroredResourceCount > 0,
                erroredResource: this.erroredResourceCount,
                loadedResource: this.loadedResourceCount,
                completedResource: this.completedResourceCount,
                lastLoadMessage: this.currentLoadingMessage,
                resourceCount: this.resourceCount
            });
        }
    }
}
export default ResourceLoader;
