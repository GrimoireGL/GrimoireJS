import Quaternion = require("../../Math/Quaternion");
import Vector3 = require("../../Math/Vector3");
import Matrix = require("../../Math/Matrix");
import SceneObject = require("../SceneObject");
import JThreeObject = require("../../Base/JThreeObject");
import Delegates = require("../../Base/Delegates");
import glm = require('glm');
import RendererBase = require('./../Renderers/RendererBase');
import JThreeEvent = require('./../../Base/JThreeEvent');
/**
 * Position,rotation and scale of scene object.
 * Every scene object in a scene has Toransformer.It's used to store and manipulate the position,rotation and scale ob the object.
 * Every Transformer can have a parent, each parent Transformer affect children's Transformer hierachically.
 */
class Transformer extends JThreeObject {
  /**
   * Constructor of Transformer
   * @param sceneObj the scene object this transformer attached to.
   */
  constructor(sceneObj: SceneObject) {
    super();
    this.relatedTo = sceneObj;
    this.position = Vector3.Zero;
    this.rotation = Quaternion.Identity;
    this.scale = new Vector3(1, 1, 1);
    this.foward = new Vector3(0, 0, -1);
    this.updateTransform();
  }
  /**
   * Scene oject reference this transformer related to.
   */
  private relatedTo: SceneObject;
  
  /**
   * backing field of Rotation.
   */
  private rotation: Quaternion;
  
  /**
   * backing field of Position.
   */
  private position: Vector3;
  
  /**
   * backing field of Scale.
   */
  private scale: Vector3;
  
  /**
   * backing filed of Foward.
   */
  private foward: Vector3;

  /**
   * backing field of LocalTransform.
   */
  private localTransform: Matrix;

  /**
   * backing field of LocalToGlobal
   */
  private localToGlobal: Matrix;
  
  /**
   * calculation cache
   */
  private cacheMat: glm.GLM.IArray=glm.mat4.create();

  private cacheMat2: glm.GLM.IArray=glm.mat4.create();
  
  /**
   * properties for storeing event handlers
   */
  private onUpdateTransformHandler: JThreeEvent<SceneObject> = new JThreeEvent<SceneObject>();

  /**
   * Subscribe event handlers it will be called when this transformer's transform was changed.
   * @param action the event handler for this event.
   */
  public onUpdateTransform(action: Delegates.Action2<Transformer, SceneObject>): void {
    this.onUpdateTransformHandler.addListerner(action);
  }
  /**
   * update all transform
   * You no need to call this method manually if you access all of properties in this transformer by accessor.
   */
  public updateTransform(): void {//TODO optimize this
    glm.mat4.identity(this.cacheMat);
    glm.mat4.scale(this.cacheMat, this.cacheMat, this.Scale.targetVector);
    glm.mat4.fromQuat(this.cacheMat2, this.rotation.targetQuat);
    glm.mat4.multiply(this.cacheMat, this.cacheMat, this.cacheMat2);
    glm.mat4.identity(this.cacheMat2);
    glm.mat4.translate(this.cacheMat2, this.cacheMat2, this.position.targetVector);
    glm.mat4.multiply(this.cacheMat, this.cacheMat, this.cacheMat2);
    this.localTransform = new Matrix(this.cacheMat);
    if (this.relatedTo != null && this.relatedTo.Parent != null) {
      glm.mat4.copy(this.cacheMat2, this.relatedTo.Parent.Transformer.LocalToGlobal.rawElements);
    } else {
      glm.mat4.identity(this.cacheMat2);
    }
    this.localToGlobal = new Matrix(glm.mat4.multiply(this.cacheMat2, this.cacheMat2, this.localTransform.rawElements));
    this.foward = Matrix.transformNormal(this.localToGlobal, new Vector3(0, 0, -1)).normalizeThis();
    this.relatedTo.Children.each((v) => {
      v.Transformer.updateTransform();
    });
    this.onUpdateTransformHandler.fire(this, this.relatedTo);
  }
  /**
   * Calculate Projection-View-Model matrix with renderer camera.
   */
  public calculateMVPMatrix(renderer: RendererBase): Matrix {//TODO optimize this by glm
    return Matrix.multiply(Matrix.multiply(renderer.Camera.ProjectionMatrix, renderer.Camera.ViewMatrix), this.LocalToGlobal);
  }
  /**
   * Get accessor for the direction of foward of this model.
   */
  public get Foward(): Vector3 {
    return this.foward;
  }
  /**
   * Get accessor for the matrix providing the transform Local space into Global space.
   */
  get LocalToGlobal(): Matrix {
    return this.localToGlobal;
  }
  /**
   * Get accessor for model rotation.
   */
  get Rotation(): Quaternion {
    return this.rotation;
  }
  /**
   * Set accessor for model rotation.
   */
  set Rotation(quat: Quaternion) {
    this.rotation = quat;
    this.updateTransform();
  }
  /**
   * Get Accessor for model position.
   */
  get Position(): Vector3 {
    return this.position
  }
  /**
   * Set Accessor for model position.
   */
  set Position(vec: Vector3) {
    this.position = vec;
    this.updateTransform();
  }
  
  /**
   * Get Accessor for model scale.
   */
  get Scale(): Vector3 {
    return this.scale;
  }
  
  /**
   * Set Accessor for model scale.
   */
  set Scale(vec: Vector3) {
    this.scale = vec;
    this.updateTransform();
  }
}

export =Transformer;
