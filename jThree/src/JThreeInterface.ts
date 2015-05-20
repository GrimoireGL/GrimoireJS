import JThreeObject = require("./Base/JThreeObject");
import JThreeContextProxy = require("./Core/JThreeContextProxy");
import JThreeContext = require("./Core/JThreeContext");
import GomlTreeNodeBase = require("./Goml/GomlTreeNodeBase");
class JThreeInterface extends JThreeObject
{
  constructor(jq:JQuery)
  {
    super();
    this.target=jq;
  }

  private target:JQuery;

  public attr(attrTarget:string,value:any):void
  {
    var t=this;
    this.target.each((n,e)=>{
      var gomlNode=t.getNode(<HTMLElement>e);
      if(gomlNode.attributes.isDefined(attrTarget))
      {
        gomlNode.attributes.setValue(attrTarget,value);
      }else{
        e.setAttribute(attrTarget,value);
      }
    });
  }

  private getNode(elem:HTMLElement):GomlTreeNodeBase
  {
    var id=elem.getAttribute('x-j3-id');
    return this.Context.GomlLoader.getNode(id);
  }

  private get Context():JThreeContext
  {
    return JThreeContextProxy.getJThreeContext();
  }
}

export=JThreeInterface;
