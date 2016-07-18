import ComponentDeclaration from "../ComponentDeclaration";
import NamespacedIdentity from "../../Base/NamespacedIdentity";
import AttributeDeclaration from "../AttributeDeclaration";

class DummyComponent extends ComponentDeclaration {
  public get Namespace(): string {
    return "http://aaaa";
  }
  // public get RequiredAttributes(): GomlAttribute[] {
  //   let a = new GomlAttribute("name1", this.Namespace, 123);
  //   return [a];
  // }
  //
  // public get OptionalAttributes(): GomlAttribute[] {
  //   let a = new GomlAttribute("optional1", this.Namespace, 999);
  //   return [a];
  // }

  public dummyMethod(arg: string): void {
    // this is dymmy method for testing broadcastMessage.
  }
  constructor() {
    let id = new NamespacedIdentity("http://aaaa", "dummy");
    let b = new AttributeDeclaration("testAttr1", 123);
    let a: AttributeDeclaration[] = [b];
    super(id, a, null);
  }
}

export default DummyComponent;
