import ContextComponents from "../ContextComponents";
import Q from "q";
class ResourceLoader {
    constructor() {
        this.resourceCount = 0;
        this.loadedResourceCount = 0;
        this.completedResourceCount = 0;
        this.erroredResourceCount = 0;
        this.currentLoadingMessage = "";
        this._resourceLoadingDeferred = Q.defer();
    }
    get isLoading() {
        return !!this._resourceLoadingDeferred;
    }
    get promise() {
        return this._resourceLoadingDeferred.promise;
    }
    getResourceLoadingDeffered() {
        this.resourceCount++;
        const d = Q.defer();
        this._registerForResourceLoaded(d.promise);
        return d;
    }
    getContextComponentIndex() {
        return ContextComponents.ResourceLoader;
    }
    /**
     * INTERNAL USE
     * Register promise to be able to check status when the promise notify state.
     * @param {Q.Promise<void>} promise [description]
     */
    _registerForResourceLoaded(promise) {
        promise.then(() => {
            this.loadedResourceCount++;
            this.completedResourceCount++;
            this._checkResourceLoaded();
        }, () => {
            this.completedResourceCount++;
            this.erroredResourceCount++;
            this._checkResourceLoaded();
        }, (s) => {
            this.currentLoadingMessage = s;
        });
    }
    /**
     * Check whether all resources was loaded after fulfilled or errored subscribed deffereds.
     */
    _checkResourceLoaded() {
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
        }
        else {
            this._resourceLoadingDeferred.notify({
                hasNoError: this.erroredResourceCount > 0,
                erroredResource: this.erroredResourceCount,
                loadedResource: this.loadedResourceCount,
                completedResource: this.completedResourceCount,
                lastLoadMessage: this.currentLoadingMessage,
                resourceCount: this.resourceCount
            });
        }
    }
}
export default ResourceLoader;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvUmVzb3VyY2VMb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8saUJBQWlCLE1BQU0sc0JBQXNCO09BRzdDLENBQUMsTUFBTSxHQUFHO0FBRWpCO0lBQUE7UUFFUyxrQkFBYSxHQUFXLENBQUMsQ0FBQztRQUUxQix3QkFBbUIsR0FBVyxDQUFDLENBQUM7UUFFaEMsMkJBQXNCLEdBQVcsQ0FBQyxDQUFDO1FBRW5DLHlCQUFvQixHQUFXLENBQUMsQ0FBQztRQUVqQywwQkFBcUIsR0FBVyxFQUFFLENBQUM7UUFFbEMsNkJBQXdCLEdBQXlDLENBQUMsQ0FBQyxLQUFLLEVBQTRCLENBQUM7SUF1RS9HLENBQUM7SUFyRUMsSUFBVyxTQUFTO1FBQ2xCLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDO0lBQ3pDLENBQUM7SUFFRCxJQUFXLE9BQU87UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxPQUFPLENBQUM7SUFDL0MsQ0FBQztJQUVNLDBCQUEwQjtRQUMvQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQywwQkFBMEIsQ0FBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFTSx3QkFBd0I7UUFDN0IsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQztJQUMxQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLDBCQUEwQixDQUFJLE9BQXFCO1FBQ3pELE9BQU8sQ0FBQyxJQUFJLENBQ1Y7WUFDRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUM5QixDQUFDLEVBQ0Q7WUFDRSxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUM5QixDQUFDLEVBQ0QsQ0FBQyxDQUFDO1lBQ0EsSUFBSSxDQUFDLHFCQUFxQixHQUFHLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQ0EsQ0FBQztJQUNOLENBQUM7SUFFRDs7T0FFRztJQUNLLG9CQUFvQjtRQUMxQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEtBQUssSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLHdCQUF3QixDQUFDLE9BQU8sQ0FBQztnQkFDcEMsVUFBVSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxDQUFDO2dCQUN6QyxlQUFlLEVBQUUsSUFBSSxDQUFDLG9CQUFvQjtnQkFDMUMsY0FBYyxFQUFFLElBQUksQ0FBQyxtQkFBbUI7Z0JBQ3hDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxzQkFBc0I7Z0JBQzlDLGVBQWUsRUFBRSxJQUFJLENBQUMscUJBQXFCO2dCQUMzQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWE7YUFDbEMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQztRQUN2QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUNsQztnQkFDRSxVQUFVLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLENBQUM7Z0JBQ3pDLGVBQWUsRUFBRSxJQUFJLENBQUMsb0JBQW9CO2dCQUMxQyxjQUFjLEVBQUUsSUFBSSxDQUFDLG1CQUFtQjtnQkFDeEMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLHNCQUFzQjtnQkFDOUMsZUFBZSxFQUFFLElBQUksQ0FBQyxxQkFBcUI7Z0JBQzNDLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTthQUNsQyxDQUNBLENBQUM7UUFDTixDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFDRCxlQUFlLGNBQWMsQ0FBQyIsImZpbGUiOiJDb3JlL1Jlc291cmNlTG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvbnRleHRDb21wb25lbnRzIGZyb20gXCIuLi9Db250ZXh0Q29tcG9uZW50c1wiO1xuaW1wb3J0IElDb250ZXh0Q29tcG9uZW50IGZyb20gXCIuLi9JQ29udGV4dENvbXBvbmVudFwiO1xuaW1wb3J0IElSZXNvdXJjZUxvYWRlckV2ZW50QXJncyBmcm9tIFwiLi9JUmVzb3VyY2VMb2FkZXJFdmVudEFyZ3NcIjtcbmltcG9ydCBRIGZyb20gXCJxXCI7XG5cbmNsYXNzIFJlc291cmNlTG9hZGVyIGltcGxlbWVudHMgSUNvbnRleHRDb21wb25lbnQge1xuXG4gIHB1YmxpYyByZXNvdXJjZUNvdW50OiBudW1iZXIgPSAwO1xuXG4gIHB1YmxpYyBsb2FkZWRSZXNvdXJjZUNvdW50OiBudW1iZXIgPSAwO1xuXG4gIHB1YmxpYyBjb21wbGV0ZWRSZXNvdXJjZUNvdW50OiBudW1iZXIgPSAwO1xuXG4gIHB1YmxpYyBlcnJvcmVkUmVzb3VyY2VDb3VudDogbnVtYmVyID0gMDtcblxuICBwdWJsaWMgY3VycmVudExvYWRpbmdNZXNzYWdlOiBzdHJpbmcgPSBcIlwiO1xuXG4gIHByaXZhdGUgX3Jlc291cmNlTG9hZGluZ0RlZmVycmVkOiBRLkRlZmVycmVkPElSZXNvdXJjZUxvYWRlckV2ZW50QXJncz4gPSBRLmRlZmVyPElSZXNvdXJjZUxvYWRlckV2ZW50QXJncz4oKTtcblxuICBwdWJsaWMgZ2V0IGlzTG9hZGluZygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLl9yZXNvdXJjZUxvYWRpbmdEZWZlcnJlZDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcHJvbWlzZSgpOiBRLlByb21pc2U8SVJlc291cmNlTG9hZGVyRXZlbnRBcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuX3Jlc291cmNlTG9hZGluZ0RlZmVycmVkLnByb21pc2U7XG4gIH1cblxuICBwdWJsaWMgZ2V0UmVzb3VyY2VMb2FkaW5nRGVmZmVyZWQ8VD4oKTogUS5EZWZlcnJlZDxUPiB7XG4gICAgdGhpcy5yZXNvdXJjZUNvdW50Kys7XG4gICAgY29uc3QgZCA9IFEuZGVmZXI8VD4oKTtcbiAgICB0aGlzLl9yZWdpc3RlckZvclJlc291cmNlTG9hZGVkPFQ+KGQucHJvbWlzZSk7XG4gICAgcmV0dXJuIGQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0Q29udGV4dENvbXBvbmVudEluZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIENvbnRleHRDb21wb25lbnRzLlJlc291cmNlTG9hZGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIElOVEVSTkFMIFVTRVxuICAgKiBSZWdpc3RlciBwcm9taXNlIHRvIGJlIGFibGUgdG8gY2hlY2sgc3RhdHVzIHdoZW4gdGhlIHByb21pc2Ugbm90aWZ5IHN0YXRlLlxuICAgKiBAcGFyYW0ge1EuUHJvbWlzZTx2b2lkPn0gcHJvbWlzZSBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBwcml2YXRlIF9yZWdpc3RlckZvclJlc291cmNlTG9hZGVkPFQ+KHByb21pc2U6IFEuUHJvbWlzZTxUPik6IHZvaWQge1xuICAgIHByb21pc2UudGhlbihcbiAgICAgICgpID0+IHsgLy8gT24gZnVsbGZpbGxlZFxuICAgICAgICB0aGlzLmxvYWRlZFJlc291cmNlQ291bnQrKztcbiAgICAgICAgdGhpcy5jb21wbGV0ZWRSZXNvdXJjZUNvdW50Kys7XG4gICAgICAgIHRoaXMuX2NoZWNrUmVzb3VyY2VMb2FkZWQoKTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiB7IC8vIE9uIHJlamVjdGVkXG4gICAgICAgIHRoaXMuY29tcGxldGVkUmVzb3VyY2VDb3VudCsrO1xuICAgICAgICB0aGlzLmVycm9yZWRSZXNvdXJjZUNvdW50Kys7XG4gICAgICAgIHRoaXMuX2NoZWNrUmVzb3VyY2VMb2FkZWQoKTtcbiAgICAgIH0sXG4gICAgICAocykgPT4geyAvLyBPbiBwcm9ncmVzc1xuICAgICAgICB0aGlzLmN1cnJlbnRMb2FkaW5nTWVzc2FnZSA9IHM7XG4gICAgICB9XG4gICAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgYWxsIHJlc291cmNlcyB3YXMgbG9hZGVkIGFmdGVyIGZ1bGZpbGxlZCBvciBlcnJvcmVkIHN1YnNjcmliZWQgZGVmZmVyZWRzLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tSZXNvdXJjZUxvYWRlZCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb21wbGV0ZWRSZXNvdXJjZUNvdW50ID09PSB0aGlzLnJlc291cmNlQ291bnQpIHtcbiAgICAgIHRoaXMuX3Jlc291cmNlTG9hZGluZ0RlZmVycmVkLnJlc29sdmUoe1xuICAgICAgICBoYXNOb0Vycm9yOiB0aGlzLmVycm9yZWRSZXNvdXJjZUNvdW50ID4gMCxcbiAgICAgICAgZXJyb3JlZFJlc291cmNlOiB0aGlzLmVycm9yZWRSZXNvdXJjZUNvdW50LFxuICAgICAgICBsb2FkZWRSZXNvdXJjZTogdGhpcy5sb2FkZWRSZXNvdXJjZUNvdW50LFxuICAgICAgICBjb21wbGV0ZWRSZXNvdXJjZTogdGhpcy5jb21wbGV0ZWRSZXNvdXJjZUNvdW50LFxuICAgICAgICBsYXN0TG9hZE1lc3NhZ2U6IHRoaXMuY3VycmVudExvYWRpbmdNZXNzYWdlLFxuICAgICAgICByZXNvdXJjZUNvdW50OiB0aGlzLnJlc291cmNlQ291bnRcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fcmVzb3VyY2VMb2FkaW5nRGVmZXJyZWQgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZXNvdXJjZUxvYWRpbmdEZWZlcnJlZC5ub3RpZnkoXG4gICAgICAgIHtcbiAgICAgICAgICBoYXNOb0Vycm9yOiB0aGlzLmVycm9yZWRSZXNvdXJjZUNvdW50ID4gMCxcbiAgICAgICAgICBlcnJvcmVkUmVzb3VyY2U6IHRoaXMuZXJyb3JlZFJlc291cmNlQ291bnQsXG4gICAgICAgICAgbG9hZGVkUmVzb3VyY2U6IHRoaXMubG9hZGVkUmVzb3VyY2VDb3VudCxcbiAgICAgICAgICBjb21wbGV0ZWRSZXNvdXJjZTogdGhpcy5jb21wbGV0ZWRSZXNvdXJjZUNvdW50LFxuICAgICAgICAgIGxhc3RMb2FkTWVzc2FnZTogdGhpcy5jdXJyZW50TG9hZGluZ01lc3NhZ2UsXG4gICAgICAgICAgcmVzb3VyY2VDb3VudDogdGhpcy5yZXNvdXJjZUNvdW50XG4gICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFJlc291cmNlTG9hZGVyO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
