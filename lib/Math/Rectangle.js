import Vector2 from "./Vector2";
import jThreeObject from "../Base/JThreeObject";
class Rectangle extends jThreeObject {
    constructor(left, top, width, height) {
        super();
        this._left = left;
        this._top = top;
        this._width = width;
        this._height = height;
    }
    static equals(r1, r2) {
        return r1.Left === r2.Left && r1.Right === r2.Right && r1.Top === r2.Top && r1.Bottom === r2.Bottom;
    }
    static edgeSizeEquals(r1, r2) {
        return r1.Width === r2.Width && r1.Height === r2.Height;
    }
    get Left() {
        return this._left;
    }
    get Right() {
        return this.Left + this.Width;
    }
    get Top() {
        return this._top;
    }
    get Bottom() {
        return this._top + this._height;
    }
    get Width() {
        return this._width;
    }
    get Height() {
        return this._height;
    }
    contains(xOrPoint, y) {
        let x;
        if (xOrPoint instanceof Vector2) {
            x = xOrPoint.X;
            y = xOrPoint.Y;
        }
        else {
            x = xOrPoint;
        }
        return this.Left <= x && this.Right >= x && this.Top <= y && this.Bottom >= y;
    }
    toLocal(xOrPoint, y) {
        let x;
        if (xOrPoint instanceof Vector2) {
            x = xOrPoint.X;
            y = xOrPoint.Y;
        }
        else {
            x = xOrPoint;
        }
        x -= this.Left;
        y -= this.Top;
        return xOrPoint instanceof Vector2 ? new Vector2(x, y) : [x, y];
    }
    toString() {
        return `Rectangle(${this.Left},${this.Top}-${this.Right},${this.Bottom})`;
    }
}
export default Rectangle;
