import JThreeObject=require('Base/JThreeObject');
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import Scene = require("../../../Core/Scene");
import JThreeContextProxy=require('../../../Core/JThreeContextProxy');
import JThreeContext=require('../../../Core/JThreeContext');
class TemplateNode extends GomlTreeNodeBase
{
  private templateGoml:string="";

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
      var name=elem.getAttribute("name");
      if(name)
      {
        loader.nodeRegister.addObject("jthree.template",name,this);
        this.templateGoml=elem.innerHTML;
        console.log(this.templateGoml);
      }else{
        console.error("template tag should be specified name.")
      }
  }
  
}

export=TemplateNode;
