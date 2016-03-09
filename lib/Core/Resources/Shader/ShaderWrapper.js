import JThreeLogger from "../../../Base/JThreeLogger";
import ResourceWrapper from "../ResourceWrapper";
class ShaderWrapper extends ResourceWrapper {
    constructor(parent, canvas) {
        super(canvas);
        this._targetShader = null;
        this._parentShader = parent;
    }
    get TargetShader() {
        if (!this.Initialized) {
            this.init();
        }
        return this._targetShader;
    }
    init() {
        if (!this.Initialized) {
            this._targetShader = this.GL.createShader(this._parentShader.ShaderType);
            this.GL.shaderSource(this._targetShader, this._parentShader.ShaderSource);
            this.GL.compileShader(this._targetShader);
            this._checkCompileStatus();
            this.__setInitialized(true);
        }
    }
    dispose() {
        if (this.Initialized) {
            this.GL.deleteShader(this._targetShader);
            this._targetShader = null;
            this.__setInitialized(false);
        }
    }
    /**
     * Update shader source from Shader class.
     */
    update() {
        this.GL.deleteShader(this._targetShader);
        this._targetShader = this.GL.createShader(this._parentShader.ShaderType);
        this.GL.shaderSource(this.TargetShader, this._parentShader.ShaderSource);
        this.GL.compileShader(this.TargetShader);
    }
    _checkCompileStatus() {
        if (!this.GL.getShaderParameter(this._targetShader, this.GL.COMPILE_STATUS)) {
            console.error(`Compile error!:${this.GL.getShaderInfoLog(this._targetShader)}`);
            JThreeLogger.sectionLongLog("COMPILE_ERROR", this._parentShader.ShaderSource);
        }
    }
}
export default ShaderWrapper;
