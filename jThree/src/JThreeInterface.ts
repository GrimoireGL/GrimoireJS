import JThreeObject = require("./Base/JThreeObject");
import JThreeContextProxy = require("./Core/JThreeContextProxy");
import JThreeContext = require("./Core/JThreeContext");
import GomlTreeNodeBase = require("./Goml/GomlTreeNodeBase");
import Delegate = require("./Delegates");
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

  public animate(attrTarget:string,valueTarget:any,duration:number,easing?:string,onComplete?:Delegate.Action0)
  {
    easing=easing||"linear";
    var t=this;
    this.target.each((n,e)=>{
      var gomlNode=t.getNode(<HTMLElement>e);
      if(gomlNode.attributes.isDefined(attrTarget))
      {
        var easingFunc=this.Context.GomlLoader.easingFunctions.get(easing);
        this.Context.addAnimater(gomlNode.attributes.getAnimater(attrTarget,this.Context.Timer.Time,duration,gomlNode.attributes.getValue(attrTarget),valueTarget,easingFunc,onComplete));
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
