import IContextComponent = require("../IContextComponent");
import ContextComponents = require("../ContextComponents");
import Canvas = require("./Canvas");
import GLSpecManager = require("./GLSpecManager");
import JThreeEvent = require("../Base/JThreeEvent");
import CanvasListChangedEventArgs = require("./CanvasListChangedEventArgs");
import ListStateChangedType = require("./ListStateChangedType");
class CanvasManager implements IContextComponent
{
  public getContextComponentIndex():number
  {
    return ContextComponents.CanvasManager;
  }

  constructor()
  {

  }

  public canvases:Canvas[] = [];

  public canvasListChanged:JThreeEvent<CanvasListChangedEventArgs> = new JThreeEvent<CanvasListChangedEventArgs>();

  public addCanvas(canvas:Canvas):void
  {
    if (this.canvases.indexOf(canvas) === -1)
    {
        this.canvases.push(canvas);
        this.canvasListChanged.fire(this,new CanvasListChangedEventArgs(ListStateChangedType.Add,canvas));
        GLSpecManager.debugDisplayGLSpecs();//TODO remove this
    }
  }

  /**
   * Remove renderer
   */
  public removeCanvas(canvas: Canvas): void {
      if (this.canvases.indexOf(canvas) !== -1) {
          for (var i = 0; i < this.canvases.length; i++) {
              if (this.canvases[i] === canvas)
              {
                  this.canvases.splice(i, 1);
                  break;
              }
          }
          this.canvasListChanged.fire(this,new CanvasListChangedEventArgs(ListStateChangedType.Delete,canvas));
      }
  }

  public beforeRenderAll()
  {
    this.canvases.forEach((c)=>c.beforeRenderAll());
  }

  public afterRenderAll()
  {
    this.canvases.forEach((c)=>c.afterRenderAll());
  }
}

export = CanvasManager;
