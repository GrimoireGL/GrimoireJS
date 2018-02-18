import BooleanConverter from "../Converter/BooleanConverter";
import StringArrayConverter from "../Converter/StringArrayConverter";
import StringConverter from "../Converter/StringConverter";
import Component from "../Core/Component";
import { attribute, watch } from "../Core/Decorator";
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

  @attribute(StringConverter, null, "id", undefined)
  public idAttr!: string;

  @attribute("StringArray", null)
  public class!: string;

  @attribute(BooleanConverter, true, "enabled", undefined)
  public enabledAttr!: boolean;

  @watch("id", true, true)
  protected idWatch(attr: string) {
    this.node.element.id = attr ? attr : "";
  }

  @watch("class", true, true)
  protected classWatch(attr: string) {
    this.node.element.className = Array.isArray(attr) ? attr.join(" ") : "";
  }

  @watch("enabled", false, true)
  protected enabledWatch(attr: string) {
    const node = this.node;
    node["_enabled"] = !!attr;
    const p = node.parent;
    node.notifyActivenessUpdate(p ? p.isActive && node.enabled : node.enabled);
  }

  /**
   * awake
   */
  protected $awake(): void {
    const node = this.node;
    node["_enabled"] = this.getAttribute("enabled");
    node["_isActive"] = node.parent ? node.parent.isActive && node.enabled : node.enabled;
  }
}
