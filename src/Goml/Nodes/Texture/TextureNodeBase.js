import CoreRelatedNodeBase from "../../CoreRelatedNodeBase";
import GLEnumParser from "../../../Core/Canvas/GL/GLEnumParser";
import JThreeContext from "../../../JThreeContext";
import ContextComponents from "../../../ContextComponents";
class TextureNodeBase extends CoreRelatedNodeBase {
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
        this.on("update-target", (obj) => {
            this._onMinFilterAttrChanged.call(this, this.attributes.getAttribute("minFilter"));
            this._onMagFilterAttrChanged.call(this, this.attributes.getAttribute("magFilter"));
            this._onTWrapAttrChanged.call(this, this.attributes.getAttribute("twrap"));
            this._onSWrapAttrChanged.call(this, this.attributes.getAttribute("swrap"));
        });
    }
    __onMount() {
        super.__onMount();
        const rm = JThreeContext.getContextComponent(ContextComponents.ResourceManager);
        const name = this.attributes.getValue("name");
        this.__constructTexture(name, rm).then((texture) => {
            this.target = texture;
            this.emit("update-target", this.target);
            this.nodeExport(name);
        });
    }
    _onMinFilterAttrChanged(attr) {
        if (this.target) {
            this.target.MinFilter = GLEnumParser.parseTextureMinFilter(attr.Value);
            attr.done();
        }
    }
    _onMagFilterAttrChanged(attr) {
        if (this.target) {
            this.target.MagFilter = GLEnumParser.parseTextureMagFilter(attr.Value);
            attr.done();
        }
    }
    _onTWrapAttrChanged(attr) {
        if (this.target) {
            this.target.TWrap = GLEnumParser.parseTextureWrapMode(attr.Value);
            attr.done();
        }
    }
    _onSWrapAttrChanged(attr) {
        if (this.target) {
            this.target.SWrap = GLEnumParser.parseTextureWrapMode(attr.Value);
            attr.done();
        }
    }
}
export default TextureNodeBase;
//# sourceMappingURL=TextureNodeBase.js.map