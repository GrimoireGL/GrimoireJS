import {GLM} from "gl-matrix";
import IVectorParseDescription from "./IVectorParseDescription";
class VectorBase {

  public rawElements: GLM.IArray;
  private _magnitudeSquaredCache: number = -1;
  private _magnitudeCache: number = -1;

  public get magnitude() {
    if (this._magnitudeCache < 0) {
      this._magnitudeCache = Math.sqrt(this.sqrMagnitude);
    }
    return this._magnitudeCache;
  }

  public get ElementCount(): number {
    return 0;
  }

  public get sqrMagnitude(): number {
    if (this._magnitudeSquaredCache < 0) {
      let sum = 0;
      let r = this.rawElements;
      for (let i = 0; i < this.ElementCount; i++) {
        sum += r[i] * r[i];
      }
      this._magnitudeSquaredCache = sum;
    }
    return this._magnitudeSquaredCache;
  }

  protected static __elementEquals(v1: VectorBase, v2: VectorBase): boolean {
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

  protected static __nearlyElementEquals(v1: VectorBase, v2: VectorBase): boolean {
    if (v1.ElementCount !== v2.ElementCount) {
      return false;
    }
    let error = 0.01;
    for (let i = 0; i < v1.ElementCount; i++) {
      if (Math.abs(v1.rawElements[i] - v2.rawElements[i]) > error) {
        return false;
      }
    }
    return true;
  }

  protected static __fromGenerationFunction<T extends VectorBase>(v1: T, v2: T, gen: (i: number, v1: T, v2: T) => number): GLM.IArray {
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
        throw new Error(`The specified string '${str}' is not containing braced vector.`);
      }
      return {
        needNormalize: matches[3] === "n",
        needNegate: matches[1] === "-",
        coefficient: parseFloat(matches[2]),
        elements: VectorBase._parseRawVector(matches[4])
      };
    } else {
      // Assume this is simplified format.
      return {
        needNormalize: false,
        needNegate: false,
        elements: VectorBase._parseRawVector(str),
        coefficient: undefined
      };
    }
  }

  private static _parseRawVector(str: string): number[] {
    const splitted = str.split(",");
    const result = new Array(splitted.length);
    for (let i = 0; i < splitted.length; i++) {
      result[i] = parseFloat(splitted[i]);
      if (isNaN(result[i])) {
        throw new Error(`Unexpected vector string ${str}`);
      }
    }
    return result;
  }
}

export default VectorBase;
