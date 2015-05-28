import JThreeObject = require("../../Base/JThreeObject");
import ContextManagerBase = require("../ContextManagerBase");
import Delegates = require("../../Delegates");
import Exceptions = require("../../Exceptions");
import JThreeContext = require("../JThreeContext");
import RendererListChangedEventArgs = require("../RendererListChangedEventArgs");
import RendererStateChangedType = require("../RendererStateChangedType");
class ContextSafeResourceContainer<T> extends JThreeObject
{
    private context: JThreeContext = null;

    constructor(context:JThreeContext) {
        super();
        this.context = context;
        //Initialize resources for the renderers already subscribed.
        this.context.CanvasManagers.forEach((v) => {
            this.cachedObject.set(v.ID, this.getInstanceForRenderer(v));
        });
        this.context.onRendererChanged(this.rendererChanged);
    }

    private cachedObject: Map<string, T> = new Map<string, T>();

    public getForRenderer(contextManager: ContextManagerBase): T {
        return this.getForRendererID(contextManager.ID);
    }

    public getForRendererID(id: string): T {
        if (!this.cachedObject.has(id))console.log("There is no matching object with the ID:"+id);
        return this.cachedObject.get(id);
    }

    protected each(act: Delegates.Action1<T>): void {
        this.cachedObject.forEach(((v, i, a) => {
            act(v);
        }));
    }

    private rendererChanged(arg:RendererListChangedEventArgs): void {
        switch (arg.ChangeType) {
            case RendererStateChangedType.Add:
                this.cachedObject.set(arg.AffectedRenderer.ID, this.getInstanceForRenderer(arg.AffectedRenderer));
                break;
            case RendererStateChangedType.Delete:
                var delTarget: T = this.cachedObject.get(arg.AffectedRenderer.ID);
                this.cachedObject.delete(arg.AffectedRenderer.ID);
                this.disposeResource(delTarget);
                break;
        }
    }

    protected getInstanceForRenderer(renderer:ContextManagerBase): T {
        throw new Exceptions.AbstractClassMethodCalledException();
    }

    protected disposeResource(resource: T): void {
        throw new Exceptions.AbstractClassMethodCalledException();
    }
}

export=ContextSafeResourceContainer;
