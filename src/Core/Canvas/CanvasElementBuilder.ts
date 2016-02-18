import ICanvasElementStructure from "./ICanvasElementStructure";

class CanvasElementBuilder {
  public static generate(container: HTMLElement, width: number, height: number): ICanvasElementStructure {
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

  private static _generateInnerContainer(container: HTMLElement, width: number, height: number): HTMLDivElement {
    const innerContainer = document.createElement("div");
    container.style.marginLeft = "auto";
    container.style.marginRight = "auto";
    container.style.width = width + "px";
    container.style.height = height + "px";
    container.appendChild(innerContainer);
    return innerContainer;
  }

  private static _generateResizeDetecter(innerContainer: HTMLDivElement): HTMLDivElement {
    const resizeDetecter = document.createElement("div");
    resizeDetecter.style.position = "relative";
    resizeDetecter.style.margin = "0";
    resizeDetecter.style.padding = "0";
    resizeDetecter.style.height = "100%";
    innerContainer.appendChild(resizeDetecter);
    return resizeDetecter;
  }

  private static _generateCanvas(resizeDetecter: HTMLDivElement): HTMLCanvasElement {
    const canvasElement = document.createElement("canvas");
    canvasElement.style.position = "absolute";
    canvasElement.setAttribute("antialias", "false");
    resizeDetecter.appendChild(canvasElement);
    return canvasElement;
  }

  private static _generateLoaderContainer(resizeDetecter: HTMLDivElement, width: number, height: number): HTMLDivElement {
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
