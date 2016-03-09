import FBOWrapper from "./FBOWrapper";
import ContextSafeResourceContainer from "./../ContextSafeResourceContainer";
class FBO extends ContextSafeResourceContainer {
    constructor() {
        super();
        this.__initializeForFirst();
    }
    __createWrapperForCanvas(canvas) {
        return new FBOWrapper(canvas);
    }
}
export default FBO;
