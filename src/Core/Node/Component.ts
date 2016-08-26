import IAttributeDeclaration from "./IAttributeDeclaration";
import IGomlInterface from "../Interface/IGomlInterface";
import Attribute from "./Attribute";
import GomlNode from "./GomlNode";
import NSDictionary from "../Base/NSDictionary";
import NSIdentity from "../Base/NSIdentity";
import IDObject from "../Base/IDObject";

class Component extends IDObject {
  public name: NSIdentity;
  public attributes: NSDictionary<Attribute>;
  public node: GomlNode;
  public element: Element;
  public enable: boolean = true;
  public get companion(): NSDictionary<any> {
    return this.node ? this.node.companion : null;
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
