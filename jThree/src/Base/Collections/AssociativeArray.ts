/**
* AssociativeArray string with an object.
*/
class AssociativeArray<T> implements Map<string, T>
{
  private target: Map<string, T> = new Map<string, T>();

    public clear(): void {
    this.target.clear();
  }

    public delete(key: string): boolean {
    return this.target.delete(key);
  }

    public forEach(callbackfn: (value: T, index: string, map: Map<string, T>) => void, thisArg?: any): void {
    this.target.forEach(callbackfn, thisArg);
  }

    public get(key: string): T {
    return this.target.get(key);
  }

    public has(key: string): boolean {
    return this.target.has(key);
  }

    public set(key: string, value: T): AssociativeArray<T> {
    this.target.set(key, value);
    return this;
  }

    public get size(): number {
    return this.target.size;
  }

    public get asArray(): T[] {
    var array = new Array(this.size);
    var i = 0;
    this.forEach((v) => {
      array[i] = v;
      i++;
    }
      );
    return array;
  }

  public get length()
  {
    return this.target.size;
  }

}

export =AssociativeArray;
