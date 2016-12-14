import IAttributeDeclaration from "../Node/IAttributeDeclaration";
import Component from "../Node/Component";

class GrimoireComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    id: {
      converter: "String",
      default: null,
      readonly: false
    },
    class: {
      converter: "StringArray",
      default: null,
      readonly: false
    },
    enabled: {
      converter: "Boolean",
      default: true,
      readonly: false
    }
  };

  public $awake(): void {
    this.node.resolveAttributesValue();
    this.getAttributeRaw("id").addObserver((attr) => {
      this.node.element.id = attr.Value;
    });
    this.getAttributeRaw("class").addObserver((attr) => {
      this.node.element.className = attr.Value.join(" ");
    });
    this.getAttributeRaw("enabled").addObserver(attr => {
      if (this.node.isActive) {
        this.node.notifyActivenessUpdate();
      }
    })
  }
}

export default GrimoireComponent;
