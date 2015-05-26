import JThreeContext = require("./Core/JThreeContext");
import JThreeContextProxy = require("./Core/JThreeContextProxy");
import $=require('jquery');
import AttributeParser = require("./Goml/AttributeParser");
import Quaternion = require("./Math/Quaternion");
import Vector3 = require("./Math/Vector3");
import Delegates = require('./Delegates');
import JThreeInterface = require('./JThreeInterface');

class JThreeInit{
  /**
*
*@param query 
*@returns
*/
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

  static noInit=false;
  /**
  * This method should be called when Jthree loaded.
  */
  static Init():void
  {
    window["j3"]=JThreeInit.j3;
    $(()=>{
      if (JThreeInit.noInit)return;
      var j3=JThreeContext.getInstanceForProxy();
      j3.GomlLoader.onload(()=>{
        console.log(j3.SceneManager.toString());
      });
      j3.init();
      console.log(Quaternion.AngleAxis(Math.PI/4,new Vector3(1,1,0)).toAngleAxisString());
    });
  }
}
export=JThreeInit;
