import JThreeObject=require('Base/JThreeObject');
import GomlTreeGeometryNodeBase = require("./GomlTreeGeometryNodeBase");
import GomlLoader = require("../GomlLoader");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");

class GomlTreeTriNode extends GomlTreeGeometryNodeBase
{
  constructor(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
  }

  
}

export=GomlTreeTriNode;
