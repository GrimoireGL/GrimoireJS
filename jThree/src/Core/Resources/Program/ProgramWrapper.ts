import Program = require("./Program");
import ContextManagerBase = require("../../ContextManagerBase");
import ResourceWrapper = require('../ResourceWrapper');
import AssociativeArray = require('../../../Base/Collections/AssociativeArray');
import VariableRegisteringArgument = require("./VariableRegister/VariableRegisteringArgument");
import VariableRegisterBase = require("./VariableRegister/Uniforms/UniformVariableRegisterBase");

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
            this.init();
        }
        if (!this.isLinked) {
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
        //this.unregister();
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
                var buffer = attribute.getForContext(this.OwnerCanvas);
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
