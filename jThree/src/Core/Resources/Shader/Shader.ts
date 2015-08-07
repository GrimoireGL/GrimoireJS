import JThreeContext = require("../../JThreeContext");
import ContextSafeContainer = require("../ContextSafeResourceContainer");
import ShaderType = require("../../../Wrapper/ShaderType");
import ContextManagerBase = require("../../ContextManagerBase");
import ShaderWrapper = require("./ShaderWrapper");

class Shader extends ContextSafeContainer<ShaderWrapper>
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
        this.initializeForFirst();
    }

    private shaderType: ShaderType;
    /**
     * Shader Type
     * (VertexShader or FragmentShader)
     */
    public get ShaderType(): ShaderType {
        return this.shaderType;
    }

    private shaderSource: string;
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
        this.each((v)=> {
            v.init();
        });
    }

    protected getInstanceForRenderer(renderer:ContextManagerBase): ShaderWrapper {
        return new ShaderWrapper(this, renderer);
    }

    protected disposeResource(resource: ShaderWrapper): void {
        resource.dispose();
    }
}

export=Shader;
