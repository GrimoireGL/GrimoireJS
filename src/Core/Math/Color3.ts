import VectorBase from "../Math/VectorBase";
import Vector3 from "./Vector3";
import Color4 from "./Color4";
import Vector4 from "./Vector4";

class Color3 extends VectorBase {

  public static colorTable: { [key: string]: string } = require("../static/color.json");

  public static fromColor4(col: Color4): Color3 {
    return new Color3(col.R, col.G, col.B);
  }

  public static parse(color: string, tryParse?: boolean): Color3 {
    return Color3.internalParse(color, true, tryParse);
  }

  /// Color parser for css like syntax
  public static internalParse(color: string, isFirst: boolean, tryParse?: boolean): Color3 {
    if (isFirst && Color4.colorTable[color]) {
      const col = Color4.internalParse(Color4.colorTable[color], false, tryParse);
      return Color3.fromColor4(col);
    }
    let m;
    if (isFirst) {
      m = color.match(/^#([0-9a-f]{3})$/i);
      // #fff
      if (m) {
        const s = m[1];
        return new Color3(
          parseInt(s.charAt(0), 16) / 0xf,
          parseInt(s.charAt(1), 16) / 0xf,
          parseInt(s.charAt(2), 16) / 0xf
          );
      }
    }

    // #ffffff
    m = color.match(/^#([0-9a-f]{6})$/i);
    if (m) {
      const s = m[1];
      return new Color3(
        parseInt(s.substr(0, 2), 16) / 0xff,
        parseInt(s.substr(2, 2), 16) / 0xff,
        parseInt(s.substr(4, 2), 16) / 0xff
        );
    }

    const n = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (n && isFirst) {
      return new Color3(parseInt(n[1], 10) / 0xff, parseInt(n[2], 10) / 0xff, parseInt(n[3], 10) / 0xff);
    }
    if (tryParse) {
      return undefined;
    }
    throw new Error("Unexpected color string" + color);
  }

  public static equals(col1: Color3, col2: Color3): boolean {
    return VectorBase.__elementEquals(col1, col2);
  }

  constructor(r: number, g: number, b: number) {
    super();
    this.rawElements = [r, g, b];
  }

  public toVector(): Vector3 {
    return new Vector3(this.R, this.G, this.B);
  }

  public toVector4(a?: number): Vector4 {
    if (typeof a === "undefined") {
      a = 0;
    }
    return new Vector4(this.R, this.G, this.B, a);
  }

  public get R(): number {
    return this.rawElements[0];
  }

  public get G(): number {
    return this.rawElements[1];
  }

  public get B(): number {
    return this.rawElements[2];
  }

  public get ElementCount(): number {
    return 3;
  }

  public equalWith(col: Color3): boolean {
    return Color3.equals(col, this);
  }

  public toString(): string {
    return `rgb(${Math.round(this.R * 255) }, ${Math.round(this.G * 255) }, ${Math.round(this.B * 255) })`;
  }

  public toDisplayString(): string {
    let st = "#";
    st += Math.round(this.R * 0xff).toString(16).toUpperCase();
    st += Math.round(this.G * 0xff).toString(16).toUpperCase();
    st += Math.round(this.B * 0xff).toString(16).toUpperCase();
    return `Color3(${this.R}, ${this.G}, ${this.B}, ${st})`;
  }
}


export default Color3;
