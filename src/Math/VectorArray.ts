import Vector4 from "./Vector4";
import Vector3 from "./Vector3";
import Vector2 from "./Vector2";
import VectorBase from "./VectorBase";
/**
 *  The array object for managing vectors having specific dimension.
 */
class VectorArray {

  public rawElements: number[];

  private _dimension: number;

  /**
   * Generate vector array filled with zero vectors.
   * @param  {number}      dimension [description]
   * @param  {number}      length   [description]
   * @return {VectorArray}          [description]
   */
  public static zeroVectorArray(dimension: number, length: number): VectorArray {
    const array = new VectorArray(dimension * length);
    for (let i = 0; i < dimension * length; i++) {
      array.rawElements[i] = 0;
    }
    array._dimension = dimension;
    return array;
  }

  public static fromArray(dimension: number, source: number[]): VectorArray {
    const array = new VectorArray(source.length);
    array._dimension = dimension;
    for (let i = 0; i < source.length; i++) {
      array.rawElements[i] = source[i];
    }
    return array;
  }

  public static equals(v1: VectorArray, v2: VectorArray): boolean {
    if (v1.rawElements.length !== v2.rawElements.length || v1._dimension !== v2._dimension) {
      return false;
    }
    for (let i = 0; i < v1.rawElements.length; i++) {
      if (v1.rawElements[i] !== v2.rawElements[i]) {
        return false;
      }
    }
    return true;
  }

  constructor(length?: number) {
    if (length) {
      this.rawElements = new Array(length);
    } else {
      this.rawElements = [];
    }
  }

  public equalWith(v1: VectorArray): boolean {
    return VectorArray.equals(this, v1);
  }

  public appendVector(vector: VectorBase): void {
    this._verifyDimension(vector);
    this.rawElements.push(<any>vector.rawElements);
  }

  public setVector(index: number, vector: VectorBase): void {
    this._verifyDimension(vector);
    for (let elemIndex = 0; elemIndex < vector.ElementCount; elemIndex++) {
      this.rawElements[index * this._dimension + elemIndex] = vector.rawElements[elemIndex];
    }
    return;
  }

  public setRawArray(index: number, rawArray: number[]): void {
    for (let elemIndex = 0; elemIndex < this._dimension; elemIndex++) {
      this.rawElements[index * this._dimension + elemIndex] = rawArray[elemIndex] ? rawArray[elemIndex] : 0;
    }
    return;
  }

  public getVector<T extends VectorBase>(index: number): T {
    switch (this._dimension) {
      case 2:
        return <T><any>new Vector2(this.rawElements[index * this._dimension + 0], this.rawElements[index * this._dimension + 1]);
      case 3:
        return <T><any>new Vector3(this.rawElements[index * this._dimension + 0], this.rawElements[index * this._dimension + 1], this.rawElements[index * this._dimension + 2]);
      case 4:
        return <T><any>new Vector4(this.rawElements[index * this._dimension + 0], this.rawElements[index * this._dimension + 1], this.rawElements[index * this._dimension + 2], this.rawElements[index * this._dimension + 3]);
      default:
        return null;
    }
  }

  public setVectorArray(vectors: VectorBase[], offset = 0): void {
    if (vectors.length === 0) {
      return;
    }
    this._verifyDimension(vectors[0]);
    vectors.forEach((e, i) => {
      if (this._dimension !== e.ElementCount) {
        throw new Error(`Unmatch unit size of vector element! at:${i}`);
      }
      for (let elemIndex = 0; elemIndex < this._dimension; elemIndex++) {
        this.rawElements[offset + this._dimension * i + elemIndex] = e.rawElements[elemIndex];
      }
    });
    return;
  }

  public getVectorArray<T extends VectorBase>(): T[] {
    if (this.rawElements.length === 0) {
      return [];
    }
    const result = new Array(this.rawElements.length / this._dimension);
    for (let i = 0; i < result.length; i++) {
      result[i] = this.getVector<T>(i);
    }
    return result;
  }

  public get dimension(): number {
    return this._dimension;
  }

  private _verifyDimension(vector: VectorBase): void {
    if (typeof this._dimension !== "undefined" && this._dimension !== vector.ElementCount) {
      throw new Error("Unmatch unit size of vectors!");
    } else if (typeof this._dimension === "undefined") {
      this._dimension = vector.ElementCount;
    }
  }
}

export default VectorArray;
