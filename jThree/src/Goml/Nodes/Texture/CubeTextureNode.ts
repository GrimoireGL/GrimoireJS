import CubeTexture = require("../../../Core/Resources/Texture/CubeTexture")
import TextureNodeBase = require("./TextureNodeBase");
import ResourceManager = require("../../../Core/ResourceManager");
import TextureBase = require("../../../Core/Resources/Texture/TextureBase");
/**
 * Cube texture resource node.
 */
class CubeTextureNode extends TextureNodeBase {
  protected groupPrefix: string = "cubetexture";

  private loadedFlags: boolean[] = [false, false, false, false, false, false];

  private loadedImages: HTMLImageElement[] = [null, null, null, null, null, null];

  constructor() {
    super();
    this.attributes.defineAttribute({
      srcs: {
        // this src should be passed by splitted with ' '(space).
        // src urls should be arranged in the layout below.
        // PositiveX NegativeX PositiveY NegativeY PositiveZ NegativeZ
        converter: "string",
        src: ""
      }
    });
  }

  protected constructTexture(name: string, rm: ResourceManager): TextureBase {
    const texture = rm.createCubeTextureWithSource("jthree.goml.cubetexture." + name, null, false);
    const srcsv = this.attributes.getValue("srcs");
    if (srcsv) {
      const srcs = srcsv.split(" ");
      for (let i = 0; i < 6; i++) {
        this.loadImg(i, srcs[i]);
      }
    }
    return texture;
  }

  private loadImg(index: number, src: string) {
    const img = this.loadedImages[index] = new Image();
    img.onload = () => {
      this.loadedFlags[index] = true;
      let allTrue = true;
      for (let j = 0; j < 6; j++) {
        if (!this.loadedFlags[j]) {
          allTrue = false;
        }
      }
      if (allTrue) {
        (<CubeTexture>this.TargetTexture).ImageSource = this.loadedImages;
      }
    };
    img.src = src;
  }
}

export = CubeTextureNode;
