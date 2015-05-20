import JThreeContext = require("./Core/JThreeContext");
import JThreeContextProxy = require("./Core/JThreeContextProxy");
import $=require('jquery');
import AttributeParser = require("./Goml/AttributeParser");
import Quaternion = require("./Math/Quaternion");
import Vector3 = require("./Math/Vector3");
class JThreeInit{
  static noInit=false;
  /**
  * This method should be called when Jthree loaded.
  */
  static Init():void
  {
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
