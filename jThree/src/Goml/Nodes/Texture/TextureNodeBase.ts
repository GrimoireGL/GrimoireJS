import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import TextureBase = require("../../../Core/Resources/Texture/TextureBase");
import ResourceManager = require("../../../Core/ResourceManager");
import MinFilterType = require("../../../Wrapper/Texture/TextureMinFilterType");
import MagFilterType = require("../../../Wrapper/Texture/TextureMagFilterType");
import TextureWrapType = require("../../../Wrapper/Texture/TextureWrapType");
import JThreeContext = require("../../../JThreeContext");
import ContextComponents = require("../../../ContextComponents");
/**
 * All texture resource node class inherit this class.
 */
abstract class TextureNodeBase extends GomlTreeNodeBase {
  /**
   * Texture reference being managed by this node.
   * @type {TextureBase}
   */
  private targetTexture: TextureBase;

  /**
   * Texture reference being managed by this node.
   */
  public get TargetTexture() {
    return this.targetTexture;
  }

  constructor() {
    super();
    this.attributes.defineAttribute({
      name: {
        value: undefined,
        converter: "string",
        constant: true,
      },
      minFilter: {
        value: "LINEAR",
        converter: "string",
        onchanged: (attr) => {
          if (this.targetTexture) {
            this.targetTexture.MinFilter = this.toMinFilterParameter(attr.Value);
          }
        }
      },
      magFilter: {
        value: "LINEAR",
        converter: "string",
        onchanged: (attr) => {
          if (this.targetTexture) {
            this.targetTexture.MagFilter = this.toMagFilterParameter(attr.Value);
          }
        }
      },
      twrap: {
        value: "clamp",
        converter: "string",
        onchanged: (attr) => {
          if (this.targetTexture) {
            this.targetTexture.TWrap = this.toWrapParameter(attr.Value);
          }
        }
      },
      swrap: {
        value: "clamp",
        converter: "string",
        onchanged: (attr) => {
          if (this.targetTexture) {
            this.targetTexture.SWrap = this.toWrapParameter(attr.Value);
          }
        }
      }
    });
  }

  protected onMount(): void {
    super.onMount();
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    const name = this.attributes.getValue("name");
    this.generateTexture(name, rm).then((texture) => {
      this.targetTexture = texture;
      this.nodeManager.nodeRegister.addObject("jthree.resource." + this.TextureGroupName, name, this);
    });
  }

  protected abstract generateTexture(name: string, rm: ResourceManager): Q.IPromise<TextureBase>;

  protected get TextureGroupName() {
    return "";
  }
  /**
   * Min filter attribute string is changed into enum by this method.
   * @param  {string}        Attribute string
   * @return {MinFilterType} Enum value being passed into gl context.
   */
  private toMinFilterParameter(attr: string): MinFilterType {
    attr = attr.toUpperCase();
    switch (attr) {
      case "NEARESTMIPLINEAR":
        return MinFilterType.NearestMipmapLinear;
      case "NEARESTMIPNEAREST":
        return MinFilterType.NearestMipmapNearest;
      case "LINEARMIPLINEAR":
        return MinFilterType.LinearMipmapLinear;
      case "LINEARMIPNEAREST":
        return MinFilterType.LinearMipmapNearest;
      case "NEAREST":
        return MinFilterType.Nearest;
      case "LINEAR":
      default:
        return MinFilterType.Linear;
    }
  }
  /**
   * Mag filter attribute string is changed into enum by this method.
   * @param  {string}        attr Attribute string
   * @return {MagFilterType}      Enum value being passed into gl context.
   */
  private toMagFilterParameter(attr: string): MagFilterType {
    attr = attr.toUpperCase();
    switch (attr) {
      case "NEAREST":
        return MagFilterType.Nearest;
      case "LINEAR":
      default:
        return MagFilterType.Linear;
    }
  }
  /**
   * Wrap attribute string is changed into enum by this method.
   * @param  {string} attr Attribute string
   * @return {[type]}      Enum value being passed into gl context.
   */
  private toWrapParameter(attr: string) {
    attr = attr.toUpperCase();
    switch (attr) {
      case "REPEAT":
        return TextureWrapType.Repeat;
      case "MIRRORED_REPEAT":
        return TextureWrapType.MirroredRepeat;
      default:
      case "CLAMP":
        return TextureWrapType.ClampToEdge;
    }
  }
}

export = TextureNodeBase;
