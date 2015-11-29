import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Delegates = require("../../../Base/Delegates");
import TreeNodeBase = require("../../TreeNodeBase");
class LoaderNode extends GomlTreeNodeBase {
  public loaderHTML:string;

  constructor(parent: GomlTreeNodeBase) {
    super(parent);
    // this.loaderHTML = elem.innerHTML;
    this.loaderHTML = ''; // TODO: pnly
    this.attributes.defineAttribute(
      {
        "name":{
          value:undefined,
          handler:(v)=>{},
          converter:"string"
        }
      }
    )
    this.nodeManager.nodeRegister.addObject("jthree.loader",this.attributes.getValue("name"),this);
  }
}

export = LoaderNode;
