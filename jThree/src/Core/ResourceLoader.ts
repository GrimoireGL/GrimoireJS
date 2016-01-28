import ContextComponents from "../ContextComponents";
import IContextComponent from "../IContextComponent";
import IResourceLoaderEventArgs from "./IResourceLoaderEventArgs";
import Q from "q";

class ResourceLoader implements IContextComponent {
  public getContextComponentIndex() {
    return ContextComponents.ResourceLoader;
  }

  public resourceCount: number = 0;

  public loadedResourceCount: number = 0;

  public completedResourceCount: number = 0;

  public erroredResourceCount: number = 0;

  public currentLoadingMessage: string = "";

  private resourceLoadingDeferred: Q.Deferred<IResourceLoaderEventArgs> = Q.defer<IResourceLoaderEventArgs>();

  public get isLoading(): boolean {
    return !!this.resourceLoadingDeferred;
  }

  public get promise(): Q.Promise<IResourceLoaderEventArgs> {
    return this.resourceLoadingDeferred.promise;
  }

  public getResourceLoadingDeffered<T>(): Q.Deferred<T> {
    this.resourceCount++;
    const d = Q.defer<T>();
    this.registerForResourceLoaded<T>(d.promise);
    return d;
  }

  /**
   * INTERNAL USE
   * Register promise to be able to check status when the promise notify state.
   * @param {Q.Promise<void>} promise [description]
   */
  private registerForResourceLoaded<T>(promise: Q.Promise<T>): void {
    promise.then(
      () => { // On fullfilled
        this.loadedResourceCount++;
        this.completedResourceCount++;
        this.checkResourceLoaded();
      },
      () => { // On rejected
        this.completedResourceCount++;
        this.erroredResourceCount++;
        this.checkResourceLoaded();
      },
      (s) => { // On progress
        this.currentLoadingMessage = s;
      }
      );
  }

  /**
   * Check whether all resources was loaded after fulfilled or errored subscribed deffereds.
   */
  private checkResourceLoaded(): void {
    if (this.completedResourceCount === this.resourceCount) {
      this.resourceLoadingDeferred.resolve({
        hasNoError: this.erroredResourceCount > 0,
        erroredResource: this.erroredResourceCount,
        loadedResource: this.loadedResourceCount,
        completedResource: this.completedResourceCount,
        lastLoadMessage: this.currentLoadingMessage,
        resourceCount: this.resourceCount
      });
      this.resourceLoadingDeferred = null;
    } else {
      this.resourceLoadingDeferred.notify(
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
export default ResourceLoader;
