import CoreRelatedNodeBase from "../../CoreRelatedNodeBase";
import GLEnumParser from "../../../Core/Canvas/GL/GLEnumParser";
import TextureBase from "../../../Core/Resources/Texture/TextureBase";
import ResourceManager from "../../../Core/ResourceManager";
import JThreeContext from "../../../JThreeContext";
import ContextComponents from "../../../ContextComponents";
/**
 * All texture resource node class inherit this class.
 */
abstract class TextureNodeBase<T extends TextureBase> extends CoreRelatedNodeBase<T> {

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
          if (this.target) {
            this.target.MinFilter = GLEnumParser.parseTextureMinFilter(attr.Value);
            attr.done();
          }
        }
      },
      magFilter: {
        value: "LINEAR",
        converter: "string",
        onchanged: (attr) => {
          if (this.target) {
            this.target.MagFilter = GLEnumParser.parseTextureMagFilter(attr.Value);
            attr.done();
          }
        }
      },
      twrap: {
        value: "CLAMP_TO_EDGE",
        converter: "string",
        onchanged: (attr) => {
          if (this.target) {
            this.target.TWrap = GLEnumParser.parseTextureWrapMode(attr.Value);
            attr.done();
          }
        }
      },
      swrap: {
        value: "CLAMP_TO_EDGE",
        converter: "string",
        onchanged: (attr) => {
          if (this.target) {
            this.target.SWrap = GLEnumParser.parseTextureWrapMode(attr.Value);
            attr.done();
          }
        }
      }
    });
    this.on("update-target", (obj: T) => {
      this._onMinFilterAttrChanged.call(this, this.attributes.getAttribute("minFilter"));
      this._onMagFilterAttrChanged.call(this, this.attributes.getAttribute("magFilter"));
      this._onTWrapAttrChanged.call(this, this.attributes.getAttribute("twrap"));
      this._onSWrapAttrChanged.call(this, this.attributes.getAttribute("swrap"));
    });
  }

  protected __onMount(): void {
    super.__onMount();
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    const name = this.attributes.getValue("name");
    this.__constructTexture(name, rm).then((texture) => {
      this.target = texture;
      this.emit("update-target", this.target);
      this.nodeExport(name);
    });
  }

  /**
   * Construct texture.
   * @param  {string}          name [description]
   * @param  {ResourceManager} rm   [description]
   * @return {TextureBase}          [description]
   */
  protected abstract __constructTexture(name: string, rm: ResourceManager): Q.IPromise<T>;

  private _onMinFilterAttrChanged(attr): void {
    if (this.target) {
      this.target.MinFilter = GLEnumParser.parseTextureMinFilter(attr.Value);
      attr.done();
    }
  }

  private _onMagFilterAttrChanged(attr): void {
    if (this.target) {
      this.target.MagFilter = GLEnumParser.parseTextureMagFilter(attr.Value);
      attr.done();
    }
  }

  private _onTWrapAttrChanged(attr): void {
    if (this.target) {
      this.target.TWrap = GLEnumParser.parseTextureWrapMode(attr.Value);
      attr.done();
    }
  }

  private _onSWrapAttrChanged(attr): void {
    if (this.target) {
      this.target.SWrap = GLEnumParser.parseTextureWrapMode(attr.Value);
      attr.done();
    }
  }
}

export default TextureNodeBase;
