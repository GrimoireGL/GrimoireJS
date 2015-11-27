import ContextComponents = require("../ContextComponents");
import IContextComponent = require("../IContextComponent");
import IResourceLoaderEventArgs = require("./IResourceLoaderEventArgs");
import Q = require("q");

class ResourceLoader implements IContextComponent {
    public getContextComponentIndex() {
        return ContextComponents.ResourceLoader;
    }

    public resourceCount: number = 0;

    public loadedResourceCount: number = 0;

    public completedResourceCount: number = 0;

    public erroredResourceCount: number = 0;

    public currentLoadingMessage: string = "";

    private resourceLoadingDeferred: Q.Deferred<IResourceLoaderEventArgs>;

    public get isLoading(): boolean {
        return !!this.resourceLoadingDeferred;
    }

    public get promise(): Q.Promise<IResourceLoaderEventArgs> {
        return this.resourceLoadingDeferred.promise;
    }

    public getResourceLoadingDeffered(): Q.Deferred<void> {
        if(!this.isLoading)
        {
          this.resourceLoadingDeferred = Q.defer<IResourceLoaderEventArgs>();
        }
        this.resourceCount++;
        var d = Q.defer<void>();
        this.registerForResourceLoaded(d.promise);
        return d;
    }

    /**
     * INTERNAL USE
     * Register promise to be able to check status when the promise notify state.
     * @param {Q.Promise<void>} promise [description]
     */
    private registerForResourceLoaded(promise: Q.Promise<void>): void {
        promise.then(
            () => {//On fullfilled
                this.loadedResourceCount++;
                this.completedResourceCount++;
                this.checkResourceLoaded();
            },
            () => {//On rejected
                this.completedResourceCount++;
                this.erroredResourceCount++;
                this.checkResourceLoaded();
            },
            (s) => {//On progress
                this.currentLoadingMessage = s;
            }
        );
    }

    /**
     * Check whether all resources was loaded after fulfilled or errored subscribed deffereds.
     */
    private checkResourceLoaded(): void {
        if (this.completedResourceCount == this.resourceCount) {
            this.resourceLoadingDeferred.resolve({
                hasNoError: this.erroredResourceCount > 0,
                erroredResource: this.erroredResourceCount,
                loadedResource: this.loadedResourceCount,
                completedResource: this.completedResourceCount,
                lastLoadMessage:this.currentLoadingMessage
            });
            this.resourceLoadingDeferred = null;
        }else{
          this.resourceLoadingDeferred.notify(
            {
              hasNoError: this.erroredResourceCount > 0,
              erroredResource: this.erroredResourceCount,
              loadedResource: this.loadedResourceCount,
              completedResource: this.completedResourceCount,
              lastLoadMessage:this.currentLoadingMessage
            }
          );
        }
    }
}
export = ResourceLoader;
