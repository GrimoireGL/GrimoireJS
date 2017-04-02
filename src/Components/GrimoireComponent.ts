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
    }, true, true);
    this.getAttributeRaw("class").watch((attr) => {
      this.node.element.className = Array.isArray(attr) ? attr.join(" ") : "";
    }, true, true);
    this.getAttributeRaw("enabled").watch(attr => {
      this.node["_enabled"] = attr;
      const p = this.node.parent;
      this.node.notifyActivenessUpdate(p ? p.isActive && this.node.enabled : this.node.enabled);
    }, false, true);
    this.node["_enabled"] = this.getAttribute("enabled");
    this.node["_isActive"] = this.node.parent ? this.node.parent.isActive && this.node.enabled : this.node.enabled;
  }
}

export default GrimoireComponent;
