import BooleanConverter from "../Converter/BooleanConverter";
import StringArrayConverter from "../Converter/StringArrayConverter";
import StringConverter from "../Converter/StringConverter";
import Component from "../Core/Component";
import { attribute, watch } from "../Core/Decorator";
import Identity from "../Core/Identity";
import Namespace from "../Core/Namespace";
import { __NAMESPACE__ } from "../metaInfo";

/**
 * Default component for all nodes.
 * GrimoireComponent provides mandatory features for all nodes like enabled handling, class Names for querying and so on.
 */
export default class GrimoireComponent extends Component {

  /**
   * component name.
   */
  public static componentName: Identity = Namespace.define(__NAMESPACE__).for("GrimoireComponent");

  /**
   * ID of node.
   * By using query beginning with #, you can fetch the node.
   */
  @attribute(StringConverter, null)
  public id!: string;

  /**
   * Class of node.
   * By using query beginning with ., you can fetch the nodes.
   */
  @attribute("StringArray", null)
  public class!: string;

  /**
   * Enabled flag of this node.
   * If this node was disabled, every components included in this node or children nodes of this node will not receive any messages until re-enabled.
   */
  @attribute(BooleanConverter, true, "enabled")
  public nodeEnabled!: boolean;

  @watch("id", true, true)
  protected __onIDChanged(attr: string) {
    this.node.element.id = attr ? attr : "";
  }

  @watch("class", true, true)
  protected __onClassChanged(attr: string) {
    this.node.element.className = Array.isArray(attr) ? attr.join(" ") : "";
  }

  @watch("enabled", false, true)
  protected __onEnabledChanged(attr: string) {
    const node = this.node;
    node["_enabled"] = !!attr;
    const p = node.parent;
    node.notifyActivenessUpdate(p ? p.isActive && node.enabled : node.enabled);
  }

  protected $awake(): void {
    const node = this.node;
    node["_enabled"] = this.getAttribute("enabled");
    node["_isActive"] = node.parent ? node.parent.isActive && node.enabled : node.enabled;
  }
}
