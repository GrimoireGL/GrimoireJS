import SceneObject = require("../SceneObject");
import Vector3 = require("../../Math/Vector3");
import Matrix = require("../../Math/Matrix");
import Exceptions = require("../../Exceptions"); //カメラ関係のクラスの基底クラス
class Camera extends SceneObject
{
	constructor()
	{
		super();
	}
	//カメラ位置
    public get Position():Vector3
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}

    public set Position(pos:Vector3)
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}

	//カメラ視線方向
    public get LookAt():Vector3
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}

    public set LookAt(vec:Vector3)
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}

	//カメラ上方向
    public get UpDirection():Vector3
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}

    public set UpDirection(vec:Vector3)
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}

    public get ViewMatrix():Matrix
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}

    public get ProjectionMatrix():Matrix
	{
		throw new Exceptions.AbstractClassMethodCalledException();
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
