import Q = require("q");
import Delegates = require("../../Base/Delegates");
class AsyncLoader<T> {

  private _loadedResource: { [url: string]: T|Q.IPromise<T> } = {};

  public static getAbsolutePath(relative: string): string {
    const aElem = document.createElement("a");
    aElem.href = relative;
    return aElem.href;
  }

  public fetch(src: string, request: Delegates.Func1<string, Q.IPromise<T>>): Q.IPromise<T> {
    const absPath = AsyncLoader.getAbsolutePath(src);
    if (this._loadedResource[absPath] && typeof this._loadedResource[absPath]["then"] === "function") { // Assume this is Promise object
      return <Q.IPromise<T>>this._loadedResource[absPath];
    } else {
      const deferred = Q.defer<T>();
      if (this._loadedResource[absPath]) { // Assume this is loaded texture
        process.nextTick(() => {
          deferred.resolve(<T>this._loadedResource[absPath]);
        });
      } else {
        request(absPath).then((result) => {
          this._loadedResource[absPath] = result;
          deferred.resolve(result);
        }, (err) => {
            deferred.reject(err);
          });
        this._loadedResource[absPath] = deferred.promise;
      }
      return deferred.promise;
    }
  }
}

export = AsyncLoader;
