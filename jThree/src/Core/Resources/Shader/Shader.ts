import ContextSafeContainer from "../ContextSafeResourceContainer";
import ShaderType from "../../../Wrapper/ShaderType";
import Canvas from "../../Canvas/Canvas";
import ShaderWrapper from "./ShaderWrapper";
import {Action2} from "../../../Base/Delegates";
import JThreeEvent from "../../../Base/JThreeEvent";
class Shader extends ContextSafeContainer<ShaderWrapper> {

  private shaderSource: string;

  private onUpdateEvent: JThreeEvent<string> = new JThreeEvent<string>();

  private shaderType: ShaderType;
  /**
   * コンストラクタ
   * (Should not be called by new,You should use CreateShader static method instead.)
   */
  constructor() {
    super();
    this.initializeForFirst();
  }

  /**
   * シェーダークラスを作成する。
   */
  public static CreateShader(source: string, shaderType: ShaderType): Shader {
    const shader: Shader = new Shader();
    shader.shaderSource = source;
    shader.shaderType = shaderType;
    return shader;
  }


  /**
   * Shader Type
   * (VertexShader or FragmentShader)
   */
  public get ShaderType(): ShaderType {
    return this.shaderType;
  }


  /**
   * Shader Source in text
   */
  public get ShaderSource(): string {
    return this.shaderSource;
  }

  /**
   * Load all shaderWrappers
   */
  public loadAll() {
    this.each((v) => {
      v.init();
    });
  }

  protected getInstanceForRenderer(renderer: Canvas): ShaderWrapper {
    return new ShaderWrapper(this, renderer);
  }

  /**
   * Update shader source code.
   * @param shaderSource new shader source code.
   */
  public update(shaderSource: string) {
    this.shaderSource = shaderSource;
    this.each((v) => {
      v.update();
    });
    this.onUpdateEvent.fire(this, shaderSource);
  }

  /**
   * Register the handler to handle when shader source code is changed.
   * @param handler the handler for shader changing
   */
  public onUpdate(handler: Action2<Shader, string>) {
    this.onUpdateEvent.addListener(handler);
  }

  protected disposeResource(resource: ShaderWrapper): void {
    resource.dispose();
  }
}

export default Shader;
