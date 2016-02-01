import GLEnumParser from "../../../Core/Canvas/GLEnumParser";
﻿import GomlTreeNodeBase from "../../GomlTreeNodeBase";
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
            this.targetTexture.MinFilter = GLEnumParser.parseTextureMinFilter(attr.Value);
          }
        }
      },
      magFilter: {
        value: "LINEAR",
        converter: "string",
        onchanged: (attr) => {
          if (this.targetTexture) {
            this.targetTexture.MagFilter = GLEnumParser.parseTextureMagFilter(attr.Value);
          }
        }
      },
      twrap: {
        value: "CLAMP_TO_EDGE",
        converter: "string",
        onchanged: (attr) => {
          if (this.targetTexture) {
            this.targetTexture.TWrap = GLEnumParser.parseTextureWrapMode(attr.Value);
          }
        }
      },
      swrap: {
        value: "CLAMP_TO_EDGE",
        converter: "string",
        onchanged: (attr) => {
          if (this.targetTexture) {
            this.targetTexture.SWrap = GLEnumParser.parseTextureWrapMode(attr.Value);
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
}

export default TextureNodeBase;
