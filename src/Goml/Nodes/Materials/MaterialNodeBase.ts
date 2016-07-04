import CoreRelatedNodeBase from "../../CoreRelatedNodeBase";
import Color4 from "../../../Math/Color4";
import MaterialManager from "../../../Core/Materials/MaterialManager";
import BasicMaterial from "../../../Core/Materials/BasicMaterial";
import IVariableDescription from "../../../Core/ProgramTransformer/Base/IVariableDescription";
import AttributeDeclationBody from "../../AttributeDeclationBody";
import Vector3 from "../../../Math/Vector3";
import Vector2 from "../../../Math/Vector2";
import AttributeDeclaration from "../../AttributeDeclaration";
import Material from "../../../Core/Materials/Material";
import MaterialPass from "../../../Core/Pass/MaterialPass";
import GomlAttribute from "../../GomlAttribute";
import TextureNode from "../../Nodes/Texture/TextureNode";
import CubeTextureNode from "../../Nodes/Texture/CubeTextureNode";

class MaterialNodeBase<T extends Material> extends CoreRelatedNodeBase<T> {
  protected __groupPrefix: string = "material";

  private _name: string = "";

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

  protected __onMount(): void {
    super.__onMount();
  }

  /**
   * Construct material. This method must be overridden.
   * @return {Material} [description]
   */
  protected __setMaterial(material: T, callbackfn: () => void): void {
    this.target = material;
    this._name = this.attributes.getValue("name");
    this.target.on("ready", () => {
      this._generateAttributeForPasses();
      this.nodeExport(this._name);
      callbackfn();
    });
  }

  protected get Material(): T {
    return this.target;
  }

  protected __getMaterialFromMatName(name: string): BasicMaterial {
    return MaterialManager.constructMaterial(name);
  }

  private _onNameAttrChanged(attr: GomlAttribute): void {
    const name = attr.Value;
    if (typeof name !== "string") {
      throw Error(`${this.getTypeName() }: name attribute must be required.`);
    }
    this._name = name;
    if (this.target && this.target.Initialized) {
      this.nodeExport(this._name);
    }
    attr.done();
  }

  private _generateAttributeForPasses(): void {
    if (this.target["_passes"]) {
      let passes = <MaterialPass[]>this.target["_passes"];
      let passVariables = {};
      for (let i = 0; i < passes.length; i++) {
        const pass = passes[i];
        const uniforms = pass.passDescription.programDescription.uniforms;
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

  private _generateAttributeForVariable(variableName: string, variableInfo: IVariableDescription): AttributeDeclationBody {
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
        onchanged: (attr) => {
          if (attr.Value) {
            this.nodeImport("jthree.resource.Texture2D", attr.Value, (node: TextureNode) => {
              if (node) {
                this.target.shaderVariables[variableName] = node.target;
                attr.done();
              } else {
                // when texture node removed
              }
            });
          }
        }
      };
    }
    if (variableInfo.variableType === "samplerCube") {
      return {
        converter: "string",
        value: "",
        onchanged: (attr) => {
          if (attr.Value) {
            this.nodeImport("jthree.resource.TextureCube", attr.Value, (node: CubeTextureNode) => {
              if (node) {
                this.target.shaderVariables[variableName] = node.target;
                attr.done();
              } else {
                // when texture node removed
              }
            });
          }
        }
      };
    }
    if (!converter) {
      console.warn(`Variable forwarding for ${variableInfo.variableType} is not implemented yet. Attribute declaration of ${variableInfo.variableName} was skipped.`);
      return undefined;
    }
    return {
      converter: converter,
      value: initialValue,
      onchanged: (attr) => {
        this.target.shaderVariables[variableName] = attr.Value;
        attr.done();
      }
    };
  }
}

export default MaterialNodeBase;
