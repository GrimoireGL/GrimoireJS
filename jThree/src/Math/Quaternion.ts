import JThreeObject = require("../Base/JThreeObject");
import Vector3 = require("./Vector3");
import glm = require("gl-matrix");
import Matrix = require("./Matrix");
/**
* The class to maniplate quaternion.
* Basically,you don't need to operate raw element.
* You consider to use some of useful methods without editing raw element forcelly.
* Each element will be represented as (w;x,y,z)
* (1,i,j,k) is base axis for quaternion. (i,j,k is pure imaginary number)
* (w;x,y,z) means w*1+x*i+y*j+z*k
*
*/
class Quaternion extends JThreeObject
{
    public static get Identity(): Quaternion
    {
        return new Quaternion(glm.quat.create());
    }


    /**
    * Constructor by specifing each elements.
    */
    constructor(rawElements: glm.GLM.IArray)
    {
        super();
        this.rawElements = rawElements;
    }

    public rawElements: glm.GLM.IArray;

    public get eularAngles()
    {
        var eular = this.FactoringQuaternionZXY();
        return new Vector3(eular.x, eular.y, eular.z);
    }

    public set eularAngles(v: Vector3)
    {
        this.rawElements = Quaternion.Euler(v.X, v.Y, v.Z).rawElements;
    }

    /**
    * Getter for X.
    */
    public get X(): number
    {
        return this.rawElements[0];
    }

    /**
    * Getter for Y.
    */
    public get Y(): number
    {
        return this.rawElements[1];
    }

    /**
    * Getter for Z.
    */
    public get Z(): number
    {
        return this.rawElements[2];
    }

    /**
    * Getter for W.
    */
    public get W(): number
    {
        return this.rawElements[3];
    }

    /**
    * Getter for imaginary part vector.
    * It returns the vector (x,y,z)
    */
    public get ImaginaryPart(): Vector3
    {
        return new Vector3(this.X, this.Y, this.Z);
    }

    /**
    * Get the conjugate of this quaternion
    */
    public get Conjugate(): Quaternion
    {
        var newQuat = glm.quat.create();
        return new Quaternion(glm.quat.conjugate(newQuat, this.rawElements));
    }

    /**
    * Get the length
    */
    public get Length(): number
    {
        return glm.quat.len(this.rawElements);
    }
    /**
    * Get normalized quaternion
    */
    public Normalize(): Quaternion
    {
        var newQuat = glm.quat.create();
        return new Quaternion(glm.quat.normalize(newQuat, this.rawElements));
    }

    
    public Inverse(): Quaternion
    {
        var newQuat = glm.quat.create();
        return new Quaternion(glm.quat.invert(newQuat, this.rawElements));
    }

    /**
    * Calculate add result of two quaternion
    */
    public static Add(q1: Quaternion, q2: Quaternion): Quaternion
    {
        var newQuat = glm.quat.create();

        return new Quaternion(glm.quat.add(newQuat, q1.rawElements, q2.rawElements));
    }

    /**
    * Calculate Multiply result of two quaternion
    */
    public static Multiply(q1: Quaternion, q2: Quaternion): Quaternion
    {
        var newQuat = glm.quat.create();
        return new Quaternion(glm.quat.mul(newQuat, q1.rawElements, q2.rawElements));
    }

    /**
    * Calculate the rotation quaternion represented as pair of angle and axis.
    */
    public static AngleAxis(angle: number, axis: Vector3): Quaternion
    {
        var axisVec = glm.vec3.create();
        axisVec[0] = axis.X;
        axisVec[1] = axis.Y;
        axisVec[2] = axis.Z;
        var newQuat = glm.quat.create();
        return new Quaternion(glm.quat.setAxisAngle(newQuat, axisVec, angle));
    }

    public static Euler(x: number, y: number, z: number): Quaternion
    {
        return Quaternion.Multiply(Quaternion.AngleAxis(z, Vector3.ZUnit), Quaternion.Multiply(Quaternion.AngleAxis(x, Vector3.XUnit), Quaternion.AngleAxis(y, Vector3.YUnit)));
    }

    public static EulerXYZ(x: number, y: number, z: number): Quaternion
    {
        return Quaternion.Multiply(Quaternion.AngleAxis(z, Vector3.ZUnit), Quaternion.Multiply(Quaternion.AngleAxis(y, Vector3.YUnit), Quaternion.AngleAxis(x, Vector3.XUnit)));
    }


    public static Slerp(q1: Quaternion, q2: Quaternion, t: number): Quaternion
    {
        var newQuat = glm.quat.create();
        return new Quaternion(glm.quat.slerp(newQuat, q1.rawElements, q2.rawElements, t));
    }

    /**
     * Returns the angle in degrees between two rotations q1 and q2.
     * @param q1 the quaternion represents begin angle.
     * @param q2 the quaternion represents end angle.
     * @returns {number} angle represented in radians.
     */
    public static Angle(q1: Quaternion, q2: Quaternion): number
    {
        var delta = Quaternion.Multiply(q2, q1.Inverse());
        return 2 * Math.acos(delta.W);
    }

    public static FromToRotation(from:Vector3,to:Vector3)
    {
      var crossed = Vector3.cross(from.normalized,to.normalized);
      var angle = Vector3.dot(from.normalized,to.normalized);
      return Quaternion.AngleAxis(angle,crossed);
    }

    public static LookRotation(forward:Vector3,upVec?:Vector3)
    {
      upVec = upVec || Vector3.YUnit;
      var normalizedForward = forward.normalized;
      var upForwardCross = Vector3.cross(upVec,normalizedForward).normalized;
      var thirdAxis = Vector3.cross(normalizedForward,upForwardCross);
      var m00 = upForwardCross.X;
      var m01 = upForwardCross.Y;
      var m02 = upForwardCross.Z;
      var m10 = thirdAxis.X;
      var m11 = thirdAxis.Y;
      var m12 = thirdAxis.Z;
      var m20 = normalizedForward.X;
      var m21 = normalizedForward.Y;
      var m22 = normalizedForward.Z;

      var num8 = m00 + m11 + m22;

      if(num8 > 0)
      {
        var num = Math.sqrt(1 + num8);
        return new Quaternion([(m12-m21)*0.5/num,(m20-m02)*0.5/num,(m01-m10)*0.5/num,num/2]);
      }
      if(m00>=m11 && m00>=m22)
      {
        var num7 =Math.sqrt(1+m00-m11-m22);
        return new Quaternion([(m01+m10)*0.5/num7,(m02+m20)*0.5/num7,(m12-m21)*0.5/num7,num7/2]);
      }
      if(m11>m22)
      {
        var num6 = Math.sqrt(1+m11-m00-m22);
        return new Quaternion([(m10+m01)*0,5/num6,0.5*num6,(m21+m12)*0.5/num6,(m20-m02)*0.5/num6]);
      }
      var num5 = Math.sqrt(1+m22-m00-m11);
      return new Quaternion([(m20+m02)*0.5/num5,(m21+m12)*0.5/num5,0.5*num5,(m01-m10)*0.5/num5]);
    }

    public toAngleAxisString()
    {
        var angle = 2 * Math.acos(this.W);
        var imm = Math.sqrt(1 - this.W * this.W);
        if (angle != 180 && angle != 0)
        {//avoid singularities
            return `axis(${angle},${this.X / imm},${this.Y / imm},${this.Z / imm})`;
        } else if (angle == 0)
        {
            return `axis(${angle},0,1,0)`;
        } else
        {
            return `axis(180d,${this.X},${this.Y},${this.Z})`;
        }
    }

    public FactoringQuaternionZXY()
    {
        var result = { x: 0, y: 0, z: 0 };
        var mat = Matrix.RotationQuaternion(this);
        var sx = mat.rawElements[6];
        if (Math.abs(sx) < 1 - 1.0E-4)
        {
            result.x = Math.asin(sx);
            result.z = Math.atan2(-mat.rawElements[4], mat.rawElements[5]);
            result.y = Math.atan2(-mat.rawElements[2], mat.rawElements[10]);
        } else
        {
            result.y = 0;
            result.x = Math.PI / 2 * sx;
            result.z = Math.atan2(mat.rawElements[1], mat.rawElements[0]);
        }
        return result;
    }


    public FactoringQuaternionXYZ()
    {
        var result = { x: 0, y: 0, z: 0 };
        var mat = Matrix.RotationQuaternion(this);
        var sy = -mat.rawElements[2];
        if (Math.abs(sy) < 1 - 1.0E-4)
        {
            result.x = Math.atan2(mat.rawElements[6], mat.rawElements[10]);
            result.y = Math.asin(sy);
            result.z = Math.atan2(mat.rawElements[1], mat.rawElements[0]);
        } else
        {
            result.x = 0;
            result.y = Math.PI / 2 * sy;
            result.z = Math.atan2(-mat.rawElements[4], mat.rawElements[5]);
        }
        return result;
    }


}
export =Quaternion;
