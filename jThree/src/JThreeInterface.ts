import JThreeObject = require("./Base/JThreeObject");
import JThreeContextProxy = require("./Core/JThreeContextProxy");
import JThreeContext = require("./Core/JThreeContext");
import GomlTreeNodeBase = require("./Goml/GomlTreeNodeBase");
import Delegate = require("./Base/Delegates");
/**
 * Provides jQuery like API for jThree.
 */
class JThreeInterface extends JThreeObject {
  constructor(jq: JQuery) {
    super();
    this.target = jq;
  }
  private queuedActions: Delegate.Action0[] = [];

  public dequeue() {
    this.queuedActions.shift();
    this.isExecuting = false;
    this.tryStartQueue();
    return this;
  }

  private tryStartQueue() {
    if (!this.isExecuting && this.queuedActions.length > 0) {
      this.isExecuting = true;
      this.queuedActions[0].call(this);
    }
  }

  public queue(act: Delegate.Action0): JThreeInterface {
    this.queuedActions.push(act);
    this.tryStartQueue();
    return this;
  }

  public delay(time: number): JThreeInterface {
    this.queue(() => {
      window.setTimeout((t) => { t.dequeue(); }, time, this);
    });
    return this;
  }

  private isExecuting = false;

  private target: JQuery;

  public attr(attrName: string);
  public attr(attrTargets: { [key: string]: any });
  public attr(attrName: string, val: Delegate.Func2<number,string,any>);
  public attr(attrName:string,val:any);
  public attr(attrTarget: { [key: string]: any }|string,val?:Delegate.Func2<number,string,any>|any): JThreeInterface|any
  {
      if (typeof attrTarget === "string")
      {
          if (val) {
              if (typeof val === "function") {
                  var f1 = (attrName: string, func: Delegate.Func2<number, string, any>) =>
                  {
                      this.target.each((n, e) =>
                      {
                          var gomlNode = JThreeInterface.getNode(<HTMLElement>e);;
                          this.setAttrValue(attrName,func(n,attrName), <HTMLElement>e, gomlNode);
                      });
                      this.dequeue();
                  }
                  this.queue(() => { f1(attrTarget,val); });
                  return this;
              } else {
                  var f2 = (attrName: string, value:any) =>
                  {
                      this.target.each((n, e) => {
                          var gomlNode = JThreeInterface.getNode(<HTMLElement>e);;
                          this.setAttrValue(attrName,  value, <HTMLElement>e, gomlNode);
                      });
                      this.dequeue();
                  }
                  this.queue(() => { f2(attrTarget, val); });
                  return this;
              }
          }else
            return this.getAttr(<string>attrTarget);
      }else if (typeof attrTarget === "object") {
          var f = (attrTarget: { [key: string]: any }) => {
              this.target.each((n, e) => {
                  var gomlNode = JThreeInterface.getNode(<HTMLElement>e);
                  for (var attrName in attrTarget) {
                      var value = attrTarget[attrName];
                      this.setAttrValue(attrName, value, <HTMLElement>e, gomlNode);
                  }
              });
              this.dequeue();
          }
          this.queue(() => { f(<{ [key: string]: any }>attrTarget); });
          return this;
      }
  }

  private getAttr(attrName:string):any {
      if (this.target.length === 0) return undefined;
      var target = this.target[0];
      var targetGoml = JThreeInterface.getNode(target);
      if (targetGoml.attributes.isDefined(attrName))
      {
          return targetGoml.attributes.getValue(attrName);
      } else
      {
          return target.attributes.getNamedItem(attrName).value;
      }
  }

  private setAttrValue(attrName: string, attrValue: any,e:HTMLElement,gomlNode:GomlTreeNodeBase){
      if (gomlNode.attributes.isDefined(attrName))
      {
          gomlNode.attributes.setValue(attrName, attrValue);
      } else
      {
          e.setAttribute(attrName, attrValue);
      }
  }

  public animate(attrTarget: { [key: string]: any }, duration: number, easing?: string, onComplete?: Delegate.Action0): JThreeInterface {
    var t = this;
    var f = (attrTarget: { [key: string]: any }, duration: number, easing?: string, onComplete?: Delegate.Action0) => {
      easing = easing || "linear";
      for (var i = 0; i < t.target.length; i++) {
        var e = this.target[i];
        for (var attrName in attrTarget) {
          var value = attrTarget[attrName];
          var gomlNode = JThreeInterface.getNode(<HTMLElement>e);
          if (gomlNode.attributes.isDefined(attrName)) {
            var easingFunc = JThreeInterface.Context.GomlLoader.Configurator.getEasingFunction(easing);
            JThreeInterface.Context.addAnimater(gomlNode.attributes.getAnimater(attrName, JThreeInterface.Context.Timer.Time, duration, gomlNode.attributes.getValue(attrName), value, easingFunc, () => {
              if (onComplete) onComplete();
              t.dequeue();
            }));
          }
        }
      }
    }
    this.queue(() => f(attrTarget, duration, easing, onComplete));
    return this;
  }

  public on(eventName:string,eventHandler:Delegate.Action1<any>)
  {
    for (var i = 0; i < this.target.length; i++) {
      var e = this.target[i];
      var node = JThreeInterface.getNode(e);
      if(!node.events[eventName])node.events[eventName]=[];
      node.events[eventName].push(eventHandler);
    }
  }


  public find(attrTarget: string): JThreeInterface {
    return new JThreeInterface(this.target.find(attrTarget));
  }

  public append(target: string): JThreeInterface {
    var newTarget: JQuery = $(target);
    this.target.each((i,e)=>{
          JThreeInterface.Context.GomlLoader.append(newTarget,<HTMLElement>e);
    });
    return new JThreeInterface(newTarget);;
  }

  private static getNode(elem: HTMLElement): GomlTreeNodeBase {
    var id = elem.getAttribute("x-j3-id");
    return JThreeInterface.Context.GomlLoader.getNode(id);
  }

  private static get Context(): JThreeContext {
    return JThreeContextProxy.getJThreeContext();
  }
}

export =JThreeInterface;
