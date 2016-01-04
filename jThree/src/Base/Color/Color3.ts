import JThreeObject = require("../JThreeObject");
import Vector3 = require("../../Math/Vector3");
import Color4 = require("./Color4");
import Vector4 = require("../../Math/Vector4");
class Color3 extends JThreeObject {
    constructor(r: number, g: number, b: number) {
        super();
        this._r = r;
        this._g = g;
        this._b = b;
    }

    private _r: number;
    private _g: number;
    private _b: number;

    public get R(): number {
        return this._r;
    }

    public get G(): number {
        return this._g;
    }

    public get B(): number {
        return this._b;
    }

    public static FromColor4(col:Color4):Color3
    {
      return new Color3(col.R,col.G,col.B);
    }
    public toVector():Vector3
    {
      return new Vector3(this.R,this.G,this.B);
    }

    public toVector4(a?:number):Vector4
    {
        if(typeof a ==="undefined")a=0;
        return new Vector4(this.R,this.G,this.B,a);
    }

    public static colorTable: { [key: string]: string } = require("../../static/color.json");
    ///Color parser for css like syntax
    public static internalParse(color: string, isFirst: boolean): Color3 {
        if (isFirst && Color4.colorTable[color]) {
            var col=Color4.internalParse(Color4.colorTable[color], false);
            return Color3.FromColor4(col);
        }
        if (isFirst) {
            var m = color.match(/^#([0-9a-f]{3})$/i);
            //#fff
            if (m) {
                var s = m[1];
                return new Color3(
                    parseInt(s.charAt(0), 16) / 0xf,
                    parseInt(s.charAt(1), 16) / 0xf,
                    parseInt(s.charAt(2), 16) / 0xf
                    );
            }
        }

        //#ffffff
        m = color.match(/^#([0-9a-f]{6})$/i);
        if (m) {
            var s = m[1];
            return new Color3(
                parseInt(s.substr(0, 2), 16) / 0xff,
                parseInt(s.substr(2, 2), 16) / 0xff,
                parseInt(s.substr(4, 2), 16) / 0xff
                );
        }

        var n = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
        if (n && isFirst) {
            return new Color3(parseInt(n[1]) / 0xff, parseInt(n[2]) / 0xff, parseInt(n[3]) / 0xff);
        }
        throw new Error("color parse failed.");
    }

    public static parseColor(color: string): Color3 {
        return Color3.internalParse(color, true);
    }

    public toString(): string {
        var st ="#";
        st += Math.round(this.R * 0xff).toString(16).toUpperCase();
        st += Math.round(this.G * 0xff).toString(16).toUpperCase();
        st += Math.round(this.B * 0xff).toString(16).toUpperCase();
        return `Color3(${this.R},${this.G},${this.B},${st})`;
    }
}


export =Color3;
