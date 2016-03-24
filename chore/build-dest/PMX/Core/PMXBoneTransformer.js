import Transformer from "../../Core/Transform/Transformer";
import { quat, vec3 } from "gl-matrix";
import Quaternion from "../../Math/Quaternion";
import Vector3 from "../../Math/Vector3";
import Matrix from "../../Math/Matrix";
import JThreeContext from "../../JThreeContext";
/**
 * Bone transformer for pmx
 */
class PMXBoneTransformer extends Transformer {
    constructor(sceneObj, pmx, index) {
        super(sceneObj);
        /**
         * Quaternion produced from manual operation,bone animation.(except bone morphs)
         * @type {Quaternion}
         */
        this.userRotation = Quaternion.Identity;
        this.transformUpdated = false;
        /**
           * Translation vector produced from manual operation,bone animation.
           * @type {Vector3}
           */
        this.userTranslation = Vector3.Zero;
        /**
         * Whether this bone transformer is IKLink or not.
         * This variable will be assigned by PMXSkeleton after loading all bones.
         * @type {boolean}
         */
        this.isIKLink = false;
        /**
         * Quaternion produced from bone morphs.
         * @type {Quaternion}
         */
        this._morphRotation = Quaternion.Identity;
        /**
         * Translation vector produced from bone morphs.
         * @type {Vector3}
         */
        this._morphTranslation = Vector3.Zero;
        /**
         * Quaternion that will be used for calculating rotation providing for child bones.
         * @type {Quaternion}
         */
        this._providingBoneRotation = Quaternion.Identity;
        /**
         * Translation vector that will be used for calculating translation providing for child bones.
         * @type {Vector3}
         */
        this._providingBoneTranslation = Vector3.Zero;
        /**
         * Quaternion produced from rotation of IK link.
         * @type {Quaternion}
         */
        this._ikLinkRotation = Quaternion.Identity;
        this._pmx = pmx;
        this._boneIndex = index;
    }
    /**
     * Reference to static model data.
     */
    get PMXModelData() {
        return this._pmx.ModelData;
    }
    get BoneData() {
        return this.PMXModelData.Bones[this._boneIndex];
    }
    get ProvidingBone() {
        return this._pmx.skeleton.getBoneByIndex(this.BoneData.providingBoneIndex);
    }
    get ProvidingBoneTransformer() {
        return this.ProvidingBone.Transformer;
    }
    get IsLocalProvidingBone() {
        return (this.BoneData.boneFlag & 0x0080) > 0;
    }
    get IsRotationProvidingBone() {
        return (this.BoneData.boneFlag & 0x0100) > 0;
    }
    get IsTranslationProvidingBone() {
        return (this.BoneData.boneFlag & 0x0200) > 0;
    }
    get IsIKBone() {
        return (this.BoneData.boneFlag & 0x0020) > 0;
    }
    updateTransform() {
        super.updateTransform();
    }
    updateTransformForPMX() {
        if (this._pmx == null) {
            return;
        }
        this._updateLocalTranslation();
        if (this.IsIKBone && this._pmx.skeleton) {
            this._applyCCDIK();
            const debug = JThreeContext.getContextComponent(6);
            debug.setInfo("Bone " + this.BoneData.boneName, this.Position.toString());
        }
        else {
            this._updateLocalRotation();
            super.updateTransform();
        }
    }
    /**
     * Calculate actual rotation quaternion.
     * This operation not affects any other bones.(Even if the bone was child bone)
     * @return {[type]} [description]
     */
    _updateLocalRotation() {
        quat.identity(this.Rotation.rawElements);
        if (this.IsRotationProvidingBone) {
            if (this.IsLocalProvidingBone) {
                // TODO Do something when this bone is local providing bone
                console.error("Local providing is not implemented yet!");
            }
            if (this.ProvidingBoneTransformer.isIKLink) {
                // Interpolate ikLink rotation with providing rate
                quat.slerp(this.Rotation.rawElements, this.Rotation.rawElements, this.ProvidingBoneTransformer._ikLinkRotation.rawElements, this.BoneData.providingRate);
            }
        }
        // Multiply local rotations of this bone
        quat.mul(this.Rotation.rawElements, this.Rotation.rawElements, this.userRotation.rawElements);
        quat.mul(this.Rotation.rawElements, this.Rotation.rawElements, this._morphRotation.rawElements);
        if (this.IsRotationProvidingBone) {
            quat.copy(this._providingBoneRotation.rawElements, this.Rotation.rawElements);
        }
        // Calculate IkLink rotation of this bone
        quat.mul(this.Rotation.rawElements, this.Rotation.rawElements, this._ikLinkRotation.rawElements);
    }
    /**
     * Calculate actual translation vector.
     * This operation not affects any other bones.(Even if the bone was child bone)
     * @return {[type]} [description]
     */
    _updateLocalTranslation() {
        this.Position.rawElements[0] = 0;
        this.Position.rawElements[1] = 0;
        this.Position.rawElements[2] = 0;
        if (this.IsTranslationProvidingBone) {
            if (this.IsLocalProvidingBone) {
                // Do something when this bone is local providing bone
                console.error("Local providing is not implemented yet!");
            }
            vec3.lerp(this.Position.rawElements, this.Position.rawElements, this.ProvidingBone.Transformer.Position.rawElements, this.BoneData.providingRate);
        }
        vec3.add(this.Position.rawElements, this.Position.rawElements, this.userTranslation.rawElements);
        vec3.add(this.Position.rawElements, this.Position.rawElements, this._morphTranslation.rawElements);
        if (this.IsTranslationProvidingBone) {
            vec3.copy(this._providingBoneTranslation.rawElements, this.Position.rawElements);
        }
    }
    _applyCCDIK() {
        for (let i = 0; i < this.BoneData.ikLinkCount; i++) {
            const link = this._getIkLinkTransformerByIndex(i);
            link._ikLinkRotation = Quaternion.Identity;
            link.updateTransformForPMX();
        }
        for (let i = 0; i < this.BoneData.ikLoopCount; i++) {
            this._cCDIKOperation(i);
        }
    }
    _cCDIKOperation(it) {
        const effectorTransformer = this._pmx.skeleton.getBoneByIndex(this.BoneData.ikTargetBoneIndex).Transformer;
        const TargetGlobalPos = Matrix.transformPoint(this.LocalToGlobal, this.LocalOrigin);
        // vec3.transformMat4(this._pmxCalcCacheVec, this.LocalOrigin.rawElements, this.LocalToGlobal.rawElements);
        for (let i = 0; i < this.BoneData.ikLinkCount; i++) {
            const ikLinkData = this.BoneData.ikLinks[i];
            const ikLinkTransform = this._getIkLinkTransformerByIndex(i);
            const link2Effector = this._getLink2Effector(ikLinkTransform, effectorTransformer);
            const link2Target = this._getLink2Target(ikLinkTransform, TargetGlobalPos);
            this._ikLinkCalc(ikLinkTransform, link2Effector, link2Target, this.BoneData.ikLimitedRotation, ikLinkData, it);
        }
    }
    _getLink2Effector(link, effector) {
        const ToLinkLocal = Matrix.inverse(link.LocalToGlobal);
        const ep = effector.LocalOrigin;
        const local2effectorLocal = Matrix.multiply(ToLinkLocal, effector.LocalToGlobal);
        const effectorPos = Matrix.transformPoint(local2effectorLocal, ep);
        return effectorPos.subtractWith(link.LocalOrigin).normalizeThis();
    }
    _getLink2Target(link, tp) {
        const ToLinkLocal = Matrix.inverse(link.LocalToGlobal);
        const effectorPos = Matrix.transformPoint(ToLinkLocal, tp);
        return effectorPos.subtractWith(link.LocalOrigin).normalizeThis();
    }
    _ikLinkCalc(link, effector, target, rotationLimit, ikLink, it) {
        // Calculate rotation angle
        let dot = Vector3.dot(effector, target);
        if (dot > 1.0) {
            dot = 1.0; // adjust error (if dot was over 1.0, acos(dot) will be NaN. Then, it cause some of bug)
        }
        const rotationAngle = this._clampFloat(Math.acos(dot), rotationLimit);
        if (isNaN(rotationAngle)) {
            return;
        }
        if (rotationAngle <= 1.0e-3) {
            return;
        }
        // Calculate rotation axis of rotation
        const rotationAxis = Vector3.cross(effector, target).normalizeThis();
        // Generate the rotation matrix rotating along the axis
        const rotation = Quaternion.angleAxis(rotationAngle, rotationAxis);
        // link.updateTransform();
        // Rotation = (_providingBoneRotation) * userRotation * _morphRotation * ikLinkRotation
        // RestrictedRotation = Rotation * ikLinkAdjust
        // ikLinkAdust = (Rotation) ^ -1 * RestrictedRotation
        const restrictedRotation = this._restrictRotation(ikLink, rotation);
        link._ikLinkRotation = Quaternion.multiply(link._ikLinkRotation, restrictedRotation);
        link.updateTransformForPMX();
        // link.updateTransformMatricies();
    }
    _getIkLinkTransformerByIndex(index) {
        return this._pmx.skeleton.getBoneByIndex(this.BoneData.ikLinks[index].ikLinkBoneIndex).Transformer;
    }
    _restrictRotation(link, rot) {
        if (!link.isLimitedRotation) {
            return rot; // If this link bone is not enabled with rotation limit,just return.
        }
        const decomposed = rot.factoringQuaternionXYZ();
        const xRotation = Math.max(link.limitedRotation[0], Math.min(link.limitedRotation[3], -decomposed.x));
        const yRotation = Math.max(link.limitedRotation[1], Math.min(link.limitedRotation[4], -decomposed.y));
        const zRotation = Math.max(link.limitedRotation[2], Math.min(link.limitedRotation[5], decomposed.z));
        return Quaternion.eulerXYZ(-xRotation, -yRotation, zRotation);
    }
    _clampFloat(f, limit) {
        return Math.max(Math.min(f, limit), -limit);
    }
}
export default PMXBoneTransformer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBNWC9Db3JlL1BNWEJvbmVUcmFuc2Zvcm1lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxXQUFXLE1BQU0sa0NBQWtDO09BR25ELEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxNQUFNLFdBQVc7T0FDN0IsVUFBVSxNQUFNLHVCQUF1QjtPQUN2QyxPQUFPLE1BQU0sb0JBQW9CO09BQ2pDLE1BQU0sTUFBTSxtQkFBbUI7T0FHL0IsYUFBYSxNQUFNLHFCQUFxQjtBQUMvQzs7R0FFRztBQUNILGlDQUFpQyxXQUFXO0lBaUUxQyxZQUFZLFFBQXFCLEVBQUUsR0FBYSxFQUFFLEtBQWE7UUFDN0QsTUFBTSxRQUFRLENBQUMsQ0FBQztRQWpFbkI7OztXQUdHO1FBQ0ssaUJBQVksR0FBZSxVQUFVLENBQUMsUUFBUSxDQUFDO1FBRS9DLHFCQUFnQixHQUFZLEtBQUssQ0FBQztRQUV6Qzs7O2FBR0U7UUFDSyxvQkFBZSxHQUFZLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFHL0M7Ozs7V0FJRztRQUNJLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFFbEM7OztXQUdHO1FBQ00sbUJBQWMsR0FBZSxVQUFVLENBQUMsUUFBUSxDQUFDO1FBRTFEOzs7V0FHRztRQUNNLHNCQUFpQixHQUFZLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFFbkQ7OztXQUdHO1FBQ00sMkJBQXNCLEdBQWUsVUFBVSxDQUFDLFFBQVEsQ0FBQztRQUVsRTs7O1dBR0c7UUFDTSw4QkFBeUIsR0FBWSxPQUFPLENBQUMsSUFBSSxDQUFDO1FBYzFEOzs7V0FHRztRQUNLLG9CQUFlLEdBQWUsVUFBVSxDQUFDLFFBQVEsQ0FBQztRQUl4RCxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNoQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztJQUMxQixDQUFDO0lBR0Q7O09BRUc7SUFDSCxJQUFXLFlBQVk7UUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lB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anMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVHJhbnNmb3JtZXIgZnJvbSBcIi4uLy4uL0NvcmUvVHJhbnNmb3JtL1RyYW5zZm9ybWVyXCI7XG5pbXBvcnQgU2NlbmVPYmplY3QgZnJvbSBcIi4uLy4uL0NvcmUvU2NlbmVPYmplY3RzL1NjZW5lT2JqZWN0XCI7XG5pbXBvcnQgUE1YTW9kZWwgZnJvbSBcIi4vUE1YTW9kZWxcIjtcbmltcG9ydCB7cXVhdCwgdmVjM30gZnJvbSBcImdsLW1hdHJpeFwiO1xuaW1wb3J0IFF1YXRlcm5pb24gZnJvbSBcIi4uLy4uL01hdGgvUXVhdGVybmlvblwiO1xuaW1wb3J0IFZlY3RvcjMgZnJvbSBcIi4uLy4uL01hdGgvVmVjdG9yM1wiO1xuaW1wb3J0IE1hdHJpeCBmcm9tIFwiLi4vLi4vTWF0aC9NYXRyaXhcIjtcbmltcG9ydCBQTVhJS0xpbmsgZnJvbSBcIi4uL1BNWElLTGlua0RhdGFcIjtcbmltcG9ydCBEZWJ1Z2dlciBmcm9tIFwiLi4vLi4vRGVidWcvRGVidWdnZXJcIjtcbmltcG9ydCBKVGhyZWVDb250ZXh0IGZyb20gXCIuLi8uLi9KVGhyZWVDb250ZXh0XCI7XG4vKipcbiAqIEJvbmUgdHJhbnNmb3JtZXIgZm9yIHBteFxuICovXG5jbGFzcyBQTVhCb25lVHJhbnNmb3JtZXIgZXh0ZW5kcyBUcmFuc2Zvcm1lciB7XG5cdC8qKlxuXHQgKiBRdWF0ZXJuaW9uIHByb2R1Y2VkIGZyb20gbWFudWFsIG9wZXJhdGlvbixib25lIGFuaW1hdGlvbi4oZXhjZXB0IGJvbmUgbW9ycGhzKVxuXHQgKiBAdHlwZSB7UXVhdGVybmlvbn1cblx0ICovXG4gIHB1YmxpYyB1c2VyUm90YXRpb246IFF1YXRlcm5pb24gPSBRdWF0ZXJuaW9uLklkZW50aXR5O1xuXG4gIHB1YmxpYyB0cmFuc2Zvcm1VcGRhdGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG5cdCAqIFRyYW5zbGF0aW9uIHZlY3RvciBwcm9kdWNlZCBmcm9tIG1hbnVhbCBvcGVyYXRpb24sYm9uZSBhbmltYXRpb24uXG5cdCAqIEB0eXBlIHtWZWN0b3IzfVxuXHQgKi9cbiAgcHVibGljIHVzZXJUcmFuc2xhdGlvbjogVmVjdG9yMyA9IFZlY3RvcjMuWmVybztcblxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoaXMgYm9uZSB0cmFuc2Zvcm1lciBpcyBJS0xpbmsgb3Igbm90LlxuICAgKiBUaGlzIHZhcmlhYmxlIHdpbGwgYmUgYXNzaWduZWQgYnkgUE1YU2tlbGV0b24gYWZ0ZXIgbG9hZGluZyBhbGwgYm9uZXMuXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgcHVibGljIGlzSUtMaW5rOiBib29sZWFuID0gZmFsc2U7XG5cblx0LyoqXG5cdCAqIFF1YXRlcm5pb24gcHJvZHVjZWQgZnJvbSBib25lIG1vcnBocy5cblx0ICogQHR5cGUge1F1YXRlcm5pb259XG5cdCAqL1xuICBwcml2YXRlIF9tb3JwaFJvdGF0aW9uOiBRdWF0ZXJuaW9uID0gUXVhdGVybmlvbi5JZGVudGl0eTtcblxuXHQvKipcblx0ICogVHJhbnNsYXRpb24gdmVjdG9yIHByb2R1Y2VkIGZyb20gYm9uZSBtb3JwaHMuXG5cdCAqIEB0eXBlIHtWZWN0b3IzfVxuXHQgKi9cbiAgcHJpdmF0ZSBfbW9ycGhUcmFuc2xhdGlvbjogVmVjdG9yMyA9IFZlY3RvcjMuWmVybztcblxuXHQvKipcblx0ICogUXVhdGVybmlvbiB0aGF0IHdpbGwgYmUgdXNlZCBmb3IgY2FsY3VsYXRpbmcgcm90YXRpb24gcHJvdmlkaW5nIGZvciBjaGlsZCBib25lcy5cblx0ICogQHR5cGUge1F1YXRlcm5pb259XG5cdCAqL1xuICBwcml2YXRlIF9wcm92aWRpbmdCb25lUm90YXRpb246IFF1YXRlcm5pb24gPSBRdWF0ZXJuaW9uLklkZW50aXR5O1xuXG5cdC8qKlxuXHQgKiBUcmFuc2xhdGlvbiB2ZWN0b3IgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIGNhbGN1bGF0aW5nIHRyYW5zbGF0aW9uIHByb3ZpZGluZyBmb3IgY2hpbGQgYm9uZXMuXG5cdCAqIEB0eXBlIHtWZWN0b3IzfVxuXHQgKi9cbiAgcHJpdmF0ZSBfcHJvdmlkaW5nQm9uZVRyYW5zbGF0aW9uOiBWZWN0b3IzID0gVmVjdG9yMy5aZXJvO1xuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgdG8gUE1YTW9kZWwgbWFuYWdpbmcgYWxsIGR5bmFtaWMgZmVhdHVyZXMuXG4gICAqIEB0eXBlIHtQTVhNb2RlbH1cbiAgICovXG4gIHByaXZhdGUgX3BteDogUE1YTW9kZWw7XG5cbiAgLyoqXG4gICAqIEJvbmUgaW5kZXggZm9yIGJvbmUgYXJyYXkgb2Ygc2tlbGV0b24uXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqL1xuICBwcml2YXRlIF9ib25lSW5kZXg6IG51bWJlcjtcblxuICAvKipcbiAgICogUXVhdGVybmlvbiBwcm9kdWNlZCBmcm9tIHJvdGF0aW9uIG9mIElLIGxpbmsuXG4gICAqIEB0eXBlIHtRdWF0ZXJuaW9ufVxuICAgKi9cbiAgcHJpdmF0ZSBfaWtMaW5rUm90YXRpb246IFF1YXRlcm5pb24gPSBRdWF0ZXJuaW9uLklkZW50aXR5O1xuXG4gIGNvbnN0cnVjdG9yKHNjZW5lT2JqOiBTY2VuZU9iamVjdCwgcG14OiBQTVhNb2RlbCwgaW5kZXg6IG51bWJlcikge1xuICAgIHN1cGVyKHNjZW5lT2JqKTtcbiAgICB0aGlzLl9wbXggPSBwbXg7XG4gICAgdGhpcy5fYm9uZUluZGV4ID0gaW5kZXg7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgdG8gc3RhdGljIG1vZGVsIGRhdGEuXG4gICAqL1xuICBwdWJsaWMgZ2V0IFBNWE1vZGVsRGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcG14Lk1vZGVsRGF0YTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgQm9uZURhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuUE1YTW9kZWxEYXRhLkJvbmVzW3RoaXMuX2JvbmVJbmRleF07XG4gIH1cblxuICBwdWJsaWMgZ2V0IFByb3ZpZGluZ0JvbmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BteC5za2VsZXRvbi5nZXRCb25lQnlJbmRleCh0aGlzLkJvbmVEYXRhLnByb3ZpZGluZ0JvbmVJbmRleCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IFByb3ZpZGluZ0JvbmVUcmFuc2Zvcm1lcigpIHtcbiAgICByZXR1cm4gPFBNWEJvbmVUcmFuc2Zvcm1lcj50aGlzLlByb3ZpZGluZ0JvbmUuVHJhbnNmb3JtZXI7XG4gIH1cblxuICBwdWJsaWMgZ2V0IElzTG9jYWxQcm92aWRpbmdCb25lKCkge1xuICAgIHJldHVybiAodGhpcy5Cb25lRGF0YS5ib25lRmxhZyAmIDB4MDA4MCkgPiAwO1xuICB9XG5cbiAgcHVibGljIGdldCBJc1JvdGF0aW9uUHJvdmlkaW5nQm9uZSgpIHtcbiAgICByZXR1cm4gKHRoaXMuQm9uZURhdGEuYm9uZUZsYWcgJiAweDAxMDApID4gMDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgSXNUcmFuc2xhdGlvblByb3ZpZGluZ0JvbmUoKSB7XG4gICAgcmV0dXJuICh0aGlzLkJvbmVEYXRhLmJvbmVGbGFnICYgMHgwMjAwKSA+IDA7XG4gIH1cblxuICBwdWJsaWMgZ2V0IElzSUtCb25lKCkge1xuICAgIHJldHVybiAodGhpcy5Cb25lRGF0YS5ib25lRmxhZyAmIDB4MDAyMCkgPiAwO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZVRyYW5zZm9ybSgpOiB2b2lkIHtcbiAgICBzdXBlci51cGRhdGVUcmFuc2Zvcm0oKTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVUcmFuc2Zvcm1Gb3JQTVgoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3BteCA9PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX3VwZGF0ZUxvY2FsVHJhbnNsYXRpb24oKTtcbiAgICBpZiAodGhpcy5Jc0lLQm9uZSAmJiB0aGlzLl9wbXguc2tlbGV0b24pIHtcbiAgICAgIHRoaXMuX2FwcGx5Q0NESUsoKTtcbiAgICAgIGNvbnN0IGRlYnVnID0gSlRocmVlQ29udGV4dC5nZXRDb250ZXh0Q29tcG9uZW50PERlYnVnZ2VyPig2KTtcbiAgICAgIGRlYnVnLnNldEluZm8oXCJCb25lIFwiICsgdGhpcy5Cb25lRGF0YS5ib25lTmFtZSwgdGhpcy5Qb3NpdGlvbi50b1N0cmluZygpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdXBkYXRlTG9jYWxSb3RhdGlvbigpO1xuICAgICAgc3VwZXIudXBkYXRlVHJhbnNmb3JtKCk7XG4gICAgfVxuICB9XG5cdC8qKlxuXHQgKiBDYWxjdWxhdGUgYWN0dWFsIHJvdGF0aW9uIHF1YXRlcm5pb24uXG5cdCAqIFRoaXMgb3BlcmF0aW9uIG5vdCBhZmZlY3RzIGFueSBvdGhlciBib25lcy4oRXZlbiBpZiB0aGUgYm9uZSB3YXMgY2hpbGQgYm9uZSlcblx0ICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG5cdCAqL1xuICBwcml2YXRlIF91cGRhdGVMb2NhbFJvdGF0aW9uKCk6IHZvaWQge1xuICAgIHF1YXQuaWRlbnRpdHkodGhpcy5Sb3RhdGlvbi5yYXdFbGVtZW50cyk7XG4gICAgaWYgKHRoaXMuSXNSb3RhdGlvblByb3ZpZGluZ0JvbmUpIHtcbiAgICAgIGlmICh0aGlzLklzTG9jYWxQcm92aWRpbmdCb25lKSB7XG4gICAgICAgIC8vIFRPRE8gRG8gc29tZXRoaW5nIHdoZW4gdGhpcyBib25lIGlzIGxvY2FsIHByb3ZpZGluZyBib25lXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJMb2NhbCBwcm92aWRpbmcgaXMgbm90IGltcGxlbWVudGVkIHlldCFcIik7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5Qcm92aWRpbmdCb25lVHJhbnNmb3JtZXIuaXNJS0xpbmspIHtcbiAgICAgICAgLy8gSW50ZXJwb2xhdGUgaWtMaW5rIHJvdGF0aW9uIHdpdGggcHJvdmlkaW5nIHJhdGVcbiAgICAgICAgcXVhdC5zbGVycCh0aGlzLlJvdGF0aW9uLnJhd0VsZW1lbnRzLCB0aGlzLlJvdGF0aW9uLnJhd0VsZW1lbnRzLCB0aGlzLlByb3ZpZGluZ0JvbmVUcmFuc2Zvcm1lci5faWtMaW5rUm90YXRpb24ucmF3RWxlbWVudHMsIHRoaXMuQm9uZURhdGEucHJvdmlkaW5nUmF0ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIE11bHRpcGx5IGxvY2FsIHJvdGF0aW9ucyBvZiB0aGlzIGJvbmVcbiAgICBxdWF0Lm11bCh0aGlzLlJvdGF0aW9uLnJhd0VsZW1lbnRzLCB0aGlzLlJvdGF0aW9uLnJhd0VsZW1lbnRzLCB0aGlzLnVzZXJSb3RhdGlvbi5yYXdFbGVtZW50cyk7XG4gICAgcXVhdC5tdWwodGhpcy5Sb3RhdGlvbi5yYXdFbGVtZW50cywgdGhpcy5Sb3RhdGlvbi5yYXdFbGVtZW50cywgdGhpcy5fbW9ycGhSb3RhdGlvbi5yYXdFbGVtZW50cyk7XG4gICAgaWYgKHRoaXMuSXNSb3RhdGlvblByb3ZpZGluZ0JvbmUpIHsgLy8gTWVtb3JpemUgcHJvdmlkaW5nIHJvdGF0aW9uIG9mIHRoaXMgYm9uZVxuICAgICAgcXVhdC5jb3B5KHRoaXMuX3Byb3ZpZGluZ0JvbmVSb3RhdGlvbi5yYXdFbGVtZW50cywgdGhpcy5Sb3RhdGlvbi5yYXdFbGVtZW50cyk7XG4gICAgfVxuICAgIC8vIENhbGN1bGF0ZSBJa0xpbmsgcm90YXRpb24gb2YgdGhpcyBib25lXG4gICAgcXVhdC5tdWwodGhpcy5Sb3RhdGlvbi5yYXdFbGVtZW50cywgdGhpcy5Sb3RhdGlvbi5yYXdFbGVtZW50cywgdGhpcy5faWtMaW5rUm90YXRpb24ucmF3RWxlbWVudHMpO1xuICB9XG5cblx0LyoqXG5cdCAqIENhbGN1bGF0ZSBhY3R1YWwgdHJhbnNsYXRpb24gdmVjdG9yLlxuXHQgKiBUaGlzIG9wZXJhdGlvbiBub3QgYWZmZWN0cyBhbnkgb3RoZXIgYm9uZXMuKEV2ZW4gaWYgdGhlIGJvbmUgd2FzIGNoaWxkIGJvbmUpXG5cdCAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxuXHQgKi9cbiAgcHJpdmF0ZSBfdXBkYXRlTG9jYWxUcmFuc2xhdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLlBvc2l0aW9uLnJhd0VsZW1lbnRzWzBdID0gMDtcbiAgICB0aGlzLlBvc2l0aW9uLnJhd0VsZW1lbnRzWzFdID0gMDtcbiAgICB0aGlzLlBvc2l0aW9uLnJhd0VsZW1lbnRzWzJdID0gMDtcbiAgICBpZiAodGhpcy5Jc1RyYW5zbGF0aW9uUHJvdmlkaW5nQm9uZSkge1xuICAgICAgaWYgKHRoaXMuSXNMb2NhbFByb3ZpZGluZ0JvbmUpIHtcbiAgICAgICAgLy8gRG8gc29tZXRoaW5nIHdoZW4gdGhpcyBib25lIGlzIGxvY2FsIHByb3ZpZGluZyBib25lXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJMb2NhbCBwcm92aWRpbmcgaXMgbm90IGltcGxlbWVudGVkIHlldCFcIik7XG4gICAgICB9XG4gICAgICB2ZWMzLmxlcnAodGhpcy5Qb3NpdGlvbi5yYXdFbGVtZW50cywgdGhpcy5Qb3NpdGlvbi5yYXdFbGVtZW50cywgdGhpcy5Qcm92aWRpbmdCb25lLlRyYW5zZm9ybWVyLlBvc2l0aW9uLnJhd0VsZW1lbnRzLCB0aGlzLkJvbmVEYXRhLnByb3ZpZGluZ1JhdGUpO1xuICAgIH1cbiAgICB2ZWMzLmFkZCh0aGlzLlBvc2l0aW9uLnJhd0VsZW1lbnRzLCB0aGlzLlBvc2l0aW9uLnJhd0VsZW1lbnRzLCB0aGlzLnVzZXJUcmFuc2xhdGlvbi5yYXdFbGVtZW50cyk7XG4gICAgdmVjMy5hZGQodGhpcy5Qb3NpdGlvbi5yYXdFbGVtZW50cywgdGhpcy5Qb3NpdGlvbi5yYXdFbGVtZW50cywgdGhpcy5fbW9ycGhUcmFuc2xhdGlvbi5yYXdFbGVtZW50cyk7XG4gICAgaWYgKHRoaXMuSXNUcmFuc2xhdGlvblByb3ZpZGluZ0JvbmUpIHtcbiAgICAgIHZlYzMuY29weSh0aGlzLl9wcm92aWRpbmdCb25lVHJhbnNsYXRpb24ucmF3RWxlbWVudHMsIHRoaXMuUG9zaXRpb24ucmF3RWxlbWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2FwcGx5Q0NESUsoKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLkJvbmVEYXRhLmlrTGlua0NvdW50OyBpKyspIHtcbiAgICAgIGNvbnN0IGxpbmsgPSB0aGlzLl9nZXRJa0xpbmtUcmFuc2Zvcm1lckJ5SW5kZXgoaSk7XG4gICAgICBsaW5rLl9pa0xpbmtSb3RhdGlvbiA9IFF1YXRlcm5pb24uSWRlbnRpdHk7XG4gICAgICBsaW5rLnVwZGF0ZVRyYW5zZm9ybUZvclBNWCgpO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuQm9uZURhdGEuaWtMb29wQ291bnQ7IGkrKykge1xuICAgICAgdGhpcy5fY0NESUtPcGVyYXRpb24oaSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY0NESUtPcGVyYXRpb24oaXQ6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGVmZmVjdG9yVHJhbnNmb3JtZXIgPSA8UE1YQm9uZVRyYW5zZm9ybWVyPiB0aGlzLl9wbXguc2tlbGV0b24uZ2V0Qm9uZUJ5SW5kZXgodGhpcy5Cb25lRGF0YS5pa1RhcmdldEJvbmVJbmRleCkuVHJhbnNmb3JtZXI7XG4gICAgY29uc3QgVGFyZ2V0R2xvYmFsUG9zID0gTWF0cml4LnRyYW5zZm9ybVBvaW50KHRoaXMuTG9jYWxUb0dsb2JhbCwgdGhpcy5Mb2NhbE9yaWdpbik7XG4gICAgLy8gdmVjMy50cmFuc2Zvcm1NYXQ0KHRoaXMuX3BteENhbGNDYWNoZVZlYywgdGhpcy5Mb2NhbE9yaWdpbi5yYXdFbGVtZW50cywgdGhpcy5Mb2NhbFRvR2xvYmFsLnJhd0VsZW1lbnRzKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuQm9uZURhdGEuaWtMaW5rQ291bnQ7IGkrKykge1xuICAgICAgY29uc3QgaWtMaW5rRGF0YSA9IHRoaXMuQm9uZURhdGEuaWtMaW5rc1tpXTtcbiAgICAgIGNvbnN0IGlrTGlua1RyYW5zZm9ybSA9IHRoaXMuX2dldElrTGlua1RyYW5zZm9ybWVyQnlJbmRleChpKTtcbiAgICAgIGNvbnN0IGxpbmsyRWZmZWN0b3IgPSB0aGlzLl9nZXRMaW5rMkVmZmVjdG9yKGlrTGlua1RyYW5zZm9ybSwgZWZmZWN0b3JUcmFuc2Zvcm1lcik7XG4gICAgICBjb25zdCBsaW5rMlRhcmdldCA9IHRoaXMuX2dldExpbmsyVGFyZ2V0KGlrTGlua1RyYW5zZm9ybSwgVGFyZ2V0R2xvYmFsUG9zKTtcbiAgICAgIHRoaXMuX2lrTGlua0NhbGMoaWtMaW5rVHJhbnNmb3JtLCBsaW5rMkVmZmVjdG9yLCBsaW5rMlRhcmdldCwgdGhpcy5Cb25lRGF0YS5pa0xpbWl0ZWRSb3RhdGlvbiwgaWtMaW5rRGF0YSwgaXQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2dldExpbmsyRWZmZWN0b3IobGluazogUE1YQm9uZVRyYW5zZm9ybWVyLCBlZmZlY3RvcjogUE1YQm9uZVRyYW5zZm9ybWVyKTogVmVjdG9yMyB7XG4gICAgY29uc3QgVG9MaW5rTG9jYWwgPSBNYXRyaXguaW52ZXJzZShsaW5rLkxvY2FsVG9HbG9iYWwpO1xuICAgIGNvbnN0IGVwID0gZWZmZWN0b3IuTG9jYWxPcmlnaW47XG4gICAgY29uc3QgbG9jYWwyZWZmZWN0b3JMb2NhbCA9IE1hdHJpeC5tdWx0aXBseShUb0xpbmtMb2NhbCwgZWZmZWN0b3IuTG9jYWxUb0dsb2JhbCk7XG4gICAgY29uc3QgZWZmZWN0b3JQb3MgPSBNYXRyaXgudHJhbnNmb3JtUG9pbnQobG9jYWwyZWZmZWN0b3JMb2NhbCwgZXApO1xuICAgIHJldHVybiBlZmZlY3RvclBvcy5zdWJ0cmFjdFdpdGgobGluay5Mb2NhbE9yaWdpbikubm9ybWFsaXplVGhpcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0TGluazJUYXJnZXQobGluazogUE1YQm9uZVRyYW5zZm9ybWVyLCB0cDogVmVjdG9yMyk6IFZlY3RvcjMge1xuICAgIGNvbnN0IFRvTGlua0xvY2FsID0gTWF0cml4LmludmVyc2UobGluay5Mb2NhbFRvR2xvYmFsKTtcbiAgICBjb25zdCBlZmZlY3RvclBvcyA9IE1hdHJpeC50cmFuc2Zvcm1Qb2ludChUb0xpbmtMb2NhbCwgdHApO1xuICAgIHJldHVybiBlZmZlY3RvclBvcy5zdWJ0cmFjdFdpdGgobGluay5Mb2NhbE9yaWdpbikubm9ybWFsaXplVGhpcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBfaWtMaW5rQ2FsYyhsaW5rOiBQTVhCb25lVHJhbnNmb3JtZXIsIGVmZmVjdG9yOiBWZWN0b3IzLCB0YXJnZXQ6IFZlY3RvcjMsIHJvdGF0aW9uTGltaXQ6IG51bWJlciwgaWtMaW5rOiBQTVhJS0xpbmssIGl0OiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBDYWxjdWxhdGUgcm90YXRpb24gYW5nbGVcbiAgICBsZXQgZG90ID0gVmVjdG9yMy5kb3QoZWZmZWN0b3IsIHRhcmdldCk7XG4gICAgaWYgKGRvdCA+IDEuMCkge1xuICAgICAgZG90ID0gMS4wOyAvLyBhZGp1c3QgZXJyb3IgKGlmIGRvdCB3YXMgb3ZlciAxLjAsIGFjb3MoZG90KSB3aWxsIGJlIE5hTi4gVGhlbiwgaXQgY2F1c2Ugc29tZSBvZiBidWcpXG4gICAgfVxuICAgIGNvbnN0IHJvdGF0aW9uQW5nbGUgPSB0aGlzLl9jbGFtcEZsb2F0KE1hdGguYWNvcyhkb3QpLCByb3RhdGlvbkxpbWl0KTtcbiAgICBpZiAoaXNOYU4ocm90YXRpb25BbmdsZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHJvdGF0aW9uQW5nbGUgPD0gMS4wZS0zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIENhbGN1bGF0ZSByb3RhdGlvbiBheGlzIG9mIHJvdGF0aW9uXG4gICAgY29uc3Qgcm90YXRpb25BeGlzID0gVmVjdG9yMy5jcm9zcyhlZmZlY3RvciwgdGFyZ2V0KS5ub3JtYWxpemVUaGlzKCk7XG5cbiAgICAvLyBHZW5lcmF0ZSB0aGUgcm90YXRpb24gbWF0cml4IHJvdGF0aW5nIGFsb25nIHRoZSBheGlzXG4gICAgY29uc3Qgcm90YXRpb24gPSBRdWF0ZXJuaW9uLmFuZ2xlQXhpcyhyb3RhdGlvbkFuZ2xlLCByb3RhdGlvbkF4aXMpO1xuICAgIC8vIGxpbmsudXBkYXRlVHJhbnNmb3JtKCk7XG4gICAgLy8gUm90YXRpb24gPSAoX3Byb3ZpZGluZ0JvbmVSb3RhdGlvbikgKiB1c2VyUm90YXRpb24gKiBfbW9ycGhSb3RhdGlvbiAqIGlrTGlua1JvdGF0aW9uXG4gICAgLy8gUmVzdHJpY3RlZFJvdGF0aW9uID0gUm90YXRpb24gKiBpa0xpbmtBZGp1c3RcbiAgICAvLyBpa0xpbmtBZHVzdCA9IChSb3RhdGlvbikgXiAtMSAqIFJlc3RyaWN0ZWRSb3RhdGlvblxuICAgIGNvbnN0IHJlc3RyaWN0ZWRSb3RhdGlvbiA9IHRoaXMuX3Jlc3RyaWN0Um90YXRpb24oaWtMaW5rLCByb3RhdGlvbik7XG4gICAgbGluay5faWtMaW5rUm90YXRpb24gPSBRdWF0ZXJuaW9uLm11bHRpcGx5KGxpbmsuX2lrTGlua1JvdGF0aW9uLCByZXN0cmljdGVkUm90YXRpb24pO1xuICAgIGxpbmsudXBkYXRlVHJhbnNmb3JtRm9yUE1YKCk7XG4gICAgLy8gbGluay51cGRhdGVUcmFuc2Zvcm1NYXRyaWNpZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldElrTGlua1RyYW5zZm9ybWVyQnlJbmRleChpbmRleDogbnVtYmVyKTogUE1YQm9uZVRyYW5zZm9ybWVyIHtcbiAgICByZXR1cm4gPFBNWEJvbmVUcmFuc2Zvcm1lcj50aGlzLl9wbXguc2tlbGV0b24uZ2V0Qm9uZUJ5SW5kZXgodGhpcy5Cb25lRGF0YS5pa0xpbmtzW2luZGV4XS5pa0xpbmtCb25lSW5kZXgpLlRyYW5zZm9ybWVyO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmVzdHJpY3RSb3RhdGlvbihsaW5rOiBQTVhJS0xpbmssIHJvdDogUXVhdGVybmlvbik6IFF1YXRlcm5pb24ge1xuICAgIGlmICghbGluay5pc0xpbWl0ZWRSb3RhdGlvbikge1xuICAgICAgcmV0dXJuIHJvdDsgLy8gSWYgdGhpcyBsaW5rIGJvbmUgaXMgbm90IGVuYWJsZWQgd2l0aCByb3RhdGlvbiBsaW1pdCxqdXN0IHJldHVybi5cbiAgICB9XG4gICAgY29uc3QgZGVjb21wb3NlZCA9IHJvdC5mYWN0b3JpbmdRdWF0ZXJuaW9uWFlaKCk7XG4gICAgY29uc3QgeFJvdGF0aW9uID0gTWF0aC5tYXgobGluay5saW1pdGVkUm90YXRpb25bMF0sIE1hdGgubWluKGxpbmsubGltaXRlZFJvdGF0aW9uWzNdLCAtZGVjb21wb3NlZC54KSk7XG4gICAgY29uc3QgeVJvdGF0aW9uID0gTWF0aC5tYXgobGluay5saW1pdGVkUm90YXRpb25bMV0sIE1hdGgubWluKGxpbmsubGltaXRlZFJvdGF0aW9uWzRdLCAtZGVjb21wb3NlZC55KSk7XG4gICAgY29uc3QgelJvdGF0aW9uID0gTWF0aC5tYXgobGluay5saW1pdGVkUm90YXRpb25bMl0sIE1hdGgubWluKGxpbmsubGltaXRlZFJvdGF0aW9uWzVdLCBkZWNvbXBvc2VkLnopKTtcbiAgICByZXR1cm4gUXVhdGVybmlvbi5ldWxlclhZWigteFJvdGF0aW9uLCAteVJvdGF0aW9uLCB6Um90YXRpb24pO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2xhbXBGbG9hdChmOiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLm1heChNYXRoLm1pbihmLCBsaW1pdCksIC1saW1pdCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUE1YQm9uZVRyYW5zZm9ybWVyO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
