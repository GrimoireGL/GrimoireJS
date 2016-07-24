import IAttributeDeclaration from "../IAttributeDeclaration";
import Component from "../Component";
import ComponentDeclaration from "../ComponentDeclaration";
import NamespacedIdentity from "../../Base/NamespacedIdentity";

class DummyComponentDeclaration extends ComponentDeclaration {
  constructor() {
    // const namespace = "http://aaaa";
    let id = new NamespacedIdentity("dummy");
    const bb: IAttributeDeclaration = { converter: "stringconverter", defaultValue: "hoge" };
    const n: { [key: string]: IAttributeDeclaration } = {};
    n["testAttr"] = bb;

    super(id, n, DummyComponent);
  }
}

class DummyComponent extends Component {

  public dummyMethod(arg: string): void {
    // this is dymmy method for testing broadcastMessage.
    console.log("dummy!! : " + arg);
    const value = this.attributes.get("testAttr").Value;
    console.log("\ttestAttr: " + value);
  }
}

export default DummyComponentDeclaration;
