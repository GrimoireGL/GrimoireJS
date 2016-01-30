import {GLM} from "gl-matrix";
import {Func3} from "../Base/Delegates";
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

}

export default VectorBase;
