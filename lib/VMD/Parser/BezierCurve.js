class BezierCurve {
    constructor(v1x, v1y, v2x, v2y) {
        this._v1x = v1x;
        this._v1y = v1y;
        this._v2x = v2x;
        this._v2y = v2y;
    }
    evaluate(progress) {
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
    _fy(t) {
        // _fy(t)=(1-t)^3*0+3*(1-t)^2*t*v1.y+3*(1-t)*t^2*v2.y+t^3*1
        return 3 * (1 - t) * (1 - t) * t * this._v1y + 3 * (1 - t) * t * t * this._v2y + t * t * t;
    }
    _fx(t) {
        // fx(t)=(1-t)^3*0+3*(1-t)^2*t*v1.x+3*(1-t)*t^2*v2.x+t^3*1
        return 3 * (1 - t) * (1 - t) * t * this._v1x + 3 * (1 - t) * t * t * this._v2x + t * t * t;
    }
    _dfxdt(t) {
        // dfx(t)/dt=-6(1-t)*t*v1.x+3(1-t)^2*v1.x-3t^2*v2.x+6(1-t)*t*v2.x+3t^2
        return -6 * (1 - t) * t * this._v1x + 3 * (1 - t) * (1 - t) * this._v1x - 3 * t * t * this._v2x + 6 * (1 - t) * t * this._v2x + 3 * t * t;
    }
    _clamp(p, min, max) {
        return Math.max(min, Math.min(p, max));
    }
}
BezierCurve._epsilon = 1.0E-3;
export default BezierCurve;
