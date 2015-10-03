import Vector3 = require("./Vector3");
import Matrix = require("./Matrix");
import glm = require("gl-matrix");
import JThreeLogger = require("../Base/JThreeLogger");
import AABB = require("./AABB");
class PointList
{
  public points:Vector3[];

  constructor(pointList?:PointList)
  {
    if(pointList)
    {
      this.points = new Array(pointList.points.length);
      for(let i = 0; i < pointList.points.length; i++)
      {
        this.points[i] = Vector3.copy(pointList.points[i]);
      }
    }else
    {
      this.points = [];
    }
  }

  public addPoint(point:Vector3)
  {
    this.points.push(point);
  }

  public transform(transformMatrix:Matrix)
  {
    for(let i = 0;i < this.points.length; i++)
    {
      glm.vec3.transformMat4(this.points[i].rawElements,this.points[i].rawElements,transformMatrix.rawElements);
    }
  }

  public clear()
  {
    this.points.length = 0;
  }

  public debugShow()
  {
    var log="";
    for(let i = 0; i < this.points.length; i++)
    {
      log += `${this.points[i]}
`;
    }
    JThreeLogger.sectionLongLog("Pointlist",log);
  }

  public getBoundingBox()
  {
    var aabb = new AABB();
    for(let i = 0; i < this.points.length; i++)
    {
      aabb.expandAABB(this.points[i]);
    }
    return aabb;
  }

  public static initializeWithCube(list:PointList)
  {
    list.clear();
    list.addPoint(new Vector3( -1.0, +1.0, -1.0 ));
    list.addPoint(new Vector3( -1.0, -1.0, -1.0 ));
    list.addPoint(new Vector3( +1.0, -1.0, -1.0 ));
    list.addPoint(new Vector3( +1.0, +1.0, -1.0 ));
    list.addPoint(new Vector3( -1.0, +1.0, +1.0 ));
    list.addPoint(new Vector3( -1.0, -1.0, +1.0 ));
    list.addPoint(new Vector3( +1.0, -1.0, +1.0 ));
    list.addPoint(new Vector3( +1.0, +1.0, +1.0 ));
    return list;
  }

  public static copy(list:PointList)
  {

  }
}

export = PointList;
