import BufferTexture = require("../Resources/Texture/BufferTexture");
import RendererBase = require("../Renderers/RendererBase");
import LightBase = require("LightBase");
import JThreeCollection = require("../../Base/JThreeCollection");
import AssociativeArray = require("../../Base/Collections/AssociativeArray");
import JThreeContextProxy = require('../../Core/JThreeContextProxy');
import InternalFormatType = require("../../Wrapper/TextureInternalFormatType");
import TextureType = require("../../Wrapper/TextureType");
import Scene = require("../Scene");
import ShaderComposer = require("./LightShderComposer");
import Program = require("../Resources/Program/Program");
import ShaderType = require("../../Wrapper/ShaderType"); /**
 * Provides light management feature by renderer
 */
class LightRegister
{
    /**
     * BufferTexture containing light parameters.
     */
    private parameterTexture: BufferTexture;

    /**
     * Renderer using this class.
     */
    private scene: Scene;

    /**
     * Height of texture.
     */
    private textureHeight: number = 4;

    private lightProgram: Program;

    /**
     * 
     */
    private lights: LightBase[] = [];

    private lightIdDictionary: AssociativeArray<number> = new AssociativeArray<number>();

    private shaderComposer: ShaderComposer = new ShaderComposer();

    private textureSourceBuffer: Float32Array;

    /**
     * Getter for height of texture.
     */
    public get TextureWidth(): number
    {
        return this.textureHeight;
    }

    public get TextureHeight(): number
    {
        return this.lights.length;
    }

    public get ParameterTexture(): BufferTexture
    {
        return this.parameterTexture;
    }

    private get ResourceManager()
    {
        return JThreeContextProxy.getJThreeContext().ResourceManager;
    }

    public get ShaderCodeComposer()
    {
        return this.shaderComposer;
    }

    constructor(scene: Scene)
    {
        this.parameterTexture = <BufferTexture>(this.ResourceManager.createTexture(scene.ID + ".jthree.light.params", this.TextureWidth, this.TextureHeight, InternalFormatType.RGBA, TextureType.Float));
        this.widthUpdate();
        this.initializeProgram();
    }

    /**
    * Getter for lights managed by this light register.
    * DO NOT PUSH ANY LIGHTS BY YOURSELF. USE addLights METHOD INSTEAD.
    */
    public get Lights(): LightBase[]
    {
        return this.lights;
    }

    public addLightType(paramVecCount: number, shaderFuncName: string, shaderFuncCode: string, lightTypeName: string)
    {
        this.shaderComposer.addLightType(shaderFuncName, shaderFuncCode, lightTypeName);
        var newSize = Math.max(paramVecCount, this.textureHeight);
        if (newSize !== this.textureHeight)
        {
            //apply new size of texture
        }
    }

    public addLight(light: LightBase)
    {
        this.lights.push(light);
        this.lightIdDictionary.set(light.ID, this.lights.length - 1);
        light.onParameterChanged((o, l) => this.lightUpdate(l));
        this.heightUpdate(0);
    }

    private heightUpdate(start: number)
    {
        //allocating new buffer
        var newBuffer = new Float32Array(4 * this.TextureWidth * this.lights.length);
        for (var i = 0; i < start * 4 * this.TextureWidth; i++)
        {
            newBuffer[i] = this.textureSourceBuffer[i];
        }
        this.textureSourceBuffer = newBuffer;
        //update variables here
        for (var i = start; i < this.Lights.length; i++)
        {
            this.lightUpdate(this.Lights[i]);
        }
        //update texture
        this.parameterTexture.resize(this.TextureWidth, this.TextureHeight);
        this.parameterTexture.updateTexture(this.textureSourceBuffer);
    }

    private widthUpdate()
    {
        this.heightUpdate(0);//update all
    }

    /**
     * Update light parameter.
     * @param light the light you want to update
     */
    private lightUpdate(light: LightBase)
    {
        var index = this.lightIdDictionary.get(light.ID);
        var parameters = light.getParameters();
        var baseIndex = index * 4 * this.TextureWidth + 1;
        var endIndex = baseIndex + parameters.length;
        this.textureSourceBuffer[baseIndex - 1] = this.shaderComposer.getLightTypeId(light);
        for (var i = baseIndex; i < endIndex; i++)
        {
            this.textureSourceBuffer[i] = parameters[i - baseIndex];
        }
        for (var i = endIndex; i < baseIndex + 4 * this.TextureWidth; i++)
        {
            this.textureSourceBuffer[i] = 0;//fill zero
        }
    }

    public updateLightForRenderer()
    {
        for (var i = 0; i < this.Lights.length; i++)
        {
            this.lightUpdate(this.Lights[i]);
        }
        this.parameterTexture.updateTexture(this.textureSourceBuffer);
    }

    private initializeProgram()
    {
        var vs = require('../Shaders/VertexShaders/PostEffectGeometries.glsl');
        var jThreeContext = JThreeContextProxy.getJThreeContext();
        var rm = jThreeContext.ResourceManager;
        var vShader = rm.createShader("jthree.shaders.vertex.post", vs, ShaderType.VertexShader);
        vShader.loadAll();
        this.lightProgram = rm.createProgram("jthree.programs.deffered.lights", [vShader, this.ShaderCodeComposer.Shader]);
    }
}

export = LightRegister;