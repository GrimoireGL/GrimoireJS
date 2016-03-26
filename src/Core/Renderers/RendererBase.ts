import ICanvasContainer from "../Canvas/ICanvasContainer";
import Rectangle from "../../Math/Rectangle";
import CanvasRegion from "../Canvas/CanvasRegion";
import Canvas from "../Canvas/Canvas";
abstract class RendererBase extends CanvasRegion implements ICanvasContainer {

  public gl: WebGLRenderingContext;

  private _region: Rectangle = new Rectangle(0, 0, 512, 512);

  constructor(public canvas: Canvas) {
    super(canvas.canvasElement);
    this.gl = canvas.gl;
  }

  public get region(): Rectangle {
    return this._region;
  }

  /**
   * Setter for viewport area. viewport area is the area to render.
   * @param area {Rectangle} the rectangle to render.
   */
  public set region(area: Rectangle) {
    if (!Rectangle.equals(area, this.region) && (typeof area.Width !== "undefined") && (typeof area.Height !== "undefined")) { // Check specified area is valid and modified
      if (isNaN(area.Height + area.Width)) {
        return;
      }
      this._region = area;
      this.emit("resize", area);
    }
  }
}
export default RendererBase;
