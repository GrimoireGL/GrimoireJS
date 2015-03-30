module jThree.Mathematics {
    import jThreeObject = jThree.Base.jThreeObject;
    import Func0 = jThree.Delegates.Func0;
    import Func1 = jThree.Delegates.Func1;
    export interface IUnitConverter {
        toRadian(val: number): number;
        fromRadian(radian: number): number;
        toMilliSecound(val: number): number;
        fromMilliSecound(milliSecound: number): number;
    }

    export class DegreeMilliSecoundUnitConverter extends jThreeObject implements IUnitConverter {
        toRadian(val: number): number {
            return jThreeMath.PI / 180 * val;
        }

        fromRadian(radian: number): number {
            return 180 / jThreeMath.PI * radian;
        }

        toMilliSecound(val: number): number {
            return val * 1000;
        }

        fromMilliSecound(milliSecound: number): number {
            return milliSecound / 1000;
        }
    }

    export class jThreeMath extends jThreeObject {
        public static PI: number = Math.PI;

        public static E: number = Math.E;

        private converter: IUnitConverter;

        private radianResult(f: Func0<number>): number {
            return this.converter.fromRadian(f());
        }

        private radianRequest(v: number, f: Func1<number, number>): number {
            return f(this.converter.toRadian(v));
        }

        public getCurrentConverter(): IUnitConverter {
            return this.converter;
        }

        constructor(unitConverter?: IUnitConverter) {
            super();
            this.converter = unitConverter || new DegreeMilliSecoundUnitConverter();
        }

        /**
         * 正弦
         */
        public sin(val: number): number {
            return this.radianRequest(val,(val) => {
                return Math.sin(val);
            });
        }
        /**
         * 余弦
         */
        public cos(val: number): number {
            return this.radianRequest(val,(val) => {
                return Math.cos(val);
            });
        }
        /**
         * 正接
         */
        public tan(val: number): number {
            return this.radianRequest(val,(val) => {
                return Math.tan(val);
            });
        }

        public asin(val: number): number {
            return this.radianResult(() => {
                return Math.asin(val);
            });
        }

        public acos(val: number): number {
            return this.radianResult(() => {
                return Math.acos(val);
            });
        }

        public atan(val: number): number {
            return this.radianResult(() => {
                return Math.atan(val);
            });
        }

        public static range(val: number, lower: number, higher: number): boolean {
            if (val >= lower && val < higher) {
                return true;
            } else {
                return false;
            }
        }

    }
}