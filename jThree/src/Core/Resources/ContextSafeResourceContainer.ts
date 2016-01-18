import JThreeObjectWithID = require("../../Base/JThreeObjectWithID");
import Canvas = require("../Canvas");
import Delegates = require("../../Base/Delegates");
import Exceptions = require("../../Exceptions");
import CanvasListChangedEventArgs = require("../CanvasListChangedEventArgs");
import ListStateChangedType = require("../ListStateChangedType");
import ResourceWrapper = require("./ResourceWrapper");;
import JThreeContext = require("../../JThreeContext");
import CanvasManager = require("../CanvasManager");
import ContextComponents = require("../../ContextComponents");
/**
 * Provides context difference abstraction.
 */
class ContextSafeResourceContainer<T extends ResourceWrapper> extends JThreeObjectWithID
{
    public name:string;

    constructor() {
        super();
        var canvasManager = JThreeContext.getContextComponent<CanvasManager>(ContextComponents.CanvasManager);
        //Initialize resources for the renderers already subscribed.
        canvasManager.canvasListChanged.addListener(this.rendererChanged.bind(this));
    }

    protected initializeForFirst() {
      var canvasManager = JThreeContext.getContextComponent<CanvasManager>(ContextComponents.CanvasManager);
        canvasManager.canvases.forEach((v) => {
            this.childWrapper[v.ID]=this.getInstanceForRenderer(v);
            this.wrapperLength ++;
        });
    }

    public get wrappers():T[]
    {
      const array = new Array(this.wrapperLength);
      let index = 0;
      this.each((elem)=>{
        array[index] = elem;
        index ++;
      })
      return array;
    }

    private childWrapper:{[key:string]:T} = {};

    private wrapperLength:number = 0;

    public getForContext(canvas: Canvas): T {
        return this.getForContextID(canvas.ID);
    }

    public getForContextID(id: string): T {
        if (!this.childWrapper[id]) console.log("There is no matching object with the ID:" + id);
        return this.childWrapper[id];
    }

    public each(act: Delegates.Action1<T>): void {
        for(let key in this.childWrapper)
        {
          act(this.childWrapper[key]);
        }
    }

    private rendererChanged(object: any, arg: CanvasListChangedEventArgs): void {
        switch (arg.ChangeType) {
            case ListStateChangedType.Add:
                this.childWrapper[arg.AffectedRenderer.ID] =  this.getInstanceForRenderer(arg.AffectedRenderer);
                this.wrapperLength++;
                break;
            case ListStateChangedType.Delete:
                var delTarget: T = this.childWrapper[arg.AffectedRenderer.ID];
                delete this.childWrapper[arg.AffectedRenderer.ID];
                this.disposeResource(delTarget);
                this.wrapperLength --;
                break;
        }
    }

    protected getInstanceForRenderer(renderer: Canvas): T {
        throw new Exceptions.AbstractClassMethodCalledException();
    }

    protected disposeResource(resource: T): void {
        throw new Exceptions.AbstractClassMethodCalledException();
    }
}

export =ContextSafeResourceContainer;
