import Quaternion from "../../Math/Quaternion";
import Vector3 from "../../Math/Vector3";
import Matrix from "../../Math/Matrix";
import SceneObject from "../SceneObjects/SceneObject";
import JThreeObject from "../../Base/JThreeObject";
import {Action2} from "../../Base/Delegates";
import {mat4, vec3, vec4} from "gl-matrix";
import BasicRenderer from "./../Renderers/BasicRenderer";
import JThreeEvent from "./../../Base/JThreeEvent";
import Vector4 from "../../Math/Vector4";
/**
 * Position,rotation and scale of scene object.
 * Every scene object in a scene has Toransformer.It's used to store and manipulate the position,rotation and scale ob the object.
 * Every Transformer can have a parent, each parent Transformer affect children's Transformer hierachically.
 */
class Transformer extends JThreeObject {

  public hasChanged: boolean = false;

  /**
   * forward direction of transform in world space
   */
  public forward: Vector3 = Vector3.ZUnit.negateThis();

  /**
   * Scene oject reference this transformer related to.
   */
  public linkedObject: SceneObject;

  /**
  * up direction of transform in world space
  */
  public up: Vector3 = Vector3.YUnit;

  /**
  * right direction of transform in world space
  */
  public right: Vector3 = Vector3.XUnit;

  /**
   * backing field of Rotation.
   */
  private _rotation: Quaternion;

  /**
   * backing field of Position.
   */
  private _position: Vector3;

  private _localOrigin: Vector3;

  /**
   * backing field of Scale.
   */
  private _scale: Vector3;

  /**
   * calculation cache
   */
  private _localTransformMatrix: Matrix = Matrix.identity();

  private _localToGlobalMatrix: Matrix = Matrix.identity();

  private _modelViewProjectionCaluculationCache: any = mat4.create();

  private _globalToLocalCache: Matrix = Matrix.identity();

  private _g2lupdated: boolean = false;

  /**
   * properties for storeing event handlers
   */
  private _onUpdateTransformHandler: JThreeEvent<SceneObject> = new JThreeEvent<SceneObject>();


  /**
   * Constructor of Transformer
   * @param sceneObj the scene object this transformer attached to.
   */
  constructor(sceneObj: SceneObject) {
    super();
    this.linkedObject = sceneObj;
    this._position = Vector3.Zero;
    this._rotation = Quaternion.Identity;
    this._scale = new Vector3(1, 1, 1);
    this._localOrigin = new Vector3(0, 0, 0);
    this.updateTransform();
  }

  public get NeedUpdateChildren(): boolean {
    return true;
  }

  public get globalToLocal() {
    if (this._g2lupdated) {
      return this._globalToLocalCache;
    }
    mat4.invert(this._localTransformMatrix.rawElements, this._localToGlobalMatrix.rawElements);
    this._g2lupdated = true;
  }

  /**
   * Subscribe event handlers it will be called when this transformer's transform was changed.
   * @param action the event handler for this event.
   */
  public onUpdateTransform(action: Action2<Transformer, SceneObject>): void {
    this._onUpdateTransformHandler.addListener(action);
  }

  /**
   * update all transform
   * You no need to call this method manually if you access all of properties in this transformer by accessor.
   */
  public updateTransform(): void {
    this.hasChanged = true;
    this.__updateTransformMatricies();
    // notify update to childrens
    if (this.linkedObject.Children && this.NeedUpdateChildren) {
      this.linkedObject.Children.forEach((v) => {
        v.Transformer.updateTransform();
      });
    }
    this._g2lupdated = false;
    // fire updated event
    this._onUpdateTransformHandler.fire(this, this.linkedObject);
  }

  public get hasParent() {
    return !!this.linkedObject.Parent;
  }

  public get parent() {
    return this.hasParent ? this.linkedObject.Parent.Transformer : null;
  }

  public get childrenCount() {
    return this.linkedObject.Children.length;
  }

  /**
   * Calculate Projection-View-Model matrix with renderer camera.
   */
  public calculateMVPMatrix(renderer: BasicRenderer): Matrix {
    mat4.mul(this._modelViewProjectionCaluculationCache, renderer.Camera.viewMatrix.rawElements, this.LocalToGlobal.rawElements);
    mat4.mul(this._modelViewProjectionCaluculationCache, renderer.Camera.projectionMatrix.rawElements, this._modelViewProjectionCaluculationCache);
    return new Matrix(this._modelViewProjectionCaluculationCache);
  }

  public get GlobalPosition() {
    return Matrix.transformPoint(this._localToGlobalMatrix, Vector3.Zero);
  }

  /**
   * Get accessor for the matrix providing the transform Local space into Global space.
   */
  public get LocalToGlobal(): Matrix {
    return this._localToGlobalMatrix;
  }

  public get LocalTransform(): Matrix {
    return this._localTransformMatrix;
  }
  /**
   * Get accessor for model rotation.
   */
  public get Rotation(): Quaternion {
    return this._rotation;
  }
  /**
   * Set accessor for model rotation.
   */
  public set Rotation(quat: Quaternion) {
    this._rotation = quat;
    this.updateTransform();
  }
  /**
   * Get Accessor for model position.
   */
  public get Position(): Vector3 {
    return this._position;
  }
  /**
   * Set Accessor for model position.
   */
  public set Position(vec: Vector3) {
    this._position = vec;
    this.updateTransform();
  }

  /**
   * Get Accessor for model scale.
   */
  public get Scale(): Vector3 {
    return this._scale;
  }

  /**
   * Set Accessor for model scale.
   */
  public set Scale(vec: Vector3) {
    this._scale = vec;
    this.updateTransform();
  }

  public get LocalOrigin(): Vector3 {
    return this._localOrigin;
  }

  public set LocalOrigin(origin: Vector3) {
    this._localOrigin = origin;
    this.updateTransform();
  }

  public transformDirection(direction: Vector3): Vector3 {
    return Matrix.transformNormal(this.LocalToGlobal, direction);
  }

  public transformPoint(point: Vector3): Vector3 {
    return Matrix.transformPoint(this._localToGlobalMatrix, point);
  }

  public transformVector(vector: Vector4): Vector4 {
    return Matrix.transform(this._localToGlobalMatrix, vector);
  }

  public inverseTransformDirection(direction: Vector3): Vector3 {
    return Matrix.transformNormal(this.globalToLocal, direction);
  }

  public inverseTransformPoint(point: Vector3): Vector3 {
    return Matrix.transformPoint(this.globalToLocal, point);
  }

  public inverseTransformVector(vector: Vector4): Vector4 {
    return Matrix.transform(this.globalToLocal, vector);
  }

  /**
  * Update transform matricies
  * @return {[type]} [description]
  */
  protected __updateTransformMatricies(): void {
    // initialize localTransformCache & localToGlobalMatrix.rawElements
    mat4.identity(this._localTransformMatrix.rawElements);
    mat4.identity(this._localToGlobalMatrix.rawElements);
    // generate local transofrm matrix
    mat4.fromRotationTranslationScaleOrigin(this._localTransformMatrix.rawElements, this._rotation.rawElements, this._position.rawElements, this._scale.rawElements, this._localOrigin.rawElements); // substitute Rotation*Translation*Scale matrix (around local origin) for localTransformMatrix.rawElements
    if (this.linkedObject != null && this.linkedObject.Parent != null) {
      // Use LocalToGlobal matrix of parents to multiply with localTransformCache
      mat4.copy(this._localToGlobalMatrix.rawElements, this.linkedObject.Parent.Transformer.LocalToGlobal.rawElements);
    } else {
      // If this transformer have no parent transformer,localToGlobalMatrix.rawElements,GlobalTransform will be same as localTransformCache
      mat4.identity(this._localToGlobalMatrix.rawElements);
    }
    // Multiply parent transform
    mat4.multiply(this._localToGlobalMatrix.rawElements, this._localToGlobalMatrix.rawElements, this._localTransformMatrix.rawElements);
    this.__updateDirections();
  }

  /**
   * Update directions by this transform
   */
  protected __updateDirections(): void {
    // Calculate direction vectors
    this._updateDirection(this.right, [1, 0, 0, 0]); // need to reduce memory allocation
    this._updateDirection(this.up, [0, 1, 0, 0]);
    this._updateDirection(this.forward, [0, 0, -1, 0]);
  }

  private _updateDirection(rawElements: Vector3, sourceVector4: number[]): void {
    vec4.transformMat4(rawElements.rawElements, sourceVector4, this._localToGlobalMatrix.rawElements);
    vec3.normalize(rawElements.rawElements, rawElements.rawElements);
  }
}

export default Transformer;
