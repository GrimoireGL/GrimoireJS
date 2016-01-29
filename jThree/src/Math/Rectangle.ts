import jThreeObject from "../Base/JThreeObject";
class Rectangle extends jThreeObject {

  private left: number;
  private top: number;
  private width: number;
  private height: number;

  constructor(left: number, top: number, width: number, height: number) {
    super();
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
  }

  public static Equals(r1: Rectangle, r2: Rectangle): boolean {
    return r1.Left === r2.Left && r1.Right === r2.Right && r1.Top === r2.Top && r1.Bottom === r2.Bottom;
  }

  public static SizeEquals(r1: Rectangle, r2: Rectangle) {
    return r1.Width === r2.Width && r1.Height === r2.Height;
  }

  public get Left(): number {
    return this.left;
  }

  public get Right(): number {
    return this.left + this.width;
  }

  public get Top(): number {
    return this.top;
  }

  public get Bottom(): number {
    return this.top + this.height;
  }

  public get Width(): number {
    return this.width;
  }

  public get Height(): number {
    return this.height;
  }

  public contains(x: number, y: number): boolean {
    return this.Left <= x && this.Right >= x && this.Top <= y && this.Bottom >= y;
  }

  public toString(): string {
    return `Rectangle(${this.left},${this.top}-${this.Right},${this.Bottom})`;
  }

}
export default Rectangle;
