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
    array._dimension = 0;
    return array;
  }

  constructor(length?: number) {
    if (length) {
      this.rawElements = new Array(length);
    } else {
      this.rawElements = [];
    }
  }

  public appendVector(vector: VectorBase): void {
    this._verifyDimension(vector);
    this.rawElements.push(<any>vector.rawElements);
  }

  public setVector(index: number, vector: VectorBase) {
    this._verifyDimension(vector);
    for (let elemIndex = 0; elemIndex < vector.ElementCount; elemIndex++) {
      this.rawElements[index * this._dimension + elemIndex] = vector.rawElements[elemIndex];
    }
  }

  public setRawArray(index: number, rawArray: number[]) {
    for (let elemIndex = 0; elemIndex < this._dimension; elemIndex++) {
     this.rawElements[index * this._dimension + elemIndex] = rawArray[elemIndex] ? rawArray[elemIndex] : 0;
    }
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

  public setVectorArray(vectors: VectorBase[], offset = 0) {
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
