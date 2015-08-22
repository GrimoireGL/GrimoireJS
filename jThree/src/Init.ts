import JThreeContext = require("./Core/JThreeContext");
import JThreeContextProxy = require("./Core/JThreeContextProxy");
import $ = require('jquery');
import Delegates = require('./Base/Delegates');
import JThreeInterface = require('./JThreeInterface');
import GomlComponentDeclaration = require('./Goml/Components/GomlComponentDeclaration');
import agent = require("superagent");
import CubeTexture = require("./Core/Resources/Texture/CubeTexture"); /**
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
    public static j3(query: string|Delegates.Action0): JThreeInterface {
    var context = JThreeContextProxy.getJThreeContext();
    if (typeof query === 'function') {//check whether this is function or not.
      context.GomlLoader.onload(query);
      return undefined;//when function was subscribed, it is no need to return JThreeInterface.
    }
    var targetObject = context.GomlLoader.rootObj.find(<string>query);//call as query
    return new JThreeInterface(targetObject);
  }

  /**
  * This method should be called when Jthree loaded.
  */
    public static Init(): void {
    //register interfaces
    window["j3"] = JThreeInit.j3;//$(~~~)
    var pro = Object.getPrototypeOf(window["j3"]);
    for (var key in JThreeStatic.prototype) {
      pro[key] = JThreeStatic.prototype[key];
    }

    $(() => {//TODO we should remove jQuery dependencies
        var j3 = JThreeContext.getInstanceForProxy();
        JThreeInit.j3(() => {
/*            JThreeInit.cubeTest = j3.ResourceManager.createCubeTextureWithSource("testcube", []);
            JThreeInit.loadCubeTex("PX", 0);
            JThreeInit.loadCubeTex("PY", 1);
            JThreeInit.loadCubeTex("PZ", 2);
            JThreeInit.loadCubeTex("NX", 3);
            JThreeInit.loadCubeTex("NY", 4);
            JThreeInit.loadCubeTex("NZ", 5);*/
        });
        j3.init();
    });
    }

    private static flags: boolean[] = [false, false, false, false, false, false];

    private static imgSource:HTMLImageElement[]=[null,null,null,null,null,null];

    private static cubeTest: CubeTexture;

    private static loadCubeTex(suffix: string, index: number) {
        var img = new Image();
        JThreeInit.imgSource[index] = img;
        img.onload = () => {
            JThreeInit.flags[index] = true;
            JThreeInit.checkCompleted();
        };
        img.src = "cube/cube_"+suffix+".png";
    }

    private static checkCompleted() {
        var allTrue = true;
        for (var i = 0; i < 6; i++) {
            if (!JThreeInit.flags[i]) {
                allTrue = false;
                break;
            }
        }
        if (allTrue)JThreeInit.cubeTest.ImageSource = JThreeInit.imgSource;
    }
}
export =JThreeInit;
