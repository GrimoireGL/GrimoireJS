import CoreRelatedNodeBase from "../../CoreRelatedNodeBase";
import CanvasManager from "../../../Core/Canvas/CanvasManager";
import ICanvasElementStructure from "../../../Core/Canvas/ICanvasElementStructure";
import CanvasElementBuilder from "../../../Core/Canvas/CanvasElementBuilder";
import Canvas from "../../../Core/Canvas/Canvas";
import JThreeContext from "../../../JThreeContext";
import ContextComponents from "../../../ContextComponents";
import ResourceLoader from "../../../Core/ResourceLoader";

class CanvasNode extends CoreRelatedNodeBase<Canvas> {
  public canvasFrames: ICanvasElementStructure;

  constructor() {
    super();
    this.attributes.defineAttribute({
      "frame": {
        value: undefined,
        converter: "string",
        // TODO pnly: frame onchange handler
      },
      "width": {
        value: 640,
        converter: "float",
        onchanged: (v) => {
          this.emit("resize");
          this.sizeChanged(v.Value, this.attributes.getValue("height"));
        },
      },
      "height": {
        value: 480,
        converter: "float",
        onchanged: (v) => {
          this.emit("resize");
          this.sizeChanged(this.attributes.getValue("width"), v.Value);
        },
      },
      "loader": {
        value: undefined,
        converter: "string",
      },
      "clearColor": {
        value: "#0000",
        converter: "color4",
        onchanged: (v) => {
          this.target.clearColor = v.Value;
        }
      }
    });
  }


  public get Frame(): string {
    return this.attributes.getValue("frame") || "body";
  }

  protected onMount(): void {
    super.onMount();
    // generate canvas
    const canvas = <HTMLElement>document.querySelector(this.Frame);
    this.canvasFrames = CanvasElementBuilder.generate(canvas, this.attributes.getValue("width"), this.attributes.getValue("height"));

    // initialize contexts
    this.target = new Canvas(this.canvasFrames.canvas);
    JThreeContext.getContextComponent<CanvasManager>(ContextComponents.CanvasManager).addCanvas(this.target);

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
