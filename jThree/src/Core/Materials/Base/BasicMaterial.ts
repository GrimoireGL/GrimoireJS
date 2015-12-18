import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");
import MaterialManager = require("./MaterialManager");
import UniformRegisterBase = require("../Registers/UniformRegisterBase");
import BasicRenderer = require("../../Renderers/BasicRenderer");
import ProgramWrapper = require("../../Resources/Program/ProgramWrapper");
import Scene = require("../../Scene");
import SceneObject = require("../../SceneObject");
import ResolvedChainInfo = require("../../Renderers/ResolvedChainInfo");
import MaterialPass = require("./MaterialPass");
import Material = require('../Material');
import Delegates = require("../../../Base/Delegates");

class BasicMaterial extends Material {
    private _passes:MaterialPass[] = [];

    private _uniformRegisters:UniformRegisterBase[] = [];

    private static xmlSource: string
    = `<?xml version="1.0" encoding="UTF-8"?>
  <material name="jthree.basic.phong" group="jthree.basic.forematerial" order="300">
    <uniform-register>
      <register name="jthree.basic.matrix"/>
      <register name="jthree.basic.variables">
        <variable name="diffuse" type="vector"/>
        <variable name="specular" type="vector"/>
        <variable name="brightness" type="float"/>
        <variable name="ambient" type="vector"/>
        <variable name="textureUsed" type="texture"/>
        <variable name="texture" type="number"/>
      </register>
    </uniform-register>
    <attribute-register>
      <register name="jthree.basic.geometry"/>
    </attribute-register>
    <shader>
      <pass>
        <blend src="1" dest="1"/>
        <depth enabled="false"/>
        <cull enabled="true" orientation="ccw"/>
        <glsl fragment="frag" vertex="vert">
          <![CDATA[
          //@import jthree.builtin.vertex

          attribute vec3 position;
          attribute vec3 normal;
          attribute vec2 uv;

          varying vec3 vNormal;
          varying  vec2 vUv;
          varying vec4 vPosition;

          uniform sampler2D dlight;
          uniform sampler2D slight;

          uniform vec3 ambientCoefficient;

          uniform vec4 diffuse;
          uniform vec3 specular;
          uniform float brightness;
          uniform vec4 ambient;
          uniform int textureUsed;
          uniform sampler2D texture;


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
            vec2 adjuv=vUv;
            gl_FragColor=vec4(0,0,0,1);
            //gl_FragColor.rgb+=ambient.rgb;
            ////calculate light uv
            vec2 lightUV=calcLightUV(vPosition);
            gl_FragColor.rgb+=texture2D(dlight,lightUV).rgb+texture2D(slight,lightUV).rgb;
            gl_FragColor.rgb +=ambient.rgb;
          }
          ]]>
        </glsl>
      </pass>
    </shader>
  </material>
`;
    constructor() {
        super();
        this._parseMaterialDocument(BasicMaterial.xmlSource);
    }

    private _parseMaterialDocument(source: string): void {
      var parsed = (new DOMParser()).parseFromString(source,"text/xml");
      var passes = parsed.querySelectorAll("material > shader > pass");
      for (let i = 0; i < passes.length; i++) {
          var pass = passes.item(i);
          this._passes.push(new MaterialPass(pass));
      }
      this._initializeUniformRegisters(parsed);
    }

    private _initializeUniformRegisters(doc:Document)
    {
      var registersDOM = doc.querySelectorAll("material > uniform-register > register");
      for(var i = 0; i < registersDOM.length; i++)
      {
        var registerDOM = registersDOM.item(i);
        var registerConstructor = this._materialManager.getUniformRegister(registerDOM.attributes.getNamedItem("name").value);
        if(!registerConstructor)continue;
        this._uniformRegisters.push(new registerConstructor(registerDOM));
      }
    }

    private get _materialManager():MaterialManager
    {
      return JThreeContext.getContextComponent<MaterialManager>(ContextComponents.MaterialManager)
    }
}

export = BasicMaterial;
