import JThreeContext = require("./Core/JThreeContext");
import JThreeContextProxy = require("./Core/JThreeContextProxy");
import $ = require("jquery");
import Delegates = require("./Base/Delegates");
import JThreeInterface = require("./JThreeInterface");
import GomlComponentDeclaration = require("./Goml/Components/GomlComponentDeclaration");
import Quaternion =require("./Math/Quaternion");
/**
* the methods having the syntax like j3.SOMETHING() should be contained in this class.
* These methods declared inside of this class will be subscribed in JThreeInit.Init(),it means the first time.
*/
class JThreeStatic {
  public addComponent(declaration: GomlComponentDeclaration) {
    var context = JThreeContextProxy.getJThreeContext();
    context.GomlLoader.componentRegistry.addComponent(declaration);
  }
}

/**
* Provides initialization of jThree.js
* You don't need to call this class directly, jThreeInit will be called automatically when jThree.js is loaded.
*/
class JThreeInit {
  /**
  * Actual definition of j3("selector") syntax.
  * This method have two roles.
  * 1, to use for select elements like jQuery in GOML.
  * 2, to use for subscribing eventhandler to be called when j3 is loaded.
  */
  static j3(query: string|Delegates.Action0): JThreeInterface {
    var context = JThreeContextProxy.getJThreeContext();
    if (typeof query === "function") {//check whether this is function or not.
      context.GomlLoader.onload(query);
      return undefined;//when function was subscribed, it is no need to return JThreeInterface.
    }
    var targetObject = context.GomlLoader.rootObj.find(<string>query);//call as query
    return new JThreeInterface(targetObject);
  }

  static img: HTMLImageElement;
  /**
  * This method should be called when Jthree loaded.
  */
  static Init(): void {
    //register interfaces
    window["j3"] = JThreeInit.j3;//$(~~~)
    var pro = Object.getPrototypeOf(window["j3"]);
    for (var key in JThreeStatic.prototype) {
      pro[key] = JThreeStatic.prototype[key];
    }

    $(() => {//TODO I wonder we should remove jQuery dependencies.
      var j3 = JThreeContext.getInstanceForProxy();
      j3.GomlLoader.onload(() => { });
      console.log(Quaternion.EulerXYZ(0,Math.PI/2,-Math.PI/4).FactoringQuaternionXYZ());
      j3.init();
    });
  }
}
export =JThreeInit;
