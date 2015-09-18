import Vector3 = require("./Vector3");
import Matrix = require("./Matrix");
import glm = require("gl-matrix");
class PointList
{
  public points:Vector3[] = [];

  constructor()
  {
  }

  public addPoint(point:Vector3)
  {
    this.points.push(point);
  }

  public transform(transformMatrix:Matrix)
  {
    for(let i = 0;i < this.points.length; i++)
    {
      glm.vec3.transformMat4(this.points[i].targetVector,this.points[i].targetVector,transformMatrix.rawElements);
    }
  }
}

export = PointList;
