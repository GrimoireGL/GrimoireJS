import ICanvasElementStructure from "../../../Core/Canvas/ICanvasElementStructure";
import CanvasElementBuilder from "../../../Core/Canvas/CanvasElementBuilder";
import Canvas from "../../../Core/Canvas/Canvas";
import JThreeContext from "../../../JThreeContext";
import ContextComponents from "../../../ContextComponents";
import CanvasManager from "../../../Core/Canvas/CanvasManager";
import CanvasNodeBase from "./CanvasNodeBase";
import {Action1} from "../../../Base/Delegates";
import ResourceLoader from "../../../Core/ResourceLoader";

class CanvasNode extends CanvasNodeBase {
  public canvasFrames: ICanvasElementStructure;

  private resizedFunctions: Action1<CanvasNode>[] = [];

  constructor() {
    super();
    this.attributes.defineAttribute({
      "frame": {
        value: undefined,
        converter: "string",
        // TODO pnly: frame onchange handler
      }
    });
  }

  protected onMount(): void {
    super.onMount();
    // generate canvas
    const canvas = <HTMLElement>document.querySelector(this.Frame);
    this.canvasFrames = CanvasElementBuilder.generate(canvas, this.attributes.getValue("width"), this.attributes.getValue("height"));

    // initialize contexts
    this.setCanvas(new Canvas(this.canvasFrames.canvas));

    // construct loader
    let defaultLoader;
    // TODO: pnly
    // if (this.attributes.getValue("loader") !== "undefined" && this.nodeManager.nodeRegister.hasGroup("jthree.loader")) {
    //   var loaderNode = (this.nodeManager.nodeRegister.getObject("jthree.loader", this.attributes.getValue("loader")) as any);
    //   if (loaderNode) defaultLoader = loaderNode.loaderHTML;
    // }
    if (!defaultLoader) {
      defaultLoader = require("../../../static/defaultLoader.html");
    }
    this.canvasFrames.loaderContainer.innerHTML = defaultLoader;

    const progressLoaders = this.canvasFrames.loaderContainer.querySelectorAll(".x-j3-loader-progress");
    JThreeContext.getContextComponent<ResourceLoader>(ContextComponents.ResourceLoader).promise.then(() => {
      const loaders = this.canvasFrames.resizeDetecter.querySelectorAll(".x-j3-loader-container");
      for (let i = 0; i < loaders.length; i++) {
        const loader = loaders.item(i);
        loader.remove();
      }
    }, () => { return; }, (p) => {
        for (let i = 0; i < progressLoaders.length; i++) {
          const progress = <HTMLDivElement>progressLoaders.item(i);
          progress.style.width = p.completedResource / p.resourceCount * 100 + "%";
        }
      });
  }

  public get Frame(): string {
    return this.attributes.getValue("frame") || "body";
  }

  public resize();
  public resize(func: Action1<CanvasNode>);
  public resize(func?: Action1<CanvasNode>) {
    if (typeof arguments[0] === "function") {
      if (this.resizedFunctions.indexOf(arguments[0]) === -1) {
        this.resizedFunctions.push(arguments[0]);
      }
    } else {
      this.sizeChanged(this.DefaultWidth, this.DefaultHeight);
      this.resizedFunctions.forEach(function(f) {
        f(this);
      }.bind(this));
    }

  }

  protected get DefaultWidth(): number {
    return this.canvasFrames.container.clientWidth;
  }

  protected get DefaultHeight(): number {
    return this.canvasFrames.container.clientHeight;
  }

  protected sizeChanged(width: number, height: number) {
    this.canvasFrames.canvas.width = width;
    this.canvasFrames.canvas.height = height;
  }
}

export default CanvasNode;
