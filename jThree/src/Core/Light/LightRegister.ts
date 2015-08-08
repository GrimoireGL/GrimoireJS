import BufferTexture = require("../Resources/Texture/BufferTexture");
import RendererBase = require("../Renderers/RendererBase");
import LightBase = require("LightBase");
import JThreeCollection = require("../../Base/JThreeCollection");
import AssociativeArray = require("../../Base/Collections/AssociativeArray"); 

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
    private renderer: RendererBase;

    /**
     * Height of texture.
     */
    private textureHeight: number = 4;

    /**
     * 
     */
    private lights: LightBase[] = [];

    private lightIdDictionary: AssociativeArray<number> = new AssociativeArray<number>();

    private textureSourceBuffer:Float32Array;

    /**
     * Getter for height of texture.
     */
    public get TextureWidth(): number {
        return this.textureHeight;
    }

    public get Renderer(): RendererBase {
        return this.renderer;
    }

    public get ParameterTexture(): BufferTexture {
        return this.parameterTexture;
    }

     /**
     * Getter for lights managed by this light register.
     * DO NOT PUSH ANY LIGHTS BY YOURSELF. USE addLights METHOD INSTEAD.
     */
    public get Lights(): LightBase[] {
        return this.lights;
    }

    public addLightType(paramVecCount:number,shaderFuncName:string,shaderFuncCode:string) {
        var newSize = Math.max(paramVecCount, this.textureHeight);
        if (newSize !== this.textureHeight) {
            //apply new size of texture
        }
    }

    public addLight(light:LightBase) {
        this.lights.push(light);
        this.lightIdDictionary.set(light.ID, this.lights.length - 1);
        light.onParameterChanged((o,l)=>this.lightUpdate(l));
    }

    private heightUpdate(start: number)
    {
        //update texture here
        var newBuffer = new Float32Array(4 * this.TextureWidth * this.lights.length);
        for (var i = 0; i < start*4*this.TextureWidth; i++) {
            newBuffer[i] = this.textureSourceBuffer[i];
        }
        this.textureSourceBuffer = newBuffer;
        //update variables here
        for (var i = start; i < this.Lights.length; i++) {
            this.lightUpdate(this.Lights[i]);
        }
    }

    private widthUpdate() {
        this.heightUpdate(0);//update all
    }

    /**
     * Update light parameter.
     * @param light the light you want to update
     */
    private lightUpdate(light:LightBase) {
        var index = this.lightIdDictionary.get(light.ID);
        var parameters = light.getParameters(this.Renderer);
        var baseIndex = index * 4 * this.TextureWidth;
        var endIndex = baseIndex + parameters.length;
        for (var i = baseIndex; i < endIndex; i++) {
            this.textureSourceBuffer[i] = parameters[i - baseIndex];
        }
        for (var i = endIndex; i < baseIndex + 4 * this.TextureWidth; i++) {
            this.textureSourceBuffer[i] = 0;//fill zero
        }
    }
}

export = LightRegister;