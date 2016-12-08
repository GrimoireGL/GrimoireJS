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
      converter: "StringArray",
      defaultValue: null,
      readonly: false
    },
    enabled: {
      converter: "Boolean",
      defaultValue: true,
      readonly: false
    }
  };

  public $awake(): void {
    this.node.resolveAttributesValue();
    this.__bindAttributes();
    const idAttribute = this.getAttribute("id");
    const classAttribute = this.getAttribute("class");
    idAttribute.addObserver((attr) => {
      this.node.element.id = attr.Value;
    });
    classAttribute.addObserver((attr) => {
      const v = attr.Value;
      this.node.element.className = v ? v.join(" ") : null;
    });
    this.node.element.id = idAttribute.Value;
    const v = classAttribute.Value;
    this.node.element.className = v ? v.join(" ") : null;
    this.getAttribute("enabled").addObserver(attr => {
      if (this.node.isActive) {
        this.node.notifyActivenessUpdate();
      }
    })
  }
}

export default GrimoireComponent;
