import GomlTreeNodeBase from "../../GomlTreeNodeBase";
import TextureBase from "../../../Core/Resources/Texture/TextureBase";
import ResourceManager from "../../../Core/ResourceManager";
import JThreeContext from "../../../JThreeContext";
import ContextComponents from "../../../ContextComponents";
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
    this.constructTexture(name, rm).then((texture) => {
      this.targetTexture = texture;
      this.nodeExport(name);
    });
  }

  /**
   * Construct texture.
   * @param  {string}          name [description]
   * @param  {ResourceManager} rm   [description]
   * @return {TextureBase}          [description]
   */
  protected abstract constructTexture(name: string, rm: ResourceManager): Q.IPromise<TextureBase>;

  /**
   * Min filter attribute string is changed into enum by this method.
   * @param  {string}        Attribute string
   * @return {MinFilterType} Enum value being passed into gl context.
   */
  private toMinFilterParameter(attr: string): number {
    attr = attr.toUpperCase();
    switch (attr) {
      case "NEARESTMIPLINEAR":
        return WebGLRenderingContext.NEAREST_MIPMAP_LINEAR;
      case "NEARESTMIPNEAREST":
        return WebGLRenderingContext.NEAREST_MIPMAP_NEAREST;
      case "LINEARMIPLINEAR":
        return WebGLRenderingContext.LINEAR_MIPMAP_LINEAR;
      case "LINEARMIPNEAREST":
        return WebGLRenderingContext.LINEAR_MIPMAP_NEAREST;
      case "NEAREST":
        return WebGLRenderingContext.NEAREST;
      case "LINEAR":
        return WebGLRenderingContext.LINEAR;
      default:
        return WebGLRenderingContext.LINEAR;
    }
  }

  /**
   * Mag filter attribute string is changed into enum by this method.
   * @param  {string}        attr Attribute string
   * @return {MagFilterType}      Enum value being passed into gl context.
   */
  private toMagFilterParameter(attr: string): number {
    attr = attr.toUpperCase();
    switch (attr) {
      case "NEAREST":
        return WebGLRenderingContext.NEAREST;
      case "LINEAR":
        return WebGLRenderingContext.LINEAR;
      default:
        return WebGLRenderingContext.LINEAR;
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
        return WebGLRenderingContext.REPEAT;
      case "MIRRORED_REPEAT":
        return WebGLRenderingContext.MIRRORED_REPEAT;
      case "CLAMP":
        return WebGLRenderingContext.CLAMP_TO_EDGE;
      default:
        return WebGLRenderingContext.CLAMP_TO_EDGE;
    }
  }
}

export default TextureNodeBase;
