import ContextSafeContainer from "../ContextSafeResourceContainer";
import Shader from "../Shader/Shader";
import Canvas from "../../Canvas/Canvas";
import ProgramWrapper from "./ProgramWrapper";

class Program extends ContextSafeContainer<ProgramWrapper> {
    constructor() {
        super();
        this.__initializeForFirst();
    }

    private _fragmentShader: Shader;

    private _vertexShader: Shader;

    public static createProgram(vertex: Shader, fragment: Shader): Program {
        const program: Program = new Program();
        program._fragmentShader = fragment;
        program._vertexShader = vertex;
        return program;
    }

    public get fragmentShader(): Shader {
        return this._fragmentShader;
    }

    public get vertexShader(): Shader {
        return this._vertexShader;
    }

    public attachShader(shader: Shader): void {
        if (shader.ShaderType === WebGLRenderingContext.FRAGMENT_SHADER) {
            this._fragmentShader = shader;
        } else if (shader.ShaderType === WebGLRenderingContext.VERTEX_SHADER) {
            this._vertexShader = shader;
        }
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
