import ContextSafeContainer = require("../ContextSafeResourceContainer");
import Shader = require("../Shader/Shader");
import Canvas = require("../../Canvas");
import ProgramWrapper = require("./ProgramWrapper");

class Program extends ContextSafeContainer<ProgramWrapper>{
    constructor() {
        super();
        this.initializeForFirst();
    }


    private attachedShaders: Shader[] = [];

    public get AttachedShaders():Shader[] {
        return this.attachedShaders;
    }

    public attachShader(shader: Shader) {
        this.attachedShaders.push(shader);
        shader.onUpdate(() => {
            this.relinkShader();
        });

    }

    public static CreateProgram(attachShaders:Shader[]): Program {
        var program: Program = new Program();
        program.attachedShaders = attachShaders;
        return program;
    }

    protected disposeResource(resource: ProgramWrapper): void {
        resource.dispose();
    }

    protected getInstanceForRenderer(renderer: Canvas): ProgramWrapper {
        return new ProgramWrapper(this, renderer);
    }

    private relinkShader() {
        this.each((v) => {
            v.relink();
        });
    }
}

export=Program;
