import JThreeObject=require('Base/JThreeObject');
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import Scene = require("../../../Core/Scene");
import JThreeContextProxy=require('../../../Core/JThreeContextProxy');
import JThreeContext=require('../../../Core/JThreeContext');
class TemplateNode extends GomlTreeNodeBase
{

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
  }

}

export=TemplateNode;
