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

    private static xmlSource: string
    = `<?xml version="1.0" encoding="UTF-8"?>
  <material name="jthree.basic.material1" group="jthree.materials.forematerial" order="300">
    <uniform-register>
      <register name="jthree.basic.matrix"/>
    </uniform-register>
    <passes>
      <pass>
        <blend src="1" dest="1"/>
        <depth enabled="false"/>
        <cull enabled="true" orientation="ccw"/>
        <glsl>
          <![CDATA[
          //@import jthree.builtin.vertex

          attribute vec3 position;
          attribute vec3 normal;
          attribute vec2 uv;

          varying vec3 vNormal;
          varying  vec2 vUv;
          varying vec4 vPosition;

          vec2 calcLightUV(vec4 projectionSpacePos)
          {
             return (projectionSpacePos.xy/projectionSpacePos.w+vec2(1,1))/2.;
          }

          //@vertonly
          void main(void)
          {
            BasicVertexTransformOutput out =  basicVertexTransform(position,normal,uv,matMVP,matMV);
            gl_Position = vPosition = out.position;
            vNormal = out.normal;
            vUv = out.normal;
          }

          //@fragonly
          void main(void)
          {
            gl_FragColor = vec4(1,0,0,1);
          }
          ]]>
        </glsl>
      </pass>
    </passes>
  </material>
`;
    constructor() {
        super();
        this._parseMaterialDocument(BasicMaterial.xmlSource);
    }

    /**
* Apply configuration of program.
* This is used for passing variables,using programs,binding index buffer.
*/
    public configureMaterial(scene: Scene, renderStage: RenderStageBase, object: SceneObject, texs: ResolvedChainInfo, techniqueIndex: number, passIndex: number): void {
        //super.applyMaterialConfig(passIndex, techniqueIndex, renderStage.Renderer);
        const targetPass = this._passes[passIndex];
        const matArg = <IMaterialConfigureArgument>{
            scene: scene,
            renderStage: renderStage,
            object: object,
            textureResource: texs,
            techniqueIndex: techniqueIndex,
            passIndex: passIndex
        };
        targetPass.configureMaterial(matArg, this._uniformRegisters,this);
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

    protected __bindIndexBuffer(matArg:IMaterialConfigureArgument)
    {
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
}

export = BasicMaterial;
