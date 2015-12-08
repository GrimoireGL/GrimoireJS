import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Delegates = require("../../../Base/Delegates");
import TreeNodeBase = require("../../TreeNodeBase");

class LoaderNode extends GomlTreeNodeBase {
  public loaderHTML: string;

  constructor() {
    super();
    // this.loaderHTML = elem.innerHTML;
    this.loaderHTML = ''; // TODO: pnly
    this.attributes.defineAttribute({
      "name": {
        value: undefined,
        converter: "string",
      }
    });
    this.attributes.getAttribute('name').on('changed', this._onNameAttrChanged.bind(this));
  }

  private _onNameAttrChanged(): void {
    this.nodeManager.nodeRegister.addObject("jthree.loader", this.attributes.getValue("name"), this);
  }
}

export = LoaderNode;
