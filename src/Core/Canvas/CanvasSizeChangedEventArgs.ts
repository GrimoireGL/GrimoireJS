import Canvas from "./Canvas";

class CanvasSizeChangedEventArg {
  private _canvas: Canvas;
  private _lastWidth: number;
  private _lastHeight: number;
  private _newWidth: number;
  private _newHeight: number;
  constructor(target: Canvas, lastWidth: number, lastHeight: number, newWidth: number, newHeight: number) {
    this._canvas = target;
    this._lastWidth = lastWidth;
    this._lastHeight = lastHeight;
    this._newWidth = newWidth;
    this._newHeight = newHeight;
  }

  public get Canvas(): Canvas {
    return this._canvas;
  }

  public get LastWidth(): number {
    return this._lastWidth;
  }

  public get LastHeight(): number {
    return this._lastHeight;
  }

  public get NewWidth(): number {
    return this._newWidth;
  }

  public get NewHeight(): number {
    return this._newHeight;
  }
}

export default CanvasSizeChangedEventArg;
