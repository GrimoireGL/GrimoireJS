﻿import BufferTexture = require("../Resources/Texture/BufferTexture");
import LightBase = require("LightBase");
import AssociativeArray = require("../../Base/Collections/AssociativeArray");
import JThreeContextProxy = require('../../Core/JThreeContextProxy');
import InternalFormatType = require("../../Wrapper/TextureInternalFormatType");
import TextureType = require("../../Wrapper/TextureType");
import Scene = require("../Scene");
import ShaderComposer = require("./LightShderComposer");
import Program = require("../Resources/Program/Program");
import ShaderType = require("../../Wrapper/ShaderType"); 

/**
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
    
    /**
     * Programs will be used for rendering this lights accumulation buffer.
     */
    private lightProgram: Program;

    /**
     * Lights subscribed to this register.
     */
    private lights: LightBase[] = [];

    /**
     * Light dictionary being sorted with id used in shaders.
     */
    private lightIdDictionary: AssociativeArray<number> = new AssociativeArray<number>();

    /**
     * Provides feature to generate shader source code.
     */
    private shaderComposer: ShaderComposer = new ShaderComposer();
    
    /**
     * Float values array for buffer of light parameter textures.
     */
    private textureSourceBuffer: Float32Array;

    /**
     * Getter for height of texture.
     * This parameter is same as count of light parameter.
     */
    public get TextureWidth(): number
    {
        return this.textureHeight;
    }

    /**
     * Getter for width of texture.
     * This parameter is same as count of lights.
     */
    public get TextureHeight(): number
    {
        return this.lights.length;
    }

    /**
     * Getter for light parameter texture.
     */
    public get ParameterTexture(): BufferTexture
    {
        return this.parameterTexture;
    }

    /**
     * Provides easy access to resource manager.
     */
    private get ResourceManager()
    {
        return JThreeContextProxy.getJThreeContext().ResourceManager;
    }
    /**
     * Getter for shader composer that generates shader source to render light accumulation buffer.
     */
    public get ShaderCodeComposer()
    {
        return this.shaderComposer;
    }

    /**
     * Getter for light program to use for rendering light accumulation buffer.
     */
    public get LightProgram() {
        return this.lightProgram;
    }

    constructor(scene: Scene) {
        this.scene = scene;
        this.parameterTexture = <BufferTexture>(this.ResourceManager.createTexture(scene.ID + ".jthree.light.params", 1, 1, InternalFormatType.RGBA, TextureType.Float));
        this.parameterTexture.updateTexture(new Float32Array([1,0,1,0]));
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

    /**
     * Add light type and append shader code.
     * @param paramVecCount required vec4 count.
     * @param shaderFuncName name for function name no need to include "()"
     * @param shaderFuncCode fragment function shader code
     * @param lightTypeName light type name it should be same as LightBase.TypeName
     */
    public addLightType(paramVecCount: number, shaderFuncName: string, shaderFuncCode: string, lightTypeName: string)
    {
        this.shaderComposer.addLightType(shaderFuncName, shaderFuncCode, lightTypeName);
        var newSize = Math.max(paramVecCount, this.textureHeight);
        if (newSize !== this.textureHeight)
        {
            //apply new size of texture
        }
    }

    /**
     * Add light to this register.
     * @param light the light to add this register.
     */
    public addLight(light: LightBase):void
    {

        this.lights.push(light);
        this.lightIdDictionary.set(light.ID, this.lights.length - 1);
        light.onParameterChanged((o, l) => this.lightUpdate(l));
        this.heightUpdate(0);
    }
    /**
     * Update height of light parameter texture.
     * @param start starting line of x-coordinate to update texture variable.
     */
    private heightUpdate(start: number):void
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

    /**
     * Update width of light parameter texture.
     */
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

    /**
     * Update light parameter texture.
     */
    public updateLightForRenderer()
    {
        for (var i = 0; i < this.Lights.length; i++)
        {
            this.lightUpdate(this.Lights[i]);
        }
        this.parameterTexture.updateTexture(this.textureSourceBuffer);
    }

    /**
     * Initialize light program.
     */
    private initializeProgram()
    {
        var vs = require('../Shaders/VertexShaders/PostEffectGeometries.glsl');
        var jThreeContext = JThreeContextProxy.getJThreeContext();
        var rm = jThreeContext.ResourceManager;
        var vShader = rm.createShader("jthree.shaders.vertex.post", vs, ShaderType.VertexShader);
        vShader.loadAll();
        this.lightProgram = rm.createProgram(this.scene.ID+".jthree.programs.deffered.lights", [vShader, this.ShaderCodeComposer.Shader]);
    }
}

export = LightRegister;