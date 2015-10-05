import SceneObject = require("../SceneObject");
import Vector3 = require("../../Math/Vector3");
import Matrix = require("../../Math/Matrix");
import Exceptions = require("../../Exceptions");
import glm = require("gl-matrix");
import PointList = require("../../Math/PointList");

/**
 * Basement class of Camera. These class related to camera are one of SceneObject in jThree.
 */
class Camera extends SceneObject
{
	private viewProjectionMatrixCache = new Float32Array(16);

	private viewProjectionInvMatrixCache = new Float32Array(16);

	private viewProjectionMatrix:Matrix = new Matrix(this.viewProjectionMatrixCache);

	private viewProjectionInvMatrix:Matrix = new Matrix(this.viewProjectionInvMatrixCache);

	/**
	 * View frustum vertex points in World space
	 */
	public frustumPoints:PointList = new PointList();

	public viewMatrix:Matrix;
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
		glm.mat4.mul(this.viewProjectionMatrixCache,this.ProjectionMatrix.rawElements,this.viewMatrix.rawElements);
		glm.mat4.invert(this.viewProjectionInvMatrixCache,this.viewProjectionMatrixCache);
		PointList.initializeWithCube(this.frustumPoints);
		this.frustumPoints.transform(this.viewProjectionInvMatrix);
	}

	public update():void
	{
		super.update();
	}　　　
}

export=Camera;
