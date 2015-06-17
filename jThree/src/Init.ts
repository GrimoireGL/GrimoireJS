import JThreeContext = require("./Core/JThreeContext");
import JThreeContextProxy = require("./Core/JThreeContextProxy");
import $ = require('jquery');
import AttributeParser = require("./Goml/AttributeParser");
import Quaternion = require("./Math/Quaternion");
import Vector3 = require("./Math/Vector3");
import Delegates = require('./Delegates');
import JThreeInterface = require('./JThreeInterface');
import GomlComponentDeclaration = require('./Goml/Components/GomlComponentDeclaration');
import TextureAttachmentType = require('./Wrapper/FramebufferAttachmentType');
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
      j3.init();
      JThreeInit.img = new Image();
      JThreeInit.img.onload = () => {
        j3.ResourceManager.createTextureWithSource("test",JThreeInit.img);
        var tex = j3.ResourceManager.createTexture("testTex", 256, 256);
        var fbo = j3.ResourceManager.createFBO("testFBO");
        fbo.getForRenderer(j3.CanvasManagers[0]).attachTexture(TextureAttachmentType.ColorAttachment0, tex);

      };
      JThreeInit.img.src = "/miku.png";
      j3.ResourceManager.createRBO("testRBO", 128, 128);
    });
  }
}
export =JThreeInit;
