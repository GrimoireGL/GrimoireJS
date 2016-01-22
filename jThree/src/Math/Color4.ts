import VectorBase = require("./VectorBase");
import Vector4 = require("./Vector4");

class Color4 extends VectorBase {
  constructor(r: number, g: number, b: number, a: number) {
    super();
    this.rawElements = [r, g, b, a];
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

  public get A(): number {
    return this.rawElements[3];
  }
  public toVector(): Vector4 {
    return new Vector4(this.R, this.G, this.B, this.A);
  }

  public static colorTable: { [key: string]: string } = require("../static/color.json");
  /// Color parser for css like syntax
  public static internalParse(color: string, isFirst: boolean): Color4 {
    if (isFirst && Color4.colorTable[color]) {
      return Color4.internalParse(Color4.colorTable[color], false);
    }
    let m;
    if (isFirst) {
      m = color.match(/^#([0-9a-f]{3})$/i);
      // #fff
      if (m) {
        const s = m[1];
        return new Color4(
          parseInt(s.charAt(0), 16) / 0xf,
          parseInt(s.charAt(1), 16) / 0xf,
          parseInt(s.charAt(2), 16) / 0xf,
          1
          );
      }
    }
    if (isFirst) {
      m = color.match(/^#([0-9a-f]{4})$/i);
      // #ffff
      if (m) {
        const s = m[1];
        return new Color4(
          parseInt(s.charAt(0), 16) / 0xf,
          parseInt(s.charAt(1), 16) / 0xf,
          parseInt(s.charAt(2), 16) / 0xf,
          parseInt(s.charAt(3), 16) / 0xf
          );
      }
    }
    // #ffffff
    m = color.match(/^#([0-9a-f]{6})$/i);
    if (m) {
      const s = m[1];
      return new Color4(
        parseInt(s.substr(0, 2), 16) / 0xff,
        parseInt(s.substr(2, 2), 16) / 0xff,
        parseInt(s.substr(4, 2), 16) / 0xff,
        1
        );
    }
    // #ffffffff
    if (isFirst) {
      m = color.match(/^#([0-9a-f]{8})$/i);
      if (m) {
        const s = m[1];
        return new Color4(
          parseInt(s.substr(0, 2), 16) / 0xff,
          parseInt(s.substr(2, 2), 16) / 0xff,
          parseInt(s.substr(4, 2), 16) / 0xff,
          parseInt(s.substr(6, 2), 16) / 0xff
          );
      }
    }
    let n = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (n && isFirst) {
      return new Color4(parseInt(n[1], 10) / 0xff, parseInt(n[2], 10) / 0xff, parseInt(n[3], 10) / 0xff, 1);
    }
    n = color.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\,\s*(\d+)\s*\)$/i);
    if (n && isFirst) {
      let d = parseInt(n[4], 10);
      d = d <= 1 ? d : d / 0xff;
      return new Color4(parseInt(n[1], 10) / 0xff, parseInt(n[2], 10) / 0xff, parseInt(n[3], 10) / 0xff, parseInt(n[4], 10));
    }
    return undefined;
  }

  public static parse(color: string): Color4 {
    return Color4.internalParse(color, true);
  }

  public get ElementCount(): number {
    return 4;
  }

  public equalWith(col: Color4): boolean {
    return Color4.equals(col, this);
  }

  public static equals(col1: Color4, col2: Color4): boolean {
    return VectorBase.elementEqual(col1, col2);
  }

  public toString(): string {
    return `rgba(${Math.round(this.R * 255) }, ${Math.round(this.G * 255) }, ${Math.round(this.B * 255) }, ${Math.round(this.A * 255) })`;
  }

  public toDisplayString(): string {
    var st = "#";
    st += Math.round(this.R * 0xff).toString(16).toUpperCase();
    st += Math.round(this.G * 0xff).toString(16).toUpperCase();
    st += Math.round(this.B * 0xff).toString(16).toUpperCase();
    st += Math.round(this.A * 0xff).toString(16).toUpperCase();
    return `Color4(${this.R}, ${this.G}, ${this.B}, ${this.A}, ${st})`;
  }
}


export = Color4;
