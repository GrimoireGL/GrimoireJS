module jThree.Effects {
    export class Shader extends jThree.Base.jThreeObject
    {
        public static CreateShader(renderers:CanvasRenderer[],source:string) :Shader {
            var shader: Shader = new Shader();
            renderers.forEach((v, i, a) => {
                shader.shaderWrappers.set(v.ID, new ShaderWrapper(shader,v.Context));
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

        private shaderWrappers:Map<string,ShaderWrapper>=new Map<string,ShaderWrapper>();
    }

    export class ShaderWrapper extends jThree.Base.jThreeObject
    {

        constructor(parent: Shader, glContext: GLContextWrapperBase) {
            super();
            this.parentShader = parent;
            this.glContext = glContext;
        }

        private initialized: boolean = false;

        private targetShader: WebGLShader = null;

        private glContext: GLContextWrapperBase = null;

        private parentShader:Shader;

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
                this.initialized = false;
            }
        }
    }
} 