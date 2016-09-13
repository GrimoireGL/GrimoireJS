import IAttributeDeclaration from "../Node/IAttributeDeclaration";
import Component from "../Node/Component";

class GrimoireComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    id: {
      converter: "String",
      defaultValue: null,
      readonly: false
    },
    class: {
      converter: "StringArray", // TODO:atringArray
      defaultValue: null,
      readonly: false
    }
  };

  public $awake(): void {
    // this.node.resolveAttributesValue();
    this.getAttribute("id").addObserver((attr) => {
      this.node.element.id = attr.Value;
    });
    this.getAttribute("class").addObserver((attr) => {
      this.node.element.className = attr.Value.join(" ");
    });
  }
}

export default GrimoireComponent;
