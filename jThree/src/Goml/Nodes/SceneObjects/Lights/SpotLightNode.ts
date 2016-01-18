import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import LightNodeBase = require("./LightNodeBase");;
// import SpotLight = require("../../../../Core/Light/Impl/SpotLight");;
import LightBase = require("../../../../Core/Light/LightBase");;

class SpotLightNode extends LightNodeBase {
  private targetLight: LightBase;

		constructor() {
    super();
    // this.attributes.defineAttribute({
    //   "intensity": {
    //     value: 1,
    //     converter: "float",
    //     onchanged: (attr) => {
    //       this.targetLight.intensity = attr.Value;
    //     }
    //   },
    //   "decay": {
    //     value: 1,
    //     converter: "float",
    //     onchanged: (attr) => {
    //       this.targetLight.decay = attr.Value;
    //     }
    //   },
    //   "inner": {
    //     value: "10d",
    //     converter: "angle",
    //     onchanged: (attr) => {
    //       this.targetLight.inner = attr.Value;
    //     }
    //   },
    //   "outer": {
    //     value: "25d",
    //     converter: "angle",
    //     onchanged: (attr) => {
    //       this.targetLight.outer = attr.Value;
    //     }
    //   }
    // });
  }

  protected constructLight(): LightBase {
    //this.targetLight = new SpotLight(this.ContainedSceneNode.targetScene);
    return this.targetLight;
  }
}

export = SpotLightNode;
