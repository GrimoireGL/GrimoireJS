import Component from "../Component";

class DummyComponent extends Component {
  public dummyMethod(arg: string): void {
    const value = this.attributes.get("testAttr").Value;
  }
}

export default DummyComponent;
