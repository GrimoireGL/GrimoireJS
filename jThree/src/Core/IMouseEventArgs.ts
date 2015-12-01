import Vector2 = require("../Math/Vector2");
import CanvasRegion = require("./CanvasRegion");
interface IMouseEventArgs{
  enter:boolean;
  leave:boolean;
  mouseOver:boolean;
  mousePosition:Vector2;
  region:CanvasRegion;
}
export = IMouseEventArgs;
