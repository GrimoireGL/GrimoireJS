import JThreeContext = require("./Core/JThreeContext");
import JThreeContextProxy = require("./Core/JThreeContextProxy");
import $=require('jquery');
import AttributeParser = require("./Goml/AttributeParser");
import Quaternion = require("./Math/Quaternion");
import Vector3 = require("./Math/Vector3");
import Delegates = require('./Delegates');
import JThreeInterface = require('./JThreeInterface');

class JThreeInit{

static j3(query:string|Delegates.Action0):JThreeInterface
  {
    var context=JThreeContextProxy.getJThreeContext();
    if(typeof query ==='function')
    {
      context.GomlLoader.onload(query);
      return null;
    }
      var targetObject=context.GomlLoader.rootObj.find(<string>query);
      return new JThreeInterface(targetObject);
  }

  /**
  * This method should be called when Jthree loaded.
  */
  static Init():void
  {
    window["j3"]=JThreeInit.j3;//subscribe the function as member of window
    $(()=>{//TODO I wonder we should remove jQuery dependencies.
      var j3=JThreeContext.getInstanceForProxy();
      j3.init();
    });
  }
}
export=JThreeInit;
