import JThreeObject = require("./Base/JThreeObject");
import JThreeContextProxy = require("./Core/JThreeContextProxy");
import JThreeContext = require("./Core/JThreeContext");
import GomlTreeNodeBase = require("./Goml/GomlTreeNodeBase");
import Delegate = require("./Base/Delegates");
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

  public attr(attrTarget: { [key: string]: any }): JThreeInterface {
    var f = (attrTarget:{[key:string]:any}) => {
      var t = this;
      this.target.each((n, e) => {
        var gomlNode = JThreeInterface.getNode(<HTMLElement>e);
        for (var attrName in attrTarget) {
          var value=attrTarget[attrName];
          if (gomlNode.attributes.isDefined(attrName)) {
            gomlNode.attributes.setValue(attrName, value);
          } else {
            e.setAttribute(attrName, value);
          }
        }
      });
      this.dequeue();
    }
    this.queue(() => { f(attrTarget); });
    return this;
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


  /**
*
*@param [object Object]
*@returns
*/
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
