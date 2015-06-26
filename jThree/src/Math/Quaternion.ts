import JThreeObject = require("../Base/JThreeObject");
import Vector3 = require("./Vector3");
import glm = require('glm');
/**
* The class to maniplate quaternion.
* Each element will be represented as (w;x,y,z)
* (1,i,j,k) is base axis for quaternion. (i,j,k is pure imaginary number)
* (w;x,y,z) means w*1+x*i+y*j+z*k
*/
class Quaternion extends JThreeObject
{
  public static get Identity():Quaternion
  {
    return new Quaternion(glm.quat.create());
  }


  /**
  * Constructor by specifing each elements.
  */
  constructor(targetQuat:glm.GLM.IArray){
    super();
    this.targetQuat=targetQuat;
  }

  public targetQuat:glm.GLM.IArray;

/**
* Getter for X.
*/
  get X():number
  {
    return this.targetQuat[0];
  }

  /**
  * Getter for Y.
  */
  get Y():number
  {
    return this.targetQuat[1];
  }

  /**
  * Getter for Z.
  */
  get Z():number
  {
    return this.targetQuat[2];
  }

  /**
  * Getter for W.
  */
  get W():number
  {
    return this.targetQuat[3];
  }

/**
* Getter for imaginary part vector.
* It returns the vector (x,y,z)
*/
  get ImaginaryPart():Vector3
  {
    return new Vector3(this.X,this.Y,this.Z);
  }

/**
* Get the conjugate of this quaternion
*/
  get Conjugate():Quaternion
  {
    var newQuat=glm.quat.create();
    return new Quaternion(glm.quat.conjugate(newQuat,this.targetQuat));
  }

/**
* Get the length
*/
  get Length():number
  {
    return glm.quat.len(this.targetQuat);
  }
/**
* Get normalized quaternion
*/
  Normalize():Quaternion
  {
    var newQuat=glm.quat.create();
    return new Quaternion(glm.quat.normalize(newQuat,this.targetQuat));
  }

  public Inverse():Quaternion
  {
    var newQuat=glm.quat.create();
    return new Quaternion(glm.quat.invert(newQuat,this.targetQuat));
  }

/**
* Calculate add result of two quaternion
*/
  public static Add(q1:Quaternion,q2:Quaternion):Quaternion
  {
    var newQuat=glm.quat.create();
    
    return new Quaternion(glm.quat.add(newQuat,q1.targetQuat,q2.targetQuat));
  }

/**
* Calculate Multiply result of two quaternion
*/
  public static Multiply(q1:Quaternion,q2:Quaternion):Quaternion
  {
    var newQuat=glm.quat.create();
    return new Quaternion(glm.quat.mul(newQuat,q1.targetQuat,q2.targetQuat));
  }

/**
* Calculate the rotation quaternion represented as pair of angle and axis.
*/
  public static AngleAxis(angle:number,axis:Vector3):Quaternion
  {
    var axisVec=glm.vec3.create();
    axisVec[0]=axis.X;
    axisVec[1]=axis.Y;
    axisVec[2]=axis.Z;
    var newQuat=glm.quat.create();
    return new Quaternion(glm.quat.setAxisAngle(newQuat,axisVec,angle));
  }

  public static Eular(x:number,y:number,z:number):Quaternion
  {
    return Quaternion.Multiply(Quaternion.AngleAxis(z,Vector3.ZUnit),Quaternion.Multiply(Quaternion.AngleAxis(x,Vector3.XUnit),Quaternion.AngleAxis(y,Vector3.YUnit)));
  }


  public static Slerp(q1:Quaternion,q2:Quaternion,t:number):Quaternion
  {
    var newQuat=glm.quat.create();
    return new Quaternion(glm.quat.slerp(newQuat,q1.targetQuat,q2.targetQuat,t));
  }

  public toAngleAxisString()
  {
    var angle=2*Math.acos(this.W);
    var imm=Math.sqrt(1-this.W*this.W);
    if(angle!=180&&angle!=0)
    {//avoid singularities
      return `axis(${angle},${this.X/imm},${this.Y/imm},${this.Z/imm})`;
    }else if(angle==0)
    {
      return `axis(${angle},0,1,0)`;
    }else
    {
      return `axis(180d,${this.X},${this.Y},${this.Z})`;
    }
  }
}

export=Quaternion;
