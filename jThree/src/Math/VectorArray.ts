import Vector4 = require("./Vector4");
import Vector3 = require("./Vector3");
import Vector2 = require("./Vector2");
import VectorBase = require("./VectorBase");
class VectorArray {

  public rawElements: number[];

  private _unitSize: number;

  constructor(length?: number) {
    if (length) {
      this.rawElements = new Array(length);
    } else {
      this.rawElements = [];
    }
  }

  public appendVector(vector: VectorBase): void {
    this._verifyUnitSize(vector);
    this.rawElements.push(<any>vector.rawElements);
  }

  public setVector(index: number, vector: VectorBase) {
    this._verifyUnitSize(vector);
    for (let elemIndex = 0; elemIndex < vector.ElementCount; elemIndex++) {
      this.rawElements[index * this._unitSize + elemIndex] = vector.rawElements[elemIndex];
    }
  }

  public getVector<T extends VectorBase>(index: number): T {
    switch (this._unitSize) {
      case 2:
        return <T><any>new Vector2(this.rawElements[index * this._unitSize + 0], this.rawElements[index * this._unitSize + 1]);
      case 3:
        return <T><any>new Vector3(this.rawElements[index * this._unitSize + 0], this.rawElements[index * this._unitSize + 1], this.rawElements[index * this._unitSize + 2]);
      case 4:
        return <T><any>new Vector4(this.rawElements[index * this._unitSize + 0], this.rawElements[index * this._unitSize + 1], this.rawElements[index * this._unitSize + 2], this.rawElements[index * this._unitSize + 3]);
      default:
        return null;
    }
  }

  public setVectorArray(vectors: VectorBase[], offset = 0) {
    if (vectors.length === 0) {
      return;
    }
    this._verifyUnitSize(vectors[0]);
    vectors.forEach((e, i) => {
      if (this._unitSize !== e.ElementCount) {
        throw new Error(`Unmatch unit size of vector element! at:${i}`);
      }
      for (let elemIndex = 0; elemIndex < this._unitSize; elemIndex++) {
        this.rawElements[offset + this._unitSize * i + elemIndex] = e.rawElements[elemIndex];
      }
    });
  }

  public getVectorArray<T extends VectorBase>(): T[] {
    if (this.rawElements.length === 0) {
      return [];
    }
    const result = new Array(this.rawElements.length / this._unitSize);
    for (let i = 0; i < result.length; i++) {
      result[i] = this.getVector<T>(i);
    }
    return result;
  }

  public get unitSize(): number {
    return this._unitSize;
  }

  private _verifyUnitSize(vector: VectorBase): void {
    if (typeof this._unitSize !== "undefined" && this._unitSize !== vector.ElementCount) {
      throw new Error("Unmatch unit size of vectors!");
    } else if (typeof this._unitSize === "undefined") {
      this._unitSize = vector.ElementCount;
    }
  }
}

export = VectorArray;
