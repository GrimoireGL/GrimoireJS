import ContextSafeContainer from "../ContextSafeResourceContainer";
import Shader from "../Shader/Shader";
import Canvas from "../../Canvas/Canvas";
import ProgramWrapper from "./ProgramWrapper";

class Program extends ContextSafeContainer<ProgramWrapper> {
  constructor() {
    super();
    this.__initializeForFirst();
  }


  private _attachedShaders: Shader[] = [];

  public static createProgram(attachShaders: Shader[]): Program {
    const program: Program = new Program();
    program._attachedShaders = attachShaders;
    return program;
  }

  public get AttachedShaders(): Shader[] {
    return this._attachedShaders;
  }

  public attachShader(shader: Shader): void {
    this._attachedShaders.push(shader);
    shader.on("source-updated", () => {
      this._relinkShader();
    });

  }

  protected __createWrapperForCanvas(canvas: Canvas): ProgramWrapper {
    return new ProgramWrapper(this, canvas);
  }

  public uniformExists(valName: string): boolean {
    if (this.wrappers.length > 0) {
      return this.wrappers[0].uniformExists(valName);
    }
    throw new Error("Any program was not initialized!");
  }

  private _relinkShader(): void {
    this.each((v) => {
      v.relink();
    });
  }
}

export default Program;
