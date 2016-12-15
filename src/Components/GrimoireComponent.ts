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
    this.getAttributeRaw("id").watch((attr) => {
      this.node.element.id = attr ? attr : "";
    }, true);
    this.getAttributeRaw("class").watch((attr) => {
      this.node.element.className = Array.isArray(attr) ? attr.join(" ") : "";
    }, true);
    this.getAttributeRaw("enabled").watch(attr => {
      if (this.node.isActive) {
        this.node.notifyActivenessUpdate();
      }
    });
  }
}

export default GrimoireComponent;
