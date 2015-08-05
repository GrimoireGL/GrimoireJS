import JThreeObject = require("./JThreeObject");
import Delegates = require("../Base/Delegates");
import Exceptions = require("../Exceptions");
/**
* The class for implementing in Event-Driven architecture.
*/
class JThreeEvent<T> extends JThreeObject
{
  /**
  * The variable to contain handlers references.
  */
  private eventHandlers:Delegates.Action2<any,T>[]=[];

  constructor()
  {
    super();
  }

  /**
  * Call all of handler you subscribed.
  */
  public fire(object:any,eventArg:T):void
  {
    this.eventHandlers.forEach((h)=>h(object,eventArg));
  }

  /**
  *Add the handler you pass.
  *@param handler the handler you want to add.
  */
  public addListerner(handler:Delegates.Action2<any,T>):void
  {
    if(typeof handler === "undefined")throw new Exceptions.InvalidArgumentException("you can not add undefined as event handler");
    this.eventHandlers.push(handler);
  }

  /**
  * Remove the handler you passing.
  * @param handler the handler you want to remove.
  */
  public removeListener(handler:Delegates.Action2<any,T>):void
  {
    for (var i = 0;i <this.eventHandlers.length;i++) {
        var val = this.eventHandlers[i];
        if(val ===handler)
        {
          this.eventHandlers.splice(i,1);
          break;
        }
    }
  }
}

export = JThreeEvent;
