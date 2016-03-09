import ContextComponents from "../../ContextComponents";
import JThreeContext from "../../JThreeContext";
import Q from "q";
class AsyncLoader {
    constructor() {
        this._loadedResource = {};
    }
    static getAbsolutePath(relative) {
        const aElem = document.createElement("a");
        aElem.href = relative;
        return aElem.href;
    }
    pushLoaded(url, content) {
        this._loadedResource[AsyncLoader.getAbsolutePath(url)] = content;
    }
    fromCache(url) {
        return this._loadedResource[AsyncLoader.getAbsolutePath(url)];
    }
    fetch(src, request) {
        const absPath = AsyncLoader.getAbsolutePath(src);
        if (this._loadedResource[absPath] && this._loadedResource[absPath] instanceof Q.Promise) {
            return this._loadedResource[absPath];
        }
        else {
            const loader = JThreeContext.getContextComponent(ContextComponents.ResourceLoader);
            const deferred = loader.getResourceLoadingDeffered();
            if (this._loadedResource[absPath]) {
                process.nextTick(() => {
                    deferred.resolve(this._loadedResource[absPath]);
                });
            }
            else {
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
