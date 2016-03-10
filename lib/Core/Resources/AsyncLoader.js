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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvUmVzb3VyY2VzL0FzeW5jTG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUNPLGlCQUFpQixNQUFNLHlCQUF5QjtPQUNoRCxhQUFhLE1BQU0scUJBQXFCO0FBRy9DO0lBQUE7UUFFVSxlQUFVLEdBQStCLEVBQUUsQ0FBQztRQUU1QyxvQkFBZSxHQUF5QixFQUFFLENBQUM7UUFFM0Msb0JBQWUsR0FBcUMsRUFBRSxDQUFDO0lBaURqRSxDQUFDO0lBL0NDLE9BQWMsZUFBZSxDQUFDLFFBQWdCO1FBQzVDLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUMsS0FBSyxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7UUFDdEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDcEIsQ0FBQztJQUVNLFVBQVUsQ0FBQyxHQUFXLEVBQUUsT0FBVTtRQUN2QyxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQ2hDLENBQUM7SUFFTSxTQUFTLENBQUMsR0FBVztRQUMxQixNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDaEUsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsR0FBRyxxQkFBcUIsQ0FBQyxDQUFDO1FBQzVELENBQUM7SUFDSCxDQUFDO0lBRU0sS0FBSyxDQUFDLEdBQVcsRUFBRSxPQUFxQztRQUM3RCxNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLE1BQU0sR0FBRyxhQUFhLENBQUMsbUJBQW1CLENBQWlCLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ25HLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQywwQkFBMEIsRUFBSyxDQUFDO1lBQ3hELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDdkMsT0FBTyxDQUFDLFFBQVEsQ0FBQztvQkFDZixRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDbEQsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU07b0JBQzNCLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcsTUFBTSxDQUFDO29CQUN2QyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQztvQkFDakMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDM0IsQ0FBQyxFQUFFLENBQUMsR0FBRztvQkFDSCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQztvQkFDakMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdkIsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO2dCQUNqRCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNsQyxDQUFDO1lBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFDMUIsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBRUQsZUFBZSxXQUFXLENBQUMiLCJmaWxlIjoiQ29yZS9SZXNvdXJjZXMvQXN5bmNMb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVzb3VyY2VMb2FkZXIgZnJvbSBcIi4uL1Jlc291cmNlTG9hZGVyXCI7XG5pbXBvcnQgQ29udGV4dENvbXBvbmVudHMgZnJvbSBcIi4uLy4uL0NvbnRleHRDb21wb25lbnRzXCI7XG5pbXBvcnQgSlRocmVlQ29udGV4dCBmcm9tIFwiLi4vLi4vSlRocmVlQ29udGV4dFwiO1xuaW1wb3J0IFEgZnJvbSBcInFcIjtcbmltcG9ydCB7RnVuYzF9IGZyb20gXCIuLi8uLi9CYXNlL0RlbGVnYXRlc1wiO1xuY2xhc3MgQXN5bmNMb2FkZXI8VD4ge1xuXG4gIHByaXZhdGUgX2lzTG9hZGluZzogeyBbdXJsOiBzdHJpbmddOiBib29sZWFuIH0gPSB7fTtcblxuICBwcml2YXRlIF9sb2FkZWRSZXNvdXJjZTogeyBbdXJsOiBzdHJpbmddOiBUIH0gPSB7fTtcblxuICBwcml2YXRlIF9sb2FkaW5nUHJvbWlzZTogeyBbdXJsOiBzdHJpbmddOiBRLklQcm9taXNlPFQ+IH0gPSB7fTtcblxuICBwdWJsaWMgc3RhdGljIGdldEFic29sdXRlUGF0aChyZWxhdGl2ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBhRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgIGFFbGVtLmhyZWYgPSByZWxhdGl2ZTtcbiAgICByZXR1cm4gYUVsZW0uaHJlZjtcbiAgfVxuXG4gIHB1YmxpYyBwdXNoTG9hZGVkKHVybDogc3RyaW5nLCBjb250ZW50OiBUKTogdm9pZCB7XG4gICAgY29uc3QgcGF0aCA9IEFzeW5jTG9hZGVyLmdldEFic29sdXRlUGF0aCh1cmwpO1xuICAgIHRoaXMuX2xvYWRlZFJlc291cmNlW3BhdGhdID0gY29udGVudDtcbiAgICB0aGlzLl9pc0xvYWRpbmdbcGF0aF0gPSBmYWxzZTtcbiAgfVxuXG4gIHB1YmxpYyBmcm9tQ2FjaGUodXJsOiBzdHJpbmcpOiBUIHtcbiAgICBjb25zdCBwYXRoID0gQXN5bmNMb2FkZXIuZ2V0QWJzb2x1dGVQYXRoKHVybCk7XG4gICAgaWYgKHRoaXMuX2lzTG9hZGluZ1twYXRoXSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiB0aGlzLl9sb2FkZWRSZXNvdXJjZVtBc3luY0xvYWRlci5nZXRBYnNvbHV0ZVBhdGgodXJsKV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIHJlc291cmNlICR7dXJsfSBpcyBub3QgbG9hZGVkIHlldC5gKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZmV0Y2goc3JjOiBzdHJpbmcsIHJlcXVlc3Q6IEZ1bmMxPHN0cmluZywgUS5JUHJvbWlzZTxUPj4pOiBRLklQcm9taXNlPFQ+IHtcbiAgICBjb25zdCBhYnNQYXRoID0gQXN5bmNMb2FkZXIuZ2V0QWJzb2x1dGVQYXRoKHNyYyk7XG4gICAgaWYgKHRoaXMuX2lzTG9hZGluZ1thYnNQYXRoXSA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2xvYWRpbmdQcm9taXNlW2Fic1BhdGhdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBsb2FkZXIgPSBKVGhyZWVDb250ZXh0LmdldENvbnRleHRDb21wb25lbnQ8UmVzb3VyY2VMb2FkZXI+KENvbnRleHRDb21wb25lbnRzLlJlc291cmNlTG9hZGVyKTtcbiAgICAgIGNvbnN0IGRlZmVycmVkID0gbG9hZGVyLmdldFJlc291cmNlTG9hZGluZ0RlZmZlcmVkPFQ+KCk7XG4gICAgICBpZiAodGhpcy5faXNMb2FkaW5nW2Fic1BhdGhdID09PSBmYWxzZSkge1xuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHRoaXMuX2xvYWRlZFJlc291cmNlW2Fic1BhdGhdKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXF1ZXN0KGFic1BhdGgpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2xvYWRlZFJlc291cmNlW2Fic1BhdGhdID0gcmVzdWx0O1xuICAgICAgICAgIHRoaXMuX2lzTG9hZGluZ1thYnNQYXRoXSA9IGZhbHNlO1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgICAgdGhpcy5faXNMb2FkaW5nW2Fic1BhdGhdID0gZmFsc2U7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fbG9hZGluZ1Byb21pc2VbYWJzUGF0aF0gPSBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB0aGlzLl9pc0xvYWRpbmdbYWJzUGF0aF0gPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFzeW5jTG9hZGVyO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9