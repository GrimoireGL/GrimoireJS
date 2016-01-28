import GomlTreeNodeBase from "../../GomlTreeNodeBase";

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

  private _onNameAttrChanged(): void {
    this.nodeExport(this.attributes.getValue("name"));
  }
}

export default LoaderNode;
