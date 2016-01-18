import Shader = require("./Shader");
import Canvas = require("../../Canvas");
import ResourceWrapper = require("../ResourceWrapper");
class ShaderWrapper extends ResourceWrapper {

  constructor(parent: Shader, canvas: Canvas) {
    super(canvas);
    this.parentShader = parent;
  }

  private targetShader: WebGLShader = null;

  private parentShader: Shader;

  public get TargetShader(): WebGLShader {
    if (!this.Initialized) {
      this.init();
    }
    return this.targetShader;
  }

  public init(): void {
    if (!this.Initialized) {
      this.targetShader = this.GL.createShader(this.parentShader.ShaderType);
      this.GL.shaderSource(this.targetShader, this.parentShader.ShaderSource);
      this.GL.compileShader(this.targetShader);
      this._checkCompileStatus();
      this.setInitialized(true);
    }
  }

  public dispose() {
    if (this.Initialized) {
      this.GL.deleteShader(this.targetShader);
      this.targetShader = null;
      this.setInitialized(false);
    }
  }

  /**
   * Update shader source from Shader class.
   */
  public update() {
    this.GL.deleteShader(this.targetShader);
    this.targetShader = this.GL.createShader(this.parentShader.ShaderType);
    this.GL.shaderSource(this.TargetShader, this.parentShader.ShaderSource);
    this.GL.compileShader(this.TargetShader);
  }

  private _checkCompileStatus() {
    if (!this.GL.getShaderParameter(this.targetShader, this.GL.COMPILE_STATUS)) {
      console.error(`Compile error!:${this.GL.getShaderInfoLog(this.targetShader) }`);
    }
  }
}

export = ShaderWrapper;
