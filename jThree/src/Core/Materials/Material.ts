import JThreeObjectEEWithID = require("../../Base/JThreeObjectEEWithID");
import Geometry = require("../Geometries/Base/Geometry");
import Vector4 = require("../../Math/Vector4");
import Vector3 = require("../../Math/Vector3");
import Vector2 = require("../../Math/Vector2");
import IMaterialConfigureArgument = require("./Base/IMaterialConfigureArgument");
import TextureBase = require("../Resources/Texture/TextureBase");
import Matrix = require("../../Math/Matrix");
import VectorBase = require("../../Math/VectorBase");
import ProgramWrapper = require("../Resources/Program/ProgramWrapper");
import IVariableInfo = require("./Base/IVariableInfo");
import BasicRenderer = require("../Renderers/BasicRenderer");
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
  public materialVariables: { [key: string]: any } = {};

  /**
  * Whether this material was initialized already or not.
  */
  private _initialized: boolean = false;

  /**
  * Rendering priorty
  */
  private _priorty: number;


  /**
  * Set loaded status of this material.
  * If first argument of boolean was passed,the status of loaded will be changed in that value.
  * If first argument of boolean was not passed, the status of loaded will be changed in true.
  */
  protected setLoaded(flag?: boolean) {
    flag = typeof flag === "undefined" ? true : flag;
    this._initialized = flag;
  }

  /**
   * Provides the flag this material finished loading or not.
   */
  public get Initialized(): boolean {
    return this._initialized;
  }
  /**
  * Rendering priorty of this material.
  * If render stage request materials of an specific material group, these list is sorted in this priorty value.
  * So any material with same group id having lower priorty will be rendered later.
  */
  public get Priorty(): number {
    return this._priorty;
  }

  /**
  * Group name of this material.
  * This main purpose is mainly intended to be used in RenderStage for filtering materials by puropse of material.
  */
  public get MaterialGroup(): string {
    return "jthree.materials.forematerial";
  }
  /**
  * Should return how many times required to render this material.
  * If you render some of model with edge,it can be 2 or greater.
  * Because it needs rendering edge first,then rendering forward shading.
  */
  public getPassCount(techniqueIndex: number) {
    return 1;
  }

  /**
  * Apply configuration of program.
  * This is used for passing variables,using programs,binding index buffer.
  */
  public apply(matArg: IMaterialConfigureArgument): void {
    this.emit("apply", matArg);
    return;
  }

  public registerMaterialVariables(renderer: BasicRenderer, pWrapper: ProgramWrapper, uniforms: { [key: string]: IVariableInfo }): void {
    for (let valName in uniforms) {
      let uniform = uniforms[valName];
      if (valName[0] === "_") { continue; }
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
            pWrapper.uniformVector(valName, <VectorBase>val);
            continue;
          case "mat4":
            pWrapper.uniformMatrix(valName, <Matrix>val);
            continue;
          case "float":
            pWrapper.uniformFloat(valName, <number>val);
            continue;
          case "int":
            pWrapper.uniformInt(valName, <number>val);
            continue;
          case "sampler2D":
          case "samplerCube":
            let registerAnnotation = uniform.variableAnnotation["register"];
            let register;
            if (registerAnnotation) {
              register = <number>parseInt(registerAnnotation, 10);
            } else {
              register = 0;
            }
            pWrapper.uniformSampler(valName, <TextureBase>val, register);
            if (uniform.variableAnnotation["flag"]) {
              pWrapper.uniformInt(uniform.variableAnnotation["flag"], 1);
            }
            continue;
          default:
            console.warn(`Unknown variable type ${uniform.variableType}`);
        }
      } else {
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
          default:
            console.warn(`Unknown array variable type ${uniform.variableType}[]`);
        }
      }
    }
  }

  public getDrawGeometryLength(geo: Geometry): number {
    return geo.getDrawLength();
  }

  public getDrawGeometryOffset(geo: Geometry): number {
    return geo.GeometryOffset;
  }

  private _whenMaterialVariableNotFound(renderer: BasicRenderer, pWrapper: ProgramWrapper, uniform: IVariableInfo): void {
    if (!uniform.isArray) {
      switch (uniform.variableType) {
        case "vec2":
          pWrapper.uniformVector(uniform.variableName, new Vector2(0, 0));
          return;
        case "vec3":
          pWrapper.uniformVector(uniform.variableName, new Vector3(0, 0, 0));
          return;
        case "vec4":
          pWrapper.uniformVector(uniform.variableName, new Vector4(0, 0, 0, 1));
          return;
        case "sampler2D":
          let registerAnnotation = uniform.variableAnnotation["register"];
          let register;
          if (registerAnnotation) {
            register = <number>parseInt(registerAnnotation, 10);
          } else {
            register = 0;
          }
          pWrapper.uniformSampler(uniform.variableName, renderer.alternativeTexture, register);
          if (uniform.variableAnnotation["flag"]) {
            debugger;
            pWrapper.uniformInt(uniform.variableAnnotation["flag"], 0);
          }
          return;
      }
    }
  }

  /**
  * The flag whether this material should be called for rendering.
  */
  public get Enabled(): boolean {
    return true;
  }


}

export = Material;
