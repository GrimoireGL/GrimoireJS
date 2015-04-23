module jThree.Color {
    export class Color4 extends jThree.Mathematics.Vector.VectorBase {
        constructor(r: number, g: number, b: number, a: number) {
            super();
            this.a = a;
            this.r = r;
            this.g = g;
            this.b = b;
        }

        get ElementCount(): number { return 4; }

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
}