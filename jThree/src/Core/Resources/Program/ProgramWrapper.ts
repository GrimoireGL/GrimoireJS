import VectorArray from "../../../Math/VectorArray";
import TextureBase from "../Texture/TextureBase";
import VectorBase from "../../../Math/VectorBase";
import Matrix from "../../../Math/Matrix";
import Program from "./Program";
import Canvas from "../../Canvas/Canvas";
import ResourceWrapper from "../ResourceWrapper";
import Buffer from "../Buffer/Buffer";
class ProgramWrapper extends ResourceWrapper {
  constructor(parent: Program, canvas: Canvas) {
    super(canvas);
    this._parentProgram = parent;
  }

  private _islinked: boolean = false;

  private _targetProgram: WebGLProgram = null;

  private _parentProgram: Program = null;

  private _attributeLocations: { [key: string]: number } = {};

  private _uniformLocations: { [key: string]: WebGLUniformLocation } = {};

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
      if (!this.GL.getProgramParameter(this._targetProgram, this.GL.LINK_STATUS)) {
        console.error(`LINK ERROR:${this.GL.getProgramInfoLog(this._targetProgram) }`);
      }
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
    return this._fetchUniformLocation(valName) !== -1;
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
   * Assign attribute variable. This method requires that this related program was already used.
   * @param {string} variableName variable name to be assigned buffer
   * @param {Buffer} buffer       actual variable buffer to be assigned
   */
  public assignAttributeVariable(variableName: string, buffer: Buffer): void {
    const attribIndex = this._fetchAttributeLocation(variableName);
    if (attribIndex < 0) { return; } // When the variable was not found
    const bufWrapper = buffer.getForContext(this.OwnerCanvas);
    bufWrapper.bindBuffer();
    this.GL.vertexAttribPointer(attribIndex, buffer.UnitCount, buffer.ElementType, buffer.Normalized, buffer.Stride, buffer.Offset);
  }

  public uniformMatrixArrayFromBuffer(variableName: string, buffer: Float32Array): void {
    const location = this._fetchUniformLocation(variableName);
    if (!location) { return; }
    this.GL.uniform4fv(location, buffer);
  }

  public uniformMatrix(variableName: string, mat: Matrix): void {
    const location = this._fetchUniformLocation(variableName);
    if (!location) { return; }
    this.GL.uniformMatrix4fv(location, false, <Float32Array>mat.rawElements);
  }

  public uniformVector(variableName: string, vec: VectorBase): void {
    const location = this._fetchUniformLocation(variableName);
    if (!location) { return; }
    const rawVector = vec.rawElements;
    switch (vec.ElementCount) {
      case 2:
        this.GL.uniform2f(location, rawVector[0], rawVector[1]);
        return;
      case 3:
        this.GL.uniform3f(location, rawVector[0], rawVector[1], rawVector[2]);
        return;
      case 4:
        this.GL.uniform4f(location, rawVector[0], rawVector[1], rawVector[2], rawVector[3]);
        return;
      default:
        console.error("Unexpected element count of vector!");
    }
  }

  public uniformVectorArray(variableName: string, vectors: VectorArray): void {
    const location = this._fetchUniformLocation(variableName);
    if (!location) { return; }
    switch (vectors.unitSize) {
      case 2:
        this.GL.uniform2fv(location, new Float32Array(vectors.rawElements));
        return;
      case 3:
        this.GL.uniform3fv(location, new Float32Array(vectors.rawElements));
        return;
      case 4:
        this.GL.uniform4fv(location, new Float32Array(vectors.rawElements));
        return;
      default:
        console.error("Unexpected element count of vector!");
    }
  }

  public uniformFloat(variableName: string, val: number): void {
    const location = this._fetchUniformLocation(variableName);
    if (!location) { return; }
    this.GL.uniform1f(location, val);
  }

  public uniformFloatArray(variableName: string, val: number[]): void {
    const location = this._fetchUniformLocation(variableName);
    if (!location) {
      return;
    }
    this.GL.uniform1fv(location, new Float32Array(val));
  }

  public uniformInt(variableName: string, val: number): void {
    const location = this._fetchUniformLocation(variableName);
    if (!location) { return; }
    this.GL.uniform1i(location, val);
  }

  public uniformIntArray(variableName: string, val: number[]): void {
    const location = this._fetchUniformLocation(variableName);
    if (!location) {
      return;
    }
    this.GL.uniform1iv(location, new Int32Array(val));
  }

  public uniformSampler(variableName: string, tex: TextureBase, texRegister: number): number {
    const location = this._fetchUniformLocation(variableName);
    const texWrapper = tex.getForContext(this.OwnerCanvas);
    if (!location) { return -1; }
    if (texWrapper.Initialized) {
      if (texWrapper.registerTexture(texRegister)) {
        this.GL.uniform1i(location, texRegister);
      }
    }
  }

  private _fetchUniformLocation(valName: string): WebGLUniformLocation {
    if (!this._uniformLocations[valName]) {
      this._uniformLocations[valName] = this.GL.getUniformLocation(this.TargetProgram, valName);
    }
    return this._uniformLocations[valName];
  }

  private _fetchAttributeLocation(valName: string): number {
    if (!this._attributeLocations[valName]) {
      this._attributeLocations[valName] = this.GL.getAttribLocation(this.TargetProgram, valName);
      if (this._attributeLocations[valName] >= 0) {
       this.GL.enableVertexAttribArray(this._attributeLocations[valName]);
      }
    }
    return this._attributeLocations[valName];
  }
}

export default ProgramWrapper;
