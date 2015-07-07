import jThreeObject = require("../Base/JThreeObject");
class Rectangle extends jThreeObject {
    constructor(left: number, top: number, width: number, height: number) {
        super();
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
    private left: number;
    private top: number;
    private width: number;
    private height: number;

    get Left(): number {
        return this.left;
    }

    get Right(): number {
        return this.left + this.width;
    }

    get Top(): number {
        return this.top;
    }

    get Bottom(): number {
        return this.top + this.height;
    }

    get Width(): number {
        return this.width;
    }

    get Height(): number {
        return this.height;
    }

    toString():string{
      return `Rectangle(${this.left},${this.top}-${this.Right},${this.Bottom})`;
    }
    
    public static Equals(r1:Rectangle,r2:Rectangle):boolean
    {
        return r1.Left===r2.Left&&r1.Right===r2.Right&&r1.Top===r2.Top&&r1.Bottom===r2.Bottom;
    }
}
export=Rectangle;
