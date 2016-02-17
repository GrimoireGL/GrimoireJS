import {GLM} from "gl-matrix";
import {Func3} from "../Base/Delegates";
import {InvalidStringException} from "../Exceptions";
interface IVectorParseDescription {
  needNormalize: boolean;
  needNegate: boolean;
  coefficient: number;
  elements: number[];
}

class VectorBase {

  public rawElements: GLM.IArray;
  private magnitudeSquaredCache: number = -1;
  private magnitudeCache: number = -1;

  public get magnitude() {
    if (this.magnitudeCache < 0) {
      this.magnitudeCache = Math.sqrt(this.sqrMagnitude);
    }
    return this.magnitudeCache;
  }

  public get ElementCount(): number {
    return 0;
  }

  public get sqrMagnitude(): number {
    if (this.magnitudeSquaredCache < 0) {
      let sum = 0;
      let r = this.rawElements;
      for (let i = 0; i < this.ElementCount; i++) {
        sum += r[i] * r[i];
      }
      this.magnitudeSquaredCache = sum;
    }
    return this.magnitudeSquaredCache;
  }

  protected static elementEqual(v1: VectorBase, v2: VectorBase): boolean {
    if (v1.ElementCount !== v2.ElementCount) {
      return false;
    }
    for (let i = 0; i < v1.ElementCount; i++) {
      if (v1.rawElements[i] !== v2.rawElements[i]) {
        return false;
      }
    }
    return true;
  }

  protected static fromGenerationFunction<T extends VectorBase>(v1: T, v2: T, gen: Func3<number, T, T, number>): GLM.IArray {
    let f = new Float32Array(v1.ElementCount);
    for (let i = 0; i < f.length; i++) {
      f[i] = gen(i, v1, v2);
    }
    return f;
  }

  protected static __parse(str: string): IVectorParseDescription {
    const checkRegex = /(-?)([\d,E\+\-\.]+)?(n)?\(([-\d,E\+\.\s]+)\)/g;
    const matches = checkRegex.exec(str);
    if (matches) {
      if (!matches[4]) { // When (x,x,x,x) was not specifed
        throw new InvalidStringException(`The specified string '${str}' is not containing braced vector.`);
      }
      return {
        needNormalize: matches[3] === "n",
        needNegate: matches[1] === "-",
        coefficient: parseFloat(matches[2]),
        elements: VectorBase.__parseRawVector(matches[4])
      };
    } else {
      // Assume this is simplified format.
      return {
        needNormalize: false,
        needNegate: false,
        elements: VectorBase.__parseRawVector(str),
        coefficient: undefined
      };
    }
  }

  private static __parseRawVector(str: string): number[] {
    const splitted = str.split(",");
    const result = new Array(splitted.length);
    for (let i = 0; i < splitted.length; i++) {
      result[i] = parseFloat(splitted[i]);
    }
    return result;
  }
}

export default VectorBase;
