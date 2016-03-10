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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvTWF0ZXJpYWxzL01hdGVyaWFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLG9CQUFvQixNQUFNLGlDQUFpQztBQVNsRTs7Ozs7Ozs7RUFRRTtBQUNGLHVCQUF1QixvQkFBb0I7SUFBM0M7UUFBdUIsZUFBb0I7UUFDbEMsc0JBQWlCLEdBQTJCLEVBQUUsQ0FBQztRQUV0RDs7VUFFRTtRQUNNLGlCQUFZLEdBQVksS0FBSyxDQUFDO0lBNE14QyxDQUFDO0lBcE1DOzs7O01BSUU7SUFDUSxXQUFXLENBQUMsSUFBYztRQUNsQyxJQUFJLEdBQUcsT0FBTyxJQUFJLEtBQUssV0FBVyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDekIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNULElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNCLENBQUM7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFXLFdBQVc7UUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsQ0FBQztJQUNEOzs7O01BSUU7SUFDRixJQUFXLE9BQU87UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVEOzs7TUFHRTtJQUNGLElBQVcsYUFBYTtRQUN0QixNQUFNLENBQUMsaUJBQWlCLENBQUM7SUFDM0IsQ0FBQztJQUNEOzs7O01BSUU7SUFDSyxZQUFZLENBQUMsY0FBc0I7UUFDeEMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFRDs7O01BR0U7SUFDSyxLQUFLLENBQUMsTUFBOEI7UUFDekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUN2QixNQUFNLENBQUM7UUFDVCxDQUFDO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FB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QztvQkFDekYsS0FBSyxDQUFDO1lBQ1YsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUQ7O01BRUU7SUFDRixJQUFXLE9BQU87UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7QUFHSCxDQUFDO0FBRUQsZUFBZSxRQUFRLENBQUMiLCJmaWxlIjoiQ29yZS9NYXRlcmlhbHMvTWF0ZXJpYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSlRocmVlT2JqZWN0RUVXaXRoSUQgZnJvbSBcIi4uLy4uL0Jhc2UvSlRocmVlT2JqZWN0RUVXaXRoSURcIjtcbmltcG9ydCBHZW9tZXRyeSBmcm9tIFwiLi4vR2VvbWV0cmllcy9CYXNlL0dlb21ldHJ5XCI7XG5pbXBvcnQgSUFwcGx5TWF0ZXJpYWxBcmd1bWVudCBmcm9tIFwiLi9CYXNlL0lBcHBseU1hdGVyaWFsQXJndW1lbnRcIjtcbmltcG9ydCBUZXh0dXJlQmFzZSBmcm9tIFwiLi4vUmVzb3VyY2VzL1RleHR1cmUvVGV4dHVyZUJhc2VcIjtcbmltcG9ydCBNYXRyaXggZnJvbSBcIi4uLy4uL01hdGgvTWF0cml4XCI7XG5pbXBvcnQgVmVjdG9yQmFzZSBmcm9tIFwiLi4vLi4vTWF0aC9WZWN0b3JCYXNlXCI7XG5pbXBvcnQgUHJvZ3JhbVdyYXBwZXIgZnJvbSBcIi4uL1Jlc291cmNlcy9Qcm9ncmFtL1Byb2dyYW1XcmFwcGVyXCI7XG5pbXBvcnQgSVZhcmlhYmxlRGVzY3JpcHRpb24gZnJvbSBcIi4vQmFzZS9JVmFyaWFibGVEZXNjcmlwdGlvblwiO1xuaW1wb3J0IEJhc2ljUmVuZGVyZXIgZnJvbSBcIi4uL1JlbmRlcmVycy9CYXNpY1JlbmRlcmVyXCI7XG4vKipcbiogQmFzZW1lbnQgY2xhc3MgZm9yIGFueSBNYXRlcmlhbHMuXG4qIE1hdGVyaWFsIGlzIGJhc2ljYWxseSBtZWFuaW5nIHdoYXQgc2hhZGVyIHdpbGwgYmUgdXNlZCBvciB3aGF0IHNoYWRlciB2YXJpYWJsZSB3aWxsIHBhc3NlZC5cbiogSW4galRocmVlIHYzLHRoZXNlIHJlbmRlcmVyIGFyZSBpbXBsZW1lbnRlZCB3aXRoIGRlZmVycmVkIHJlbmRlcmluZyBtZXRob2QuXG4qIFRoYXQgbWV0aG9kIG5lZWRzIHRvIHVzZSBhIGxvdCBvZiBzaGFkZXJzIGFuZCBzaGFkZXIgdmFyaWFibGVzLlxuKiBUaGVyZWZvcmUsbWF0ZXJpYWxzIG9mIGpUaHJlZSBpcyBub3Qgb25seSB2aXNjZXJhbCBNYXRlcmlhbHMuXG4qIFNvbWUgb2YgbWF0ZXJpYWxzIGFyZSBpbnRlbmRlZCB0byB1c2UgaW4gZGVmZXJyZWQgcmVuZGVyaW5nIHN0YWdlKEctYnVmZmVyIGdlbmVyYXRpb24gc3RhZ2UgaXMgb25lIG9mIGV4YW1wbGUpLlxuKiBUaGlzIGlzIG9uZSBvZiBzaWduaWZpY2FudCBkaWZmZXJlbmNlIGJldHdlZW4galRocmVlIGFuZCB0aGUgb3RoZXIgV2ViM0QgbGlicmFyaWVzIGluIE1hdGVyaWFsLlxuKi9cbmNsYXNzIE1hdGVyaWFsIGV4dGVuZHMgSlRocmVlT2JqZWN0RUVXaXRoSUQge1xuICBwdWJsaWMgbWF0ZXJpYWxWYXJpYWJsZXM6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fTtcblxuICAvKipcbiAgKiBXaGV0aGVyIHRoaXMgbWF0ZXJpYWwgd2FzIGluaXRpYWxpemVkIGFscmVhZHkgb3Igbm90LlxuICAqL1xuICBwcml2YXRlIF9pbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAqIFJlbmRlcmluZyBwcmlvcnR5XG4gICovXG4gIHByaXZhdGUgX3ByaW9ydHk6IG51bWJlcjtcblxuXG4gIC8qKlxuICAqIFNldCBsb2FkZWQgc3RhdHVzIG9mIHRoaXMgbWF0ZXJpYWwuXG4gICogSWYgZmlyc3QgYXJndW1lbnQgb2YgYm9vbGVhbiB3YXMgcGFzc2VkLHRoZSBzdGF0dXMgb2YgbG9hZGVkIHdpbGwgYmUgY2hhbmdlZCBpbiB0aGF0IHZhbHVlLlxuICAqIElmIGZpcnN0IGFyZ3VtZW50IG9mIGJvb2xlYW4gd2FzIG5vdCBwYXNzZWQsIHRoZSBzdGF0dXMgb2YgbG9hZGVkIHdpbGwgYmUgY2hhbmdlZCBpbiB0cnVlLlxuICAqL1xuICBwcm90ZWN0ZWQgX19zZXRMb2FkZWQoZmxhZz86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBmbGFnID0gdHlwZW9mIGZsYWcgPT09IFwidW5kZWZpbmVkXCIgPyB0cnVlIDogZmxhZztcbiAgICB0aGlzLl9pbml0aWFsaXplZCA9IGZsYWc7XG4gICAgaWYgKGZsYWcpIHtcbiAgICAgIHRoaXMuZW1pdChcInJlYWR5XCIsIHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyB0aGUgZmxhZyB0aGlzIG1hdGVyaWFsIGZpbmlzaGVkIGxvYWRpbmcgb3Igbm90LlxuICAgKi9cbiAgcHVibGljIGdldCBJbml0aWFsaXplZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faW5pdGlhbGl6ZWQ7XG4gIH1cbiAgLyoqXG4gICogUmVuZGVyaW5nIHByaW9ydHkgb2YgdGhpcyBtYXRlcmlhbC5cbiAgKiBJZiByZW5kZXIgc3RhZ2UgcmVxdWVzdCBtYXRlcmlhbHMgb2YgYW4gc3BlY2lmaWMgbWF0ZXJpYWwgZ3JvdXAsIHRoZXNlIGxpc3QgaXMgc29ydGVkIGluIHRoaXMgcHJpb3J0eSB2YWx1ZS5cbiAgKiBTbyBhbnkgbWF0ZXJpYWwgd2l0aCBzYW1lIGdyb3VwIGlkIGhhdmluZyBsb3dlciBwcmlvcnR5IHdpbGwgYmUgcmVuZGVyZWQgbGF0ZXIuXG4gICovXG4gIHB1YmxpYyBnZXQgUHJpb3J0eSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9wcmlvcnR5O1xuICB9XG5cbiAgLyoqXG4gICogR3JvdXAgbmFtZSBvZiB0aGlzIG1hdGVyaWFsLlxuICAqIFRoaXMgbWFpbiBwdXJwb3NlIGlzIG1haW5seSBpbnRlbmRlZCB0byBiZSB1c2VkIGluIFJlbmRlclN0YWdlIGZvciBmaWx0ZXJpbmcgbWF0ZXJpYWxzIGJ5IHB1cm9wc2Ugb2YgbWF0ZXJpYWwuXG4gICovXG4gIHB1YmxpYyBnZXQgTWF0ZXJpYWxHcm91cCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBcImJ1aWx0aW4uZm9yd2FyZFwiO1xuICB9XG4gIC8qKlxuICAqIFNob3VsZCByZXR1cm4gaG93IG1hbnkgdGltZXMgcmVxdWlyZWQgdG8gcmVuZGVyIHRoaXMgbWF0ZXJpYWwuXG4gICogSWYgeW91IHJlbmRlciBzb21lIG9mIG1vZGVsIHdpdGggZWRnZSxpdCBjYW4gYmUgMiBvciBncmVhdGVyLlxuICAqIEJlY2F1c2UgaXQgbmVlZHMgcmVuZGVyaW5nIGVkZ2UgZmlyc3QsdGhlbiByZW5kZXJpbmcgZm9yd2FyZCBzaGFkaW5nLlxuICAqL1xuICBwdWJsaWMgZ2V0UGFzc0NvdW50KHRlY2huaXF1ZUluZGV4OiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgLyoqXG4gICogQXBwbHkgY29uZmlndXJhdGlvbiBvZiBwcm9ncmFtLlxuICAqIFRoaXMgaXMgdXNlZCBmb3IgcGFzc2luZyB2YXJpYWJsZXMsdXNpbmcgcHJvZ3JhbXMsYmluZGluZyBpbmRleCBidWZmZXIuXG4gICovXG4gIHB1YmxpYyBhcHBseShtYXRBcmc6IElBcHBseU1hdGVyaWFsQXJndW1lbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2luaXRpYWxpemVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZW1pdChcImFwcGx5XCIsIG1hdEFyZyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyTWF0ZXJpYWxWYXJpYWJsZXMocmVuZGVyZXI6IEJhc2ljUmVuZGVyZXIsIHBXcmFwcGVyOiBQcm9ncmFtV3JhcHBlciwgdW5pZm9ybXM6IHsgW2tleTogc3RyaW5nXTogSVZhcmlhYmxlRGVzY3JpcHRpb24gfSk6IHZvaWQge1xuICAgIGZvciAobGV0IHZhbE5hbWUgaW4gdW5pZm9ybXMpIHtcbiAgICAgIGxldCB1bmlmb3JtID0gdW5pZm9ybXNbdmFsTmFtZV07XG4gICAgICBpZiAodmFsTmFtZVswXSA9PT0gXCJfXCIpIHsgY29udGludWU7IH1cbiAgICAgIGNvbnN0IHZhbCA9IHRoaXMubWF0ZXJpYWxWYXJpYWJsZXNbdmFsTmFtZV07XG4gICAgICBpZiAodHlwZW9mIHZhbCA9PT0gXCJ1bmRlZmluZWRcIiB8fCB2YWwgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl93aGVuTWF0ZXJpYWxWYXJpYWJsZU5vdEZvdW5kKHJlbmRlcmVyLCBwV3JhcHBlciwgdW5pZm9ybSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKCF1bmlmb3JtLmlzQXJyYXkpIHtcbiAgICAgICAgc3dpdGNoICh1bmlmb3JtLnZhcmlhYmxlVHlwZSkge1xuICAgICAgICAgIGNhc2UgXCJ2ZWMyXCI6XG4gICAgICAgICAgY2FzZSBcInZlYzNcIjpcbiAgICAgICAgICBjYXNlIFwidmVjNFwiOlxuICAgICAgICAgICAgcFdyYXBwZXIudW5pZm9ybVZlY3Rvcih2YWxOYW1lLCA8VmVjdG9yQmFzZT52YWwpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgY2FzZSBcIm1hdDRcIjpcbiAgICAgICAgICAgIHBXcmFwcGVyLnVuaWZvcm1NYXRyaXgodmFsTmFtZSwgPE1hdHJpeD52YWwpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgY2FzZSBcImZsb2F0XCI6XG4gICAgICAgICAgICBwV3JhcHBlci51bmlmb3JtRmxvYXQodmFsTmFtZSwgPG51bWJlcj52YWwpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgY2FzZSBcImludFwiOlxuICAgICAgICAgICAgcFdyYXBwZXIudW5pZm9ybUludCh2YWxOYW1lLCA8bnVtYmVyPnZhbCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICBjYXNlIFwic2FtcGxlcjJEXCI6XG4gICAgICAgICAgY2FzZSBcInNhbXBsZXJDdWJlXCI6XG4gICAgICAgICAgICBsZXQgcmVnaXN0ZXJBbm5vdGF0aW9uID0gdW5pZm9ybS52YXJpYWJsZUFubm90YXRpb25bXCJyZWdpc3RlclwiXTtcbiAgICAgICAgICAgIGxldCByZWdpc3RlcjtcbiAgICAgICAgICAgIGlmIChyZWdpc3RlckFubm90YXRpb24pIHtcbiAgICAgICAgICAgICAgcmVnaXN0ZXIgPSA8bnVtYmVyPnBhcnNlSW50KHJlZ2lzdGVyQW5ub3RhdGlvbiwgMTApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVnaXN0ZXIgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcFdyYXBwZXIudW5pZm9ybVNhbXBsZXIodmFsTmFtZSwgPFRleHR1cmVCYXNlPnZhbCwgcmVnaXN0ZXIpO1xuICAgICAgICAgICAgaWYgKHVuaWZvcm0udmFyaWFibGVBbm5vdGF0aW9uW1wiZmxhZ1wiXSkge1xuICAgICAgICAgICAgICBwV3JhcHBlci51bmlmb3JtSW50KHVuaWZvcm0udmFyaWFibGVBbm5vdGF0aW9uW1wiZmxhZ1wiXSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBVbmtub3duIHZhcmlhYmxlIHR5cGUgJHt1bmlmb3JtLnZhcmlhYmxlVHlwZX1gKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3dpdGNoICh1bmlmb3JtLnZhcmlhYmxlVHlwZSkge1xuICAgICAgICAgIGNhc2UgXCJ2ZWMyXCI6XG4gICAgICAgICAgY2FzZSBcInZlYzNcIjpcbiAgICAgICAgICBjYXNlIFwidmVjNFwiOlxuICAgICAgICAgICAgcFdyYXBwZXIudW5pZm9ybVZlY3RvckFycmF5KHZhbE5hbWUsIHZhbCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICBjYXNlIFwiZmxvYXRcIjpcbiAgICAgICAgICAgIHBXcmFwcGVyLnVuaWZvcm1GbG9hdEFycmF5KHZhbE5hbWUsIHZhbCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICBjYXNlIFwiaW50XCI6XG4gICAgICAgICAgICBwV3JhcHBlci51bmlmb3JtSW50QXJyYXkodmFsTmFtZSwgdmFsKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIGNhc2UgXCJtYXQ0XCI6XG4gICAgICAgICAgICBwV3JhcHBlci51bmlmb3JtTWF0cml4QXJyYXkodmFsTmFtZSwgdmFsKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFVua25vd24gYXJyYXkgdmFyaWFibGUgdHlwZSAke3VuaWZvcm0udmFyaWFibGVUeXBlfVtdYCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0RHJhd0dlb21ldHJ5TGVuZ3RoKGdlbzogR2VvbWV0cnkpOiBudW1iZXIge1xuICAgIHJldHVybiBnZW8uZ2V0RHJhd0xlbmd0aCgpO1xuICB9XG5cbiAgcHVibGljIGdldERyYXdHZW9tZXRyeU9mZnNldChnZW86IEdlb21ldHJ5KTogbnVtYmVyIHtcbiAgICByZXR1cm4gZ2VvLkdlb21ldHJ5T2Zmc2V0O1xuICB9XG5cbiAgcHJpdmF0ZSBfd2hlbk1hdGVyaWFsVmFyaWFibGVOb3RGb3VuZChyZW5kZXJlcjogQmFzaWNSZW5kZXJlciwgcFdyYXBwZXI6IFByb2dyYW1XcmFwcGVyLCB1bmlmb3JtOiBJVmFyaWFibGVEZXNjcmlwdGlvbik6IHZvaWQge1xuICAgIGlmICghdW5pZm9ybS5pc0FycmF5KSB7XG4gICAgICBzd2l0Y2ggKHVuaWZvcm0udmFyaWFibGVUeXBlKSB7XG4gICAgICAgIGNhc2UgXCJmbG9hdFwiOlxuICAgICAgICAgIHBXcmFwcGVyLnVuaWZvcm1GbG9hdCh1bmlmb3JtLnZhcmlhYmxlTmFtZSwgdW5pZm9ybS52YXJpYWJsZUFubm90YXRpb25bXCJkZWZhdWx0XCJdKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNhc2UgXCJ2ZWMyXCI6XG4gICAgICAgICAgcFdyYXBwZXIudW5pZm9ybVZlY3Rvcih1bmlmb3JtLnZhcmlhYmxlTmFtZSwgdW5pZm9ybS52YXJpYWJsZUFubm90YXRpb25bXCJkZWZhdWx0XCJdKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNhc2UgXCJ2ZWMzXCI6XG4gICAgICAgICAgcFdyYXBwZXIudW5pZm9ybVZlY3Rvcih1bmlmb3JtLnZhcmlhYmxlTmFtZSwgdW5pZm9ybS52YXJpYWJsZUFubm90YXRpb25bXCJkZWZhdWx0XCJdKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNhc2UgXCJ2ZWM0XCI6XG4gICAgICAgICAgcFdyYXBwZXIudW5pZm9ybVZlY3Rvcih1bmlmb3JtLnZhcmlhYmxlTmFtZSwgdW5pZm9ybS52YXJpYWJsZUFubm90YXRpb25bXCJkZWZhdWx0XCJdKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNhc2UgXCJzYW1wbGVyMkRcIjpcbiAgICAgICAgICBsZXQgcmVnaXN0ZXJBbm5vdGF0aW9uID0gdW5pZm9ybS52YXJpYWJsZUFubm90YXRpb25bXCJyZWdpc3RlclwiXTtcbiAgICAgICAgICBsZXQgcmVnaXN0ZXI7XG4gICAgICAgICAgaWYgKHJlZ2lzdGVyQW5ub3RhdGlvbikge1xuICAgICAgICAgICAgcmVnaXN0ZXIgPSA8bnVtYmVyPnBhcnNlSW50KHJlZ2lzdGVyQW5ub3RhdGlvbiwgMTApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWdpc3RlciA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBXcmFwcGVyLnVuaWZvcm1TYW1wbGVyKHVuaWZvcm0udmFyaWFibGVOYW1lLCByZW5kZXJlci5hbHRlcm5hdGl2ZVRleHR1cmUsIHJlZ2lzdGVyKTtcbiAgICAgICAgICBpZiAodW5pZm9ybS52YXJpYWJsZUFubm90YXRpb25bXCJmbGFnXCJdKSB7XG4gICAgICAgICAgICBwV3JhcHBlci51bmlmb3JtSW50KHVuaWZvcm0udmFyaWFibGVBbm5vdGF0aW9uW1wiZmxhZ1wiXSwgMCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY2FzZSBcInNhbXBsZXJDdWJlXCI6XG4gICAgICAgICAgbGV0IHJlZ2lzdGVyQ3ViZUFubm90YXRpb24gPSB1bmlmb3JtLnZhcmlhYmxlQW5ub3RhdGlvbltcInJlZ2lzdGVyXCJdO1xuICAgICAgICAgIGxldCByZWdpc3RlckN1YmU7XG4gICAgICAgICAgaWYgKHJlZ2lzdGVyQW5ub3RhdGlvbikge1xuICAgICAgICAgICAgcmVnaXN0ZXJDdWJlID0gPG51bWJlcj5wYXJzZUludChyZWdpc3RlckN1YmVBbm5vdGF0aW9uLCAxMCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlZ2lzdGVyQ3ViZSA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBXcmFwcGVyLnVuaWZvcm1TYW1wbGVyKHVuaWZvcm0udmFyaWFibGVOYW1lLCByZW5kZXJlci5hbHRlcm5hdGl2ZUN1YmVUZXh0dXJlLCByZWdpc3RlckN1YmUpO1xuICAgICAgICAgIGlmICh1bmlmb3JtLnZhcmlhYmxlQW5ub3RhdGlvbltcImZsYWdcIl0pIHtcbiAgICAgICAgICAgIHBXcmFwcGVyLnVuaWZvcm1JbnQodW5pZm9ybS52YXJpYWJsZUFubm90YXRpb25bXCJmbGFnXCJdLCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzd2l0Y2ggKHVuaWZvcm0udmFyaWFibGVUeXBlKSB7XG4gICAgICAgIGNhc2UgXCJmbG9hdFwiOlxuICAgICAgICAgIHBXcmFwcGVyLnVuaWZvcm1GbG9hdEFycmF5KHVuaWZvcm0udmFyaWFibGVOYW1lLCB1bmlmb3JtLnZhcmlhYmxlQW5ub3RhdGlvbltcImRlZmF1bHRcIl0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwidmVjMlwiOlxuICAgICAgICBjYXNlIFwidmVjM1wiOlxuICAgICAgICBjYXNlIFwidmVjNFwiOlxuICAgICAgICAgIHBXcmFwcGVyLnVuaWZvcm1WZWN0b3JBcnJheSh1bmlmb3JtLnZhcmlhYmxlTmFtZSwgdW5pZm9ybS52YXJpYWJsZUFubm90YXRpb25bXCJkZWZhdWx0XCJdKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm1hdDRcIjpcbiAgICAgICAgICBwV3JhcHBlci51bmlmb3JtTWF0cml4QXJyYXkodW5pZm9ybS52YXJpYWJsZU5hbWUsIHVuaWZvcm0udmFyaWFibGVBbm5vdGF0aW9uW1wiZGVmYXVsdFwiXSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogVGhlIGZsYWcgd2hldGhlciB0aGlzIG1hdGVyaWFsIHNob3VsZCBiZSBjYWxsZWQgZm9yIHJlbmRlcmluZy5cbiAgKi9cbiAgcHVibGljIGdldCBFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cblxufVxuXG5leHBvcnQgZGVmYXVsdCBNYXRlcmlhbDtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
