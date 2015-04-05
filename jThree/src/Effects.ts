module jThree.Effects
{
    /**
     * コンテキストを跨いでシェーダーを管理しているクラス
     */
    export class Shader extends jThree.Base.jThreeObject
    {
        public static CreateShader(renderers:RendererBase[],source:string,shaderType:ShaderType) :Shader {
            var shader: Shader = new Shader();
            shader.shaderSource = source;
            shader.shaderType = shaderType;
            renderers.forEach((v, i, a) => {
                shader.shaderWrappers.set(v.ID, new ShaderWrapper(shader,v));
            });
            return shader;
        }

        private shaderType: jThree.ShaderType;

        get ShaderType(): jThree.ShaderType {
            return this.shaderType;
        }

        private shaderSource: string;

        get ShaderSource(): string {
            return this.shaderSource;
        }

        private shaderWrappers: Map<string, ShaderWrapper> = new Map<string, ShaderWrapper>();

        loadAll() {
            this.shaderWrappers.forEach((v, i, a) => {
                v.init();
            });
        }

        get ShaderWrappers():Map<string, ShaderWrapper> {
            return this.shaderWrappers;
        }

        getForRenderer(renderer: CanvasRenderer): ShaderWrapper {
            return this.shaderWrappers.get(renderer.ID);
        }
    }

    export class ShaderWrapper extends jThree.Base.jThreeObject
    {

        constructor(parent: Shader,renderer:RendererBase) {
            super();
            this.parentShader = parent;
            this.glContext = renderer.Context;
            this.ID = renderer.ID;
        }

        private ID:string="";

        private initialized: boolean = false;

        private targetShader: WebGLShader = null;

        private glContext: GLContextWrapperBase = null;

        private parentShader: Shader;

        get TargetShader(): WebGLShader {
            return this.targetShader;
        }

        init(): void {
            if (!this.initialized) {
                this.targetShader = this.glContext.CreateShader(this.parentShader.ShaderType);
                this.glContext.ShaderSource(this.targetShader, this.parentShader.ShaderSource);
                this.glContext.CompileShader(this.targetShader);
            }
        }

        dispose() {
            if (this
                .initialized) {
                this.glContext.DeleteShader(this.targetShader);
                this.targetShader = null;
                this.initialized = false;
            }
        }
    }

    export class Program extends jThree.Base.jThreeObject {
        constructor() {
            super();
        }

        private programWrappers: Map<string, ProgramWrapper> = new Map<string, ProgramWrapper>();

        getForRenderer(renderer:RendererBase): ProgramWrapper {
            return this.programWrappers.get(renderer.ID);
        }

        attachShader(shader: Shader) {
            this.programWrappers.forEach((v, i, a) => {
                v.attachShader(shader.ShaderWrappers.get(v.ID));
            });
        }
    }

    export class ProgramWrapper extends jThree.Base.jThreeObject
    {
        constructor(parent:Program,renderer:RendererBase) {
            super();
            this.id = renderer.ID;
            this.glContext = renderer.Context;
            this.parentProgram = parent;
        }

        private id:string="";

        private initialized: boolean = false;

        private targetProgram: WebGLProgram = null;

        private glContext: GLContextWrapperBase = null;

        private parentProgram:Program=null;

        init(): void {
            if (!this.initialized) {
                this.targetProgram = this.glContext.CreateProgram();
            }
        }

        dispose() {
            if (this.initialized) {
                this.glContext.DeleteProgram(this.targetProgram);
                this.initialized = false;
                this.targetProgram = null;
            }
        }

        attachShader(shaderWrapper: ShaderWrapper): void;
        attachShader(shader: Shader): void;
        attachShader(): void {
            if (arguments.length !== 1) throw new Error("invalid call");
            var casted: jThree.Base.jThreeObject = (<jThree.Base.jThreeObject>arguments[0]);
            var targetShader: WebGLShader = null;
            if (casted.getTypeName() === "Shader") {
                var shader: Shader = <Shader>casted;
                targetShader = shader.ShaderWrappers.get(this.ID).TargetShader;
            } else if (casted.getTypeName() === "ShaderWrapper") {
                var shaderWrapped: ShaderWrapper = <ShaderWrapper>casted;
                targetShader = shaderWrapped.TargetShader;
            }
            this.glContext.AttachShader(this.targetProgram, targetShader);
        }
        //attachShader(shaderWrapper:ShaderWrapper): void {
        //    if (!this.initialized) this.init();
        //    this.glContext.AttachShader(this.targetProgram, shaderWrapper.TargetShader);
        //}

        get ID(): string {
            return this.id;
        }

    }
} 