import NamedValue from "../../Base/NamedValue";
import ResourceLoader from "../ResourceLoader";
import Q from "q";
abstract class CacheResolver<T> {

  private _isLoading: NamedValue<boolean> = {};

  private _loadedResource: NamedValue<T> = {};

  private _loadingPromise: NamedValue<Q.IPromise<T>> = {};

  // public static getAbsolutePath(relative: string): string {
  //   const aElem = document.createElement("a");
  //   aElem.href = relative;
  //   return aElem.href;
  // }

  public abstract getIdentityName(name: string): string;

  public pushLoaded(identity: string, content: T): void {
    const path = this.getIdentityName(identity);
    this._loadedResource[path] = content;
    this._isLoading[path] = false;
  }

  public fromCache(name: string): T {
    const path = this.getIdentityName(name);
    if (this._isLoading[path] === false) {
      return this._loadedResource[this.getIdentityName(name)];
    } else {
      throw new Error(`The resource ${name} is not loaded yet.`);
    }
  }

  public fetch(name: string, request: (identity: string) => Q.IPromise<T>): Q.IPromise<T> {
    const identity = this.getIdentityName(name);
    if (this._isLoading[identity] === true) {
      return this._loadingPromise[identity];
    } else {
      const deferred = ResourceLoader.getResourceLoadingDeffered<T>();
      if (this._isLoading[identity] === false) {
        process.nextTick(() => {
          deferred.resolve(this._loadedResource[identity]);
        });
      } else {
        request(identity).then((result) => {
          this._loadedResource[identity] = result;
          this._isLoading[identity] = false;
          deferred.resolve(result);
        }, (err) => {
            this._isLoading[identity] = false;
            deferred.reject(err);
          });
        this._loadingPromise[identity] = deferred.promise;
        this._isLoading[identity] = true;
      }
      return deferred.promise;
    }
  }
}

export default CacheResolver;
