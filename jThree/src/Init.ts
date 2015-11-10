import JThreeContext = require("./Core/JThreeContext");
import JThreeContextProxy = require("./Core/JThreeContextProxy");
import Delegates = require('./Base/Delegates');
import JThreeInterface = require('./JThreeInterface');
import BehaviorDeclaration = require("./Goml/Behaviors/BehaviorDeclaration");
import BehaviorDeclarationBody = require("./Goml/Behaviors/BehaviorDeclarationBody");
import agent = require("superagent");
import JThreeLogger = require("./Base/JThreeLogger");
/**
* the methods having the syntax like j3.SOMETHING() should be contained in this class.
* These methods declared inside of this class will be subscribed in JThreeInit.Init(),it means the first time.
*/
class JThreeStatic
{
    public defineBehavior(behaviorName: string, decl: BehaviorDeclarationBody|Delegates.Action0);
    public defineBehavior(declarations:BehaviorDeclaration);
  public defineBehavior(nameOrDeclarations:string|BehaviorDeclaration,declaration?:BehaviorDeclarationBody|Delegates.Action0) {
    var context = JThreeContextProxy.getJThreeContext();
    context.GomlLoader.componentRegistry.defineBehavior(<string>nameOrDeclarations,declaration);//This is not string but it is for conviniesnce.
    }

  public get Math() {
      return{
          Quaternion: require("./Math/Quaternion"),
          Vector2:
              require("./Math/Vector2"),
          Vector3:
              require("./Math/Vector3"),
          Vector4:
              require("./Math/Vector4")
      };
  }
}

/**
* Provides initialization of jThree.js
* You don't need to call this class directly, jThreeInit will be called automatically when jThree.js is loaded.
*/
class JThreeInit {

  public static SelfTag:HTMLScriptElement;

  /**
  * Actual definition of j3("selector") syntax.
  * This method have two roles.
  * 1, to use for select elements like jQuery in GOML.
  * 2, to use for subscribing eventhandler to be called when j3 is loaded.
  */
  public static j3(query: string|Delegates.Action0): JThreeInterface {
    var context = JThreeContextProxy.getJThreeContext();
    if (typeof query === 'function') {//check whether this is function or not.
      context.GomlLoader.onload(query);
      return undefined;//when function was subscribed, it is no need to return JThreeInterface.
    }
    var targetObject: NodeList = context.GomlLoader.rootObj.querySelectorAll(<string>query); //call as query
    return new JThreeInterface(targetObject);
  }

  /**
  * This method should be called when Jthree loaded.
  */
   public static Init(): void {
    var scripts=document.getElementsByTagName('script');
    JThreeInit.SelfTag = scripts[scripts.length - 1];
    //register interfaces
    window["j3"] = JThreeInit.j3;//$(~~~)
    var pro = Object.getPrototypeOf(window["j3"]);
    for (var key in JThreeStatic.prototype) {
      pro[key] = JThreeStatic.prototype[key];
    }
    window["j3"]["lateStart"] = JThreeInit.startInitialize;

  if(JThreeInit.SelfTag.getAttribute('lateLoad')!=="true")window.addEventListener('DOMContentLoaded', () => {
      JThreeInit.startInitialize();
    });
  }

  private static startInitialize()
  {
    var j3 = JThreeContextProxy.getJThreeContext();
    JThreeInit.j3(() => {
    });
    j3.init();
  }
}
export = JThreeInit;
