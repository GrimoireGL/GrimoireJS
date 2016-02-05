import ResourceLoader from "../ResourceLoader";
import ContextComponents from "../../ContextComponents";
import JThreeContext from "../../JThreeContext";
import Q from "q";
import {Func1} from "../../Base/Delegates";
class AsyncLoader<T> {

  private _loadedResource: { [url: string]: T|Q.IPromise<T> } = {};

  public static getAbsolutePath(relative: string): string {
    const aElem = document.createElement("a");
    aElem.href = relative;
    return aElem.href;
  }

  public pushLoaded(url: string, content: T): void {
    this._loadedResource[AsyncLoader.getAbsolutePath(url)] = content;
  }

  public fromCache(url: string): T {
    return <T>this._loadedResource[AsyncLoader.getAbsolutePath(url)];
  }

  public fetch(src: string, request: Func1<string, Q.IPromise<T>>): Q.IPromise<T> {
    const absPath = AsyncLoader.getAbsolutePath(src);
    if (this._loadedResource[absPath] && this._loadedResource[absPath] instanceof Q.Promise) { // Assume this is Promise object
      return <Q.IPromise<T>>this._loadedResource[absPath];
    } else {
      const loader = JThreeContext.getContextComponent<ResourceLoader>(ContextComponents.ResourceLoader);
      const deferred = loader.getResourceLoadingDeffered<T>();
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

export default AsyncLoader;
