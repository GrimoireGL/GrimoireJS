import JThreeContext = require("./Core/JThreeContext");
import JThreeContextProxy = require("./Core/JThreeContextProxy");
import $ = require('jquery');
import Delegates = require('./Base/Delegates');
import JThreeInterface = require('./JThreeInterface');
import GomlComponentDeclaration = require('./Goml/Components/GomlComponentDeclaration');
import TextureAttachmentType = require('./Wrapper/FrameBufferAttachmentType');
import TextureMinFilter = require('./Wrapper/Texture/TextureMinFilterType');
import PluginLoader = require('./Goml/Plugins/PluginLoader');
class JThreeStatic {
  public addComponent(declaration: GomlComponentDeclaration) {
    var context = JThreeContextProxy.getJThreeContext();
    context.GomlLoader.componentRegistry.addComponent(declaration);
  }
}

class JThreeInit {

  static j3(query: string|Delegates.Action0): JThreeInterface {
    var context = JThreeContextProxy.getJThreeContext();
    if (typeof query === 'function') {
      context.GomlLoader.onload(query);
      return null;
    }
    var targetObject = context.GomlLoader.rootObj.find(<string>query);
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
      j3.GomlLoader.onload(() => {

        JThreeInit.img = new Image();
        JThreeInit.img.onload = () => {
          var res = j3.ResourceManager.createTextureWithSource("test", JThreeInit.img);
        };
        JThreeInit.img.src = "/miku2.png";
      });
      j3.init();
    });
  }
}
export =JThreeInit;
