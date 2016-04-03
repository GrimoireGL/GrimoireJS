import Vector3 from "./Vector3";
import Matrix from "./Matrix";
import {vec3} from "gl-matrix";
import JThreeLogger from "../Base/JThreeLogger";
import AABB from "./AABB";
class PointList {
  public points: Vector3[];

  constructor(pointList?: PointList) {
    if (pointList) {
      this.points = new Array(pointList.points.length);
      for (let i = 0; i < pointList.points.length; i++) {
        this.points[i] = Vector3.copy(pointList.points[i]);
      }
    } else {
      this.points = [];
    }
  }

  public static initializeWithCube(list: PointList): PointList {
    list.clear();
    list.addPoint(new Vector3(-1.0, +1.0, -1.0));
    list.addPoint(new Vector3(-1.0, -1.0, -1.0));
    list.addPoint(new Vector3(+1.0, -1.0, -1.0));
    list.addPoint(new Vector3(+1.0, +1.0, -1.0));
    list.addPoint(new Vector3(-1.0, +1.0, +1.0));
    list.addPoint(new Vector3(-1.0, -1.0, +1.0));
    list.addPoint(new Vector3(+1.0, -1.0, +1.0));
    list.addPoint(new Vector3(+1.0, +1.0, +1.0));
    return list;
  }

  public addPoint(point: Vector3): void {
    this.points.push(point);
  }

  public transform(transformMatrix: Matrix): void {
    for (let i = 0; i < this.points.length; i++) {
      vec3.transformMat4(this.points[i].rawElements, this.points[i].rawElements, transformMatrix.rawElements);
    }
    return;
  }

  public clear(): void {
    this.points.length = 0;
    return;
  }

  public debugShow(): void {
    let log = "";
    for (let i = 0; i < this.points.length; i++) {
      log += `${this.points[i]}
`;
    }
    JThreeLogger.sectionLongLog("Pointlist", log);
    return;
  }

  public getBoundingBox(): AABB {
    let aabb = new AABB();
    for (let i = 0; i < this.points.length; i++) {
      aabb.expandAABB(this.points[i]);
    }
    return aabb;
  }

  public toMathematicaPoints(): string {
    let points = "";
    for (let i = 0; i < this.points.length; i++) {
      if (i !== 0) {
        points += `,`;
      }
      points += this.points[i].toMathematicaString();
    }
    return `Point[{${points}}]`;
  }
}

export default PointList;
