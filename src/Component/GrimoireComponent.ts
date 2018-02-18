import BooleanConverter from "../Converter/BooleanConverter";
import StringConverter from "../Converter/StringConverter";
import Component from "../Core/Component";
import { attribute } from "../Core/Decorator";
import Identity from "../Core/Identity";
import Namespace from "../Core/Namespace";
import { __NAMESPACE__ } from "../metaInfo";

/**
 * Basic Component for all node.
 */
export default class GrimoireComponent extends Component {

  /**
   * component name.
   */
  public static componentName: Identity = Namespace.define(__NAMESPACE__).for("GrimoireComponent");

  /**
   * attributes
   */
  public static attributes = {
    id: {
      converter: StringConverter,
      default: null,
    },
    class: {
      converter: "StringArray",
      default: null,
    },
    enabled: {
      converter: BooleanConverter,
      default: true,
    },
  };

  // @attribute("S", null)
  // public id = "aaa";

  // @attribute("S", null)
  // public class = "aaa";

  /**
   * awake
   */
  protected $awake(): void {
    const node = this.node;
    this.getAttributeRaw(GrimoireComponent.attributes.id).watch((attr) => {
      node.element.id = attr ? attr : "";
    }, true, true);
    this.getAttributeRaw(GrimoireComponent.attributes.class).watch((attr) => {
      node.element.className = Array.isArray(attr) ? attr.join(" ") : "";
    }, true, true);
    this.getAttributeRaw(GrimoireComponent.attributes.enabled).watch(attr => {
      node["_enabled"] = !!attr;
      const p = node.parent;
      node.notifyActivenessUpdate(p ? p.isActive && node.enabled : node.enabled);
    }, false, true);
    node["_enabled"] = this.getAttribute("enabled");
    node["_isActive"] = node.parent ? node.parent.isActive && node.enabled : node.enabled;
  }
}
