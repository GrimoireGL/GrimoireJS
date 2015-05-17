import JThreeObject = require("../Base/JThreeObject");
import Vector3 = require("./Vector3");
class Quaternion extends JThreeObject
{
  constructor(x:number,y:number,z:number,w:number){
    super();
    this.x=x;
    this.y=y;
    this.z=z;
    this.w=w;
  }

  private x:number;
  private y:number;
  private z:number;
  private w:number;

  get X():number
  {
    return this.x;
  }

  get Y():number
  {
    return this.y;
  }

  get Z():number
  {
    return this.z;
  }

  get W():number
  {
    return this.w;
  }

  get ImaginaryPart():Vector3
  {
    return new Vector3(this.y,this.z,this.w);
  }

  get Conjugate():Quaternion
  {
    return new Quaternion(this.x,-this.y,-this.z,-this.w);
  }

  get Length():number
  {
    return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);
  }

  Normalize():Quaternion
  {
    var length=this.Length;
    return new Quaternion(this.x/length,this.y/length,this.z/length,this.w/length);
  }

  public static Add(q1:Quaternion,q2:Quaternion):Quaternion
  {
    return new Quaternion(q1.X+q2.X,q1.Y+q2.Y,q1.Z+q2.Z,q1.W+q2.W);
  }

  public static Multiply(q1:Quaternion,q2:Quaternion):Quaternion
  {
    var r1=q1.X,v1=q1.ImaginaryPart;
    var r2=q2.X,v2=q2.ImaginaryPart;
    var im=v1.multiplyWith(r2).addWith(v2.multiplyWith(r1)).addWith(Vector3.cross(v1,v2));
    return new Quaternion(r1*r2-v1.dotWith(v2),im.X,im.Y,im.Z);
  }

  public static AngleAxis(angle:number,axis:Vector3):Quaternion
  {
    axis=axis.normalizeThis();
    var im=Math.sin(angle/2);
    return new Quaternion(Math.cos(angle/2),im*axis.X,im*axis.Y,im*axis.Z);
  }
}

export=Quaternion;
