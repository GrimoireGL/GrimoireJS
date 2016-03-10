"use strict";
class CanvasElementBuilder {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CanvasElementBuilder;
//# sourceMappingURL=CanvasElementBuilder.js.map