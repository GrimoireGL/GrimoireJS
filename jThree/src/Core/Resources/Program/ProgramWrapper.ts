import Program = require("./Program");
import ContextManagerBase = require("../../ContextManagerBase");
import Matrix = require("../../../Math/Matrix");
import BufferWrapper = require("../Buffer/BufferWrapper");
import VectorBase = require("../../../Math/VectorBase");
import Vector2 = require("../../../Math/Vector2");
import Vector3 = require("../../../Math/Vector3");
import Vector4 = require("../../../Math/Vector4");
import ResourceWrapper = require('../ResourceWrapper');
import AssociativeArray = require('../../../Base/Collections/AssociativeArray');
import RendererBase = require('../../Renderers/RendererBase');
import TextureRegister = require('../../../Wrapper/Texture/TextureRegister');
import TextureBase = require('../Texture/TextureBase');
import TextureTargetType = require('../../../Wrapper/TargetTextureType');
import VariableRegisteringArgument = require("./VariableRegister/VariableRegisteringArgument");
import VariableRegisterBase = require("VariableRegister/Uniforms/UniformVariableRegisterBase");

class ProgramWrapper extends ResourceWrapper {
    constructor(parent: Program, contextManager: ContextManagerBase) {
        super(contextManager);
        this.parentProgram = parent;
    }

    private isLinked: boolean = false;

    private targetProgram: WebGLProgram = null;

    private parentProgram: Program = null;

    private attributeLocations: AssociativeArray<number> = new AssociativeArray<number>();

    private uniformLocations: AssociativeArray<WebGLUniformLocation> = new AssociativeArray<WebGLUniformLocation>();

    public get TargetProgram(): WebGLProgram {
        return this.targetProgram;
    }

    public init(): void {
        if (!this.Initialized) {
            this.targetProgram = this.WebGLContext.CreateProgram();
            this.parentProgram.AttachedShaders.forEach((v, i, a) => {
                this.WebGLContext.AttachShader(this.targetProgram, v.getForContextID(this.OwnerID).TargetShader);
            });
            this.setInitialized();
        }
    }

    public dispose() {
        if (this.Initialized) {
            this.WebGLContext.DeleteProgram(this.targetProgram);
            this.setInitialized(false);
            this.targetProgram = null;
            this.isLinked = false;
        }
    }

    public linkProgram(): void {
        if (!this.isLinked) {
            this.WebGLContext.LinkProgram(this.targetProgram);
            this.isLinked = true;
        }
    }

    public useProgram(): void {
        if (!this.Initialized) {
            console.log("useProgram was called, but program was not initialized.");
            this.init();
        }
        if (!this.isLinked) {
            console.log("useProgram was called, but program was not linked.");
            this.linkProgram();
        }
        this.WebGLContext.UseProgram(this.targetProgram);
    }
    
    private fetchUniformLocation(valName:string):WebGLUniformLocation
    {
        if(!this.uniformLocations.has(valName))
        {
            this.uniformLocations.set(valName,this.WebGLContext.GetUniformLocation(this.TargetProgram,valName));
        }
        return this.uniformLocations.get(valName);
    }

    public setUniformMatrix(valName: string, matrix: Matrix): void {
        this.useProgram();
        var uniformIndex: WebGLUniformLocation = this.fetchUniformLocation(valName);
        this.WebGLContext.UniformMatrix(uniformIndex, matrix);
    }

    public setUniform1i(valName: string, num: number): void {
        this.useProgram();
        var uniformIndex: WebGLUniformLocation = this.fetchUniformLocation(valName);
        this.WebGLContext.Uniform1i(uniformIndex, num);
    }

    public setUniform1f(valName:string,num:number):void{
        this.useProgram();
        var uniformIndex=this.fetchUniformLocation(valName);
        this.WebGLContext.Uniform1f(uniformIndex,num);
    }

    public setUniformVector(valName: string, vec: VectorBase): void {
        this.useProgram();
        var uniformIndex: WebGLUniformLocation = this.fetchUniformLocation(valName);
        switch (vec.ElementCount) {
            case 2:
                this.WebGLContext.UniformVector2(uniformIndex, <Vector2>vec);
                break;
            case 3:
                this.WebGLContext.UniformVector3(uniformIndex, <Vector3>vec);
                break;
            case 4:
                this.WebGLContext.UniformVector4(uniformIndex, <Vector4>vec);
                break;
        }
    }

    public setUniformVectorArray(valName: string, vec: VectorBase[]) {
        this.useProgram();
        var uniformIndex: WebGLUniformLocation = this.fetchUniformLocation(valName);
        if(vec.length===0)return;
        switch (vec[0].ElementCount) {
            case 2:
                this.WebGLContext.UniformVector2Array(uniformIndex, <Vector2[]>vec);
                break;
            case 3:
                this.WebGLContext.UniformVector3Array(uniformIndex, <Vector3[]>vec);
                break;
            case 4:
                this.WebGLContext.UniformVector4Array(uniformIndex, <Vector4[]>vec);
                break;
        }

    }

    public setAttributeVerticies(valName: string, buffer: BufferWrapper): void {
        this.useProgram();
        buffer.bindBuffer();
        if (!this.attributeLocations.has(valName)) {
            this.attributeLocations.set(valName, this.WebGLContext.GetAttribLocation(this.TargetProgram, valName));
        }
        var attribIndex: number = this.attributeLocations.get(valName);
        this.WebGLContext.EnableVertexAttribArray(attribIndex);
        this.WebGLContext.VertexAttribPointer(attribIndex, buffer.UnitCount, buffer.ElementType, buffer.Normalized, buffer.Stride, buffer.Offset);
    }

    public registerTexture(renderer: RendererBase, tex: TextureBase, texNumber: number, samplerName: string) {
    renderer.ContextManager.GLContext.ActiveTexture(TextureRegister.Texture0 + texNumber);
    if(tex!=null&&typeof tex !== 'undefined')
    {
        tex.getForContext(renderer.ContextManager).bind();
    }else
    {
        this.WebGLContext.BindTexture(TextureTargetType.Texture2D,null);
    }
    this.setUniform1i(samplerName, texNumber);
  }
    
    /**
     * Relink shader for shader source changing
     */
    public relink() {
        this.WebGLContext.DeleteProgram(this.TargetProgram);
        this.targetProgram = this.WebGLContext.CreateProgram();
        this.parentProgram.AttachedShaders.forEach((v, i, a) =>
        {
            this.WebGLContext.AttachShader(this.targetProgram, v.getForContextID(this.OwnerID).TargetShader);
        });
    }

    /**
     * Pass the variables into shader
     * @param variables 
     * @returns {} 
     */
    public register(variables: VariableRegisteringArgument) {
        this.useProgram();
        var uniformRegisterTypeList: { [name: string]: VariableRegisterBase } = require("./VariableRegister/Uniforms/UniformTypeList");
        //register uniform variables
        if (typeof variables.uniforms !== "undefined") {
            for (var uniformKey in variables.uniforms) {
                var uniform = variables.uniforms[uniformKey];
                uniform['context'] = this.OwnerCanvas;
                var index = this.fetchUniformLocation(uniformKey);
                var registerer = uniformRegisterTypeList[uniform.type];
                registerer.registerVariable(this.WebGLContext, index, uniform.value,uniform);
            }
        }

        //register attribute variables
        if (typeof variables.attributes !== "undefined") {
            for (var attributeKey in variables.attributes) {
                var attribute = variables.attributes[attributeKey];
                var buffer = attribute.getForRenderer(this.OwnerCanvas);
                buffer.bindBuffer();
                if (!this.attributeLocations.has(attributeKey))
                {
                    this.attributeLocations.set(attributeKey, this.WebGLContext.GetAttribLocation(this.TargetProgram, attributeKey));
                }
                var attribIndex: number = this.attributeLocations.get(attributeKey);
                this.WebGLContext.EnableVertexAttribArray(attribIndex);
                this.WebGLContext.VertexAttribPointer(attribIndex, buffer.UnitCount, buffer.ElementType, buffer.Normalized, buffer.Stride, buffer.Offset);

            }
        }
    }
}

export =ProgramWrapper;
