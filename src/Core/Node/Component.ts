import Attribute from "./Attribute";
import GomlNode from "./GomlNode";
import NamespacedDictionary from "../Base/NamespacedDictionary";
import NamespacedIdentity from "../Base/NamespacedIdentity";

class Component {
  public name: NamespacedIdentity;
  public attributes: NamespacedDictionary<Attribute>;
  public node: GomlNode;
  public sharedObject: {[key: string]: any};
}

export default Component;
