/**
 * The class providing expression of angle.
 */
class Angle {
  public static fromDegree(degree: number): Angle {
    return new Angle(degree / 360 * 2 * Math.PI);
  }

  public radian: number;

  constructor(radian: number) {
    this.radian = radian;
  }
}

export default Angle;
