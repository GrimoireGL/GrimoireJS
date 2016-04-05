import TransformerBase from "./TransformerBase";
import IRenderer from "../Renderers/IRenderer";
import Quaternion from "../../Math/Quaternion";
import Vector3 from "../../Math/Vector3";
import Matrix from "../../Math/Matrix";
import SceneObject from "../SceneObjects/SceneObject";
import {mat4, vec3, vec4, GLM} from "gl-matrix";
/**
 * Position,rotation and scale of scene object.
 * Every scene object in a scene has Toransformer.It's used to store and manipulate the position,rotation and scale ob the object.
 * Every Transformer can have a parent, each parent Transformer affect children's Transformer hierachically.
 */
class Transformer extends TransformerBase {

  public hasChanged: boolean = false;

  /**
   * forward direction of transform in world space
   */
  public forward: Vector3 = Vector3.ZUnit.negateThis();

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

  private _modelViewProjectionCaluculationCache: GLM.IArray = mat4.create();

  /**
   * Constructor of Transformer
   * @param sceneObj the scene object this transformer attached to.
   */
  constructor(sceneObj: SceneObject) {
    super(sceneObj);
    this._position = Vector3.Zero;
    this._rotation = Quaternion.Identity;
    this._scale = new Vector3(1, 1, 1);
    this._localOrigin = new Vector3(0, 0, 0);
    this.updateTransform();
  }

  /**
   * update all transform
   * You no need to call this method manually if you access all of properties in this transformer by accessor.
   */
  public updateTransform(): void {
    this.hasChanged = true;
    this.__updateTransformMatricies();
    // notify update to childrens
    if (this.object.Children) {
      this.object.Children.forEach((v) => {
        v.Transformer.updateTransform();
      });
    }
    // fire updated event
    this.emit("transform", this);
  }

  public get hasParent() {
    return !!this.object.Parent;
  }

  public get parent() {
    return this.hasParent ? this.object.Parent.Transformer : null;
  }

  public get childrenCount() {
    return this.object.Children.length;
  }

  /**
   * Calculate Projection-View-Model matrix with renderer camera.
   */
  public calculateMVPMatrix(renderer: IRenderer): Matrix {
    mat4.mul(this._modelViewProjectionCaluculationCache, renderer.camera.viewMatrix.rawElements, this.localToGlobal.rawElements);
    mat4.mul(this._modelViewProjectionCaluculationCache, renderer.camera.projectionMatrix.rawElements, this._modelViewProjectionCaluculationCache);
    return new Matrix(this._modelViewProjectionCaluculationCache);
  }

  public get GlobalPosition() {
    return Matrix.transformPoint(this.localToGlobal, Vector3.Zero);
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

  /**
  * Update transform matricies
  * @return {[type]} [description]
  */
  protected __updateTransformMatricies(): void {
    // initialize localTransformCache & localToGlobalMatrix.rawElements
    mat4.identity(this.localTransform.rawElements);
    mat4.identity(this.localToGlobal.rawElements);
    // generate local transofrm matrix
    mat4.fromRotationTranslationScaleOrigin(this.localTransform.rawElements, this._rotation.rawElements, this._position.rawElements, this._scale.rawElements, this._localOrigin.rawElements); // substitute Rotation*Translation*Scale matrix (around local origin) for localTransformMatrix.rawElements
    if (this.object != null && this.object.Parent != null) {
      // Use localToGlobal matrix of parents to multiply with localTransformCache
      mat4.copy(this.localToGlobal.rawElements, this.object.Parent.Transformer.localToGlobal.rawElements);
    } else {
      // If this transformer have no parent transformer,localToGlobalMatrix.rawElements,GlobalTransform will be same as localTransformCache
      mat4.identity(this.localToGlobal.rawElements);
    }
    // Multiply parent transform
    mat4.multiply(this.localToGlobal.rawElements, this.localToGlobal.rawElements, this.localTransform.rawElements);
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
    vec4.transformMat4(rawElements.rawElements, sourceVector4, this.localToGlobal.rawElements);
    vec3.normalize(rawElements.rawElements, rawElements.rawElements);
  }
}

export default Transformer;
