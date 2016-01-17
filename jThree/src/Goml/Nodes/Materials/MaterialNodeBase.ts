import Color4 = require("../../../Math/Color4");
import MaterialManager = require("../../../Core/Materials/Base/MaterialManager");
import JThreeContext = require("../../../JThreeContext");
import BasicMaterial = require("../../../Core/Materials/Base/BasicMaterial");
import ContextComponents = require("../../../ContextComponents");
import IVariableInfo = require("../../../Core/Materials/Base/IVariableInfo");
import AttributeDeclationBody = require("../../AttributeDeclationBody");
import Vector4 = require("../../../Math/Vector4");
import Vector3 = require("../../../Math/Vector3");
import Vector2 = require("../../../Math/Vector2");
import AttributeDeclaration = require("../../AttributeDeclaration");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Material = require('../../../Core/Materials/Material');
import JThreeID = require("../../../Base/JThreeID");
import MaterialPass = require("../../../Core/Materials/Base/MaterialPass");

class MaterialNodeBase extends GomlTreeNodeBase {
  public targetMaterial: Material;

  protected ConstructMaterial(): Material {
    return null;
  }

  constructor() {
    super();
    this.attributes.defineAttribute({
      'name': {
        value: undefined,
        converter: 'string',
        onchanged: this._onNameAttrChanged,
      }
    });
  }

  private _onNameAttrChanged(attr): void {
    this.name = attr.Value;
  }

  protected groupPrefix: string = 'material';

  protected __getMaterialFromMatName(name:string):BasicMaterial {
    return JThreeContext.getContextComponent<MaterialManager>(ContextComponents.MaterialManager).constructMaterial(name);
  }

  protected onMount() {
    super.onMount();
    this.name = this.attributes.getValue('name'); // TODO: pnly
    this.targetMaterial = this.ConstructMaterial();
    this._generateAttributeForPasses();
    this.nodeExport(this.Name);
  }

  private _generateAttributeForPasses(): void {
    if (this.targetMaterial["_passes"]) {
      let passes = <MaterialPass[]>this.targetMaterial["_passes"];
      let passVariables = {};
      for (let i = 0; i < passes.length; i++) {
        const pass = passes[i];
        const uniforms = pass.parsedProgram.uniforms;
        for (let variableName in uniforms) {
          if (variableName[0] == "_") continue;//Ignore system variables
          if (!passVariables[variableName]) {
            //When the pass variable are not found yet.
            passVariables[variableName] = uniforms[variableName];
          }
          else {
            //When the pass variable are already found.
            if (passVariables[variableName] == uniforms[variableName]) continue;//When the variable was found and same type.(This is not matter)
            else//When the variable was already found and
              console.error("Material can not contain same variables even if these variable are included in different passes");
          }
        }
      }
      let attributes: AttributeDeclaration = {};
      for (let variableName in passVariables) {
        const attribute = this._generateAttributeForVariable(variableName, passVariables[variableName]);
        if (attribute) attributes[variableName] = attribute;
      }
      this.attributes.defineAttribute(attributes);
    }
  }

  private _generateAttributeForVariable(variableName: string, variableInfo: IVariableInfo): AttributeDeclationBody {
    let converter;
    let initialValue;
    if (variableInfo.variableType == "vec2") { // TODO converter name should be vec2,vec3 or vec4, same as name of vector variable in GLSL.
      converter = "vec2";
      initialValue = Vector2.Zero;
    }
    if (variableInfo.variableType == "vec3") {
      converter = "color3";
      initialValue = Vector3.Zero;
    }
    if (variableInfo.variableType == "vec4") {
      converter = "color4";//TODO add vector4 converter
      initialValue = new Color4(0,0,0,1);
    }
    if (variableInfo.variableType == "float") {
      converter = "float"; // This should be float
      initialValue = 0.0;
    }
    if (!converter) return undefined;
    return {
      converter: converter,
      value: initialValue,
      onchanged: (v) => {
        this.targetMaterial.materialVariables[variableName] = v.Value;
      }
    };
  }

  private name: string;
  /**
  * GOML Attribute
  * Identical Name for camera
  */
  public get Name(): string {
    this.name = this.name || JThreeID.getUniqueRandom(10);
    return this.name;
  }

}

export = MaterialNodeBase;
