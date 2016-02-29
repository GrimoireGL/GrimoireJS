class BezierCurve {
  private static _epsilon: number = 1.0E-3;

  private _v1x: number;

  private _v2x: number;

  private _v1y: number;

  private _v2y: number;

  constructor(v1x: number, v1y: number, v2x: number, v2y: number) {
    this._v1x = v1x;
    this._v1y = v1y;
    this._v2x = v2x;
    this._v2y = v2y;
  }

  public evaluate(progress: number): number {
    // Newton method
    let t = this._clamp(progress, 0, 1);
    let dt;
    do {
      dt = -(this._fx(t) - progress) / this._dfxdt(t);
      if (isNaN(dt)) {
        break;
      }
      t += this._clamp(dt, -1, 1);
    } while (Math.abs(dt) > BezierCurve._epsilon);
    return this._clamp(this._fy(t), 0, 1);
  }

  private _fy(t: number): number {
    // _fy(t)=(1-t)^3*0+3*(1-t)^2*t*v1.y+3*(1-t)*t^2*v2.y+t^3*1
    return 3 * (1 - t) * (1 - t) * t * this._v1y + 3 * (1 - t) * t * t * this._v2y + t * t * t;
  }

  private _fx(t: number): number {
    // fx(t)=(1-t)^3*0+3*(1-t)^2*t*v1.x+3*(1-t)*t^2*v2.x+t^3*1
    return 3 * (1 - t) * (1 - t) * t * this._v1x + 3 * (1 - t) * t * t * this._v2x + t * t * t;
  }

  private _dfxdt(t: number): number {
    // dfx(t)/dt=-6(1-t)*t*v1.x+3(1-t)^2*v1.x-3t^2*v2.x+6(1-t)*t*v2.x+3t^2
    return -6 * (1 - t) * t * this._v1x + 3 * (1 - t) * (1 - t) * this._v1x - 3 * t * t * this._v2x + 6 * (1 - t) * t * this._v2x + 3 * t * t;
  }

  private _clamp(p: number, min: number, max: number): number {
    return Math.max(min, Math.min(p, max));
  }
}

export default BezierCurve;
