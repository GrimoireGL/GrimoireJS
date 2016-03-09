import Quaternion from "../../Math/Quaternion";
import Vector3 from "../../Math/Vector3";
import Matrix from "../../Math/Matrix";
import JThreeObject from "../../Base/JThreeObject";
import { mat4, vec3, vec4 } from "gl-matrix";
import JThreeEvent from "./../../Base/JThreeEvent";
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
    constructor(sceneObj) {
        super();
        this.hasChanged = false;
        /**
         * forward direction of transform in world space
         */
        this.forward = Vector3.ZUnit.negateThis();
        /**
        * up direction of transform in world space
        */
        this.up = Vector3.YUnit;
        /**
        * right direction of transform in world space
        */
        this.right = Vector3.XUnit;
        /**
         * calculation cache
         */
        this._localTransformMatrix = Matrix.identity();
        this._localToGlobalMatrix = Matrix.identity();
        this._modelViewProjectionCaluculationCache = mat4.create();
        this._globalToLocalCache = Matrix.identity();
        this._g2lupdated = false;
        /**
         * properties for storeing event handlers
         */
        this._onUpdateTransformHandler = new JThreeEvent();
        this.linkedObject = sceneObj;
        this._position = Vector3.Zero;
        this._rotation = Quaternion.Identity;
        this._scale = new Vector3(1, 1, 1);
        this._localOrigin = new Vector3(0, 0, 0);
        this.updateTransform();
    }
    get NeedUpdateChildren() {
        return true;
    }
    get globalToLocal() {
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
    onUpdateTransform(action) {
        this._onUpdateTransformHandler.addListener(action);
    }
    /**
     * update all transform
     * You no need to call this method manually if you access all of properties in this transformer by accessor.
     */
    updateTransform() {
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
    get hasParent() {
        return !!this.linkedObject.Parent;
    }
    get parent() {
        return this.hasParent ? this.linkedObject.Parent.Transformer : null;
    }
    get childrenCount() {
        return this.linkedObject.Children.length;
    }
    /**
     * Calculate Projection-View-Model matrix with renderer camera.
     */
    calculateMVPMatrix(renderer) {
        mat4.mul(this._modelViewProjectionCaluculationCache, renderer.Camera.viewMatrix.rawElements, this.LocalToGlobal.rawElements);
        mat4.mul(this._modelViewProjectionCaluculationCache, renderer.Camera.projectionMatrix.rawElements, this._modelViewProjectionCaluculationCache);
        return new Matrix(this._modelViewProjectionCaluculationCache);
    }
    get GlobalPosition() {
        return Matrix.transformPoint(this._localToGlobalMatrix, Vector3.Zero);
    }
    /**
     * Get accessor for the matrix providing the transform Local space into Global space.
     */
    get LocalToGlobal() {
        return this._localToGlobalMatrix;
    }
    get LocalTransform() {
        return this._localTransformMatrix;
    }
    /**
     * Get accessor for model rotation.
     */
    get Rotation() {
        return this._rotation;
    }
    /**
     * Set accessor for model rotation.
     */
    set Rotation(quat) {
        this._rotation = quat;
        this.updateTransform();
    }
    /**
     * Get Accessor for model position.
     */
    get Position() {
        return this._position;
    }
    /**
     * Set Accessor for model position.
     */
    set Position(vec) {
        this._position = vec;
        this.updateTransform();
    }
    /**
     * Get Accessor for model scale.
     */
    get Scale() {
        return this._scale;
    }
    /**
     * Set Accessor for model scale.
     */
    set Scale(vec) {
        this._scale = vec;
        this.updateTransform();
    }
    get LocalOrigin() {
        return this._localOrigin;
    }
    set LocalOrigin(origin) {
        this._localOrigin = origin;
        this.updateTransform();
    }
    transformDirection(direction) {
        return Matrix.transformNormal(this.LocalToGlobal, direction);
    }
    transformPoint(point) {
        return Matrix.transformPoint(this._localToGlobalMatrix, point);
    }
    transformVector(vector) {
        return Matrix.transform(this._localToGlobalMatrix, vector);
    }
    inverseTransformDirection(direction) {
        return Matrix.transformNormal(this.globalToLocal, direction);
    }
    inverseTransformPoint(point) {
        return Matrix.transformPoint(this.globalToLocal, point);
    }
    inverseTransformVector(vector) {
        return Matrix.transform(this.globalToLocal, vector);
    }
    /**
    * Update transform matricies
    * @return {[type]} [description]
    */
    __updateTransformMatricies() {
        // initialize localTransformCache & localToGlobalMatrix.rawElements
        mat4.identity(this._localTransformMatrix.rawElements);
        mat4.identity(this._localToGlobalMatrix.rawElements);
        // generate local transofrm matrix
        mat4.fromRotationTranslationScaleOrigin(this._localTransformMatrix.rawElements, this._rotation.rawElements, this._position.rawElements, this._scale.rawElements, this._localOrigin.rawElements); // substitute Rotation*Translation*Scale matrix (around local origin) for localTransformMatrix.rawElements
        if (this.linkedObject != null && this.linkedObject.Parent != null) {
            // Use LocalToGlobal matrix of parents to multiply with localTransformCache
            mat4.copy(this._localToGlobalMatrix.rawElements, this.linkedObject.Parent.Transformer.LocalToGlobal.rawElements);
        }
        else {
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
    __updateDirections() {
        // Calculate direction vectors
        this._updateDirection(this.right, [1, 0, 0, 0]); // need to reduce memory allocation
        this._updateDirection(this.up, [0, 1, 0, 0]);
        this._updateDirection(this.forward, [0, 0, -1, 0]);
    }
    _updateDirection(rawElements, sourceVector4) {
        vec4.transformMat4(rawElements.rawElements, sourceVector4, this._localToGlobalMatrix.rawElements);
        vec3.normalize(rawElements.rawElements, rawElements.rawElements);
    }
}
export default Transformer;
