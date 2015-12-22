import Vector4 = require("../../../Math/Vector4");
import Vector3 = require("../../../Math/Vector3");
import Vector2 = require("../../../Math/Vector2");
import VectorBase = require("../../../Math/VectorBase");
import Matrix = require("../../../Math/Matrix");
import Program = require("./Program");
import Canvas = require("../../Canvas");
import ResourceWrapper = require('../ResourceWrapper');
import AssociativeArray = require('../../../Base/Collections/AssociativeArray');
import VariableRegisteringArgument = require("./VariableRegister/VariableRegisteringArgument");
import VariableRegisterBase = require("./VariableRegister/Uniforms/UniformVariableRegisterBase");
import Buffer = require("../Buffer/Buffer");
class ProgramWrapper extends ResourceWrapper {
    constructor(parent: Program, canvas: Canvas) {
        super(canvas);
        this._parentProgram = parent;
    }

    private _islinked: boolean = false;

    private _targetProgram: WebGLProgram = null;

    private _parentProgram: Program = null;

    private _attributeLocations: AssociativeArray<number> = new AssociativeArray<number>();

    private _uniformLocations: AssociativeArray<WebGLUniformLocation> = new AssociativeArray<WebGLUniformLocation>();

    private _uniformRegisterTypeList: { [name: string]: VariableRegisterBase } = require("./VariableRegister/Uniforms/UniformTypeList");

    public get TargetProgram(): WebGLProgram {
        return this._targetProgram;
    }

    public init(): void {
        if (!this.Initialized) {
            this._targetProgram = this.GL.createProgram();
            this._parentProgram.AttachedShaders.forEach((v, i, a) => {
                this.GL.attachShader(this._targetProgram, v.getForContextID(this.OwnerID).TargetShader);
            });
            this.setInitialized();
        }
    }

    public dispose() {
        if (this.Initialized) {
            this.GL.deleteProgram(this._targetProgram);
            this.setInitialized(false);
            this._targetProgram = null;
            this._islinked = false;
        }
    }

    public linkProgram(): void {
        if (!this._islinked) {
            this.GL.linkProgram(this._targetProgram);
            this._islinked = true;
        }
    }

    public useProgram(): void {
        if (!this.Initialized) {
            this.init();
        }
        if (!this._islinked) {
            this.linkProgram();
        }
        this.GL.useProgram(this._targetProgram);
    }

    public uniformExists(valName: string): boolean {
        this.useProgram();
        return this._fetchUniformLocation(valName) != -1;
    }

    private _fetchUniformLocation(valName: string): WebGLUniformLocation {
        if (!this._uniformLocations.has(valName)) {
            this._uniformLocations.set(valName, this.GL.getUniformLocation(this.TargetProgram, valName));
        }
        return this._uniformLocations.get(valName);
    }

    private _fetchAttributeLocation(valName: string): number {
        if (!this._attributeLocations.has(valName)) {
            this._attributeLocations.set(valName, this.GL.getAttribLocation(this.TargetProgram, valName));
        }
        return this._attributeLocations.get(valName);
    }

    /**
     * Relink shader for shader source changing
     */
    public relink() {
        this.GL.deleteProgram(this.TargetProgram);
        this._targetProgram = this.GL.createProgram();
        this._parentProgram.AttachedShaders.forEach((v, i, a) => {
            this.GL.attachShader(this._targetProgram, v.getForContextID(this.OwnerID).TargetShader);
        });
    }

    /**
     * Pass the variables into shader
     * @param variables
     * @returns {}
     */
    public register(variables: VariableRegisteringArgument) {
        this.useProgram();
        //register uniform variables
        if (typeof variables.uniforms !== "undefined") {
            for (var uniformKey in variables.uniforms) {
                var uniform = variables.uniforms[uniformKey];
                uniform['context'] = this.OwnerCanvas;
                var index = this._fetchUniformLocation(uniformKey);
                if (index == -1) continue;
                var registerer = this._uniformRegisterTypeList[uniform.type];
                registerer.registerVariable(this.GL, index, uniform.value, uniform);
            }
        }
        //register attribute variables
        if (typeof variables.attributes !== "undefined") {
            for (var attributeKey in variables.attributes) {
                var attribute = variables.attributes[attributeKey];
                var buffer = attribute.getForContext(this.OwnerCanvas);
                buffer.bindBuffer();
                var attribIndex: number = this._fetchAttributeLocation(attributeKey);
                this.GL.enableVertexAttribArray(attribIndex);
                this.GL.vertexAttribPointer(attribIndex, buffer.UnitCount, buffer.ElementType, buffer.Normalized, buffer.Stride, buffer.Offset);
            }
        }
    }

    /**
     * Assign attribute variable. This method requires that this related program was already used.
     * @param {string} variableName variable name to be assigned buffer
     * @param {Buffer} buffer       actual variable buffer to be assigned
     */
    public assignAttributeVariable(variableName: string, buffer: Buffer): void {
        const attribIndex = this._fetchAttributeLocation(variableName);
        if (attribIndex < 0) return; // When the variable was not found
        const bufWrapper = buffer.getForContext(this.OwnerCanvas);
        bufWrapper.bindBuffer();
        this.GL.enableVertexAttribArray(attribIndex);
        this.GL.vertexAttribPointer(attribIndex, buffer.UnitCount, buffer.ElementType, buffer.Normalized, buffer.Stride, buffer.Offset);
    }

    public uniformMatrix(variableName: string, mat: Matrix): void {
        const location = this._fetchUniformLocation(variableName);
        if (location < 0) return;
        this.GL.uniformMatrix4fv(location, false, <Float32Array>mat.rawElements);
    }

    public uniformVector(variableName: string, vec: VectorBase): void {
        const location = this._fetchUniformLocation(variableName);
        if (location < 0) return;
        switch (vec.ElementCount) {
            case 2:
                this.GL.uniform2f(location, (<Vector2>vec).X, (<Vector2>vec).Y);
                return;
            case 3:
                this.GL.uniform3f(location, (<Vector3>vec).X, (<Vector3>vec).Y, (<Vector3>vec).Z);
                return;
            case 4:
                this.GL.uniform4f(location, (<Vector4>vec).X, (<Vector4>vec).Y, (<Vector4>vec).Z, (<Vector4>vec).W);
                return;
            default:
                console.error("Unexpected element count of vector!");
        }
    }

    public uniformFloat(variableName:string,val:number):void
    {
      const location = this._fetchUniformLocation(variableName);
      if(location < 0)return;
      this.GL.uniform1f(location,val);
    }
}

export =ProgramWrapper;
