import JThreeObjectWithID from "../../Base/JThreeObjectWithID";
import { AbstractClassMethodCalledException } from "../../Exceptions";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
/**
 * Provides context difference abstraction.
 */
class ContextSafeResourceContainer extends JThreeObjectWithID {
    constructor() {
        super();
        this._childWrapper = {};
        this._wrapperLength = 0;
        const canvasManager = JThreeContext.getContextComponent(ContextComponents.CanvasManager);
        // Initialize resources for the renderers already subscribed.
        canvasManager.canvasListChanged.addListener(this._rendererChanged.bind(this));
    }
    dispose() {
        this.each((e) => {
            e.dispose();
        });
    }
    get wrappers() {
        const array = new Array(this._wrapperLength);
        let index = 0;
        this.each((elem) => {
            array[index] = elem;
            index++;
        });
        return array;
    }
    getForContext(canvas) {
        return this.getForContextID(canvas.ID);
    }
    getForContextID(id) {
        if (!this._childWrapper[id]) {
            console.log("There is no matching object with the ID:" + id);
        }
        return this._childWrapper[id];
    }
    each(act) {
        for (let key in this._childWrapper) {
            act(this._childWrapper[key]);
        }
    }
    __createWrapperForCanvas(canvas) {
        throw new AbstractClassMethodCalledException();
    }
    __initializeForFirst() {
        const canvasManager = JThreeContext.getContextComponent(ContextComponents.CanvasManager);
        canvasManager.canvases.forEach((v) => {
            this._childWrapper[v.ID] = this.__createWrapperForCanvas(v);
            this._wrapperLength++;
        });
    }
    _rendererChanged(object, arg) {
        if (arg.isAdditionalChange) {
            this._childWrapper[arg.canvas.ID] = this.__createWrapperForCanvas(arg.canvas);
            this._wrapperLength++;
        }
        else {
            const delTarget = this._childWrapper[arg.canvas.ID];
            delete this._childWrapper[arg.canvas.ID];
            delTarget.dispose();
            this._wrapperLength--;
        }
    }
}
export default ContextSafeResourceContainer;
