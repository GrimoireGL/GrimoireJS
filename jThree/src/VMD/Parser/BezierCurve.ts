class BezierCurve {
  private static Epsilon = 1.0E-3;

  private v1x: number;

  private v2x: number;

  private v1y: number;

  private v2y: number;

  constructor(v1x: number, v1y: number, v2x: number, v2y: number) {
    this.v1x = v1x;
    this.v1y = v1y;
    this.v2x = v2x;
    this.v2y = v2y;
  }

  public evaluate(progress: number) {
    // Newton method
    var t = this.clamp(progress, 0, 1);
    var dt;
    do {
      dt = -(this.fx(t) - progress) / this.dfxdt(t);
      if (isNaN(dt))
        break;
      t += this.clamp(dt, -1, 1);
    } while (Math.abs(dt) > BezierCurve.Epsilon);
    return this.clamp(this.fy(t), 0, 1);
  }

  private clamp(p: number, min: number, max: number) {
    return Math.max(min, Math.min(p, max));
  }

  public fy(t: number) {
    // fy(t)=(1-t)^3*0+3*(1-t)^2*t*v1.y+3*(1-t)*t^2*v2.y+t^3*1
    return 3 * (1 - t) * (1 - t) * t * this.v1y + 3 * (1 - t) * t * t * this.v2y + t * t * t;
  }

  public fx(t: number) {
    // fx(t)=(1-t)^3*0+3*(1-t)^2*t*v1.x+3*(1-t)*t^2*v2.x+t^3*1
    return 3 * (1 - t) * (1 - t) * t * this.v1x + 3 * (1 - t) * t * t * this.v2x + t * t * t;
  }

  public dfxdt(t: number) {
    // dfx(t)/dt=-6(1-t)*t*v1.x+3(1-t)^2*v1.x-3t^2*v2.x+6(1-t)*t*v2.x+3t^2
    return -6 * (1 - t) * t * this.v1x + 3 * (1 - t) * (1 - t) * this.v1x - 3 * t * t * this.v2x + 6 * (1 - t) * t * this.v2x + 3 * t * t;
  }
}

export = BezierCurve;
