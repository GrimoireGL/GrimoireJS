import JThreeContext = require("./JThreeContext");
import JThreeContextProxy = require("./JThreeContextProxy");
import BufferTargetType = require("../Wrapper/BufferTargetType");
import BufferUsageType = require("../Wrapper/BufferUsageType");
import ElementType = require("../Wrapper/ElementType");
import ShaderType = require("../Wrapper/ShaderType");

import jThreeObject = require("../Base/JThreeObject");
import Buffer = require("./Resources/Buffer/Buffer");
import Shader = require("./Resources/Shader/Shader");
import Program = require("./Resources/Program/Program");

/**
 * コンテキストを跨いでリソースを管理するクラスをまとめているクラス
 */
class ResourceManager extends jThreeObject
{

    constructor() {
        super();
    }

    private get context(): JThreeContext {
        return JThreeContextProxy.getJThreeContext();
    }

    private buffers: Map<string, Buffer> = new Map<string, Buffer>();

    createBuffer(id:string,target:BufferTargetType,usage:BufferUsageType,unitCount:number,elementType:ElementType):Buffer {
        if (this.buffers.has(id)) {
            throw new Error("Buffer id cant be dupelicated");
        }
        var buf: Buffer = Buffer.CreateBuffer(this.context.CanvasRenderers, target, usage,unitCount,elementType);
        this.buffers.set(id, buf);
        return buf;
    }

    getBuffer(id:string): Buffer {
      if(!this.buffers.has(id))console.error('there were no such buffer');
        return this.buffers.get(id);
    }

    private shaders: Map<string, Shader> = new Map<string, Shader>();

    createShader(id: string,source:string,shaderType:ShaderType): Shader {
        var shader: Shader = Shader.CreateShader(this.context, source, shaderType);
        this.shaders.set(id, shader);
        return shader;
    }

    createOrGetShader(id:string,source:string,shaderType:ShaderType):Shader
    {
      if(this.hasShader(id))
      {
        return this.getShader(id);
      }else
      {
        return this.createShader(id,source,shaderType);
      }
    }

    getShader(id: string):Shader {
        return this.shaders.get(id);
    }

    hasShader(id:string):boolean
    {
      return this.shaders.has(id);
    }

    private programs: Map<string, Program> = new Map<string, Program>();

    createProgram(id: string,shaders:Shader[]): Program {
        var program: Program = Program.CreateProgram(this.context, shaders);
        this.programs.set(id, program);
        return program;
    }
    public createorGetProgram(id:string,shaders:Shader[]):Program
    {
      if(!this.programs.has(id))
      {
        return this.createProgram(id,shaders);
      }else
      {
        return this.getProgram(id);
      }
    }

    getProgram(id: string): Program {
        return this.programs.get(id);
    }
}
export=ResourceManager;
