import JThreeContext = require("./Core/JThreeContext");
import JThreeContextProxy = require("./Core/JThreeContextProxy");
import $=require('jquery');
import Matrix=require('./Math/Matrix');
class JThreeInit{
  static noInit=false;
  static Init():void
  {
    $(()=>{
      if (JThreeInit.noInit)return;
      var j3=JThreeContext.getInstanceForProxy();
      j3.GomlLoader.onload(()=>{
        console.log(j3.SceneManager.toString());
      });
      j3.init();
    });
  }
}
export=JThreeInit;
