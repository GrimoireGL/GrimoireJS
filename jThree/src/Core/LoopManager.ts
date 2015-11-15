import IContextComponent = require("../IContextComponent");
import ContextComponents = require("../ContextComponents");
import Delegate = require("../Base/Delegates");

interface LoopAction
{
  order:number;
  action:Delegate.Action0;
}
class LoopManager implements IContextComponent
{
  public getContextComponentIndex():number
  {
    return ContextComponents.LoopManager;
  }

  private registerNextLoop;

  private loopActions:LoopAction[] = [];

  constructor()
  {
    this.registerNextLoop=
      window.requestAnimationFrame //if window.requestAnimationFrame is defined or undefined
        ?
      　()=>{//When window.requestAnimationFrame is supported
      　window.requestAnimationFrame(this.loop.bind(this));
      　}
      　:
      　()=>{//When window.requestAnimationFrame is not supported.
      　  window.setTimeout(this.loop.bind(this),1000/60);
      　  };
  }

  public begin()
  {
    this.loop();
  }

  public addAction(order:number,action:Delegate.Action0)
  {
    this.loopActions.push({
      order:order,
      action:action
    });
    this.loopActions.sort((a1,a2)=>a1.order-a2.order);
  }

  private loop()
  {
    this.loopActions.forEach(act=>
    {
      act.action();
    });
    this.registerNextLoop();
  }
}

export = LoopManager;
