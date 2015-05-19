import SceneObject = require("../SceneObject");
import Vector3 = require("../../Math/Vector3");
import Matrix = require("../../Math/Matrix");
import Exceptions = require("../../Exceptions");
import Quaternion = require("../../Math/Quaternion");
//カメラ関係のクラスの基底クラス
class Camera extends SceneObject
{
	constructor()
	{
		super();
	}
	//カメラ位置
	get Position():Vector3
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}

	set Position(pos:Vector3)
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}

	//カメラ視線方向
	get LookAt():Vector3
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}

	set LookAt(vec:Vector3)
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}

	//カメラ上方向
	get UpDirection():Vector3
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}

	set UpDirection(vec:Vector3)
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}

	get ViewMatrix():Matrix
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}

	get ProjectionMatrix():Matrix
	{
		throw new Exceptions.AbstractClassMethodCalledException();
	}
	update():void
	{
		super.update();
	}　　　
}

export=Camera;
