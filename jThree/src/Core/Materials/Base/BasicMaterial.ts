import IVariableInfo = require("./IVariableInfo");
import RenderStageBase = require("../../Renderers/RenderStages/RenderStageBase");
import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");
import MaterialManager = require("./MaterialManager");
import BasicRenderer = require("../../Renderers/BasicRenderer");
import ProgramWrapper = require("../../Resources/Program/ProgramWrapper");
import Scene = require("../../Scene");
import SceneObject = require("../../SceneObject");
import ResolvedChainInfo = require("../../Renderers/ResolvedChainInfo");
import MaterialPass = require("./MaterialPass");
import Material = require('../Material');
import Delegates = require("../../../Base/Delegates");
import IMaterialConfigureArgument = require("./IMaterialConfigureArgument");

class BasicMaterial extends Material {
    private _passes: MaterialPass[] = [];

    private _uniformRegisters: Delegates.Action4<WebGLRenderingContext, ProgramWrapper, IMaterialConfigureArgument, { [key: string]: IVariableInfo }>[] = [];

    constructor(sourceString: string) {
        super();
        this._parseMaterialDocument(sourceString);
    }

    /**
* Apply configuration of program.
* This is used for passing variables,using programs,binding index buffer.
*/
    public configureMaterial(matArg:IMaterialConfigureArgument): void {
        //super.applyMaterialConfig(passIndex, techniqueIndex, renderStage.Renderer);
        const targetPass = this._passes[matArg.passIndex];
        targetPass.configureMaterial(matArg, this._uniformRegisters, this);
        this.__bindIndexBuffer(matArg);
    }

    private _parseMaterialDocument(source: string): void {
        var xmml = (new DOMParser()).parseFromString(source, "text/xml");
        this._materialName = xmml.querySelector("material").getAttribute("name");
        this._materialGroup = xmml.querySelector("material").getAttribute("group");

        if (!this._materialName) {
            console.error("Material name must be specified");
        }
        if (!this._materialGroup) {
            console.error("Material group must be specified!");
        }
        this._parsePasses(xmml);
        this._initializeUniformRegisters(xmml);
        this.setLoaded();
    }

    private _parsePasses(doc: Document) {
        var passes = doc.querySelectorAll("material > passes > pass");
        for (let i = 0; i < passes.length; i++) {
            var pass = passes.item(i);
            this._passes.push(new MaterialPass(pass, this._materialName, i));
        }
        this._passCount = passes.length;
    }

    private _initializeUniformRegisters(doc: Document) {
        const registersDOM = doc.querySelectorAll("material > uniform-register > register");
        for (var i = 0; i < registersDOM.length; i++) {
            const registerDOM = registersDOM.item(i);
            const registerFunction = this._materialManager.getUniformRegister(registerDOM.attributes.getNamedItem("name").value);
            if (!registerFunction) continue;
            this._uniformRegisters.push(registerFunction);
        }
    }

    protected __bindIndexBuffer(matArg: IMaterialConfigureArgument) {
        matArg.object.Geometry.IndexBuffer.getForContext(matArg.renderStage.Renderer.ContextManager).bindBuffer();
    }
    private get _materialManager(): MaterialManager {
        return JThreeContext.getContextComponent<MaterialManager>(ContextComponents.MaterialManager)
    }

    private _materialGroup: string;

    private _materialName: string;

    public get MaterialGroup() {
        return this._materialGroup;
    }

    private _passCount:number = 0;

    /**
    * Should return how many times required to render this material.
    * If you render some of model with edge,it can be 2 or greater.
    * Because it needs rendering edge first,then rendering forward shading.
    */
    public getPassCount(techniqueIndex: number) {
        return this._passCount;
    }
}

export = BasicMaterial;
