import JThreeContext = require("./Core/JThreeContext");
import JThreeContextProxy = require("./Core/JThreeContextProxy");
import $=require('jquery');
import AttributeParser = require("./Goml/AttributeParser");
import Quaternion = require("./Math/Quaternion");
import Vector3 = require("./Math/Vector3");
import Delegates = require('./Delegates');
import JThreeInterface = require('./JThreeInterface');
import GomlModuleDeclaration = require('./Goml/Module/GomlModuleDeclaration')
class JThreeStatic
{ 
  public addModule(declaration:GomlModuleDeclaration)
  {
        var context=JThreeContextProxy.getJThreeContext();
        context.GomlLoader.moduleRegistry.addModule(declaration);
  }
}

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
  static img:HTMLImageElement;
  /**
  * This method should be called when Jthree loaded.
  */
  static Init():void
  {
    //register interfaces
    window["j3"]=JThreeInit.j3;
    window["j3"].__proto__ = JThreeStatic.prototype;

    $(()=>{//TODO I wonder we should remove jQuery dependencies.
      var j3=JThreeContext.getInstanceForProxy();
      j3.init();

      JThreeInit.img= new Image();
      JThreeInit.img.onload = ()=>{j3.ResourceManager.createTexture("test",JThreeInit.img)};
      JThreeInit.img.src="/miku.png";
    });
  }
}
export=JThreeInit;
