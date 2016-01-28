import ContextSafeContainer = require("../ContextSafeResourceContainer");
import Shader = require("../Shader/Shader");
import Canvas = require("../../Canvas");
import ProgramWrapper = require("./ProgramWrapper");

class Program extends ContextSafeContainer<ProgramWrapper> {
  constructor() {
    super();
    this.initializeForFirst();
  }


  private attachedShaders: Shader[] = [];

  public static CreateProgram(attachShaders: Shader[]): Program {
    const program: Program = new Program();
    program.attachedShaders = attachShaders;
    return program;
  }

  public get AttachedShaders(): Shader[] {
    return this.attachedShaders;
  }

  public attachShader(shader: Shader) {
    this.attachedShaders.push(shader);
    shader.onUpdate(() => {
      this.relinkShader();
    });

  }

  protected disposeResource(resource: ProgramWrapper): void {
    resource.dispose();
  }

  protected getInstanceForRenderer(renderer: Canvas): ProgramWrapper {
    return new ProgramWrapper(this, renderer);
  }

  public uniformExists(valName: string): boolean {
    if (this.wrappers.length > 0) {
      return this.wrappers[0].uniformExists(valName);
    }
    throw new Error("Any program was not initialized!");
  }

  private relinkShader() {
    this.each((v) => {
      v.relink();
    });
  }
}

export = Program;
