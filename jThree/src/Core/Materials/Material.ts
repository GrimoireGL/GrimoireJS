import IMaterialConfigureArgument = require("./Base/IMaterialConfigureArgument");
import RendererBase = require("../Renderers/RendererConfigurator/RendererConfiguratorBase");
import TextureBase = require("../Resources/Texture/TextureBase");

import Matrix = require("../../Math/Matrix");
import VectorBase = require("../../Math/VectorBase");
import ProgramWrapper = require("../Resources/Program/ProgramWrapper");
import IVariableInfo = require("./Base/IVariableInfo");
import JThreeObjectWithID = require("../../Base/JThreeObjectWithID");
import BasicRenderer = require("../Renderers/BasicRenderer");
import SceneObject = require("../SceneObject");
import GLCullMode = require("../../Wrapper/GLCullMode");
import GLFeatureType = require("../../Wrapper/GLFeatureType");
import ShaderType = require("../../Wrapper/ShaderType");
import Program = require('../Resources/Program/Program');
import Scene = require('../Scene');
import ResolvedChainInfo = require('../Renderers/ResolvedChainInfo');
import Geometry = require('../Geometries/Geometry')
import ResourceManager = require("../ResourceManager");
import JThreeContext = require("../../JThreeContext");
import ContextComponents = require("../../ContextComponents");
import IMaterialConfig = require("./IMaterialConfig");
import RenderStageBase = require("../Renderers/RenderStages/RenderStageBase");
/**
* Basement class for any Materials.
* Material is basically meaning what shader will be used or what shader variable will passed.
* In jThree v3,these renderer are implemented with deferred rendering method.
* That method needs to use a lot of shaders and shader variables.
* Therefore,materials of jThree is not only visceral Materials.
* Some of materials are intended to use in deferred rendering stage(G-buffer generation stage is one of example).
* This is one of significant difference between jThree and the other Web3D libraries in Material.
*/
class Material extends JThreeObjectWithID {
    /**
    * Whether this material was initialized already or not.
    */
    private initialized: boolean = false;

    public materialVariables: { [key: string]: any } = {};

    /**
    * Set loaded status of this material.
    * If first argument of boolean was passed,the status of loaded will be changed in that value.
    * If first argument of boolean was not passed, the status of loaded will be changed in true.
    */
    protected setLoaded(flag?: boolean) {
        flag = typeof flag === 'undefined' ? true : flag;
        this.initialized = flag;
    }

    /**
     * Provides the flag this material finished loading or not.
     */
    public get Initialized(): boolean {
        return this.initialized;
    }

    constructor() {
        super();
    }

    /**
    * Rendering priorty
    */
    private priorty: number;
    /**
    * Rendering priorty of this material.
    * If render stage request materials of an specific material group, these list is sorted in this priorty value.
    * So any material with same group id having lower priorty will be rendered later.
    */
    public get Priorty(): number {
        return this.priorty;
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
    * Initialize shader programs.
    * @param vsid the vertex shader id
    * @param fsid the fragment shader id
    * @param pid the program id which is link of the vertex shader and fragment shader
    * @param vscode the vertex shader source code
    * @param fscode the fragment shader source code
    */
    protected loadProgram(vsid: string, fsid: string, pid: string, vscode: string, fscode: string): Program {
        var rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
        var vShader = rm.createShader(vsid, vscode, ShaderType.VertexShader);
        var fShader = rm.createShader(fsid, fscode, ShaderType.FragmentShader);
        vShader.loadAll(); fShader.loadAll();
        return rm.createProgram(pid, [vShader, fShader]);
    }
    /**
    * Apply configuration of program.
    * This is used for passing variables,using programs,binding index buffer.
    */
    public configureMaterial(matArg:IMaterialConfigureArgument): void {
        return;
    }

    public registerMaterialVariables(renderer: BasicRenderer, pWrapper: ProgramWrapper, uniforms: { [key: string]: IVariableInfo }): void {
        for (let valName in uniforms) {
            let uniform = uniforms[valName];
            if (valName[0] == "_") continue;
            const val = this.materialVariables[valName];
            if (typeof val === "undefined"||val == null) {
                this._whenMaterialVariableNotFound(renderer, pWrapper, uniform);
                continue;
            }
            if (uniform.variableType === "vec2" || uniform.variableType === "vec3" || uniform.variableType === "vec4") {
                pWrapper.uniformVector(valName, <VectorBase>val);
            }
            if (uniform.variableType === "mat4") {
                pWrapper.uniformMatrix(valName, <Matrix>val);
            }
            if (uniform.variableType === "float") {
                pWrapper.uniformFloat(valName, <number>val)
            }
            if (uniform.variableType === "int") {
                pWrapper.uniformInt(valName, <number>val);
            }
            if (uniform.variableType === "sampler2D") {
                let registerAnnotation = uniform.variableAnnotation["register"];
                let register;
                if (registerAnnotation) {
                    register = <number>parseInt(registerAnnotation, 10);
                } else {
                    register = 0;
                }
                pWrapper.uniformSampler2D(valName, <TextureBase>val, register);
            }
        }
    }

    private _whenMaterialVariableNotFound(renderer: BasicRenderer, pWrapper: ProgramWrapper, uniform: IVariableInfo): void {
        if (uniform.variableType === "sampler2D") {
            let registerAnnotation = uniform.variableAnnotation["register"];
            let register;
            if (registerAnnotation) {
                register = <number>parseInt(registerAnnotation, 10);
            } else {
                register = 0;
            }
            pWrapper.uniformSampler2D(uniform.variableName, renderer.alternativeTexture, register);
        }
    }

    /**
    * The flag whether this material should be called for rendering.
    */
    public get Enabled(): boolean {
        return true;
    }

    public getDrawGeometryLength(geo: Geometry): number {
        return geo.IndexCount;
    }

    public getDrawGeometryOffset(geo: Geometry): number {
        return geo.GeometryOffset;
    }
}

export =Material;
