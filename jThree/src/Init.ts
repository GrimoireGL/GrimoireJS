import JThreeContext = require("./Core/JThreeContext");
import JThreeContextProxy = require("./Core/JThreeContextProxy");
import $=require('jquery');
import Matrix=require('./Math/Matrix');
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
      var projMat:Matrix=Matrix.perspective(Math.PI/4,1,0.1,10);
      var viewMat=Matrix.lookAt(new Vector3(0,0,1),new Vector3(0,0,0),new Vector3(0,1,0))
      console.log(projMat.toString())
      console.log(viewMat.toString())
      console.log(Matrix.multiply(projMat,viewMat).toString())
      console.log(Matrix.transformPoint(viewMat,new Vector3(0,0,-9)));
      console.log(Matrix.transformPoint(viewMat,new Vector3(0,2,2)));
      console.log(Matrix.transformPoint(viewMat,new Vector3(0,0,1)));
    });
  }
}
export=JThreeInit;
