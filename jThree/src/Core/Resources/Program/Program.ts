import JThreeObject=require('Base/JThreeObject');
import ContextSafeContainer = require("../ContextSafeResourceContainer");
import JThreeContext = require("../../JThreeContext");
import Shader = require("../Shader/Shader");
import ContextManagerBase = require("../../ContextManagerBase");
import ProgramWrapper = require("./ProgramWrapper");

class Program extends ContextSafeContainer<ProgramWrapper>{
    constructor(context:JThreeContext) {
        super(context);
    }


    private attachedShaders: Shader[] = [];

    get AttachedShaders():Shader[] {
        return this.attachedShaders;
    }

    attachShader(shader: Shader) {
        this.attachedShaders.push(shader);
    }

    static CreateProgram(context:JThreeContext,attachShaders:Shader[]): Program {
        var program: Program = new Program(context);
        program.attachedShaders = attachShaders;
        return program;
    }

    protected disposeResource(resource: ProgramWrapper): void {
        resource.dispose();
    }

    protected getInstanceForRenderer(renderer: ContextManagerBase): ProgramWrapper {
        return new ProgramWrapper(this, renderer);
    }
}

export=Program;
