import Rectangle = require("../Math/Rectangle");
import JThreeObjectWithID = require("../Base/JThreeObjectWithID");
import Vector2 = require("../Math/Vector2");
import JThreeContext = require("../JThreeContext");
import Debugger = require("../Debug/Debugger");
import ContextComponents = require("../ContextComponents");

class CanvasRegion extends JThreeObjectWithID {
    constructor(canvasElement: HTMLCanvasElement) {
        super();
        this.canvasElement = canvasElement;
        this.canvasElement.addEventListener('mousemove', this._mouseMoveHandler.bind(this), false);
        this.canvasElement.addEventListener('mouseenter', this._mouseEnterHandler.bind(this), false);
        this.canvasElement.addEventListener('mouseleave', this._mouseLeaveHandler.bind(this), false);
        this.name = this.ID;
    }
    public name: string;

    public canvasElement: HTMLCanvasElement;

    public mouseOver: boolean = false;

    public lastMousePosition: Vector2 = new Vector2(0, 0);

    public get region(): Rectangle {
        return null;
    }

    private _mouseMoveHandler(e: MouseEvent): void {
        this._checkMouseInside(e);
    }

    private _mouseLeaveHandler(e: MouseEvent): void {
        this._checkMouseInside(e);
    }

    private _mouseEnterHandler(e: MouseEvent): void {
        this._checkMouseInside(e);
    }

    private _checkMouseInside(e: MouseEvent): boolean {
        var r = this.region;
        var rect = this.canvasElement.getBoundingClientRect();
        var x =  (e.clientX-rect.left)/(rect.right-rect.left)*this.canvasElement.width;
        var y =  (e.clientY-rect.top)/(rect.bottom-rect.top)*this.canvasElement.height;
        this.mouseOver = r.contains(x, y);
        if (this.mouseOver) {
            this.lastMousePosition.X = (x - r.Left)/r.Width;
            this.lastMousePosition.Y = (y - r.Top)/r.Height;
        } else {
            this.lastMousePosition.X = -1;
            this.lastMousePosition.Y = -1;
        }
        var debug = JThreeContext.getContextComponent<Debugger>(ContextComponents.Debugger);
        debug.setInfo(`MouseState:${this.name}(${this.getTypeName()})`,{
          mouseOver:this.mouseOver,
          mousePositionX:this.lastMousePosition.X,
          mousePositionY:this.lastMousePosition.Y
        });
        return this.mouseOver;
    }
}

export = CanvasRegion;
