import Vector2 from "./Vector2";
import jThreeObject from "../Base/JThreeObject";
class Rectangle extends jThreeObject {

  private _left: number;
  private _top: number;
  private _width: number;
  private _height: number;

  public static equals(r1: Rectangle, r2: Rectangle): boolean {
    return r1.Left === r2.Left && r1.Right === r2.Right && r1.Top === r2.Top && r1.Bottom === r2.Bottom;
  }

  public static edgeSizeEquals(r1: Rectangle, r2: Rectangle): boolean {
    return r1.Width === r2.Width && r1.Height === r2.Height;
  }

  constructor(left: number, top: number, width: number, height: number) {
    super();
    this._left = left;
    this._top = top;
    this._width = width;
    this._height = height;
  }

  public get Left(): number {
    return this._left;
  }

  public get Right(): number {
    return this.Left + this.Width;
  }

  public get Top(): number {
    return this._top;
  }

  public get Bottom(): number {
    return this._top + this._height;
  }

  public get Width(): number {
    return this._width;
  }

  public get Height(): number {
    return this._height;
  }

  public contains(point: Vector2): boolean;
  public contains(x: number, y: number): boolean;
  public contains(xOrPoint: number|Vector2, y?: number): boolean {
    let x;
    if (xOrPoint instanceof Vector2) {
      x = xOrPoint.X;
      y = xOrPoint.Y;
    } else {
      x = xOrPoint;
    }
    return this.Left <= x && this.Right >= x && this.Top <= y && this.Bottom >= y;
  }

  public toLocal(x: Vector2): Vector2;
  public toLocal(x: number, y: number): number[];
  public toLocal(xOrPoint: Vector2 | number, y?: number): any {
    let x;
    if (xOrPoint instanceof Vector2) {
      x = xOrPoint.X;
      y = xOrPoint.Y;
    } else {
      x = xOrPoint;
    }
    x -= this.Left;
    y -= this.Top;

    return xOrPoint instanceof Vector2 ? new Vector2(x, y) : [x, y];
  }

  public toString(): string {
    return `Rectangle(${this.Left},${this.Top}-${this.Right},${this.Bottom})`;
  }

}
export default Rectangle;
