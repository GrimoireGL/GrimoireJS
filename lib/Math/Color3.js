import VectorBase from "../Math/VectorBase";
import Vector3 from "./Vector3";
import Color4 from "./Color4";
import Vector4 from "./Vector4";
class Color3 extends VectorBase {
    constructor(r, g, b) {
        super();
        this.rawElements = [r, g, b];
    }
    static fromColor4(col) {
        return new Color3(col.R, col.G, col.B);
    }
    static parse(color) {
        return Color3.internalParse(color, true);
    }
    /// Color parser for css like syntax
    static internalParse(color, isFirst) {
        if (isFirst && Color4.colorTable[color]) {
            const col = Color4.internalParse(Color4.colorTable[color], false);
            return Color3.fromColor4(col);
        }
        let m;
        if (isFirst) {
            m = color.match(/^#([0-9a-f]{3})$/i);
            // #fff
            if (m) {
                const s = m[1];
                return new Color3(parseInt(s.charAt(0), 16) / 0xf, parseInt(s.charAt(1), 16) / 0xf, parseInt(s.charAt(2), 16) / 0xf);
            }
        }
        // #ffffff
        m = color.match(/^#([0-9a-f]{6})$/i);
        if (m) {
            const s = m[1];
            return new Color3(parseInt(s.substr(0, 2), 16) / 0xff, parseInt(s.substr(2, 2), 16) / 0xff, parseInt(s.substr(4, 2), 16) / 0xff);
        }
        const n = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
        if (n && isFirst) {
            return new Color3(parseInt(n[1], 10) / 0xff, parseInt(n[2], 10) / 0xff, parseInt(n[3], 10) / 0xff);
        }
        return undefined;
    }
    static equals(col1, col2) {
        return VectorBase.__elementEquals(col1, col2);
    }
    toVector() {
        return new Vector3(this.R, this.G, this.B);
    }
    toVector4(a) {
        if (typeof a === "undefined") {
            a = 0;
        }
        return new Vector4(this.R, this.G, this.B, a);
    }
    get R() {
        return this.rawElements[0];
    }
    get G() {
        return this.rawElements[1];
    }
    get B() {
        return this.rawElements[2];
    }
    get ElementCount() {
        return 3;
    }
    equalWith(col) {
        return Color3.equals(col, this);
    }
    toString() {
        return `rgb(${Math.round(this.R * 255)}, ${Math.round(this.G * 255)}, ${Math.round(this.B * 255)})`;
    }
    toDisplayString() {
        let st = "#";
        st += Math.round(this.R * 0xff).toString(16).toUpperCase();
        st += Math.round(this.G * 0xff).toString(16).toUpperCase();
        st += Math.round(this.B * 0xff).toString(16).toUpperCase();
        return `Color3(${this.R}, ${this.G}, ${this.B}, ${st})`;
    }
}
Color3.colorTable = require("../static/color.json");
export default Color3;
