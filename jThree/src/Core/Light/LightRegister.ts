import BufferTexture = require("../Resources/Texture/BufferTexture");
import LightBase = require("./LightBase");
import AssociativeArray = require("../../Base/Collections/AssociativeArray");
import JThreeContextProxy = require('../../Core/JThreeContextProxy');
import InternalFormatType = require("../../Wrapper/TextureInternalFormatType");
import TextureType = require("../../Wrapper/TextureType");
import Scene = require("../Scene");
import ShaderComposer = require("./LightShderComposer");
import Program = require("../Resources/Program/Program");
import ShaderType = require("../../Wrapper/ShaderType");
import Vector2 = require("../../Math/Vector2");
import LightTypeDeclaration = require("./LightTypeDeclaration");
import RendererBase = require("../Renderers/RendererBase");
import DefaultLightTypeList = require("./DefaultLightTypeList");
import ShadowDroppableLight = require("./ShadowMap/ShadowDroppableLight");
import GLSpec = require("../GLSpecManager");
import JThreeLogger = require("../../Base/JThreeLogger");
/**
 * Provides light management feature by renderer
 */
class LightRegister
{
    /**
     * Texture input count for light accumulation stage except shadow maps.
     */
    public textureInputCount:number = 4;

    /**
     * Maximum count of shadow map textures for once drawing.
     */
    public get shadowMapMax()
    {
      return GLSpec.MaxTextureCount - this.textureInputCount;
    }

    public lightWorldMatricis = new Float32Array(this.shadowMapMax * 16);

    public viewInvertedLightMatricis = new Float32Array(this.shadowMapMax * 16);

    /**
     * BufferTexture containing light parameters.
     */
    private parameterTexture: BufferTexture;

    /**
     * Renderer using this class.
     */
    private scene: Scene;

    /**
     * Width of texture.
     */
    private textureWidth: number = 5;

    /**
     * Programs will be used for rendering diffuse light accumulation buffer.
     */
    private diffuseLightProgram: Program;

    /**
     * Programs will be used for rendering specular light accumulation buffer.
     */
    private specularLightProgram: Program;

    /**
     * Lights subscribed to this register.
     */
    private lights: LightBase[] = [];

    /**
     * All light references that drops shadow to other objects.
     */
    public shadowDroppableLights:ShadowDroppableLight[] =[];

    /**
     * Light dictionary being sorted with id used in shaders.
     */
    private lightIdDictionary: AssociativeArray<number> = new AssociativeArray<number>();

    private get shaderHeader()
    {
      return `precision mediump float;
      #define SHADOW_MAP_LENGTH ${this.shadowMapMax}`;
    }

    /**
     * Provides feature to generate shader source code.
     */
    private diffuseShaderComposer: ShaderComposer = new ShaderComposer(this.shaderHeader+require('../Shaders/Light/DiffuseLightFragment.glsl'), "diffuse", (index, funcName) => `if(getLightType(int(i)) == ${index}.)gl_FragColor.rgb+=${funcName}(position,normal,int(i),diffuse);\n`);
    /**
     * Provides feature to generate specular light buffer shader source code.
     */
    private specularShaderComposer: ShaderComposer = new ShaderComposer(this.shaderHeader+require('../Shaders/Light/SpecularLightFragment.glsl'), "specular", (index, funcName) => `if(getLightType(int(i)) == ${index}.)gl_FragColor.rgb+=${funcName}(position,normal,int(i),specular,specularCoefficient);\n`);

    /**
     * Float values array for buffer of light parameter textures.
     */
    private textureSourceBuffer: Float32Array;

    /**
     * Number of shadow droppable lights.
     * @type {number}
     */
    private shadowDroppableLightCount:number=0;

    /**
     * Getter for number of shadow droppable lights.
     * @return {number} [description]
     */
    public get ShadowDroppableLightCount()
    {
      return this.shadowDroppableLightCount;
    }

    /**
     * Getter for width of texture.
     * This parameter is same as count of light parameter.
     */
    public get TextureWidth(): number
    {
        return this.textureWidth;
    }

    /**
     * Getter for height of texture.
     * This parameter is same as count of lights.
     */
    public get TextureHeight(): number
    {
        return this.lights.length;
    }

    public get TextureSize(): Vector2
    {
        return new Vector2(this.TextureWidth, this.TextureHeight);
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
     * Getter for shader composer that generates shader source to render diffuse light accumulation buffer.
     */
    public get DiffuseShaderCodeComposer()
    {
        return this.diffuseShaderComposer;
    }

    /**
     * Getter for shader composer that generates shader source to render specular light accumulation buffer.
     */
    public get SpecularShaderCodeComposer()
    {
        return this.specularShaderComposer;
    }

    /**
     * Getter for light program to use for rendering light accumulation buffer.
     */
    public get DiffuseLightProgram()
    {
        return this.diffuseLightProgram;
    }

    public get SpecularLightProgram() {
        return this.specularLightProgram;
    }

    public getSpecularShaderCodeComposer()
    {
        return this.specularLightProgram;
    }

    constructor(scene: Scene)
    {
        this.scene = scene;
        this.parameterTexture = <BufferTexture>(this.ResourceManager.createTexture(scene.ID + ".jthree.light.params", 1, 1, InternalFormatType.RGBA, TextureType.Float));
        this.parameterTexture.updateTexture(new Float32Array([1, 0, 1, 0]));
        this.initializeProgram();
        for (let i = 0; i < DefaultLightTypeList.length; i++) {
            var type=DefaultLightTypeList[i];
            this.addLightType(type.TypeDefinition);
        }
        JThreeLogger.sectionLongLog("Light diffuse shader",this.DiffuseShaderCodeComposer.ShaderCode);
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
    public addLightType(ld: LightTypeDeclaration)
    {
        this.diffuseShaderComposer.addLightType(ld.shaderfuncName, ld.diffuseFragmentCode, ld.typeName);
        this.specularShaderComposer.addLightType(ld.shaderfuncName, ld.specularFragmentCode, ld.typeName);
        var newSize = Math.max(ld.requiredParamCount, this.TextureHeight);
        if (newSize !== this.textureWidth)
        {
            //TODO apply new size of texture
        }
    }

    /**
     * Add light to this register.
     * @param light the light to add this register.
     */
    public addLight(light: LightBase): void
    {

        this.lights.push(light);
        this.lightIdDictionary.set(light.ID, this.lights.length - 1);
        this.heightUpdate(0);
    }
    /**
     * Update height of light parameter texture.
     * @param start starting line of x-coordinate to update texture variable.
     */
    private heightUpdate(start: number): void
    {
        //allocating new buffer
        var newBuffer = new Float32Array(4 * this.TextureWidth * this.lights.length);
        for (var i = 0; i < start * 4 * this.TextureWidth; i++)
        {
            newBuffer[i] = 0;
        }
        this.textureSourceBuffer = newBuffer;
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
    private lightUpdate(light: LightBase,renderer:RendererBase)
    {
        var index = this.lightIdDictionary.get(light.ID);
        var parameters = light.getParameters(renderer);
        var baseIndex = index * 4 * this.TextureWidth + 1;
        var endIndex = baseIndex + parameters.length;
        this.textureSourceBuffer[baseIndex - 1] = this.diffuseShaderComposer.getLightTypeId(light);
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
    public updateLightForRenderer(renderer:RendererBase)
    {
        this.shadowDroppableLightCount=0;
        for (var i = 0; i < this.Lights.length; i++)
        {
            this.lightUpdate(this.Lights[i],renderer);
            //Arrange shadow droppable lights
            if((<ShadowDroppableLight>this.Lights[i]).isShadowDroppable)
            {
              this.shadowDroppableLights[this.shadowDroppableLightCount]=<ShadowDroppableLight>this.Lights[i];
              this.shadowDroppableLightCount++;
            }
            //Cache matrix values frpm shadow droppable Lights
            for (let i = 0; i < this.shadowDroppableLights.length; i++) {
                let shadowDroppable = this.shadowDroppableLights[i];
                for (let j = 0; j < 16; j++) {
                    this.lightWorldMatricis[i * 16 + j] = shadowDroppable.matLightProjection.rawElements[j];
                    this.viewInvertedLightMatricis[i*16 +j] = shadowDroppable.matInverseLightProjection.rawElements[j];
                 }
            }
        }
        this.parameterTexture.updateTexture(this.textureSourceBuffer);
    }

    /**
     * Initialize light program.
     */
    private initializeProgram()
    {
        var vs = require('../Shaders/Light/LightVertex.glsl');
        var jThreeContext = JThreeContextProxy.getJThreeContext();
        var rm = jThreeContext.ResourceManager;
        var vShader = rm.createShader("jthree.shaders.vertex.post", vs, ShaderType.VertexShader);
        vShader.loadAll();
        this.diffuseLightProgram = rm.createProgram(this.scene.ID + ".jthree.programs.light.diffuse", [vShader, this.DiffuseShaderCodeComposer.Shader]);
        this.specularLightProgram = rm.createProgram(this.scene.ID + ".jthree.programs.light.specular", [vShader, this.SpecularShaderCodeComposer.Shader]);
    }
}

export = LightRegister;
