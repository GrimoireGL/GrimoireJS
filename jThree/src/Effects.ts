module jThree.Effects
{
    import Buffer = jThree.Buffers.Buffer;
    import BufferWrapper = jThree.Buffers.BufferWrapper;
    import ContextSafeContainer = jThree.Base.ContextSafeResourceContainer;
     /**
     * コンテキストを跨いでシェーダーを管理しているクラス
     */
    export class Shader extends ContextSafeContainer<ShaderWrapper>
    {
        /**
         * シェーダークラスを作成する。
         */
        public static CreateShader(context:JThreeContext,source:string,shaderType:ShaderType) :Shader {
            var shader: Shader = new Shader(context);
            shader.shaderSource = source;
            shader.shaderType = shaderType;
            return shader;
        }
        /**
         * コンストラクタ
         * (Should not be called by new,You should use CreateShader static method instead.)
         */
        constructor(context:JThreeContext) {
            super(context);
        }

        private shaderType: jThree.ShaderType;
        /**
         * Shader Type
         * (VertexShader or FragmentShader)
         */
        get ShaderType(): jThree.ShaderType {
            return this.shaderType;
        }

        private shaderSource: string;
        /**
         * Shader Source in text
         */
        get ShaderSource(): string {
            return this.shaderSource;
        }

        /**
         * Load all shaderWrappers
         */
        loadAll() {
            this.each((v)=> {
                v.init();
            });
        }

        protected getInstanceForRenderer(renderer: RendererBase): ShaderWrapper {
            return new ShaderWrapper(this, renderer);
        }

        protected disposeResource(resource: ShaderWrapper): void {
            resource.dispose();
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
            if (!this.initialized) this.init();
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

    export class Program extends ContextSafeContainer<ProgramWrapper>{
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

        protected getInstanceForRenderer(renderer: RendererBase): ProgramWrapper {
            return new ProgramWrapper(this, renderer);
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

        private isLinked:boolean=false;

        private targetProgram: WebGLProgram = null;

        private glContext: GLContextWrapperBase = null;

        private parentProgram: Program = null;

        private attribLocations:Map<string,number>=new Map<string,number>();

        get TargetProgram(): WebGLProgram {
            return this.targetProgram;
        }

        init(): void {
            if (!this.initialized) {
                this.targetProgram = this.glContext.CreateProgram();
                this.parentProgram.AttachedShaders.forEach((v, i, a) => {
                    this.glContext.AttachShader(this.targetProgram, v.getForRendererID(this.id).TargetShader);
                });
                this.initialized = true;
            }
        }

        dispose() {
            if (this.initialized) {
                this.glContext.DeleteProgram(this.targetProgram);
                this.initialized = false;
                this.targetProgram = null;
                this.isLinked = false;
            }
        }

        linkProgram(): void {
            if (!this.isLinked) {
                this.glContext.LinkProgram(this.targetProgram);
                this.isLinked = true;
            }
        }
        
        useProgram(): void {
            if (!this.initialized) {
                this.init();
            }
            if (!this.isLinked) {
                this.linkProgram();
            }
            this.glContext.UseProgram(this.targetProgram);
        }

        setAttributeVerticies(valName: string, buffer: BufferWrapper): void {
            this.useProgram();
            buffer.bindBuffer();
            if (!this.attribLocations.has(valName)) {
                this.attribLocations.set(valName, this.glContext.GetAttribLocation(this.TargetProgram, valName));
            }
            var attribIndex: number = this.attribLocations.get(valName);
            this.glContext.EnableVertexAttribArray(attribIndex);
            this.glContext.VertexAttribPointer(attribIndex, buffer.UnitCount, buf.ElementType,buf.Normalized,buf.Stride,buf.Offset);
        }

        get ID(): string {
            return this.id;
        }

    }
} 