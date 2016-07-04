import IResourceLoaderEventArgs from "./IResourceLoaderEventArgs";
import Q from "q";

class ResourceLoader {

    public static instance: ResourceLoader;

    public resourceCount: number = 0;

    public loadedResourceCount: number = 0;

    public completedResourceCount: number = 0;

    public erroredResourceCount: number = 0;

    public currentLoadingMessage: string = "";

    private _resourceLoadingDeferred: Q.Deferred<IResourceLoaderEventArgs> = Q.defer<IResourceLoaderEventArgs>();

    public get isLoading(): boolean {
        return !!this._resourceLoadingDeferred;
    }

    public get promise(): Q.Promise<IResourceLoaderEventArgs> {
        return this._resourceLoadingDeferred.promise;
    }

    public getResourceLoadingDeffered<T>(): Q.Deferred<T> {
        this.resourceCount++;
        const d = Q.defer<T>();
        this._registerForResourceLoaded<T>(d.promise);
        return d;
    }

    /**
     * INTERNAL USE
     * Register promise to be able to check status when the promise notify state.
     * @param {Q.Promise<void>} promise [description]
     */
    private _registerForResourceLoaded<T>(promise: Q.Promise<T>): void {
        promise.then(
            () => { // On fullfilled
                this.loadedResourceCount++;
                this.completedResourceCount++;
                this._checkResourceLoaded();
            },
            () => { // On rejected
                this.completedResourceCount++;
                this.erroredResourceCount++;
                this._checkResourceLoaded();
            },
            (s) => { // On progress
                this.currentLoadingMessage = s;
            }
        );
    }

    /**
     * Check whether all resources was loaded after fulfilled or errored subscribed deffereds.
     */
    private _checkResourceLoaded(): void {
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
        } else {
            this._resourceLoadingDeferred.notify(
                {
                    hasNoError: this.erroredResourceCount > 0,
                    erroredResource: this.erroredResourceCount,
                    loadedResource: this.loadedResourceCount,
                    completedResource: this.completedResourceCount,
                    lastLoadMessage: this.currentLoadingMessage,
                    resourceCount: this.resourceCount
                }
            );
        }
    }
}

ResourceLoader.instance = new ResourceLoader();
export default ResourceLoader.instance;
