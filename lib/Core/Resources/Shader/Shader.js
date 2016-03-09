import ContextSafeContainer from "../ContextSafeResourceContainer";
import ShaderWrapper from "./ShaderWrapper";
import JThreeEvent from "../../../Base/JThreeEvent";
class Shader extends ContextSafeContainer {
    /**
     * コンストラクタ
     * (Should not be called by new,You should use CreateShader static method instead.)
     */
    constructor() {
        super();
        this._onUpdateEvent = new JThreeEvent();
        this.__initializeForFirst();
    }
    /**
     * シェーダークラスを作成する。
     */
    static createShader(source, shaderType) {
        const shader = new Shader();
        shader._shaderSource = source;
        shader._shaderType = shaderType;
        return shader;
    }
    /**
     * Shader Type
     * (VertexShader or FragmentShader)
     */
    get ShaderType() {
        return this._shaderType;
    }
    /**
     * Shader Source in text
     */
    get ShaderSource() {
        return this._shaderSource;
    }
    /**
     * Load all shaderWrappers
     */
    loadAll() {
        this.each((v) => {
            v.init();
        });
    }
    __createWrapperForCanvas(canvas) {
        return new ShaderWrapper(this, canvas);
    }
    /**
     * Update shader source code.
     * @param shaderSource new shader source code.
     */
    update(shaderSource) {
        this._shaderSource = shaderSource;
        this.each((v) => {
            v.update();
        });
        this._onUpdateEvent.fire(this, shaderSource);
    }
    /**
     * Register the handler to handle when shader source code is changed.
     * @param handler the handler for shader changing
     */
    onUpdate(handler) {
        this._onUpdateEvent.addListener(handler);
    }
}
export default Shader;
