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
    const node = this.node!;
    node.resolveAttributesValue();
    this.getAttributeRaw("id").watch((attr) => {
      node.element.id = attr ? attr : "";
    }, true, true);
    this.getAttributeRaw("class").watch((attr) => {
      node.element.className = Array.isArray(attr) ? attr.join(" ") : "";
    }, true, true);
    this.getAttributeRaw("enabled").watch(attr => {
      node["_enabled"] = attr;
      const p = node.parent;
      node.notifyActivenessUpdate(p ? p.isActive && node.enabled : node.enabled);
    }, false, true);
    node["_enabled"] = this.getAttribute("enabled");
    node["_isActive"] = node.parent ? node.parent.isActive && node.enabled : node.enabled;
  }
}

export default GrimoireComponent;
