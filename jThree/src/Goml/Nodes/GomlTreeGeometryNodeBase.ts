import JThreeObject=require('Base/JThreeObject');
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlLoader = require("../GomlLoader");
import JThreeID = require("../../Base/JThreeID");

class GomlTreeGeometryNode extends GomlTreeNodeBase
{
  constructor(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
  }

  private name:string;
  /**
  * GOML Attribute
  * Identical Name for geometry
  */
  get Name():string{
    this.name=this.name||this.element.getAttribute('name')||JThreeID.getUniqueRandom(10);
    return this.name;
  }

  private lazy:boolean=undefined;
  /**
  * GOML Attribute
  * If this Attribute was true, this resource will be loaded when be used first.
  */
  get Lazy():boolean
  {
    this.lazy=typeof this.lazy === 'undefined'?this.element.getAttribute('lazy').toLowerCase()=='true':this.lazy;
    return this.lazy;
  }
}

export=GomlTreeGeometryNode;
