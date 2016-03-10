import ContextComponents from "../../ContextComponents";
import JThreeContext from "../../JThreeContext";
class AsyncLoader {
    constructor() {
        this._isLoading = {};
        this._loadedResource = {};
        this._loadingPromise = {};
    }
    static getAbsolutePath(relative) {
        const aElem = document.createElement("a");
        aElem.href = relative;
        return aElem.href;
    }
    pushLoaded(url, content) {
        const path = AsyncLoader.getAbsolutePath(url);
        this._loadedResource[path] = content;
        this._isLoading[path] = false;
    }
    fromCache(url) {
        const path = AsyncLoader.getAbsolutePath(url);
        if (this._isLoading[path] === false) {
            return this._loadedResource[AsyncLoader.getAbsolutePath(url)];
        }
        else {
            throw new Error(`The resource ${url} is not loaded yet.`);
        }
    }
    fetch(src, request) {
        const absPath = AsyncLoader.getAbsolutePath(src);
        if (this._isLoading[absPath] === true) {
            return this._loadingPromise[absPath];
        }
        else {
            const loader = JThreeContext.getContextComponent(ContextComponents.ResourceLoader);
            const deferred = loader.getResourceLoadingDeffered();
            if (this._isLoading[absPath] === false) {
                process.nextTick(() => {
                    deferred.resolve(this._loadedResource[absPath]);
                });
            }
            else {
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
//# sourceMappingURL=AsyncLoader.js.map