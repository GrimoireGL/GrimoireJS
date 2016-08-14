import IGomlInterface from "../Interface/IGomlInterface";
import Attribute from "./Attribute";
import GomlNode from "./GomlNode";
import NamespacedDictionary from "../Base/NamespacedDictionary";
import NamespacedIdentity from "../Base/NamespacedIdentity";

class Component {
  public name: NamespacedIdentity;
  public attributes: NamespacedDictionary<Attribute>;
  public node: GomlNode;
  public tree: IGomlInterface;
  public element: Element;
  public get sharedObject(): NamespacedDictionary<any> {
    return this.node ? this.node.sharedObject : null;
  }
}

export default Component;
