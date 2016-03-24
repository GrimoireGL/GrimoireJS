import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import JThreeEvent from "../../Base/JThreeEvent";
/**
 * A context component provides the feature to manage all of canvas.
 *
 *すべてのCanvasを管理する機能を提供するコンテキストコンポーネント
 * @type {[type]}
 */
class CanvasManager {
    constructor() {
        /**
         * All canvas managed by jThree
         * @type {Canvas[]}
         */
        this.canvases = [];
        /**
         * Event object notifying when canvas list is changed
         * @type {JThreeEvent<CanvasListChangedEventArgs>}
         */
        this.canvasListChanged = new JThreeEvent();
        const loopManager = JThreeContext.getContextComponent(ContextComponents.LoopManager);
        loopManager.addAction(4000, () => this.beforeRenderAll());
        loopManager.addAction(6000, () => this.afterRenderAll());
    }
    /**
     * Implementation for IContextComponent
     */
    getContextComponentIndex() {
        return ContextComponents.CanvasManager;
    }
    /**
     * Add canvas to be managed.
     * @param {Canvas} canvas [description]
     */
    addCanvas(canvas) {
        if (this.canvases.indexOf(canvas) === -1) {
            this.canvases.push(canvas);
            this.canvasListChanged.fire(this, {
                isAdditionalChange: true,
                canvas: canvas
            });
        }
    }
    /**
     * Remove canvas from managed canvas list.
     */
    removeCanvas(canvas) {
        if (this.canvases.indexOf(canvas) !== -1) {
            for (let i = 0; i < this.canvases.length; i++) {
                if (this.canvases[i] === canvas) {
                    this.canvases.splice(i, 1);
                    break;
                }
            }
            this.canvasListChanged.fire(this, {
                isAdditionalChange: true,
                canvas: canvas
            });
        }
    }
    beforeRenderAll() {
        this.canvases.forEach((c) => c.beforeRenderAll());
        return;
    }
    afterRenderAll() {
        this.canvases.forEach((c) => c.afterRenderAll());
        return;
    }
}
export default CanvasManager;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvQ2FudmFzL0NhbnZhc01hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQ08sYUFBYSxNQUFNLHFCQUFxQjtPQUV4QyxpQkFBaUIsTUFBTSx5QkFBeUI7T0FFaEQsV0FBVyxNQUFNLHdCQUF3QjtBQUVoRDs7Ozs7R0FLRztBQUNIO0lBRUU7UUFNQTs7O1dBR0c7UUFDSSxhQUFRLEdBQWEsRUFBRSxDQUFDO1FBRS9COzs7V0FHRztRQUNJLHNCQUFpQixHQUE2QyxJQUFJLFdBQVcsRUFBK0IsQ0FBQztRQWZsSCxNQUFNLFdBQVcsR0FBRyxhQUFhLENBQUMsbUJBQW1CLENBQWMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbEcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztRQUMxRCxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFjRDs7T0FFRztJQUNJLHdCQUF3QjtRQUM3QixNQUFNLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDO0lBQ3pDLENBQUM7SUFDRDs7O09BR0c7SUFDSSxTQUFTLENBQUMsTUFBYztRQUM3QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDM0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ2hDLGtCQUFrQixFQUFFLElBQUk7Z0JBQ3hCLE1BQU0sRUFBRSxNQUFNO2FBQ2YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFFRDs7T0FFRztJQUNJLFlBQVksQ0FBQyxNQUFjO1FBQ2hDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzlDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUMzQixLQUFLLENBQUM7Z0JBQ1IsQ0FBQztZQUNILENBQUM7WUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDaEMsa0JBQWtCLEVBQUUsSUFBSTtnQkFDeEIsTUFBTSxFQUFFLE1BQU07YUFDZixDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUVNLGVBQWU7UUFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7UUFDbEQsTUFBTSxDQUFDO0lBQ1QsQ0FBQztJQUVNLGNBQWM7UUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDakQsTUFBTSxDQUFDO0lBQ1QsQ0FBQztBQUNILENBQUM7QUFFRCxlQUFlLGFBQWEsQ0FBQyIsImZpbGUiOiJDb3JlL0NhbnZhcy9DYW52YXNNYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvb3BNYW5hZ2VyIGZyb20gXCIuLi9Mb29wTWFuYWdlclwiO1xuaW1wb3J0IEpUaHJlZUNvbnRleHQgZnJvbSBcIi4uLy4uL0pUaHJlZUNvbnRleHRcIjtcbmltcG9ydCBJQ29udGV4dENvbXBvbmVudCBmcm9tIFwiLi4vLi4vSUNvbnRleHRDb21wb25lbnRcIjtcbmltcG9ydCBDb250ZXh0Q29tcG9uZW50cyBmcm9tIFwiLi4vLi4vQ29udGV4dENvbXBvbmVudHNcIjtcbmltcG9ydCBDYW52YXMgZnJvbSBcIi4vQ2FudmFzXCI7XG5pbXBvcnQgSlRocmVlRXZlbnQgZnJvbSBcIi4uLy4uL0Jhc2UvSlRocmVlRXZlbnRcIjtcbmltcG9ydCBJQ2FudmFzTGlzdENoYW5nZWRFdmVudEFyZ3MgZnJvbSBcIi4vSUNhbnZhc0xpc3RDaGFuZ2VkRXZlbnRBcmdzXCI7XG4vKipcbiAqIEEgY29udGV4dCBjb21wb25lbnQgcHJvdmlkZXMgdGhlIGZlYXR1cmUgdG8gbWFuYWdlIGFsbCBvZiBjYW52YXMuXG4gKlxuICrjgZnjgbnjgabjga5DYW52YXPjgpLnrqHnkIbjgZnjgovmqZ/og73jgpLmj5DkvpvjgZnjgovjgrPjg7Pjg4bjgq3jgrnjg4jjgrPjg7Pjg53jg7zjg43jg7Pjg4hcbiAqIEB0eXBlIHtbdHlwZV19XG4gKi9cbmNsYXNzIENhbnZhc01hbmFnZXIgaW1wbGVtZW50cyBJQ29udGV4dENvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3QgbG9vcE1hbmFnZXIgPSBKVGhyZWVDb250ZXh0LmdldENvbnRleHRDb21wb25lbnQ8TG9vcE1hbmFnZXI+KENvbnRleHRDb21wb25lbnRzLkxvb3BNYW5hZ2VyKTtcbiAgICBsb29wTWFuYWdlci5hZGRBY3Rpb24oNDAwMCwgKCkgPT4gdGhpcy5iZWZvcmVSZW5kZXJBbGwoKSk7XG4gICAgbG9vcE1hbmFnZXIuYWRkQWN0aW9uKDYwMDAsICgpID0+IHRoaXMuYWZ0ZXJSZW5kZXJBbGwoKSk7XG4gIH1cblxuICAvKipcbiAgICogQWxsIGNhbnZhcyBtYW5hZ2VkIGJ5IGpUaHJlZVxuICAgKiBAdHlwZSB7Q2FudmFzW119XG4gICAqL1xuICBwdWJsaWMgY2FudmFzZXM6IENhbnZhc1tdID0gW107XG5cbiAgLyoqXG4gICAqIEV2ZW50IG9iamVjdCBub3RpZnlpbmcgd2hlbiBjYW52YXMgbGlzdCBpcyBjaGFuZ2VkXG4gICAqIEB0eXBlIHtKVGhyZWVFdmVudDxDYW52YXNMaXN0Q2hhbmdlZEV2ZW50QXJncz59XG4gICAqL1xuICBwdWJsaWMgY2FudmFzTGlzdENoYW5nZWQ6IEpUaHJlZUV2ZW50PElDYW52YXNMaXN0Q2hhbmdlZEV2ZW50QXJncz4gPSBuZXcgSlRocmVlRXZlbnQ8SUNhbnZhc0xpc3RDaGFuZ2VkRXZlbnRBcmdzPigpO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRhdGlvbiBmb3IgSUNvbnRleHRDb21wb25lbnRcbiAgICovXG4gIHB1YmxpYyBnZXRDb250ZXh0Q29tcG9uZW50SW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gQ29udGV4dENvbXBvbmVudHMuQ2FudmFzTWFuYWdlcjtcbiAgfVxuICAvKipcbiAgICogQWRkIGNhbnZhcyB0byBiZSBtYW5hZ2VkLlxuICAgKiBAcGFyYW0ge0NhbnZhc30gY2FudmFzIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHB1YmxpYyBhZGRDYW52YXMoY2FudmFzOiBDYW52YXMpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jYW52YXNlcy5pbmRleE9mKGNhbnZhcykgPT09IC0xKSB7XG4gICAgICB0aGlzLmNhbnZhc2VzLnB1c2goY2FudmFzKTtcbiAgICAgIHRoaXMuY2FudmFzTGlzdENoYW5nZWQuZmlyZSh0aGlzLCB7XG4gICAgICAgIGlzQWRkaXRpb25hbENoYW5nZTogdHJ1ZSxcbiAgICAgICAgY2FudmFzOiBjYW52YXNcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgY2FudmFzIGZyb20gbWFuYWdlZCBjYW52YXMgbGlzdC5cbiAgICovXG4gIHB1YmxpYyByZW1vdmVDYW52YXMoY2FudmFzOiBDYW52YXMpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jYW52YXNlcy5pbmRleE9mKGNhbnZhcykgIT09IC0xKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FudmFzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuY2FudmFzZXNbaV0gPT09IGNhbnZhcykge1xuICAgICAgICAgIHRoaXMuY2FudmFzZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmNhbnZhc0xpc3RDaGFuZ2VkLmZpcmUodGhpcywge1xuICAgICAgICBpc0FkZGl0aW9uYWxDaGFuZ2U6IHRydWUsXG4gICAgICAgIGNhbnZhczogY2FudmFzXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYmVmb3JlUmVuZGVyQWxsKCk6IHZvaWQge1xuICAgIHRoaXMuY2FudmFzZXMuZm9yRWFjaCgoYykgPT4gYy5iZWZvcmVSZW5kZXJBbGwoKSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHVibGljIGFmdGVyUmVuZGVyQWxsKCk6IHZvaWQge1xuICAgIHRoaXMuY2FudmFzZXMuZm9yRWFjaCgoYykgPT4gYy5hZnRlclJlbmRlckFsbCgpKTtcbiAgICByZXR1cm47XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FudmFzTWFuYWdlcjtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
