class SampleClass {
  constructor(a : number) {
    this._a = a;
  }

  private _a : number;

  public times(b) : number {
    return this._a * b;
  }
}

export = SampleClass;
