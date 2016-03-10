/**
 * All canvas element managed by jThree should be constructed with this class.
 */
class CanvasElementBuilder {
    /**
     * Generate canvas element structure
     * @param  {HTMLElement}             container the container element holds the canvas
     * @param  {number}                  width     [the width in pixel]
     * @param  {number}                  height    [the height in pixel]
     * @return {ICanvasElementStructure}           [constructed structure infomation]
     */
    static generate(container, width, height) {
        const innerContainer = CanvasElementBuilder._generateInnerContainer(container, width, height);
        const resizeDetecter = CanvasElementBuilder._generateResizeDetecter(innerContainer);
        const canvasElement = CanvasElementBuilder._generateCanvas(resizeDetecter);
        const loaderContainer = CanvasElementBuilder._generateLoaderContainer(resizeDetecter, width, height);
        return {
            innerContainer: innerContainer,
            resizeDetecter: resizeDetecter,
            canvas: canvasElement,
            container: container,
            loaderContainer: loaderContainer
        };
    }
    static _generateInnerContainer(container, width, height) {
        const innerContainer = document.createElement("div");
        container.style.marginLeft = "auto";
        container.style.marginRight = "auto";
        container.style.width = width + "px";
        container.style.height = height + "px";
        container.appendChild(innerContainer);
        return innerContainer;
    }
    static _generateResizeDetecter(innerContainer) {
        const resizeDetecter = document.createElement("div");
        resizeDetecter.style.position = "relative";
        resizeDetecter.style.margin = "0";
        resizeDetecter.style.padding = "0";
        resizeDetecter.style.height = "100%";
        innerContainer.appendChild(resizeDetecter);
        return resizeDetecter;
    }
    static _generateCanvas(resizeDetecter) {
        const canvasElement = document.createElement("canvas");
        canvasElement.style.position = "absolute";
        canvasElement.setAttribute("antialias", "false");
        resizeDetecter.appendChild(canvasElement);
        return canvasElement;
    }
    static _generateLoaderContainer(resizeDetecter, width, height) {
        const loaderContainer = document.createElement("div");
        loaderContainer.style.position = "absolute";
        loaderContainer.style.width = width + "px";
        loaderContainer.style.height = height + "px";
        loaderContainer.classList.add("x-j3-loader-container");
        resizeDetecter.appendChild(loaderContainer);
        return loaderContainer;
    }
}
export default CanvasElementBuilder;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvQ2FudmFzL0NhbnZhc0VsZW1lbnRCdWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBOztHQUVHO0FBQ0g7SUFDQzs7Ozs7O09BTUc7SUFDRixPQUFjLFFBQVEsQ0FBQyxTQUFzQixFQUFFLEtBQWEsRUFBRSxNQUFjO1FBQzFFLE1BQU0sY0FBYyxHQUFHLG9CQUFvQixDQUFDLHVCQUF1QixDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDOUYsTUFBTSxjQUFjLEdBQUcsb0JBQW9CLENBQUMsdUJBQXVCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDcEYsTUFBTSxhQUFhLEdBQUcsb0JBQW9CLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzNFLE1BQU0sZUFBZSxHQUFHLG9CQUFvQixDQUFDLHdCQUF3QixDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckcsTUFBTSxDQUFDO1lBQ0wsY0FBYyxFQUFFLGNBQWM7WUFDOUIsY0FBYyxFQUFFLGNBQWM7WUFDOUIsTUFBTSxFQUFFLGFBQWE7WUFDckIsU0FBUyxFQUFFLFNBQVM7WUFDcEIsZUFBZSxFQUFFLGVBQWU7U0FDakMsQ0FBQztJQUNKLENBQUM7SUFFRCxPQUFlLHVCQUF1QixDQUFDLFNBQXNCLEVBQUUsS0FBYSxFQUFFLE1BQWM7UUFDMUYsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyRCxTQUFTLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7UUFDcEMsU0FBUyxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1FBQ3JDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDckMsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQztRQUN2QyxTQUFTLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxjQUFjLENBQUM7SUFDeEIsQ0FBQztJQUVELE9BQWUsdUJBQXVCLENBQUMsY0FBOEI7UUFDbkUsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyRCxjQUFjLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7UUFDM0MsY0FBYyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2xDLGNBQWMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztRQUNuQyxjQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsY0FBYyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxPQUFlLGVBQWUsQ0FBQyxjQUE4QjtRQUMzRCxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZELGFBQWEsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUMxQyxhQUFhLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNqRCxjQUFjLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxhQUFhLENBQUM7SUFDdkIsQ0FBQztJQUVELE9BQWUsd0JBQXdCLENBQUMsY0FBOEIsRUFBRSxLQUFhLEVBQUUsTUFBYztRQUNuRyxNQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RELGVBQWUsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUM1QyxlQUFlLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQzNDLGVBQWUsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDN0MsZUFBZSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUN2RCxjQUFjLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxlQUFlLENBQUM7SUFDekIsQ0FBQztBQUNILENBQUM7QUFFRCxlQUFlLG9CQUFvQixDQUFDIiwiZmlsZSI6IkNvcmUvQ2FudmFzL0NhbnZhc0VsZW1lbnRCdWlsZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IElDYW52YXNFbGVtZW50U3RydWN0dXJlIGZyb20gXCIuL0lDYW52YXNFbGVtZW50U3RydWN0dXJlXCI7XG4vKipcbiAqIEFsbCBjYW52YXMgZWxlbWVudCBtYW5hZ2VkIGJ5IGpUaHJlZSBzaG91bGQgYmUgY29uc3RydWN0ZWQgd2l0aCB0aGlzIGNsYXNzLlxuICovXG5jbGFzcyBDYW52YXNFbGVtZW50QnVpbGRlciB7XG4gLyoqXG4gICogR2VuZXJhdGUgY2FudmFzIGVsZW1lbnQgc3RydWN0dXJlXG4gICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgICAgICAgICAgIGNvbnRhaW5lciB0aGUgY29udGFpbmVyIGVsZW1lbnQgaG9sZHMgdGhlIGNhbnZhc1xuICAqIEBwYXJhbSAge251bWJlcn0gICAgICAgICAgICAgICAgICB3aWR0aCAgICAgW3RoZSB3aWR0aCBpbiBwaXhlbF1cbiAgKiBAcGFyYW0gIHtudW1iZXJ9ICAgICAgICAgICAgICAgICAgaGVpZ2h0ICAgIFt0aGUgaGVpZ2h0IGluIHBpeGVsXVxuICAqIEByZXR1cm4ge0lDYW52YXNFbGVtZW50U3RydWN0dXJlfSAgICAgICAgICAgW2NvbnN0cnVjdGVkIHN0cnVjdHVyZSBpbmZvbWF0aW9uXVxuICAqL1xuICBwdWJsaWMgc3RhdGljIGdlbmVyYXRlKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogSUNhbnZhc0VsZW1lbnRTdHJ1Y3R1cmUge1xuICAgIGNvbnN0IGlubmVyQ29udGFpbmVyID0gQ2FudmFzRWxlbWVudEJ1aWxkZXIuX2dlbmVyYXRlSW5uZXJDb250YWluZXIoY29udGFpbmVyLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBjb25zdCByZXNpemVEZXRlY3RlciA9IENhbnZhc0VsZW1lbnRCdWlsZGVyLl9nZW5lcmF0ZVJlc2l6ZURldGVjdGVyKGlubmVyQ29udGFpbmVyKTtcbiAgICBjb25zdCBjYW52YXNFbGVtZW50ID0gQ2FudmFzRWxlbWVudEJ1aWxkZXIuX2dlbmVyYXRlQ2FudmFzKHJlc2l6ZURldGVjdGVyKTtcbiAgICBjb25zdCBsb2FkZXJDb250YWluZXIgPSBDYW52YXNFbGVtZW50QnVpbGRlci5fZ2VuZXJhdGVMb2FkZXJDb250YWluZXIocmVzaXplRGV0ZWN0ZXIsIHdpZHRoLCBoZWlnaHQpO1xuICAgIHJldHVybiB7XG4gICAgICBpbm5lckNvbnRhaW5lcjogaW5uZXJDb250YWluZXIsXG4gICAgICByZXNpemVEZXRlY3RlcjogcmVzaXplRGV0ZWN0ZXIsXG4gICAgICBjYW52YXM6IGNhbnZhc0VsZW1lbnQsXG4gICAgICBjb250YWluZXI6IGNvbnRhaW5lcixcbiAgICAgIGxvYWRlckNvbnRhaW5lcjogbG9hZGVyQ29udGFpbmVyXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIF9nZW5lcmF0ZUlubmVyQ29udGFpbmVyKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogSFRNTERpdkVsZW1lbnQge1xuICAgIGNvbnN0IGlubmVyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjb250YWluZXIuc3R5bGUubWFyZ2luTGVmdCA9IFwiYXV0b1wiO1xuICAgIGNvbnRhaW5lci5zdHlsZS5tYXJnaW5SaWdodCA9IFwiYXV0b1wiO1xuICAgIGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IHdpZHRoICsgXCJweFwiO1xuICAgIGNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyBcInB4XCI7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGlubmVyQ29udGFpbmVyKTtcbiAgICByZXR1cm4gaW5uZXJDb250YWluZXI7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBfZ2VuZXJhdGVSZXNpemVEZXRlY3Rlcihpbm5lckNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQpOiBIVE1MRGl2RWxlbWVudCB7XG4gICAgY29uc3QgcmVzaXplRGV0ZWN0ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHJlc2l6ZURldGVjdGVyLnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xuICAgIHJlc2l6ZURldGVjdGVyLnN0eWxlLm1hcmdpbiA9IFwiMFwiO1xuICAgIHJlc2l6ZURldGVjdGVyLnN0eWxlLnBhZGRpbmcgPSBcIjBcIjtcbiAgICByZXNpemVEZXRlY3Rlci5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcbiAgICBpbm5lckNvbnRhaW5lci5hcHBlbmRDaGlsZChyZXNpemVEZXRlY3Rlcik7XG4gICAgcmV0dXJuIHJlc2l6ZURldGVjdGVyO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgX2dlbmVyYXRlQ2FudmFzKHJlc2l6ZURldGVjdGVyOiBIVE1MRGl2RWxlbWVudCk6IEhUTUxDYW52YXNFbGVtZW50IHtcbiAgICBjb25zdCBjYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICBjYW52YXNFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgIGNhbnZhc0VsZW1lbnQuc2V0QXR0cmlidXRlKFwiYW50aWFsaWFzXCIsIFwiZmFsc2VcIik7XG4gICAgcmVzaXplRGV0ZWN0ZXIuYXBwZW5kQ2hpbGQoY2FudmFzRWxlbWVudCk7XG4gICAgcmV0dXJuIGNhbnZhc0VsZW1lbnQ7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBfZ2VuZXJhdGVMb2FkZXJDb250YWluZXIocmVzaXplRGV0ZWN0ZXI6IEhUTUxEaXZFbGVtZW50LCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IEhUTUxEaXZFbGVtZW50IHtcbiAgICBjb25zdCBsb2FkZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGxvYWRlckNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICBsb2FkZXJDb250YWluZXIuc3R5bGUud2lkdGggPSB3aWR0aCArIFwicHhcIjtcbiAgICBsb2FkZXJDb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgXCJweFwiO1xuICAgIGxvYWRlckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwieC1qMy1sb2FkZXItY29udGFpbmVyXCIpO1xuICAgIHJlc2l6ZURldGVjdGVyLmFwcGVuZENoaWxkKGxvYWRlckNvbnRhaW5lcik7XG4gICAgcmV0dXJuIGxvYWRlckNvbnRhaW5lcjtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYW52YXNFbGVtZW50QnVpbGRlcjtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==