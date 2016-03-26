import ResourceLoader from "../ResourceLoader";
import ContextComponents from "../../ContextComponents";
import JThreeContext from "../../JThreeContext";
import Q from "q";
class AsyncLoader<T> {

  private _isLoading: { [url: string]: boolean } = {};

  private _loadedResource: { [url: string]: T } = {};

  private _loadingPromise: { [url: string]: Q.IPromise<T> } = {};

  public static getAbsolutePath(relative: string): string {
    const aElem = document.createElement("a");
    aElem.href = relative;
    return aElem.href;
  }

  public pushLoaded(url: string, content: T): void {
    const path = AsyncLoader.getAbsolutePath(url);
    this._loadedResource[path] = content;
    this._isLoading[path] = false;
  }

  public fromCache(url: string): T {
    const path = AsyncLoader.getAbsolutePath(url);
    if (this._isLoading[path] === false) {
      return this._loadedResource[AsyncLoader.getAbsolutePath(url)];
    } else {
      throw new Error(`The resource ${url} is not loaded yet.`);
    }
  }

  public fetch(src: string, request: (url: string) => Q.IPromise<T>): Q.IPromise<T> {
    const absPath = AsyncLoader.getAbsolutePath(src);
    if (this._isLoading[absPath] === true) {
      return this._loadingPromise[absPath];
    } else {
      const loader = JThreeContext.getContextComponent<ResourceLoader>(ContextComponents.ResourceLoader);
      const deferred = loader.getResourceLoadingDeffered<T>();
      if (this._isLoading[absPath] === false) {
        process.nextTick(() => {
          deferred.resolve(this._loadedResource[absPath]);
        });
      } else {
        request(absPath).then((result) => {
          this._loadedResource[absPath] = result;
          this._isLoading[absPath] = false;
          deferred.resolve(result);
        }, (err) => {
            this._isLoading[absPath] = false;
            deferred.reject(err);
          });
        this._loadingPromise[absPath] = deferred.promise;
        this._isLoading[absPath] = true;
      }
      return deferred.promise;
    }
  }
}

export default AsyncLoader;
