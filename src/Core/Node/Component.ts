import Attribute from "./Attribute";
import GomlNode from "./GomlNode";
import NamespacedDictionary from "../Base/NamespacedDictionary";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import ComponentDeclaration from "./ComponentDeclaration";

class Component {
  // public declaration: ComponentDeclaration;//いらない？
  // public name: NamespacedIdentity;
  // public attributes: NamespacedDictionary<Attribute>;
  // public node: GomlNode;

  constructor(public name: NamespacedIdentity, public attributes: NamespacedDictionary<Attribute>, public node: GomlNode) {

  }
}

export default Component;
