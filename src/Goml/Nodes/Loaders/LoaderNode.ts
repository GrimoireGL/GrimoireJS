import GomlTreeNodeBase from "../../GomlTreeNodeBase";
import GomlAttribute from "../../GomlAttribute";

class LoaderNode extends GomlTreeNodeBase {
  public loaderHTML: string;

  constructor() {
    super();
    // this.loaderHTML = elem.innerHTML;
    this.loaderHTML = ""; // TODO: pnly
    this.attributes.defineAttribute({
      "name": {
        value: undefined,
        converter: "string",
        onchanged: this._onNameAttrChanged,
      }
    });
  }

  private _onNameAttrChanged(attr: GomlAttribute): void {
    this.nodeExport(this.attributes.getValue("name"));
    attr.done();
  }
}

export default LoaderNode;
