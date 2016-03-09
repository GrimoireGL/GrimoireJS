import ContextSafeResourceContainer from "./../ContextSafeResourceContainer";
import VAOWrapper from "./VAOWrapper";
class VAO extends ContextSafeResourceContainer {
    constructor() {
        super();
        this.__initializeForFirst();
    }
    __createWrapperForCanvas(canvas) {
        return new VAOWrapper(canvas, this);
    }
}
export default VAO;
