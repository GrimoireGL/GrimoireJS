import JThreeObject = require("../Base/JThreeObject");
import Vector3 = require("./Vector3");
/**
* The class to maniplate quaternion.
* Each element will be represented as (x;y,z,w)
* (1,i,j,k) is base axis for quaternion. (i,j,k is pure imaginary number)
* (x;y,z,w) means x*1+y*i+z*j+w*k
*/
class Quaternion extends JThreeObject
{
  public static get Identity():Quaternion
  {
    return new Quaternion(1,0,0,0);
  }


  /**
  * Constructor by specifing each elements.
  */
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

/**
* Getter for X.
*/
  get X():number
  {
    return this.x;
  }

  /**
  * Getter for Y.
  */
  get Y():number
  {
    return this.y;
  }

  /**
  * Getter for Z.
  */
  get Z():number
  {
    return this.z;
  }

  /**
  * Getter for W.
  */
  get W():number
  {
    return this.w;
  }

/**
* Getter for imaginary part vector.
* It returns the vector (y,z,w)
*/
  get ImaginaryPart():Vector3
  {
    return new Vector3(this.y,this.z,this.w);
  }

/**
* Get the conjugate of this quaternion
*/
  get Conjugate():Quaternion
  {
    return new Quaternion(this.x,-this.y,-this.z,-this.w);
  }

/**
* Get the length
*/
  get Length():number
  {
    return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);
  }

/**
* Get normalized quaternion
*/
  Normalize():Quaternion
  {
    var length=this.Length;
    return new Quaternion(this.x/length,this.y/length,this.z/length,this.w/length);
  }

  public Inverse():Quaternion
  {
    var normalized=this.Normalize();
    return normalized.Conjugate;
  }

/**
* Calculate add result of two quaternion
*/
  public static Add(q1:Quaternion,q2:Quaternion):Quaternion
  {
    return new Quaternion(q1.X+q2.X,q1.Y+q2.Y,q1.Z+q2.Z,q1.W+q2.W);
  }

/**
* Calculate Multiply result of two quaternion
*/
  public static Multiply(q1:Quaternion,q2:Quaternion):Quaternion
  {
    var r1=q1.X,v1=q1.ImaginaryPart;
    var r2=q2.X,v2=q2.ImaginaryPart;
    var im=v1.multiplyWith(r2).addWith(v2.multiplyWith(r1)).addWith(Vector3.cross(v1,v2));
    return new Quaternion(r1*r2-v1.dotWith(v2),im.X,im.Y,im.Z);
  }

/**
* Calculate the rotation quaternion represented as pair of angle and axis.
*/
  public static AngleAxis(angle:number,axis:Vector3):Quaternion
  {
    axis=axis.normalizeThis();
    var im=Math.sin(angle/2);
    return new Quaternion(Math.cos(angle/2),im*axis.X,im*axis.Y,im*axis.Z);
  }

  public static Eular(x:number,y:number,z:number):Quaternion
  {
    return Quaternion.Multiply(Quaternion.AngleAxis(z,Vector3.ZUnit),Quaternion.Multiply(Quaternion.AngleAxis(x,Vector3.XUnit),Quaternion.AngleAxis(y,Vector3.YUnit)));
  }

  public Power(p:number):Quaternion
  {
    var angle=2*Math.acos(this.x);
    var imm=Math.sqrt(1-this.x*this.x);
    var sinP=Math.sin(angle/2*p)/imm;
    if(angle==0)
    {
      return Quaternion.Identity;
    }else{
      return new Quaternion(Math.cos(angle/2*p),sinP*this.y,sinP*this.z,sinP*this.w);
    }
  }

  public static Slerp(q1:Quaternion,q2:Quaternion,t:number):Quaternion
  {
    return Quaternion.Multiply(q1,Quaternion.Multiply(q1.Inverse(),q2).Power(t));
  }

  public toAngleAxisString()
  {
    var angle=2*Math.acos(this.x);
    var imm=Math.sqrt(1-this.x*this.x);
    if(angle!=180&&angle!=0)
    {//avoid singularities
      return "axis({0},{1},{2},{3})".format(angle,this.y/imm,this.z/imm,this.w/imm);
    }else if(angle==0)
    {
      return "axis({0},0,1,0)".format(angle);
    }else
    {
      return "axis(180d,{0},{1},{2})".format(this.y,this.z,this.w);
    }
  }
}

export=Quaternion;
