import ContextSafeContainer from "../ContextSafeResourceContainer";
import Canvas from "../../Canvas/Canvas";
import ShaderWrapper from "./ShaderWrapper";
import {Action2} from "../../../Base/Delegates";
import JThreeEvent from "../../../Base/JThreeEvent";
class Shader extends ContextSafeContainer<ShaderWrapper> {

  private _shaderSource: string;

  private _onUpdateEvent: JThreeEvent<string> = new JThreeEvent<string>();

  private _shaderType: number;
  /**
   * コンストラクタ
   * (Should not be called by new,You should use CreateShader static method instead.)
   */
  constructor() {
    super();
    this.__initializeForFirst();
  }

  /**
   * シェーダークラスを作成する。
   */
  public static createShader(source: string, shaderType: number): Shader {
    const shader: Shader = new Shader();
    shader._shaderSource = source;
    shader._shaderType = shaderType;
    return shader;
  }


  /**
   * Shader Type
   * (VertexShader or FragmentShader)
   */
  public get ShaderType(): number {
    return this._shaderType;
  }


  /**
   * Shader Source in text
   */
  public get ShaderSource(): string {
    return this._shaderSource;
  }

  /**
   * Load all shaderWrappers
   */
  public loadAll(): void {
    this.each((v) => {
      v.init();
    });
  }

  protected __createWrapperForCanvas(canvas: Canvas): ShaderWrapper {
    return new ShaderWrapper(this, canvas);
  }

  /**
   * Update shader source code.
   * @param shaderSource new shader source code.
   */
  public update(shaderSource: string): void {
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
  public onUpdate(handler: Action2<Shader, string>): void {
    this._onUpdateEvent.addListener(handler);
  }

}

export default Shader;
