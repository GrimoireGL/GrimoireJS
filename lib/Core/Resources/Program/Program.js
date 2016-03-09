import ContextSafeContainer from "../ContextSafeResourceContainer";
import ProgramWrapper from "./ProgramWrapper";
class Program extends ContextSafeContainer {
    constructor() {
        super();
        this._attachedShaders = [];
        this.__initializeForFirst();
    }
    static createProgram(attachShaders) {
        const program = new Program();
        program._attachedShaders = attachShaders;
        return program;
    }
    get AttachedShaders() {
        return this._attachedShaders;
    }
    attachShader(shader) {
        this._attachedShaders.push(shader);
        shader.onUpdate(() => {
            this._relinkShader();
        });
    }
    __createWrapperForCanvas(canvas) {
        return new ProgramWrapper(this, canvas);
    }
    uniformExists(valName) {
        if (this.wrappers.length > 0) {
            return this.wrappers[0].uniformExists(valName);
        }
        throw new Error("Any program was not initialized!");
    }
    _relinkShader() {
        this.each((v) => {
            v.relink();
        });
    }
}
export default Program;
