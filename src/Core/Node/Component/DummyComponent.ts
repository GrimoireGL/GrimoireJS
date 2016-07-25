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

    const value = this.attributes.get("testAttr").Value;
  }
}

export default DummyComponentDeclaration;
