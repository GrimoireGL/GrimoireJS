import JThreeObject = require("../JThreeObject");
import Vector4 = require("../../Math/Vector4");
declare function require(string): { [key: string]: string };

class Color4 extends JThreeObject {
    constructor(r: number, g: number, b: number, a: number) {
        super();
        this.a = a;
        this.r = r;
        this.g = g;
        this.b = b;
    }

    private a: number;
    private r: number;
    private g: number;
    private b: number;

    get A(): number {
        return this.a;
    }

    get R(): number {
        return this.r;
    }

    get G(): number {
        return this.g;
    }

    get B(): number {
        return this.b;
    }
    public toVector():Vector4
    {
      return new Vector4(this.R,this.G,this.B,this.A);
    }

    static colorTable: { [key: string]: string } = require('static/color.json');
    ///Color parser for css like syntax
    static internalParse(color: string, isFirst: boolean): Color4 {
        if (isFirst && Color4.colorTable[color]) {
            return Color4.internalParse(Color4.colorTable[color], false);
        }
        if (isFirst) {
            var m = color.match(/^#([0-9a-f]{3})$/i);
            //#fff
            if (m) {
                var s = m[1];
                return new Color4(
                    parseInt(s.charAt(0), 16) / 0xf,
                    parseInt(s.charAt(1), 16) / 0xf,
                    parseInt(s.charAt(2), 16) / 0xf,
                    1
                    );
            }
        }
        if (isFirst) {
            m = color.match(/^#([0-9a-f]{3})$/i);
            //#ffff
            if (m) {
                var s = m[1];
                return new Color4(
                    parseInt(s.charAt(0), 16) / 0xf,
                    parseInt(s.charAt(1), 16) / 0xf,
                    parseInt(s.charAt(2), 16) / 0xf,
                    parseInt(s.charAt(3), 16) / 0xf
                    );
            }
        }
        //#ffffff
        m = color.match(/^#([0-9a-f]{6})$/i);
        if (m) {
            var s = m[1];
            return new Color4(
                parseInt(s.substr(0, 2), 16) / 0xff,
                parseInt(s.substr(2, 2), 16) / 0xff,
                parseInt(s.substr(4, 2), 16) / 0xff,
                1
                );
        }
        //#ffffffff
        if (isFirst) {
            m = color.match(/^#([0-9a-f]{8})$/i);
            if (m ) {
              var s=m[1];
                return new Color4(
                    parseInt(s.substr(0, 2), 16) / 0xff,
                    parseInt(s.substr(2, 2), 16) / 0xff,
                    parseInt(s.substr(4, 2), 16) / 0xff,
                    parseInt(s.substr(6, 2), 16) / 0xff
                    );
            }
        }
        var n = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
        if (n && isFirst) {
            return new Color4(parseInt(n[1]) / 0xff, parseInt(n[2]) / 0xff, parseInt(n[3]) / 0xff, 1);
        }
        var n = color.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\,\s*(\d+)\s*\)$/i);
        if (n && isFirst) {
            var d=parseInt(n[4]);
            d=d<=1?d:d/0xff;
            return new Color4(parseInt(n[1]) / 0xff, parseInt(n[2]) / 0xff, parseInt(n[3]) / 0xff, parseInt(n[4]));
        }
        throw new Error("color parse failed.");
    }

    static parseColor(color: string): Color4 {
        return Color4.internalParse(color, true);
    }

    toString(): string {
        var st ="#";
        st += Math.round(this.R * 0xff).toString(16).toUpperCase();
        st += Math.round(this.G * 0xff).toString(16).toUpperCase();
        st += Math.round(this.B * 0xff).toString(16).toUpperCase();
        st += Math.round(this.A * 0xff).toString(16).toUpperCase();
        return `Color4(${this.R}, ${this.G}, ${this.B},${this.A},${st})`;
    }
}


export =Color4;
