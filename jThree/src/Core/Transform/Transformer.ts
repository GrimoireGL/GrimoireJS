import Quaternion= require("../../Math/Quaternion");
import Vector3 = require("../../Math/Vector3");
import Matrix = require("../../Math/Matrix");
import SceneObject = require("../SceneObject");
import JThreeObject = require("../../Base/JThreeObject");
import Delegates = require("../../Delegates");
class Transformer extends JThreeObject
{
  constructor(sceneObj:SceneObject)
  {
    super();
    this.relatedTo=sceneObj;
    this.position=Vector3.Zero;
    this.rotation=Quaternion.Identity;
    this.scale=new Vector3(1,1,1);
    this.updateTransform();
  }
  private relatedTo:SceneObject;

  private rotation:Quaternion;

  private position:Vector3;

  private scale:Vector3;

  private localTransofrm:Matrix;

  private localToGlobal:Matrix;

  private onUpdateTransformHandler:Delegates.Action1<SceneObject>[]=[];

  public onUpdateTransform(action:Delegates.Action1<SceneObject>):void
  {
    this.onUpdateTransformHandler.push(action);
  }

  private notifyOnUpdateTransform():void
  {
    this.onUpdateTransformHandler.forEach((v:Delegates.Action1<SceneObject>)=>{v(this.relatedTo);});
  }

  public updateTransform():void
  {
    this.localTransofrm=Matrix.TRS(this.position,this.rotation,this.scale);
    this.localToGlobal=Matrix.multiply(this.relatedTo!=null&&this.relatedTo.Parent!=null?this.relatedTo.Parent.Transformer.localToGlobal:Matrix.identity(),this.localTransofrm);
    this.relatedTo.Children.each((v)=>{
      v.Transformer.updateTransform();
    });
    this.notifyOnUpdateTransform();
    console.log(this.localToGlobal.toString());
  }

  get LocalToGlobal():Matrix
  {
    return this.localToGlobal;
  }

  get Rotation():Quaternion
  {
    return this.rotation;
  }

  set Rotation(quat:Quaternion)
  {
    this.rotation=quat;
    this.updateTransform();
  }

  get Position():Vector3
  {
    return this.position
  }

  set Position(vec:Vector3)
  {
    this.position=vec;
    this.updateTransform();
  }

  get Scale():Vector3
  {
    return this.scale;
  }

  set Scale(vec:Vector3)
  {
    this.scale=vec;
    this.updateTransform();
  }
}

export =Transformer;
