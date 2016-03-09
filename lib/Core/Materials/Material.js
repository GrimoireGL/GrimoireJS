import JThreeObjectEEWithID from "../../Base/JThreeObjectEEWithID";
/**
* Basement class for any Materials.
* Material is basically meaning what shader will be used or what shader variable will passed.
* In jThree v3,these renderer are implemented with deferred rendering method.
* That method needs to use a lot of shaders and shader variables.
* Therefore,materials of jThree is not only visceral Materials.
* Some of materials are intended to use in deferred rendering stage(G-buffer generation stage is one of example).
* This is one of significant difference between jThree and the other Web3D libraries in Material.
*/
class Material extends JThreeObjectEEWithID {
    constructor(...args) {
        super(...args);
        this.materialVariables = {};
        /**
        * Whether this material was initialized already or not.
        */
        this._initialized = false;
    }
    /**
    * Set loaded status of this material.
    * If first argument of boolean was passed,the status of loaded will be changed in that value.
    * If first argument of boolean was not passed, the status of loaded will be changed in true.
    */
    __setLoaded(flag) {
        flag = typeof flag === "undefined" ? true : flag;
        this._initialized = flag;
        if (flag) {
            this.emit("ready", this);
        }
    }
    /**
     * Provides the flag this material finished loading or not.
     */
    get Initialized() {
        return this._initialized;
    }
    /**
    * Rendering priorty of this material.
    * If render stage request materials of an specific material group, these list is sorted in this priorty value.
    * So any material with same group id having lower priorty will be rendered later.
    */
    get Priorty() {
        return this._priorty;
    }
    /**
    * Group name of this material.
    * This main purpose is mainly intended to be used in RenderStage for filtering materials by puropse of material.
    */
    get MaterialGroup() {
        return "builtin.forward";
    }
    /**
    * Should return how many times required to render this material.
    * If you render some of model with edge,it can be 2 or greater.
    * Because it needs rendering edge first,then rendering forward shading.
    */
    getPassCount(techniqueIndex) {
        return 1;
    }
    /**
    * Apply configuration of program.
    * This is used for passing variables,using programs,binding index buffer.
    */
    apply(matArg) {
        if (!this._initialized) {
            return;
        }
        this.emit("apply", matArg);
        return;
    }
    registerMaterialVariables(renderer, pWrapper, uniforms) {
        for (let valName in uniforms) {
            let uniform = uniforms[valName];
            if (valName[0] === "_") {
                continue;
            }
            const val = this.materialVariables[valName];
            if (typeof val === "undefined" || val == null) {
                this._whenMaterialVariableNotFound(renderer, pWrapper, uniform);
                continue;
            }
            if (!uniform.isArray) {
                switch (uniform.variableType) {
                    case "vec2":
                    case "vec3":
                    case "vec4":
                        pWrapper.uniformVector(valName, val);
                        continue;
                    case "mat4":
                        pWrapper.uniformMatrix(valName, val);
                        continue;
                    case "float":
                        pWrapper.uniformFloat(valName, val);
                        continue;
                    case "int":
                        pWrapper.uniformInt(valName, val);
                        continue;
                    case "sampler2D":
                    case "samplerCube":
                        let registerAnnotation = uniform.variableAnnotation["register"];
                        let register;
                        if (registerAnnotation) {
                            register = parseInt(registerAnnotation, 10);
                        }
                        else {
                            register = 0;
                        }
                        pWrapper.uniformSampler(valName, val, register);
                        if (uniform.variableAnnotation["flag"]) {
                            pWrapper.uniformInt(uniform.variableAnnotation["flag"], 1);
                        }
                        continue;
                    default:
                        console.warn(`Unknown variable type ${uniform.variableType}`);
                }
            }
            else {
                switch (uniform.variableType) {
                    case "vec2":
                    case "vec3":
                    case "vec4":
                        pWrapper.uniformVectorArray(valName, val);
                        continue;
                    case "float":
                        pWrapper.uniformFloatArray(valName, val);
                        continue;
                    case "int":
                        pWrapper.uniformIntArray(valName, val);
                        continue;
                    case "mat4":
                        pWrapper.uniformMatrixArray(valName, val);
                        continue;
                    default:
                        console.warn(`Unknown array variable type ${uniform.variableType}[]`);
                }
            }
        }
    }
    getDrawGeometryLength(geo) {
        return geo.getDrawLength();
    }
    getDrawGeometryOffset(geo) {
        return geo.GeometryOffset;
    }
    _whenMaterialVariableNotFound(renderer, pWrapper, uniform) {
        if (!uniform.isArray) {
            switch (uniform.variableType) {
                case "float":
                    pWrapper.uniformFloat(uniform.variableName, uniform.variableAnnotation["default"]);
                    return;
                case "vec2":
                    pWrapper.uniformVector(uniform.variableName, uniform.variableAnnotation["default"]);
                    return;
                case "vec3":
                    pWrapper.uniformVector(uniform.variableName, uniform.variableAnnotation["default"]);
                    return;
                case "vec4":
                    pWrapper.uniformVector(uniform.variableName, uniform.variableAnnotation["default"]);
                    return;
                case "sampler2D":
                    let registerAnnotation = uniform.variableAnnotation["register"];
                    let register;
                    if (registerAnnotation) {
                        register = parseInt(registerAnnotation, 10);
                    }
                    else {
                        register = 0;
                    }
                    pWrapper.uniformSampler(uniform.variableName, renderer.alternativeTexture, register);
                    if (uniform.variableAnnotation["flag"]) {
                        pWrapper.uniformInt(uniform.variableAnnotation["flag"], 0);
                    }
                    return;
                case "samplerCube":
                    let registerCubeAnnotation = uniform.variableAnnotation["register"];
                    let registerCube;
                    if (registerAnnotation) {
                        registerCube = parseInt(registerCubeAnnotation, 10);
                    }
                    else {
                        registerCube = 0;
                    }
                    pWrapper.uniformSampler(uniform.variableName, renderer.alternativeCubeTexture, registerCube);
                    if (uniform.variableAnnotation["flag"]) {
                        pWrapper.uniformInt(uniform.variableAnnotation["flag"], 0);
                    }
                    return;
            }
        }
        else {
            switch (uniform.variableType) {
                case "float":
                    pWrapper.uniformFloatArray(uniform.variableName, uniform.variableAnnotation["default"]);
                    break;
                case "vec2":
                case "vec3":
                case "vec4":
                    pWrapper.uniformVectorArray(uniform.variableName, uniform.variableAnnotation["default"]);
                    break;
                case "mat4":
                    pWrapper.uniformMatrixArray(uniform.variableName, uniform.variableAnnotation["default"]);
                    break;
            }
        }
    }
    /**
    * The flag whether this material should be called for rendering.
    */
    get Enabled() {
        return true;
    }
}
export default Material;
