import IShaderCompileError from "./IShaderCompileError";
import Shader from "./Shader";
import Canvas from "../../Canvas/Canvas";
import ResourceWrapper from "../ResourceWrapper";
class ShaderWrapper extends ResourceWrapper {

    constructor(parent: Shader, canvas: Canvas) {
        super(canvas);
        this._parentShader = parent;
    }

    private _targetShader: WebGLShader = null;

    private _parentShader: Shader;

    public get TargetShader(): WebGLShader {
        if (!this.Initialized) {
            this.init();
        }
        return this._targetShader;
    }

    public init(): void {
        if (!this.Initialized) {
            this._targetShader = this.GL.createShader(this._parentShader.ShaderType);
            this.GL.shaderSource(this._targetShader, this._parentShader.ShaderSource);
            this.GL.compileShader(this._targetShader);
            this._checkCompileStatus();
            this.__setInitialized(true);
        }
    }

    public dispose(): void {
        if (this.Initialized) {
            this.GL.deleteShader(this._targetShader);
            this._targetShader = null;
            this.__setInitialized(false);
        }
    }

    /**
     * Update shader source from Shader class.
     */
    public update(): void {
        this.GL.deleteShader(this._targetShader);
        this._targetShader = this.GL.createShader(this._parentShader.ShaderType);
        this.GL.shaderSource(this.TargetShader, this._parentShader.ShaderSource);
        this.GL.compileShader(this.TargetShader);
    }

    private _checkCompileStatus(): void {
        if (!this.GL.getShaderParameter(this._targetShader, this.GL.COMPILE_STATUS)) {
            const errorMessage = this.GL.getShaderInfoLog(this._targetShader);
            this.__handleResourceError<IShaderCompileError>("shader-compile-error", {
                handled: false,
                shader: this._parentShader,
                shaderCode: this._parentShader.ShaderSource,
                errorMessage: errorMessage
            });
        }
    }
}

export default ShaderWrapper;
