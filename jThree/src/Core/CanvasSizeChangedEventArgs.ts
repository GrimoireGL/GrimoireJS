import Canvas = require("./Canvas");

class CanvasSizeChangedEventArg {
  private canvas: Canvas;
  private lastWidth: number;
  private lastHeight: number;
  private newWidth: number;
  private newHeight: number;
  constructor(target: Canvas, lastWidth: number, lastHeight: number, newWidth: number, newHeight: number) {
    this.canvas = target;
    this.lastWidth = lastWidth;
    this.lastHeight = lastHeight;
    this.newWidth = newWidth;
    this.newHeight = newHeight;
  }

  public get Canvas(): Canvas {
    return this.canvas;
  }

  public get LastWidth(): number {
    return this.lastWidth;
  }

  public get LastHeight(): number {
    return this.lastHeight;
  }

  public get NewWidth(): number {
    return this.newWidth;
  }

  public get NewHeight(): number {
    return this.newHeight;
  }
}

export = CanvasSizeChangedEventArg;
