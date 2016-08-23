import IAttributeDeclaration from "./IAttributeDeclaration";
import IGomlInterface from "../Interface/IGomlInterface";
import Attribute from "./Attribute";
import GomlNode from "./GomlNode";
import NamespacedDictionary from "../Base/NamespacedDictionary";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import IDObject from "../Base/IDObject";

class Component extends IDObject {
  public name: NamespacedIdentity;
  public attributes: NamespacedDictionary<Attribute>;
  public node: GomlNode;
  public element: Element;
  public enable: boolean = true;
  public get sharedObject(): NamespacedDictionary<any> {
    return this.node ? this.node.sharedObject : null;
  }
  public get tree(): IGomlInterface {
    return this.node ? this.node.treeInterface : null;
  }
  protected __addAtribute(name: string, attribute: IAttributeDeclaration): void {
    if (!attribute) {
      throw new Error("can not add attribute null or undefined.");
    }
    const attr = new Attribute(name, attribute, this);
    this.attributes.set(attr.name, attr); // TODO: NodeのAttributesにも追加するか？
  }
}

export default Component;
