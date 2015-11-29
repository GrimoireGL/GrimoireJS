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
  private _eventHandlers:Delegates.Action2<any,T>[]=[];

  /**
  * Call all of handler you subscribed.
  */
  public fire(object:any,eventArg:T):void
  {
    this._eventHandlers.forEach((h)=>h(object,eventArg));
  }

  /**
  *Add the handler you pass.
  *@param handler the handler you want to add.
  */
  public addListener(handler:Delegates.Action2<any,T>):void
  {
    if(typeof handler === "undefined")throw new Exceptions.InvalidArgumentException("you can not add undefined as event handler");
    this._eventHandlers.push(handler);
  }

  /**
  * Remove the handler you passing.
  * @param handler the handler you want to remove.
  */
  public removeListener(handler:Delegates.Action2<any,T>):void
  {
    for (var i = 0;i <this._eventHandlers.length;i++) {
        var val = this._eventHandlers[i];
        if(val ===handler)
        {
          this._eventHandlers.splice(i,1);
          break;
        }
    }
  }
}

export = JThreeEvent;
