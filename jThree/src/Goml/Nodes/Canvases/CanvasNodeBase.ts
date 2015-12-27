import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Canvas = require("../../../Core/Canvas");

class CanvasNodeBase extends GomlTreeNodeBase {
  constructor() {
    super();
    this.attributes.defineAttribute({
      "width": {
        value: undefined,
        converter: "float",
        onchanged: (v) => {
          this.sizeChanged(v.Value, this.attributes.getValue("height"));
        },
      },
      "height": {
        value: undefined,
        converter: "float",
        onchanged: (v) => {
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
      "loader":
      {
        value: undefined,
        converter: "string",
        onchanged: (v) => {
        },
      }
    });
    this.on('canvas-ready', this._onCanvasReady);
  }

  private _onCanvasReady(): void {
    this.attributes.setValue("width", this.DefaultWidth);
    this.attributes.setValue("height", this.DefaultHeight);
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

  }

  protected get DefaultWidth(): number {
    return 0;
  }

  protected get DefaultHeight(): number {
    return 0;
  }
}

export = CanvasNodeBase;
