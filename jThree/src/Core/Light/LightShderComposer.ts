import Shader = require("../Resources/Shader/Shader");
import AssociativeArray = require("../../Base/Collections/AssociativeArray");
import LightBase = require("LightBase");
import JThreeContextProxy = require("../JThreeContextProxy");
import ResourceManager = require("../ResourceManager");
import JThreeObjectWithId = require("../../Base/JThreeObjectWithID");
import ShaderType = require("../../Wrapper/ShaderType");
 
/**
 * Managing shader codes for extensible.
 */
class LightShaderComposer extends JThreeObjectWithId
{
    private shader: Shader;

    private lightTypeIdArray: AssociativeArray<number> = new AssociativeArray<number>();

    private shaderSourceBase: string = require('../Shaders/Light/LightAccumulation.glsl');

    private shaderCache:string;

    private shaderFuncNames: string[] = [];

    private shaderFuncDefs: string[] = [];

    private resourceManager:ResourceManager;

    constructor() {
        super();
        this.shaderCache = this.generateLightShaderSource();
        this.resourceManager = JThreeContextProxy.getJThreeContext().ResourceManager;
        this.shader = this.resourceManager.createShader(this.ID + ".jthree.lightaccum", "", ShaderType.FragmentShader);
    }

    /**
     * Constructed shader instance
     * @returns {Shader} Constructed shader 
     */
    public get Shader() :Shader {
        return this.shader;
    }

    /**
     * Constructed shader code
     * @returns {string} Constructed shader code 
     */
    public get ShaderCode(): string {
        return this.shaderCache;
    }

    /**
     * Obtain integer id to identify lights.
     * If passed light are unregistered one, this method should return 0.
     * If passed light are registeredb one, this method should return 0 to N.
     * @param light light instance that you want to find id.
     * @returns {number} id 
     */
    public getLightTypeId(light: LightBase) {
        return this.lightTypeIdArray.has(light.LightType) ?
            this.lightTypeIdArray.get(light.LightType) : 0;
    }

    /**
     * Register new type of light.
     * @param shaderFuncName shader function name. no need to include parameter declarations.
     * @param shaderFuncCode shader function define code. this function must return vec3 as light color to add. This function must receive 2 variables,vec3 position and vec3 normal. Each parameter are already transformed into view space.
     * @param lightTypeName light type name it must be same with LightBase.LightTypeName
     */
    public addLightType(shaderFuncName: string, shaderFuncCode: string, lightTypeName: string) {
        if (this.lightTypeIdArray.has(lightTypeName)) {
            console.warn("already this light type was added.");
            return;
        } else
        {
            this.lightTypeIdArray.set(lightTypeName, this.lightTypeIdArray.size + 1);
        }
        this.shaderFuncDefs.push(shaderFuncCode);
        this.shaderFuncNames.push(shaderFuncName);
        this.shaderCache = this.generateLightShaderSource();
        this.updateShaderFromCache();
    }

    /**
     * Generate whole source shader code.
     * @returns {string} generated source code of light fragment code. 
     */
    private generateLightShaderSource(): string {
        var result = this.shaderSourceBase;
        result = result.replace('///<<< LIGHT FUNCTION DEFINITIONS', this.generateLightFunctionDefinitions());
        result = result.replace('///<<< LIGHT FUNCTION CALLS', this.generateLightFunctionCallers());
        return result;
    }


    /**
     * Generate chunk of light shader declarations.
     * @returns {string} concatted light fragment declarations.
     */
    private generateLightFunctionDefinitions(): string {
        var result = "";
        for (var i = 0; i < this.shaderFuncDefs.length; i++) {
            result += this.shaderFuncDefs[i];
        }
        return result;
    }

    /**
     * Generate chunk of light shader callers;
     * @returns {string} concatted light fragment functions callers. 
     */
    private generateLightFunctionCallers(): string {
        var result = "";
        for (var i = 0; i < this.shaderFuncNames.length; i++) {
            result += `if(getLightType(i) == ${(i+1).toFixed(0)}.)gl_FragColor.rgb+=${this.shaderFuncNames
            [i]}(position,normal,i);`;
        }
        return result;
    }

    private updateShaderFromCache() {
        this.Shader.update(this.shaderCache);
        console.warn("shader updated.");
    }
}

export = LightShaderComposer;