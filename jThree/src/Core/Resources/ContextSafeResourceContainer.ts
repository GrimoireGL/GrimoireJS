import JThreeObjectWithID = require("../../Base/JThreeObjectWithID");
import ContextManagerBase = require("../ContextManagerBase");
import Delegates = require("../../Base/Delegates");
import Exceptions = require("../../Exceptions");
import CanvasListChangedEventArgs = require("../CanvasListChangedEventArgs");
import ListStateChangedType = require("../ListStateChangedType");
import AssociativeArray = require('../../Base/Collections/AssociativeArray');
import ResourceWrapper = require('./ResourceWrapper');
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
            this.childWrapper.set(v.ID, this.getInstanceForRenderer(v));
        });
    }

    public get wrappers():T[]
    {
      return this.childWrapper.asArray;
    }

    private childWrapper: AssociativeArray<T> = new AssociativeArray<T>();

    public getForContext(contextManager: ContextManagerBase): T {
        return this.getForContextID(contextManager.ID);
    }

    public getForContextID(id: string): T {
        if (!this.childWrapper.has(id)) console.log("There is no matching object with the ID:" + id);
        return this.childWrapper.get(id);
    }

    public each(act: Delegates.Action1<T>): void {
        this.childWrapper.forEach(((v, i, a) => {
            act(v);
        }));
    }

    private rendererChanged(object: any, arg: CanvasListChangedEventArgs): void {
        switch (arg.ChangeType) {
            case ListStateChangedType.Add:
                this.childWrapper.set(arg.AffectedRenderer.ID, this.getInstanceForRenderer(arg.AffectedRenderer));
                break;
            case ListStateChangedType.Delete:
                var delTarget: T = this.childWrapper.get(arg.AffectedRenderer.ID);
                this.childWrapper.delete(arg.AffectedRenderer.ID);
                this.disposeResource(delTarget);
                break;
        }
    }

    protected getInstanceForRenderer(renderer: ContextManagerBase): T {
        throw new Exceptions.AbstractClassMethodCalledException();
    }

    protected disposeResource(resource: T): void {
        throw new Exceptions.AbstractClassMethodCalledException();
    }
}

export =ContextSafeResourceContainer;
