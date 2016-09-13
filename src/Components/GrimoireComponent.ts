import IAttributeDeclaration from "../Node/IAttributeDeclaration";
import Component from "../Node/Component";

class GrimoireComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    id: {
      converter: "String",
      defaultValue: null,
      readonly: false,
      responsively: true
    },
    class: {
      converter: "StringArray", // TODO:atringArray
      defaultValue: null,
      readonly: false,
      responsively: true
    }
  };

  public $awake(): void {
    // this.node.resolveAttributesValue();
  }
}

export default GrimoireComponent;
