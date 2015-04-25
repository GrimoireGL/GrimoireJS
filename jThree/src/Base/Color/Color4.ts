import JThreeObject = require("../JThreeObject");

class Color4 extends JThreeObject {
        constructor(r: number, g: number, b: number, a: number) {
            super();
            this.a = a;
            this.r = r;
            this.g = g;
            this.b = b;
        }

        private a:number;
        private r:number;
        private g:number;
        private b:number;

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

    }


export=Color4;
