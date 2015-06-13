import JThreeContext = require("./JThreeContext");
import JThreeContextProxy = require("./JThreeContextProxy");
import BufferTargetType = require("../Wrapper/BufferTargetType");
import BufferUsageType = require("../Wrapper/BufferUsageType");
import ElementType = require("../Wrapper/ElementType");
import ShaderType = require("../Wrapper/ShaderType");
import Delegates = require('../Delegates');
import jThreeObject = require("../Base/JThreeObject");
import Buffer = require("./Resources/Buffer/Buffer");
import Shader = require("./Resources/Shader/Shader");
import Program = require("./Resources/Program/Program");
import Texture = require('./Resources/Texture/Texture');
import AssociativeArray = require('../Base/Collections/AssociativeArray');
import RBO = require('./Resources/RBO/RBO');
import ResourceArray = require('./Resources/ResourceArray');
type ImageSource = HTMLCanvasElement|HTMLImageElement|ImageData|ArrayBufferView;

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

    private buffers: ResourceArray<Buffer,Delegates.Func5<JThreeContext,BufferTargetType,BufferUsageType,number,ElementType,Buffer>>=new ResourceArray<Buffer,Delegates.Func5<JThreeContext,BufferTargetType,BufferUsageType,number,ElementType,Buffer>>
    (
        (context,target,usage,unitcount,elementType)=>
        {
            return Buffer.CreateBuffer(context,target,usage,unitcount,elementType);
        }
    );

    createBuffer(id:string,target:BufferTargetType,usage:BufferUsageType,unitCount:number,elementType:ElementType):Buffer {
        return this.buffers.create(id,this.context,target,usage,unitCount,elementType);
    }

    getBuffer(id:string): Buffer {
        return this.buffers.get(id);
    }

    private shaders:ResourceArray<Shader,Delegates.Func3<JThreeContext,string,ShaderType,Shader>>=new ResourceArray<Shader,Delegates.Func3<JThreeContext,string,ShaderType,Shader>>(
        (context:JThreeContext,source:string,shaderType:ShaderType)=>
        {
            return Shader.CreateShader(context,source,shaderType);
        }
    );

    createShader(id: string,source:string,shaderType:ShaderType): Shader {
        return this.shaders.create(id,this.context,source,shaderType);
    }

    getShader(id: string):Shader {
        return this.shaders.get(id);
    }

    hasShader(id:string):boolean
    {
      return this.shaders.has(id);
    }

    private programs: ResourceArray<Program,Delegates.Func2<JThreeContext,Shader[],Program>>=new ResourceArray<Program,Delegates.Func2<JThreeContext,Shader[],Program>>(
       (context:JThreeContext,shaders:Shader[])=>
       {
           return Program.CreateProgram(context,shaders);
       }
    );

    createProgram(id: string,shaders:Shader[]): Program {
        return this.programs.create(id,this.context,shaders);
    }
    public createorGetProgram(id:string,shaders:Shader[]):Program
    {
        return this.programs.create(id,this.context,shaders);
    }

    getProgram(id: string): Program {
        return this.programs.get(id);
    }
    
    private textures:ResourceArray<Texture,Delegates.Func2<JThreeContext,ImageSource,Texture>>=new ResourceArray<Texture,Delegates.Func2<JThreeContext,ImageSource,Texture>>(
        (context,imageSource)=>{
            var tex = new Texture(this.context,imageSource);
            tex.each(v=>v.init());//TODO I wonder tmdhere is no need to initialize all context exisiting.
            return tex;
        }
    );
    

    createTexture(id:string,source:ImageSource):Texture
    {
      return this.textures.create(id,this.context,source);
    }

    getTexture(id:string):Texture
    {
      return this.textures.get(id);
    }
    
    private rbos:ResourceArray<RBO,Delegates.Func3<JThreeContext,number,number,RBO>> = new ResourceArray<RBO,Delegates.Func3<JThreeContext,number,number,RBO>>(
        (context,width,height)=>
        {
            var r=new RBO(context,width,height);
            r.each(v=>v.init());
            return r;
        }
        );
        
    createRBO(id:string,width:number,height:number):RBO
    {
        return this.rbos.create(id,this.context,width,height);
    }
    
    getRBO(id:string):RBO
    {
        return this.rbos.get(id);
    }
    
    
   public toString()
   {
       return `buffer:${this.buffers.toString()}\nshader:${this.shaders.toString()}\nprograms:${this.programs.toString()}\ntexture:${this.textures.toString()}`;
   }
}
export=ResourceManager;
