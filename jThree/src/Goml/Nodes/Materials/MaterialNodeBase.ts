import Color4 = require("../../../Math/Color4");
import MaterialManager = require("../../../Core/Materials/Base/MaterialManager");
import JThreeContext = require("../../../JThreeContext");
import BasicMaterial = require("../../../Core/Materials/Base/BasicMaterial");
import ContextComponents = require("../../../ContextComponents");
import IVariableInfo = require("../../../Core/Materials/Base/IVariableInfo");
import AttributeDeclationBody = require("../../AttributeDeclationBody");
import Vector3 = require("../../../Math/Vector3");
import Vector2 = require("../../../Math/Vector2");
import AttributeDeclaration = require("../../AttributeDeclaration");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Material = require("../../../Core/Materials/Material");
import MaterialPass = require("../../../Core/Materials/Base/MaterialPass");
import GomlAttribute = require("../../GomlAttribute");
import TextureNode = require("../../Nodes/Texture/TextureNode");
import CubeTextureNode = require("../../Nodes/Texture/CubeTextureNode");

class MaterialNodeBase extends GomlTreeNodeBase {
  protected groupPrefix: string = "material";

  private targetMaterial: Material;

  constructor() {
    super();
    this.attributes.defineAttribute({
      "name": {
        value: undefined,
        converter: "string",
        onchanged: this._onNameAttrChanged,
      }
    });
  }

  /**
  * The material this node managing.
  */
  public get TargetMaterial(): Material {
    return this.targetMaterial;
  }

  protected onMount() {
    super.onMount();
    this.targetMaterial = this.ConstructMaterial();
    this._generateAttributeForPasses();
  }

  /**
   * Construct material. This method must be overridden.
   * @return {Material} [description]
   */
  protected ConstructMaterial(): Material {
    return null;
  }

  protected __getMaterialFromMatName(name: string): BasicMaterial {
    return JThreeContext.getContextComponent<MaterialManager>(ContextComponents.MaterialManager).constructMaterial(name);
  }

  private _onNameAttrChanged(attr: GomlAttribute): void {
    const name = attr.Value;
    if (typeof name !== "string") {
      throw Error(`${this.getTypeName()}: name attribute must be required.`);
    }
    this.nodeExport(name);
  }

  private _generateAttributeForPasses(): void {
    if (this.targetMaterial["_passes"]) {
      let passes = <MaterialPass[]>this.targetMaterial["_passes"];
      let passVariables = {};
      for (let i = 0; i < passes.length; i++) {
        const pass = passes[i];
        const uniforms = pass.parsedProgram.uniforms;
        for (let variableName in uniforms) {
          if (variableName[0] === "_") {
            continue; // Ignore system variables
          }
          if (!passVariables[variableName]) {
            // When the pass variable are not found yet.
            passVariables[variableName] = uniforms[variableName];
          } else {
            // When the pass variable are already found.
            if (passVariables[variableName] === uniforms[variableName]) {
              continue; // When the variable was found and same type.(This is not matter)
            } else { // When the variable was already found and
              console.error("Material can not contain same variables even if these variable are included in different passes");
            }
          }
        }
      }
      let attributes: AttributeDeclaration = {};
      for (let variableName in passVariables) {
        const attribute = this._generateAttributeForVariable(variableName, passVariables[variableName]);
        if (attribute) {
          attributes[variableName] = attribute;
        }
      }
      this.attributes.defineAttribute(attributes);
    }
  }

  private _generateAttributeForVariable(variableName: string, variableInfo: IVariableInfo): AttributeDeclationBody {
    let converter;
    let initialValue;
    if (variableInfo.variableType === "vec2") { // TODO converter name should be vec2,vec3 or vec4, same as name of vector variable in GLSL.
      converter = "vec2";
      initialValue = Vector2.Zero;
    }
    if (variableInfo.variableType === "vec3") {
      converter = "color3";
      initialValue = Vector3.Zero;
    }
    if (variableInfo.variableType === "vec4") {
      converter = "color4"; // TODO add vector4 converter
      initialValue = new Color4(0, 0, 0, 1);
    }
    if (variableInfo.variableType === "float") {
      converter = "float"; // This should be float
      initialValue = 0.0;
    }
    if (variableInfo.variableType === "sampler2D") {
      return {
        converter: "string",
        value: "",
        onchanged: (v) => {
          if (v.Value) {
            this.nodeImport("jthree.resource.texture2d", v.Value, (node: TextureNode) => {
              this.targetMaterial.materialVariables[variableName] = node.TargetTexture;
            });
          }
        }
      };
    }
    if (variableInfo.variableType === "samplerCube") {
      return {
        converter: "string",
        value: "",
        onchanged: (v) => {
          if (v.Value) {
            this.nodeImport("jthree.resource.cubetexture", v.Value, (node: CubeTextureNode) => {
              this.targetMaterial.materialVariables[variableName] = node.TargetTexture;
            });
          }
        }
      };
    }
    if (!converter) {
      return;
    }
    return {
      converter: converter,
      value: initialValue,
      onchanged: (v) => {
        this.targetMaterial.materialVariables[variableName] = v.Value;
      }
    };
  }
}

export = MaterialNodeBase;
