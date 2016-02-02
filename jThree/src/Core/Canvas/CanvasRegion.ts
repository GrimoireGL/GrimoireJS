import JThreeObjectEEWithID from "../../Base/JThreeObjectEEWithID";
import IDisposable from "../../Base/IDisposable";
import Rectangle from "../../Math/Rectangle";
import JThreeContext from "../../JThreeContext";
import Debugger from "../../Debug/Debugger";
import ContextComponents from "../../ContextComponents";
/**
 * Abstract class to provide mouse tracking feature on a part of region on canvas.
 * This class is intended to be used in Canvas and viewport renderer.
 *
 * キャンバス内の特定領域におけるマウスイベントを管理するためのクラス。
 * 主にキャンバス自身や、ビューポートを持つレンダラによる使用を想定されている。
 */
class CanvasRegion extends JThreeObjectEEWithID implements IDisposable {
  /**
   * Constructor
   * @param  {HTMLCanvasElement} canvasElement the canvas element which contains this region
   */
  constructor(canvasElement: HTMLCanvasElement) {
    super();
    this.canvasElement = canvasElement;
    this.canvasElement.addEventListener("mousemove", this._mouseMoveHandler, false);
    this.canvasElement.addEventListener("mouseenter", this._mouseEnterHandler, false);
    this.canvasElement.addEventListener("mouseleave", this._mouseLeaveHandler, false);
    this.name = this.ID;
  }

  /**
   * The name for identifying this instance.
   * Random generated unique ID will be used as default.
   *
   * このクラスのインスタンスを識別するための名前
   * デフォルトではランダムに生成されたユニークな文字列が用いられる。
   */
  public name: string;

  /**
   * The html canvas element containing this renderable region.
   *
   * このクラスの管理するレンダリング可能領域が属するキャンバスのHTMLCanvasElement
   */
  public canvasElement: HTMLCanvasElement;

  /**
   * Whether mouse is on the region or not.
   *
   * マウスが現在このクラスが管理する領域の上に乗っているかどうか。
   */
  public mouseOver: boolean = false;

  public mouseX: number = 0;

  public mouseY: number = 0;

  private _mouseMoveHandler = ((e: MouseEvent): void => {
    this._checkMouseInside(e, true);
    this.emit("mouse-move", {
      enter: false,
      leave: false,
      mouseOver: this.mouseOver,
      region: this,
      mouseX: this.mouseX,
      mouseY: this.mouseY
    });
  }).bind(this);

  private _mouseLeaveHandler = ((e: MouseEvent): void => {
    this._checkMouseInside(e, false);
    this.emit("mouse-leave", {
      enter: false,
      leave: true,
      mouseOver: this.mouseOver,
      mouseX: this.mouseX,
      mouseY: this.mouseY,
      region: this
    });
  }).bind(this);

  private _mouseEnterHandler = ((e: MouseEvent): void => {
    this._checkMouseInside(e, true);
    this.emit("mouse-enter", {
      enter: true,
      leave: false,
      mouseOver: this.mouseOver,
      mouseX: this.mouseX,
      mouseY: this.mouseY,
      region: this
    });
  }).bind(this);


  /**
   * The region managed by this class.(This getter should be overridden)
   *
   * このクラスによって管理されている領域(このgetterはオーバーライドされるべきものです。)
   */
  public get region(): Rectangle {
    return null;
  }

  /**
   * Dispose used objects and event handlers.
   *
   *使ったオブジェクトやイベントハンドラの破棄
   */
  public dispose() {
    this.canvasElement.removeEventListener("mousemove", this._mouseMoveHandler, false);
    this.canvasElement.removeEventListener("mouseenter", this._mouseEnterHandler, false);
    this.canvasElement.removeEventListener("mouseleave", this._mouseLeaveHandler, false);
  }

  private _checkMouseInside(e: MouseEvent, mouseState: boolean): boolean {
    // TODO fix bug here
    const rect = this.canvasElement.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
    this.mouseOver = this.region.contains(this.mouseX, this.mouseY);
    const debug = JThreeContext.getContextComponent<Debugger>(ContextComponents.Debugger);
    debug.setInfo(`MouseState:${this.name}(${this.getTypeName() })`, {
      mouseOver: this.mouseOver,
      mousePositionX: this.mouseX,
      mousePositionY: this.mouseY,
      rawX: this.mouseX,
      rawY: this.mouseY
    });
    return this.mouseOver;
  }
}

export default CanvasRegion;
