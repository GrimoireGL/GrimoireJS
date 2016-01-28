import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Canvas = require("../../../Core/Canvas");

class CanvasNodeBase extends GomlTreeNodeBase {
  constructor() {
    super();
    this.attributes.defineAttribute({
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
      "clearColor": {
        value: "#0FF",
        converter: "color4",
        onchanged: (v) => {
          this.canvas.clearColor = v.Value;
        },
      },
      "loader": {
        value: undefined,
        converter: "string",
      }
    });
  }

  private canvas: Canvas;

  protected setCanvas(canvas: Canvas) {
    this.canvas = canvas;
    this.sizeChanged(this.DefaultWidth, this.DefaultHeight);
  }

  public get Canvas(): Canvas {
    return this.canvas;
  }

  protected sizeChanged(width: number, height: number) {
    return;
  }

  protected get DefaultWidth(): number {
    return 0;
  }

  protected get DefaultHeight(): number {
    return 0;
  }
}

export = CanvasNodeBase;
