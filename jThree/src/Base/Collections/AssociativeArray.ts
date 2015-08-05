/**
* AssociativeArray string with an object.
*/
class AssociativeArray<T> implements Map<string, T>
{
  private target: Map<string, T> = new Map<string, T>();
  clear(): void {
    this.target.clear();
  }
  delete(key: string): boolean {
    return this.target.delete(key);
  }
  forEach(callbackfn: (value: T, index: string, map: Map<string, T>) => void, thisArg?: any): void {
    this.target.forEach(callbackfn, thisArg);
  }
  get(key: string): T {
    return this.target.get(key);
  }
  has(key: string): boolean {
    return this.target.has(key);
  }
  set(key: string, value: T): AssociativeArray<T> {
    this.target.set(key, value);
    return this;
  }
  get size(): number {
    return this.target.size;
  }

  get asArray(): T[] {
    var array = new Array(this.size);
    var i = 0;
    this.forEach((v) => {
      array[i] = v;
      i++;
    }
      );
    return array;
  }

}

export =AssociativeArray;
