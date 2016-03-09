import ResourceWrapper from "../ResourceWrapper";
class ProgramWrapper extends ResourceWrapper {
    constructor(parent, canvas) {
        super(canvas);
        this._islinked = false;
        this._targetProgram = null;
        this._parentProgram = null;
        this._attributeLocations = {};
        this._uniformLocations = {};
        this._parentProgram = parent;
    }
    get TargetProgram() {
        return this._targetProgram;
    }
    init() {
        if (!this.Initialized) {
            this._targetProgram = this.GL.createProgram();
            this._parentProgram.AttachedShaders.forEach((v, i, a) => {
                this.GL.attachShader(this._targetProgram, v.getForContextID(this.OwnerID).TargetShader);
            });
            this.__setInitialized();
        }
    }
    dispose() {
        if (this.Initialized) {
            this.GL.deleteProgram(this._targetProgram);
            this.__setInitialized(false);
            this._targetProgram = null;
            this._islinked = false;
        }
    }
    linkProgram() {
        if (!this._islinked) {
            this.GL.linkProgram(this._targetProgram);
            if (!this.GL.getProgramParameter(this._targetProgram, this.GL.LINK_STATUS)) {
                console.error(`LINK ERROR:${this.GL.getProgramInfoLog(this._targetProgram)}`);
            }
            this._islinked = true;
        }
    }
    useProgram() {
        if (!this.Initialized) {
            this.init();
        }
        if (!this._islinked) {
            this.linkProgram();
        }
        this.GL.useProgram(this._targetProgram);
    }
    uniformExists(valName) {
        this.useProgram();
        return this._fetchUniformLocation(valName) !== -1;
    }
    /**
     * Relink shader for shader source changing
     */
    relink() {
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
    assignAttributeVariable(variableName, buffer) {
        const attribIndex = this._fetchAttributeLocation(variableName);
        if (attribIndex < 0) {
            return;
        } // When the variable was not found
        const bufWrapper = buffer.getForContext(this.OwnerCanvas);
        bufWrapper.bindBuffer();
        this.GL.vertexAttribPointer(attribIndex, buffer.UnitCount, buffer.ElementType, buffer.Normalized, buffer.Stride, buffer.Offset);
    }
    uniformMatrixArrayFromBuffer(variableName, buffer) {
        const location = this._fetchUniformLocation(variableName);
        if (!location) {
            return;
        }
        this.GL.uniform4fv(location, buffer);
    }
    uniformMatrixArray(variableName, matArray) {
        const location = this._fetchUniformLocation(variableName);
        if (!location) {
            return;
        }
        this.GL.uniform4fv(location, matArray.rawElements);
    }
    uniformMatrix(variableName, mat) {
        const location = this._fetchUniformLocation(variableName);
        if (!location) {
            return;
        }
        this.GL.uniformMatrix4fv(location, false, mat.rawElements);
    }
    uniformVector(variableName, vec) {
        const location = this._fetchUniformLocation(variableName);
        if (!location) {
            return;
        }
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
    uniformVectorArray(variableName, vectors) {
        const location = this._fetchUniformLocation(variableName);
        if (!location) {
            return;
        }
        switch (vectors.dimension) {
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
    uniformFloat(variableName, val) {
        const location = this._fetchUniformLocation(variableName);
        if (!location) {
            return;
        }
        this.GL.uniform1f(location, val);
    }
    uniformFloatArray(variableName, val) {
        const location = this._fetchUniformLocation(variableName);
        if (!location) {
            return;
        }
        this.GL.uniform1fv(location, new Float32Array(val));
    }
    uniformInt(variableName, val) {
        const location = this._fetchUniformLocation(variableName);
        if (!location) {
            return;
        }
        this.GL.uniform1i(location, val);
    }
    uniformIntArray(variableName, val) {
        const location = this._fetchUniformLocation(variableName);
        if (!location) {
            return;
        }
        this.GL.uniform1iv(location, new Int32Array(val));
    }
    uniformSampler(variableName, tex, texRegister) {
        const location = this._fetchUniformLocation(variableName);
        const texWrapper = tex.getForContext(this.OwnerCanvas);
        if (!location) {
            return -1;
        }
        if (texWrapper.Initialized) {
            if (texWrapper.registerTexture(texRegister)) {
                this.GL.uniform1i(location, texRegister);
            }
        }
    }
    _fetchUniformLocation(valName) {
        if (!this._uniformLocations[valName]) {
            this._uniformLocations[valName] = this.GL.getUniformLocation(this.TargetProgram, valName);
        }
        return this._uniformLocations[valName];
    }
    _fetchAttributeLocation(valName) {
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
