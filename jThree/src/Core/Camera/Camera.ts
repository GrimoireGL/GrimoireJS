import SceneObject = require("../SceneObject");
import Vector3 = require("../../Math/Vector3");
import Matrix = require("../../Math/Matrix");
import Exceptions = require("../../Exceptions");
import glm = require("gl-matrix");
/**
 * Basement class of Camera. These class related to camera are one of SceneObject in jThree.
 */
class Camera extends SceneObject
{
	private viewProjectionMatrixCache = new Float32Array(16);

	private viewProjectionMatrix:Matrix = new Matrix(this.viewProjectionMatrixCache);
	/**
	 * Getter for position of this camera.
	 */
    public get Position():Vector3
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}
	/**
	 * Setter for position of this camera.
	 * By assign this setter, invokes updating camera matrix.
	 */
    public set Position(pos:Vector3)
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}

	/**
	 * Getter for the position camera being looking at.
	 */
    public get LookAt():Vector3
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}
	/**
	 * Setter for the position camera being looking at.
	 * By assign this setter, invokes updating camera matrix.
	 */
    public set LookAt(vec:Vector3)
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}

	/**
	 * Getter for the upper direction of camera.
	 */
    public get UpDirection():Vector3
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}
	/**
	 * Setter for the upper direction of camera.
	 * By assign this setter, invokes updating camera matrix.
	 */
    public set UpDirection(vec:Vector3)
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}
	/**
	 * Getter for view transform matrix of this camera.
	 */
  public get ViewMatrix():Matrix
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}
	/**
 	* Getter for projection transform matrix of this camera.
 	*/
    public get ProjectionMatrix():Matrix
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}

	public get ViewProjectionMatrix():Matrix{
		return this.viewProjectionMatrix;
	}

	protected updateViewProjectionMatrix()
	{
		glm.mat4.mul(this.viewProjectionMatrixCache,this.ProjectionMatrix.rawElements,this.ViewMatrix.rawElements);
	}

    public get Far():number
	{
		return undefined;
	}

    public get Near():number
	{
		return undefined;
	}

    public update():void
	{
		super.update();
	}　　　
}

export=Camera;
